from azure.storage.blob import BlobServiceClient, BlobType
from django.conf import settings


class AzureBlobStorage:
    def __init__(self):
        self.blob_service_client = BlobServiceClient.from_connection_string(settings.AZURE_CONNECTION_STRING)
        self.container_client = self.blob_service_client.get_container_client(settings.AZURE_CONTAINER)

    def upload_file(self, file, blob_name):
        blob_client = self.container_client.get_blob_client(blob_name)
        file_data = file.read()
        blob_client.upload_blob(data=file_data, blob_type=BlobType.BlockBlob, overwrite=True)
        return blob_client.url

    def delete_file(self, blob_name):
        blob_client = self.container_client.get_blob_client(blob_name)
        blob_client.delete_blob()

    def get_file_url(self, blob_name):
        blob_client = self.container_client.get_blob_client(blob_name)
        return blob_client.url
