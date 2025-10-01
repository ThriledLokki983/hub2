import os

from django.core.exceptions import ValidationError


def validate_excel_file_extension(value):
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = [".xlsx", ".xls"]
    if ext.lower() not in valid_extensions:
        raise ValidationError("Unsupported file extension.")


def validate_excel_and_csv_file_extension(value):
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = [".xlsx", ".xls", ".csv"]
    if ext.lower() not in valid_extensions:
        raise ValidationError("Unsupported file extension.")


def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = [".png", ".svg", ".jpeg", ".jpg"]
    if ext.lower() not in valid_extensions:
        raise ValidationError("Unsupported file extension.")


def validate_file_size(value):
    filesize = value.size

    if filesize > 10 * 1024 * 1024:  # 10 MB
        raise ValidationError("The maximum file size that can be uploaded is 10MB")
    return value
