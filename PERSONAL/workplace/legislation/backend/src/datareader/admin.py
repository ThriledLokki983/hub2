import logging

import pandas as pd
from django import forms
from django.contrib import admin

from datareader.models import DataImportLog, DataSource
from datareader.tasks import process_legislation_excel

logging.basicConfig(level=logging.INFO)


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    save_on_top = True
    save_as = True
    list_display = [
        "name",
        "owner",
        "created_at",
        "is_processed",
        "file",
        "identifier",
    ]
    list_filter = [
        "is_processed",
        "owner",
    ]
    search_fields = [
        "name",
        "owner",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]
    autocomplete_fields = [
        "owner",
    ]

    def save_model(self, request, obj, form, change):
        obj.owner = request.user
        obj.user = request.user

        if not change:
            # add, not update
            if obj.name == "":
                obj.name = obj.file.name
        logging.info("SAVING FILE %s TO DATABASE", obj.name)
        super().save_model(request, obj, form, change)

        if obj.file_type == DataSource.FileType.LEGISLATION.value:
            try:
                process_legislation_excel(obj)

            except FileNotFoundError as fnf_error:
                logging.error("Error: %s. The file %s was not found.", fnf_error, obj.name)

            except pd.errors.EmptyDataError as empty_error:
                logging.error("Error: %s. The file %s is empty.", empty_error, obj.name)

            except pd.errors.ParserError as parser_error:
                logging.error("Error: %s. There was a parsing error while reading %s.", parser_error, obj.name)

            except Exception as e:  # pylint: disable=broad-exception-caught
                raise e

    # This will hide the owner field in the admin form
    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj, change, **kwargs)
        form.base_fields["owner"].widget = forms.HiddenInput()
        form.base_fields["is_processed"].widget = forms.HiddenInput()
        form.base_fields["is_archived"].widget = forms.HiddenInput()

        return form


@admin.register(DataImportLog)
class DataImportLogAdmin(admin.ModelAdmin):
    save_on_top = True
    save_as = True
    list_display = [
        "identifier",
        "created_at",
        "data_source",
        "process_name",
        "level",
        "is_successful",
        "is_processed",
        "message",
        "elapsed_time_minutes",
        "data",
    ]
    list_filter = [
        "data_source",
        "is_processed",
        "is_successful",
        "process_name",
        "level",
    ]
    search_fields = [
        "process_name",
        "level",
        "message",
    ]
