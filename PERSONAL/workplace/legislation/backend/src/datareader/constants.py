from enum import Enum, auto


class DataImportProcess(Enum):
    PARSE_EXCEL = auto()
    POPULATE_DB = auto()
    IMPORT_LEGISLATION = auto()
    READ_EXCEL = auto()
