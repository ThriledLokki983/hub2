import os


class DiskHandler:
    """
    Disk handler class that handles all the actions that can be done with the files in os
    """

    def __init__(self) -> None:
        pass

    def save(self, path: str, file_name: str):
        """Save the file to the folder

        Parameters
        ----------
        path : str
            Path to the folder where the file should be saved
        file_name : str
            File name that needs to be saved

        Returns
        -------
        str
            Returns a path where the file was saved
        """
        try:
            full_path = os.path.join(path, file_name)
            print(f"The file {file_name} was saved to the directory {path}")
            return full_path
        except Exception as e:
            print(
                f"The file {file_name} could not saved to the following {path} directory."
            )
            raise e

    def delete(self, path: str):
        """Deletes all the files from the folder

        Parameters
        ----------
        path : str
            Folder path where the files should be deleted

        Raises
        ------
        e
            Raises an error when the file could not be deleted
        """
        try:
            # check if folder exists
            if os.path.exists(path=path):
                file_dir = os.listdir(path)
                if len(file_dir) > 0:
                    for item in file_dir:
                        path_to_file = os.path.join(path, item)
                        os.remove(path_to_file)

                    print(f"The files were successfully removed from the {path}")
                else:
                    print("There is no files in the folder")
            else:
                print("Folder does not exist!")
        except Exception as e:
            print(f"The file {item} could not be deleted from the directory")
            raise e

    def get(self, path: str):
        """Grabs the first file from folder

        Parameters
        ----------
        path : str
            Path to the folder where the file is located

        Returns
        -------
        str
            File path to the selected file from the folder

        Raises
        ------
        e
            Raises an error if the file can not be grabbed
        """
        try:
            if os.path.exists(path):
                file_dir = os.listdir(path)
                if len(file_dir) > 0:
                    file_dir_cleaned = [
                        item
                        for item in file_dir
                        if ".xlsx" in item
                        or ".json" in item
                        or ".docx" in item
                        or ".pdf" in item
                    ][0]
                    doc_file_path = os.path.join(path, file_dir_cleaned)
                    print(f"The file {doc_file_path} was extracted from the directory")
                    return doc_file_path
                else:
                    print("No files in the folder")
                    return None
            else:
                print("Folder does not exist")
                return None
        except Exception as e:
            print(f"The file {doc_file_path} could not be extracted from directory")
            raise e

    def make(self, path: str):
        """Creates a folder

        Parameters
        ----------
        path : str
            Path to the folder

        Raises
        ------
        e
            Error that the folder could not be created
        """
        try:
            if not os.path.exists(path):
                os.makedirs(path, exist_ok=True)
                print(f"The new folder {path} was created")
            else:
                print(f"The folder already exists!")
        except Exception as e:
            print(f"The new folder {path} could not be created")
            raise e
