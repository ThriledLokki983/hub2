import http.client
import json
import os

from auth_token import get_auth_token
from dotenv import load_dotenv

load_dotenv()


GIF_API_KEY = os.getenv("GIF_API_KEY")
GUID = os.getenv("GUID")
PASSWORD = os.getenv("PASSWORD")
BASE_URL = "gif-apim-glb.pwcinternal.com"
INSTANCE = "/ngc/prod-eu/openai/v2/"
ID_BROKER_HOST = "https://dp-idbroker-eu.pwclabs.pwcglb.com"
DEPLOYMENT_ID = "gpt-35-turbo"
API_VERSION = "2023-03-15-preview"


def get_chat_response(
    input_text,
    temperature=0.5,
    max_tokens=3000,
):
    conn = http.client.HTTPSConnection(BASE_URL)
    payload = json.dumps(
        {
            "max_tokens": 3000,
            "temperature": 0.5,
            "top_p": 1,
            "n": 1,
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "user",
                    "content": input_text,
                },
            ],
        }
    )
    headers = {
        "Authorization": get_auth_token(GUID, PASSWORD),
        "x-request-type": "sync",
        "Content-Type": "application/json",
    }
    conn.request(
        "POST",
        f"{INSTANCE}openai/deployments/{DEPLOYMENT_ID}/chat/completions?api-version={API_VERSION}&subscription-key={GIF_API_KEY}",
        payload,
        headers,
    )
    res = conn.getresponse()
    data = res.read()
    print(data.decode("utf-8"))


get_chat_response("Can you explain neural networks?")
