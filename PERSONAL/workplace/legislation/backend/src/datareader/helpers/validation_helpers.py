from typing import Tuple

import pandas as pd

from datareader.constants import DataImportProcess
from datareader.models import DataImportLog, DataSource


def strip_spaces_from_dfs(*dfs: pd.DataFrame) -> Tuple[pd.DataFrame, ...]:
    "Helper function to strip spaces from string columns"

    def strip_spaces(df: pd.DataFrame) -> pd.DataFrame:
        df[df.select_dtypes(include=["object"]).columns] = df.select_dtypes(include=["object"]).apply(
            lambda x: x.str.strip()
        )
        return df

    stripped_dfs = tuple(strip_spaces(df) for df in dfs)

    return stripped_dfs


def process_dropdown_field(field_value):
    """
    Fields that hold dropdown data are separated by ; and must be converted
    before they can be used to create many to many relationships later on.
    """
    if field_value:
        return [{"name": item.strip()} for item in field_value.split(";")]
    return []


def check_legislation_name_unique(df_legislation: pd.DataFrame):
    """Makes sure uploaded legislation names are unique"""
    if not df_legislation["*Name of legislation in the original language"].is_unique:
        duplicates = df_legislation[
            df_legislation["*Name of legislation in the original language"].duplicated(keep=False)
        ]
        duplicate_names = duplicates["*Name of legislation in the original language"].unique()
        error_message = ""

        for name in duplicate_names:
            duplicate_codes = duplicates[duplicates["*Name of legislation in the original language"] == name][
                "*Unique Identifier Code"
            ].tolist()
            error_message += f"\nDuplicate legislation '{name}' found with Unique Identifier Codes: {duplicate_codes}"

        raise ValueError(error_message)


def data_validation_dropdown_check(
    df_legislation: pd.DataFrame,
    df_reporting: pd.DataFrame,
    df_role_content: pd.DataFrame,
    df_validation: pd.DataFrame,
):
    """
    Checks whether or not the field value is within the validation dropdown values
    Raises value error with the field and expected values
    """
    legislation_columns_to_validate = {
        "*Topic": "Topic",
        "*Issuing jurisdiction": "Issuing jurisdiction",
        "*Type of legislation": "Type of legislation",
        "*Geographical scope": "Geographical scope",
        "*In effect": "In effect",
        "*Relevant product (group) or services": "Relevant product (group) or services",
        "*Type of requirements": "Type of requirements",
        "*Consequences of non-compliance": "Consequences of non-compliance",
    }

    reporting_columns_to_validate = [
        "Way of submitting",
    ]

    role_content_columns_to_validate = {
        "*Role name": "Role name",
    }

    def validate_columns(df_to_validate, columns_to_validate, df_validation):
        for col in columns_to_validate:
            if isinstance(columns_to_validate, dict):
                validation_col = columns_to_validate[col]
            else:
                validation_col = col

            valid_values = (
                df_validation[validation_col].dropna().apply(lambda x: x if ";" not in x else None).dropna().tolist()
            )
            invalid_rows = []

            for index, row in df_to_validate.iterrows():
                cell_value = str(row[col])
                values_to_check = [v.strip() for v in cell_value.split(";")]

                if not all(value in valid_values for value in values_to_check):
                    invalid_rows.append(row)

            if invalid_rows:
                expected_values = ", ".join(map(str, valid_values))
                invalid_list = [str(row[col]) for row in invalid_rows]
                raise ValueError(
                    f"Invalid values found in column '{col}': {invalid_list}. "
                    f"Expected values are: {expected_values}"
                )

    validate_columns(df_legislation, legislation_columns_to_validate, df_validation)
    validate_columns(df_reporting, reporting_columns_to_validate, df_validation)

    # Role content validation, check for size as it was not a sheet in the original request
    if len(df_role_content) > 0:
        validate_columns(df_role_content, role_content_columns_to_validate, df_validation)


