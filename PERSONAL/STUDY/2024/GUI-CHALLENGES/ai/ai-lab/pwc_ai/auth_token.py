import base64
import http.client
import logging

logging.basicConfig(level=logging.INFO)


def generate_basic_auth_header(username, password):
    credentials = f"{username}:{password}"
    credentials_bytes = credentials.encode("ascii")
    base64_credentials = base64.b64encode(credentials_bytes)
    auth_header_value = f"Basic {base64_credentials.decode('ascii')}"
    return auth_header_value


def get_auth_token(guid, password):
    header_value = generate_basic_auth_header(guid, password)
    conn = http.client.HTTPSConnection("dp-idbroker-eu.pwclabs.pwcglb.com")
    payload = ""
    headers = {"Authorization": f"Basic {header_value}"}
    conn.request("GET", "/api/v1/public/login", payload, headers)
    res = conn.getresponse()
    token = res.getheader("Authorization")

    return token
