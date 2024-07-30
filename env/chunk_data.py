from langchain_chroma import Chroma
from langchain.chains import create_history_aware_retriever, create_retrieval_chain       #hypersonic search
from langchain.chains.combine_documents import create_stuff_documents_chain   # for combining documents
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder     # for custom prompt #for memory
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain_community.chat_message_histories import ChatMessageHistory  # storing chat messages
from langchain_core.chat_history import BaseChatMessageHistory  # holds all chat sessions
from langchain_core.runnables.history import RunnableWithMessageHistory  #allows model to work with history
from data_api import get_data



# Receive data 
api_data = get_data()

# Chunk data
def chunk():
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
  chunked_data = text_splitter.split_text(api_data)
  return chunked_data
  
def store():  
  vector_emb_store = Chroma.from_documents(chunk, embedding=HuggingFaceEmbeddings( model_name="BAAI/bge-large-en-v1.5", trust_remote_code=True))
  retriever = vector_emb_store.as_retriever()
  return retriever