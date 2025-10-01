# gen-ai-template

The template for usage of the genai, that involves embedding of the documents and sending prompt to gpt to get response.

The script is designed to showcase the usage of GenAI in the upcoming workshop. However I though that it can be used as a nice template for the rest of the team who wants to implement GenAI solutions.
As stated above it involves all the neccessary actions that you need to implement a GenAI solution.
From instantiating NGC service, to embedding the documents, retrieving the context and sending it to gpt to get the response.

Down below is the installation guide locally:

1.  Create a virtual environment: python3 -m venv venv
2.  Install genai-sdk by using the following command (please make sure that this command is one liner: `pip install --extra-index-url https://username:jfrog_api_key@artifacts-west.pwc.com/artifactory/api/pypi/g00078-pwc-gx-cto-pypi-local/simple genai-sdk --no-cache-dir`
3.  Install requirements: `pip3 install -r requirements.txt`
4.  Create a .env.local file in the RAG directory and add the following variables:

    ```
    LLM_CONFIG="NGC"
    CHAT_MODEL="gpt-35-turbo"
    OPENAI_API_VERSION="2023-03-15-preview"

    USERNAME=""
    PASSWORD=""
    ID_BROKER_HOST="https://dp-idbroker-eu.pwclabs.pwcglb.com"
    ID_BROKER_HOST_LOGIN="https://dp-idbroker-eu.pwclabs.pwcglb.com/api/v1/public/login"
    OPENAI_API_KEY=""
    GIF_HOST="https://gif-apim-glb.pwcinternal.com/ngc/prod-eu/openai/v2"
    DEPLOY_ENV="prod-eu"
    SUBSCRIPTION_KEY=""
    EMBEDDING_MODEL="text-embedding-ada-002"
    API_TYPE="azure"
    API_BASE="https://pwc-nl-openai-dev.openai.azure.com/"
    ```

    For USERNAME & PASSWORD use your guid and password. For OPENAI_API_KEY and SUBSCRIPTION_KEY, you can use the GIF key.

5.  Run the app from code folder with python3 executor.py
