# pylint: disable=R0914, R0912, R0915, W0718
import logging

from django.db.models import Q

from datareader.constants import DataImportProcess
from datareader.helpers.database_helpers import create_legislation_database_entries
from datareader.helpers.excel_helpers import prepare_data_for_import, read_legislation_excel
from datareader.helpers.validation_helpers import validate_import_columns
from datareader.models import DataImportLog, DataSource
from navigator.models import Legislation

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def process_legislation_excel(obj):
    data_source = DataSource.objects.get(name=obj.name)

    main_import_log = DataImportLog.objects.create(
        data_source=data_source,
        process_name=DataImportProcess.IMPORT_LEGISLATION,
        level=DataImportLog.Level.MAIN,
        message=f"Main import log for file {obj.name}",
    )
    main_import_log.save()

    read_import_log = DataImportLog.objects.create(
        data_source=data_source,
        process_name=DataImportProcess.READ_EXCEL,
        level=DataImportLog.Level.SUB_PROCESS,
        message=f"Import log for reading file {obj.name}",
    )
    read_import_log.save()

    try:
        (
            df_legislation,
            df_registration,
            df_reporting,
            df_regulatory,
            df_role_content,
            sheets_read,
            sheets_failed_to_read,
        ) = read_legislation_excel(
            obj,
            data_source,
            read_import_log,
            main_import_log,
        )
    except (ValueError, TypeError, KeyError) as exc:
        raise exc
    except Exception as e:  # pylint: disable=broad-exception-caught
        logging.error("An unexpected error occurred while processing the excel file: %s", str(e))
        raise e

    read_import_log.is_processed = True
    read_import_log.is_successful = True
    read_import_log.message = f"Read sheets of {sheets_read}. Failed to read: {sheets_failed_to_read}"
    read_import_log.save()

    parse_import_log = DataImportLog.objects.create(
        data_source=data_source,
        process_name=DataImportProcess.PARSE_EXCEL,
        level=DataImportLog.Level.SUB_PROCESS,
        message=f"Import log for parsing file {obj.name}",
    )
    parse_import_log.save()

    try:
        list_dataframe = prepare_data_for_import(
            df_legislation,
            parse_import_log,
            main_import_log,
            data_source,
        )
        if list_dataframe is None:
            raise KeyError("Failed to prepare data for import")
    except (KeyError, TypeError, AttributeError, ValueError) as exc:
        raise exc

    try:
        dfs = (df_legislation, df_registration, df_reporting, df_regulatory, df_role_content)
        validate_import_columns(
            dfs,
            data_source,
        )
    except KeyError as exc:
        raise exc

    if not isinstance(list_dataframe, list):
        raise TypeError("Expected dict_dataframe to be a list of dictionaries")

    uploaded_legislation_list = []
    existing_legislation_list = []
    for record in list_dataframe:  # pylint: disable=not-an-iterable
        abbreviation = record.get("*Unique Identifier Code", None)
        name_local = record.get("*Name of legislation in the original language", None)
        if abbreviation:
            exists = Legislation.objects.filter(Q(name_local=name_local) | Q(abbreviation=abbreviation))
            if not exists:
                try:
                    abbreviation = record.get("*Unique Identifier Code", None)
                    in_effect_column = record.get("*In effect", None)
                    if abbreviation is None:
                        raise KeyError("Missing column: '*Unique Identifier Code' is either missing or empty")
                    if in_effect_column is None:
                        raise KeyError("Missing column: 'In effect' is either missing or empty")
                except KeyError as e:
                    import_log_fail = DataImportLog.objects.create(
                        data_source=data_source,
                        process_name=DataImportProcess.PARSE_EXCEL,
                        level=DataImportLog.Level.ERROR,
                        message=f"Please check the column listed in details. Details: {e}",
                    )
                    import_log_fail.is_processed = True
                    import_log_fail.save()
                    parse_import_log.is_processed = True
                    parse_import_log.save()
                    main_import_log.is_successful = False
                    main_import_log.is_processed = True
                    main_import_log.save()
                    raise e

                dataframes_tuple = (df_registration, df_regulatory, df_reporting, df_role_content)
                uploaded_legislation = create_legislation_database_entries(
                    record,
                    dataframes_tuple,
                    obj,
                )
                uploaded_legislation_list.append(uploaded_legislation)
            else:
                existing_legislation_list.append(name_local)
    parse_import_log.is_successful = True
    parse_import_log.is_processed = True
    parse_import_log.save()

    main_import_log.is_successful = True
    main_import_log.is_processed = True
    main_import_log.save()

    data_source.is_processed = True
    data_source.save()

    return uploaded_legislation_list, existing_legislation_list
