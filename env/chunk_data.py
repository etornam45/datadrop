from langchain_community.document_loaders import TextLoader
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from data_api import get_data


docs = []


def chunk_store():
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
  embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

  all_documents = []

  for doc in docs:
    for doc_name, content in doc.items():
      chunks = text_splitter.split_text(content)
      
      # Create Document objects for each chunk
      for chunk in chunks:
          all_documents.append(Document(
              page_content=chunk,
              metadata={"source": doc_name}
          ))
          
  vector_emb_store = Chroma.from_documents(
      documents=all_documents,
      embedding=embeddings
  )   

  retriever = vector_emb_store.as_retriever()     
  return retriever
