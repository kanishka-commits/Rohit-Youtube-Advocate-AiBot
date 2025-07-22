import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables (make sure .env file exists)
load_dotenv()

# Constants
FAISS_DB_PATH = "vectorstore/db_faiss"
OLLAMA_MODEL_NAME = "deepseek-r1:1.5b"
GROQ_MODEL = "deepseek-r1-distill-llama-70b"  # or "deepseek-coder:6.7b-instruct"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Step 1: Load FAISS Vector DB
def load_faiss_db():
    embeddings = OllamaEmbeddings(model=OLLAMA_MODEL_NAME)
    return FAISS.load_local(
        FAISS_DB_PATH,
        embeddings=embeddings,
        allow_dangerous_deserialization=True
    )

# Step 2: Setup LLM with Groq
def setup_llm():
    return ChatGroq(
        api_key=GROQ_API_KEY,
        model_name=GROQ_MODEL,
        temperature=0.2
    )

# Step 3: Get context from retrieved documents
def get_context(docs):
    return "\n\n".join([doc.page_content for doc in docs])

# Step 4: Use RAG prompt template
PROMPT_TEMPLATE = """
Use the pieces of information provided in the context to answer the user's question.
If you don't know the answer, just say "I don't know" — do not try to make up an answer.
Only answer using the given context.

Question: {question}
Context: {context}

Answer:
"""

def ask_question(llm, vector_db, query):
    docs = vector_db.similarity_search(query)
    context = get_context(docs)
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    chain = prompt | llm
    return chain.invoke({"question": query, "context": context})

# 🔁 Run the pipeline
if __name__ == "__main__":
    query = input("Ask your legal question: ")

    print("[+] Loading FAISS vector database...")
    db = load_faiss_db()

    print("[+] Setting up Groq LLM...")
    llm = setup_llm()

    print("[+] Answering your question...\n")
    response = ask_question(llm, db, query)
    print("💡 AI Answer:\n", response)
