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
You are a legal AI assistant designed to help content creators understand contracts by simplifying complex legal language into clear, plain English.
Use only the information provided in the contract text. Do not make assumptions or generate legal advice beyond the context.
Always respond in a **formal, assertive tone** and ensure **full legal clarity** while simplifying. 
Your goal is to make the terms transparent and easily understandable for a non-lawyer creator.
**Structure your response in this format:**
Summary:
- Give a high-level explanation of what the contract or clause is about.
Key Terms Explained:
- Bullet out and explain any important terms, rights, obligations, timelines, fees, ownership clauses, or penalties.
- Flag anything that may require special attention (e.g., exclusivity, indemnity, automatic renewals).
Plain English Version:
- Rewrite the entire clause/section in simple, everyday language while preserving all its meaning.
---
Example 1:
Contract Text:
"The Creator hereby grants the Platform an irrevocable, worldwide, royalty-free license to use, reproduce, modify, and distribute their content across any media now known or later developed."
Answer:
Summary:
This clause talks about how the platform can use the creator’s content.
Key Terms Explained:
- "Irrevocable": Cannot be withdrawn once granted.
- "Royalty-free": You won’t get paid each time your content is used.
- "Worldwide": Applies globally.
- "Any media": Includes all current and future formats (e.g., YouTube, podcasts, VR, etc.).
Plain English Version:
Once you upload content to the platform, they can use it anywhere, however they like, without paying you—and you can’t take back those rights.
---
Now simplify the following contract in the same format:

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
