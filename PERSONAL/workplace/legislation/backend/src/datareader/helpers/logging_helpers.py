from datareader.models import DataImportLog, DataSource


def log_error_and_update_logs(
    data_source: DataSource,
    process_name: str,
    main_import_log: DataImportLog,
    read_import_log: DataImportLog,
    error_message: str,
):
    import_log_fail = DataImportLog.objects.create(
        data_source=data_source,
        process_name=process_name,
        level=DataImportLog.Level.ERROR,
        message=error_message,
    )
    import_log_fail.is_processed = True
    import_log_fail.save()
    read_import_log.is_processed = True
    read_import_log.save()
    main_import_log.is_successful = False
    main_import_log.is_processed = True
    main_import_log.save()
