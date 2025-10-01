import os
from django.core.management.base import BaseCommand
from django.conf import settings
from core.functions import send_mail
from core.settings.azureblob import AzureBlobStorage


class Command(BaseCommand):

    @staticmethod
    def test_azure_blob():
        print("Testing Azure Blob Storage")
        _fn = "azure_blob_test.txt"
        print("- Creating a temp file")
        with open(_fn, "w", encoding="utf-8") as file:
            file.write("Hello World")
        with open(_fn, "rb") as file:
            print("- Uploading file to Azure Blob Storage")
            azure_blob_storage = AzureBlobStorage()
            file_url = azure_blob_storage.upload_file(file, _fn)
            print(f"- Upload successful, file at {file_url}")
            azure_blob_storage.delete_file(_fn)
            print("- Deleted file from Azure Blob Storage")
        os.remove(_fn)
        print("- Deleted file from OS")

    @staticmethod
    def test_email():
        print("- Testing email server")
        payload = {
            "subject": "Testing email",
            "data": {},
        }
        if send_mail(settings.EMAIL_TO_TEST_ADDRESS, payload):
            print("- Email sent successfully")
        else:
            print("- Email sending failed")

    def handle(self, *args, **kwargs):  # pylint: disable=W0613
        self.test_azure_blob()
        self.test_email()
