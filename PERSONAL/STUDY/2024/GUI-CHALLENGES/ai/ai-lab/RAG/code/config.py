import os

from dotenv import load_dotenv

env_path = os.path.join(os.getcwd(), ".env.local")
load_dotenv(env_path)

LLM_CONFIG = os.getenv("LLM_CONFIG")
OPENAI_API_VERSION = os.environ.get("OPENAI_API_VERSION")
CHAT_MODEL = os.getenv("CHAT_MODEL")

# OPTION 2 - NGC
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
ID_BROKER_HOST = os.getenv("ID_BROKER_HOST")
ID_BROKER_HOST_LOGIN = os.getenv("ID_BROKER_HOST_LOGIN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GIF_HOST = os.getenv("GIF_HOST")
DEPLOY_ENV = os.getenv("DEPLOY_ENV")
SUBSCRIPTION_KEY = os.getenv("SUBSCRIPTION_KEY")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
API_TYPE = os.getenv("API_TYPE")
API_BASE = os.getenv("API_BASE")

# OPTION 3 - AZURE_DEFAULT
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")

# Base dir
BASE_DIR = os.environ.get("BASE_DIR", "")
