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
from rag import rag_system

# Manage chat history
stores = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in stores:
        stores[session_id] = ChatMessageHistory()
    return stores[session_id]

conversational_rag_chain = RunnableWithMessageHistory(
      rag_system,
      get_session_history,
      input_messages_key="input",
      history_messages_key="chat_history",
      output_messages_key="answer",
  )

def chatbot(user_input, session_id):
    conversational_rag_chain.invoke(
        {input:user_input},
        config={"configurable": {"session_id": session_id}}  
    )['answer']
    