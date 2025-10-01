import os

from chat_gpt_handler import ChatGPTApiHandler
from llama_index.legacy import SimpleDirectoryReader, VectorStoreIndex


def embed_docs(folder_path: str, chunk_size: int = 750, chunk_overlap: int = 50):
    """Function that embeds the documents uploaded

    Parameters
    ----------
    folder_path : str
        the path to the document to be embedded
    chunk_size : int
        defines the length of each chunk
    chunk_overlap : int
        amount of consecutive chunk's overlap

    Raises
    ------
    e
        _description_
    """
    # initiate chat_gpt_handler
    chat_gpt_handler = ChatGPTApiHandler()

    # create service context
    service_context = chat_gpt_handler.initiate_service_context(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    # instantiate empty vector store index
    index = VectorStoreIndex([], service_context=service_context)
    try:
        for doc_name in os.listdir(folder_path):
            if ".json" in doc_name:
                continue

            # join the doc_name and folder path
            file_path = os.path.join(folder_path, doc_name)

            # tranform to llama (do embedding)
            print(f"Embedding the {doc_name}")
            documents = SimpleDirectoryReader(input_files=[file_path]).load_data()

            # add to vector store index
            [index.insert(doc) for doc in documents]

        # store embeddings in the disk
        context = index.storage_context.persist(persist_dir=folder_path)
        print("Finished embedding")

        return context

    except Exception as e:
        print(f"The documents were not embedded with the error {e}")
        raise e
