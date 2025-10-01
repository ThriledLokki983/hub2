import os

from chat_gpt_handler import ChatGPTApiHandler
from embeddings import embed_docs
from llama_index.legacy import StorageContext

BASEDIR = os.path.abspath(os.path.dirname(__file__))
DATADIR = f"{BASEDIR}/docs"


def executor():
    """Main executable function

    Raises
    ------
    e
        gpt error if the response can not be retrieved from the api
    """
    # config for directories where the input files stored
    ist_docs_directory = f"{DATADIR}/ist_docs"
    # sol_docs_directory = f"{DATADIR}/sol_docs" #can be allowed to test the embedding of multiple docs from different folders
    # here you can add more docs that can be embedded
    docs_list = [ist_docs_directory]

    for doc_path in docs_list:
        print("Started embedding of the documents")
        embed_docs(folder_path=doc_path)

    chat_gpt_handler = ChatGPTApiHandler()

    while True:
        # user input
        print("\033[92mQuestion: Please ask me anything about the doc you uploaded?\033[0m ")
        user_input = input()
        try:
            # grab the document context for which you want to ask questions
            ist_context = StorageContext.from_defaults(persist_dir=ist_docs_directory)
            # ask gpt
            prompting_result = chat_gpt_handler.get_gpt_response(context=ist_context, query=user_input)
            print("CHAT GPT RESPONSE ====>", prompting_result.response)

        except Exception as e:
            raise e


if __name__ == "__main__":

    executor = executor()
