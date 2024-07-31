import getpass
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

import os
from dotenv import load_dotenv
import google.generativeai as genai
from chunk_data import store


load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

llm = genai.GenerativeModel('gemini-1.5-flash')

def rag_system():
    # Store in vector database
    retriever = store()

    # Chat history + user input => contextualize the input => History aware retriever
    contextualized_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )

    contextualized_prompt_template = ChatPromptTemplate.from_messages([
        ('system', contextualized_system_prompt),
        MessagesPlaceholder('chat_history'),
        ('User', '{user_input}'),
    ])

    history_aware_retriever = create_history_aware_retriever(
        llm,
        retriever,
        contextualized_prompt_template,
    )

    #History aware prompt
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Think through step by step"
        "\n\n"
        "{context}"
    )

    prompt_template = ChatPromptTemplate.from_messages([
    [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    ])

    llm_response_to_user = create_stuff_documents_chain(llm, prompt_template)

    rag_qa_chain = create_retrieval_chain(history_aware_retriever, llm_response_to_user)

    return rag_qa_chain






   
