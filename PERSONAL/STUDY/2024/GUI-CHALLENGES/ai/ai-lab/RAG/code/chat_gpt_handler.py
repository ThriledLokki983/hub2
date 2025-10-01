import os

from config import EMBEDDING_MODEL, OPENAI_API_VERSION, PASSWORD, SUBSCRIPTION_KEY, USERNAME
from genai_sdk import PwCAzureChatOpenAI, PwCAzureOpenAIEmbeddings
from llama_index.legacy import ServiceContext, load_index_from_storage


class ChatGPTApiHandler:
    """
    A class that handles the chatGPT token initiation

    Attributes:
        openai_api_key: str
            api key
        openai_version: str
            OpenAI version

    Methods:
        get_gpt_response(self, context: Context, query: str)
            Function to get the response from the API using the OnDemand api proxy connection
        initiate_service_context(
                self,
                max_input_size: int,
                num_output: int,
                max_chunk_overlap: int,
                chunk_size_limit: int,
                chunk_size: int,
                chunk_overlap: int
                )
            Function that initiates the service_context
    """

    def __init__(self) -> None:
        self.openai_api_key = os.getenv("OPENAI_API_KEY_DIRECT")
        self.openai_version = OPENAI_API_VERSION

    def get_gpt_response(self, context, query):
        """
        Retrieves a GPT response based on the provided context and query.

        Parameters
        ----------
        context : str
            The context for generating the GPT response.
        query : str
            The query used to generate the GPT response.

        Returns
        -------
        str
            The generated GPT response.

        Raises
        ------
        Exception
            If an error occurs during the process of retrieving the GPT response.
        """
        try:
            service_context = self.initiate_service_context()

            index = load_index_from_storage(context, service_context=service_context)

            # assign query engine
            query_engine = index.as_query_engine(
                similarity_top_k=4,
            )

            # generate response
            response = query_engine.query(query)

        except Exception as e:
            raise e

        return response

    def initiate_service_context(self, chunk_size: int = 1000, chunk_overlap: int = 20):
        """
        The LLM service initiation, can be used for vectorizing creation, vector retrieval
        LLM and embedding model are initiated based on either the Azure or NGC configuration.
        """

        llm = self.initiate_llm()
        embed_model = self.initiate_embed_model(chunk_size=chunk_size)

        service_context = ServiceContext.from_defaults(
            llm=llm,
            embed_model=embed_model,
        )

        return service_context

    def initiate_llm(self):
        """
        Returns the llm object as required in the ServiceContext

        Returns
        -------
        llm
            BaseChatModel object
        """

        llm = PwCAzureChatOpenAI(
            username=USERNAME,
            password=PASSWORD,
            apikey=SUBSCRIPTION_KEY,
            api_version=OPENAI_API_VERSION,
            model="gpt-35-turbo",
            max_tokens=750,
        )

        return llm

    def initiate_embed_model(self, chunk_size: int = 1000):

        embed_model = PwCAzureOpenAIEmbeddings(
            apikey=SUBSCRIPTION_KEY,
            api_version=OPENAI_API_VERSION,
            model=EMBEDDING_MODEL,
            chunk_size=chunk_size,
        )

        return embed_model
