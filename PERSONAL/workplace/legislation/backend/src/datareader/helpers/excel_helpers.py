# pylint: disable=R0914, R0915,
import logging
import traceback
import warnings
from datetime import date
from typing import Any, Dict, List, Tuple

import pandas as pd

from datareader.constants import DataImportProcess
from datareader.helpers.logging_helpers import log_error_and_update_logs
from datareader.helpers.validation_helpers import (
    check_legislation_name_unique,
    data_validation_dropdown_check,
    strip_spaces_from_dfs,
)
from datareader.models import DataImportLog, DataSource


def custom_warning_handler(
    message, category, filename, lineno, file=None, line=None
):  # pylint: disable=too-many-arguments
    log = f"Warning: {message} (Category: {category}, File: {filename}, Line: {lineno})\n"
    log += "".join(traceback.format_stack())
    print(log)


# Set the custom warning handler
# warnings.showwarning = custom_warning_handler

warnings.filterwarnings("ignore", category=UserWarning, module=r"openpyxl\.worksheet\._reader")


def read_legislation_excel(
    obj,
    data_source: DataSource,
    read_import_log: DataImportLog,
    main_import_log: DataImportLog,
) -> Tuple[
    pd.DataFrame,
    pd.DataFrame,
    pd.DataFrame,
    pd.DataFrame,
    list,
    list,
]:
    """
    Reads the 4 sheets in the file and returns data frames, along with a list of sheet read and failed to read.
    """
    legislation_sheet_name = "Legislation"
    registration_sheet_name = "Registration"
    reporting_sheet_name = "Reporting"
    regulatory_sheet_name = "Regulatory"
    role_content_sheet_name = "Role-related recommendations"
    validation_sheet_name = "Validation"
    sheets_read = []
    sheets_failed_to_read = []

    required_sheet_names = [
        legislation_sheet_name,
        registration_sheet_name,
        reporting_sheet_name,
        regulatory_sheet_name,
    ]

    try:
        sheet_names = pd.ExcelFile(obj.file).sheet_names

        missing_sheets = [sheet for sheet in required_sheet_names if sheet not in sheet_names]
        if missing_sheets:
            raise KeyError(
                f"Missing required sheets: {missing_sheets}. Available sheets: {sheet_names}. "
                f"Also check for spelling."
            )

    except FileNotFoundError as e:
        error_message = f"File '{obj.file}' was not found. Details: {str(e)}"
        log_error_and_update_logs(
            data_source,
            DataImportProcess.READ_EXCEL,
            main_import_log,
            read_import_log,
            error_message,
        )
        raise
    except ValueError as e:
        error_message = f"File '{obj.file}' is not a valid Excel file or is corrupted. Details: {str(e)}"
        log_error_and_update_logs(
            data_source,
            DataImportProcess.READ_EXCEL,
            main_import_log,
            read_import_log,
            error_message,
        )
        raise
    except KeyError as e:
        error_message = f"Required sheets missing. {str(e)}"
        log_error_and_update_logs(
            data_source,
            DataImportProcess.READ_EXCEL,
            main_import_log,
            read_import_log,
            error_message,
        )
        raise
    except Exception as e:  # pylint: disable=broad-except
        error_message = f"An unexpected error occurred while processing the file '{obj.file}'. \
                            Details: {str(e)}"
        log_error_and_update_logs(
            data_source,
            DataImportProcess.READ_EXCEL,
            main_import_log,
            read_import_log,
            error_message,
        )
        raise

    df_legislation = pd.DataFrame(
        pd.read_excel(
            obj.file,
            sheet_name=legislation_sheet_name,
            skiprows=3,
        )
    )
    df_legislation.columns = df_legislation.columns.str.strip()
    sheets_read.append(legislation_sheet_name)

    df_registration = pd.DataFrame(
        pd.read_excel(
            obj.file,
            sheet_name=registration_sheet_name,
            skiprows=3,
        )
    )
    df_registration.columns = df_registration.columns.str.strip()
    sheets_read.append(registration_sheet_name)

    df_reporting = pd.DataFrame(
        pd.read_excel(
            obj.file,
            sheet_name=reporting_sheet_name,
            skiprows=3,
        )
    )
    df_reporting.columns = df_reporting.columns.str.strip()
    sheets_read.append(reporting_sheet_name)

    df_regulatory = pd.DataFrame(
        pd.read_excel(
            obj.file,
            sheet_name=regulatory_sheet_name,
            skiprows=3,
        )
    )
    df_regulatory.columns = df_regulatory.columns.str.strip()
    sheets_read.append(regulatory_sheet_name)

    df_role_content = pd.DataFrame()
    try:
        df_role_content = pd.DataFrame(
            pd.read_excel(
                obj.file,
                sheet_name=role_content_sheet_name,
                skiprows=3,
            )
        )
        if len(df_role_content) != 0:
            df_role_content.columns = df_role_content.columns.str.strip()
            sheets_read.append(role_content_sheet_name)

    except ValueError as e:
        import_log_fail = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.READ_EXCEL,
            level=DataImportLog.Level.WARNING,
            message=f"Could not find sheet: {role_content_sheet_name} in the file {obj.name}. Details: {e}",
        )
        import_log_fail.is_processed = True
        import_log_fail.save()
        sheets_failed_to_read.append(role_content_sheet_name)

    df_validation = pd.DataFrame(
        pd.read_excel(
            obj.file,
            sheet_name=validation_sheet_name,
            skiprows=2,
        )
    )
    df_validation.columns = df_validation.columns.str.strip()

    cleaned_dfs = strip_spaces_from_dfs(
        df_legislation,
        df_reporting,
        df_regulatory,
        df_registration,
        df_role_content,
    )
    df_legislation, df_reporting, df_regulatory, df_registration, df_role_content = cleaned_dfs

    check_legislation_name_unique(df_legislation)

    data_validation_dropdown_check(
        df_legislation=df_legislation,
        df_reporting=df_reporting,
        df_role_content=df_role_content,
        df_validation=df_validation,
    )

    legislation_read_count = len(df_legislation)
    registration_read_count = len(df_registration)
    reporting_read_count = len(df_reporting)
    regulatory_read_count = len(df_regulatory)
    role_content_read_count = len(df_role_content)

    read_status_log = DataImportLog.objects.create(
        data_source=data_source,
        process_name=DataImportProcess.READ_EXCEL,
        is_processed=True,
        is_successful=True,
        level=DataImportLog.Level.INFO,
        message=f"Read logs for {obj.name}. See data for details",
        data={
            "legislation_count": legislation_read_count,
            "registration_requirement_count": registration_read_count,
            "reporting_requirement_count": reporting_read_count,
            "regulatory_requirement_count": regulatory_read_count,
            "role_content_read_count": role_content_read_count,
        },
    )
    read_status_log.save()

    return (
        df_legislation,
        df_registration,
        df_reporting,
        df_regulatory,
        df_role_content,
        sheets_read,
        sheets_failed_to_read,
    )