def validate_import_columns(
    dfs: Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame],
    data_source: DataSource,
):
    """
    Checks if the expected columns exist in the excel that was read
    Logs entry if column not found and raises exception.
    """
    df_legislation, df_registration, df_reporting, df_regulatory, df_role_content = dfs

    legislation_expected_columns = [
        "*PwC Territory",
        "*Unique Identifier Code",
        "*Topic",
        "*Name of legislation in the original language",
        "Abbreviation",
        "Generic name of legislation",
        "*Issuing jurisdiction",
        "*Type of legislation",
        "Type of legislation - Other",
        "*Geographical scope",
        "Geographical scope - Other",
        "*In effect",
        "*Applicable from",
        "Applicable to",
        "*Responsible Authority",
        "*Relevant product (group) or services",
        "Relevant product (group) or services - Other",
        "*Type of requirements",
        "*Objective of the legislation (summary)",
        "*Scope of the legislation (summary)",
        "*Responsible party (summary)",
        "*Consequences of non-compliance",
        "Consequences of non-compliance - Other",
        "*Link to legislation",
        "Link to additional guidance",
        "*Relevant PwC contact",
    ]

    registration_expected_columns = [
        "*Legislation code",
        "*General description",
        "*Responsible authority",
        "*Activities that trigger requirements",
        "*Responsible party",
        "*Data elements required",
        "*Payment obligations",
        "*Deadline",
        "*Threshold",
        "*Sanctions",
        "*Exemptions",
    ]

    reporting_expected_columns = [
        "*Legislation code",
        "General description",
        "Responsible authority",
        "Activities that trigger requirements",
        "Responsible party",
        "Data elements for reporting",
        "Language of reporting",
        "Frequency of reporting",
        "Deadlines",
        "Way of submitting",
        "Way of submitting - Other",
        "Payment obligations and rates",
        "Retainment of records",
        "Refund possibilities",
        "Thresholds",
        "Sanctions",
        "Exemptions",
    ]

    regulatory_expected_columns = [
        "Responsibile authority",
        "Activities that trigger requirements",
        "Responsible party",
        "Key actions for compliance",
        "Deadlines",
        "Thresholds",
        "Sanctions",
        "Exemptions",
    ]

    regulatory_expected_columns = [
        "*Legislation code",
        "General description",
        "Responsible authority",
        "Activities that trigger requirements",
        "Responsible party",
        "Key actions for compliance",
        "Deadlines",
        "Thresholds",
        "Sanctions",
        "Exemptions",
    ]

    role_content_expected_columns = [
        "*Legislation code",
        "*Role name",
        "What does this role need to do",
        "Why is this legislation relevant for this role",
        "Example of role compliance",
        "Risk of non-compliance",
    ]

    legislation_missing_columns = [col for col in legislation_expected_columns if col not in df_legislation.columns]
    if legislation_missing_columns:
        import_log_fail = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.PARSE_EXCEL,
            level=DataImportLog.Level.ERROR,
            is_processed=True,
            message=f"Missing columns in Legislation tab: {', '.join(legislation_missing_columns)}. "
            f"Help: if you see the column, \
                check if it is an exact match when you click on the cell. Check for ' at the beginning.",
        )
        import_log_fail.save()
        raise KeyError(f"Missing columns in Legislation tab: {', '.join(legislation_missing_columns)}")

    registration_expected_columns = [col for col in registration_expected_columns if col not in df_registration.columns]
    if registration_expected_columns:
        import_log_fail = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.PARSE_EXCEL,
            level=DataImportLog.Level.ERROR,
            is_processed=True,
            message=f"Missing columns in Registration requirements tab: {', '.join(registration_expected_columns)}. "
            f"Help: if you see the column, \
                check if it is an exact match when you click on the cell. Check for ' at the beginning.",
        )
        import_log_fail.save()
        raise KeyError(f"Missing columns in Registration requirements tab: {', '.join(registration_expected_columns)}")

    reporting_expected_columns = [col for col in reporting_expected_columns if col not in df_reporting.columns]
    if reporting_expected_columns:
        import_log_fail = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.PARSE_EXCEL,
            level=DataImportLog.Level.ERROR,
            is_processed=True,
            message=f"Missing columns in Reporting requirements tab: {', '.join(reporting_expected_columns)}",
        )
        import_log_fail.save()
        raise KeyError(f"Missing columns in Reporting requirements tab: {', '.join(reporting_expected_columns)}")

    regulatory_expected_columns = [col for col in regulatory_expected_columns if col not in df_regulatory.columns]
    if regulatory_expected_columns:
        import_log_fail = DataImportLog.objects.create(
            data_source=data_source,
            process_name=DataImportProcess.PARSE_EXCEL,
            level=DataImportLog.Level.ERROR,
            is_processed=True,
            message=f"Missing columns in Regulatory requirements tab: {', '.join(regulatory_expected_columns)}. "
            f"Help: if you see the column, \
                check if it is an exact match when you click on the cell. Check for ' at the beginning.",
        )
        import_log_fail.save()
        raise KeyError(f"Missing columns in Regulatory requirements tab: {', '.join(regulatory_expected_columns)}")

    if len(df_role_content) != 0:
        role_content_expected_columns = [
            col for col in role_content_expected_columns if col not in df_role_content.columns
        ]
        if role_content_expected_columns:
            import_log_fail = DataImportLog.objects.create(
                data_source=data_source,
                process_name=DataImportProcess.PARSE_EXCEL,
                level=DataImportLog.Level.ERROR,
                is_processed=True,
                message=f"Missing columns in Role content tab: {', '.join(role_content_expected_columns)}. "
                f"Help: if you see the column, \
                    check if it is an exact match when you click on the cell. Check for ' at the beginning.",
            )
            import_log_fail.save()
            raise KeyError(f"Missing columns in Role content tab: {', '.join(role_content_expected_columns)}")
