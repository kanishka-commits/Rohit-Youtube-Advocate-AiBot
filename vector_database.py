from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
import os

# Path to your actual PDF
PDF_PATH = "YouTube-Community-Guidelines-August-2018.pdf"
FAISS_DB_PATH = "vectorstore/db_faiss"
OLLAMA_MODEL_NAME = "deepseek-r1:14b"  # Make sure this model is available in your Ollama setup

# Step 1: Load the PDF
def load_pdf(file_path):
    loader = PDFPlumberLoader(file_path)
    return loader.load()

# Step 2: Split the content into chunks
def create_chunks(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True
    )
    return splitter.split_documents(documents)

# Step 3: Get Ollama embeddings
def get_embedding_model(model_name):
    return OllamaEmbeddings(model=model_name)

# Step 4: Store in FAISS vector DB
def create_faiss_index(docs, model_name):
    embeddings = get_embedding_model(model_name)
    faiss_db = FAISS.from_documents(docs, embeddings)
    faiss_db.save_local(FAISS_DB_PATH)
    print(f"Vector database saved at: {FAISS_DB_PATH}")

# Run everything
if __name__ == "__main__":
    docs = load_pdf(PDF_PATH)
    chunks = create_chunks(docs)
    create_faiss_index(chunks, OLLAMA_MODEL_NAME)