def update_other_fields(df_legislation: pd.DataFrame) -> pd.DataFrame:
    """
    Checks columns that have the value other with a "-Other" field equivalent.
    Replaces the values in the original column with the values from the "-Other" field.
    """
    columns_to_check = [
        "*Type of legislation",
        "*Geographical scope",
        "*Relevant product (group) or services",
        "*Consequences of non-compliance",
    ]

    def check_and_update(row, col, other_col):
        if row[col] == "Other":
            if pd.notna(row[other_col]) and str(row[other_col]).strip() != "":
                return row[other_col]
            raise ValueError(
                f"The field '{other_col}' is empty for a row where '{col}' is 'Other'. "
                f"Please add value to the {other_col} field."
            )
        return row[col]

    for col in columns_to_check:
        other_col = col.replace("*", "").strip() + " - Other"

        if col in df_legislation.columns and other_col in df_legislation.columns:
            df_legislation[col] = df_legislation.apply(check_and_update, axis=1, col=col, other_col=other_col)

    return df_legislation


def prepare_data_for_import(
    df_legislation: pd.DataFrame,
    parse_import_log: DataImportLog,
    main_import_log: DataImportLog,
    data_source: DataSource,
) -> List[Dict[str, Any]]:
    """
    Ensures the data column is in correct format and returns a dict formatted from a dataframe
    """

    def is_string(value):
        return isinstance(value, str)

    try:
        string_values = df_legislation["*Applicable from"].apply(is_string)

        if string_values.any():
            raise TypeError("Date written as string. Should be date format")
        df_legislation["*Applicable from"] = pd.to_datetime(
            df_legislation["*Applicable from"],
            errors="coerce",
        ).dt.strftime("%Y-%m-%d")

        invalid_rows = df_legislation[df_legislation["*Applicable from"].isna()]
        if not invalid_rows.isnull().values.all():
            affected_names = invalid_rows["*Name of legislation in the original language"].tolist()
            raise TypeError(f"Invalid date formats for rows: {affected_names}")

        df_legislation_other_replaced = update_other_fields(df_legislation)

        list_dict_dataframe = df_legislation_other_replaced.to_dict(orient="records")

    except KeyError as e:
        message = f"The column '*Applicable from' does not exist. Details: {e}"
        fail_log = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.PARSE_EXCEL,
            level=DataImportLog.Level.ERROR,
            message=message,
        )

        fail_log.is_processed = True
        fail_log.save()
        parse_import_log.is_processed = True
        parse_import_log.save()
        main_import_log.is_successful = False
        main_import_log.is_processed = True
        main_import_log.save()
        raise

    except TypeError as e:
        fail_log = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.PARSE_EXCEL,
            level=DataImportLog.Level.ERROR,
            message=f"There was a problem with the data type in column 'Applicable from'. Details: {e}",
        )

        fail_log.is_processed = True
        fail_log.save()
        parse_import_log.is_processed = True
        parse_import_log.save()
        main_import_log.is_successful = False
        main_import_log.is_processed = True
        main_import_log.save()
        raise

    except AttributeError as e:
        logging.error("AttributeError: There was a problem accessing attributes. Details: %s", e)
        raise

    return list_dict_dataframe


def remap_record_to_legislation_fields(record, status, is_in_effect, owner):
    """
    Remap a record to the fields required by the Legislation model.

    :param record: The original record dictionary with data.
    :param abbreviation: The abbreviation of the legislation.
    :param status: The status of the legislation.
    :param is_in_effect: Boolean indicating if the legislation is in effect.
    :param owner: The owner of the legislation record.
    :return: A dictionary with keys corresponding to the Legislation model fields.
    """
    effective_date = record.get("*Applicable from")

    if isinstance(effective_date, date):
        effective_date = effective_date.isoformat()

    return {
        "name_local": record.get("*Name of legislation in the original language"),
        "name_generic": record.get("Generic name of legislation"),
        "abbreviation": record.get("*Unique Identifier Code"),
        "status": status,
        "effective_date": effective_date,
        "scope": record.get("*Scope of the legislation (summary)"),
        "objective": record.get("*Objective of the legislation (summary)"),
        "responsible_authority": record.get("*Responsible Authority"),
        "responsible_party": record.get("*Responsible party (summary)"),
        "link": record.get("*Link to legislation"),
        "is_in_effect": is_in_effect,
        "created_by": owner,
        "pwc_territory": record.get("*PwC Territory"),
    }
