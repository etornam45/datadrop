import getpass
from langchain.chains import create_history_aware_retriever, create_retrieval_chain       # retrievers
from langchain.chains.combine_documents import create_stuff_documents_chain   # for combining documents
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder     # prompt templates and chat history
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import TextLoader
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_huggingface.embeddings import HuggingFaceEmbeddings

import os
from dotenv import load_dotenv
import google.generativeai as genai

from chunk_data import chunk_store


load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
llm = genai.GenerativeModel('gemini-1.5-flash')



def create_rag_system():

    chunk_store()
    
    # Context reconstruction prompt
    contextualized_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )

    contextualized_prompt_template = ChatPromptTemplate.from_messages([
        ('system', contextualized_system_prompt),
        MessagesPlaceholder(variable_name='chat_history'),
        ('human', '{question}'),
    ])

    # Create history-aware retriever
    history_aware_retriever = create_history_aware_retriever(
        llm,
        retriever,
        contextualized_prompt_template,
    )

    # RAG prompt
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Think through step by step"
        "\n\n"
        "{context}"
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ])

    # Create the RAG chain
    rag_chain = (
        RunnablePassthrough.assign(
            context=history_aware_retriever
        )
        | prompt_template
        | llm
        | StrOutputParser()
    )

    return rag_chain

rag_system = create_rag_system()






   
