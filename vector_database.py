from langchain_groq import ChatGroq
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Constants
FAISS_DB_PATH = "vectorstore/db_faiss"
OLLAMA_MODEL_NAME = "deepseek-r1:1.5b"
GROQ_MODEL = "deepseek-r1-distill-llama-70b"

# Setup LLM
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model=GROQ_MODEL,
    temperature=0.2
)
# Load FAISS DB
def load_faiss():
    embeddings = OllamaEmbeddings(model=OLLAMA_MODEL_NAME)
    return FAISS.load_local(FAISS_DB_PATH, embeddings=embeddings, allow_dangerous_deserialization=True)

db = load_faiss()

# Utility to build a prompt chain
def get_chain(template):
    prompt = ChatPromptTemplate.from_template(template)
    return prompt | llm | StrOutputParser()

# Function: Simplify Contract
def simplify_contract(text):
    template = """
    Simplify this contract text for a content creator. Be clear, accurate, and brief:

    Contract:
    {text}

    Simplified Summary:
    """
    chain = get_chain(template)
    return chain.invoke({"text": text})

# Function: Content Safety Check
def check_content_safety(text):
    template = """
    Analyze the following content for YouTube safety and flag any potential violations (e.g., hate speech, misinformation, copyright, nudity, etc.):

    Content:
    {text}

    Report:
    """
    chain = get_chain(template)
    return chain.invoke({"text": text})

# Function: Generate Invoice
def generate_invoice(brand, service, amount, include_gst):
    gst_text = " including 18% GST" if include_gst else ""
    final_amount = round(amount * 1.18, 2) if include_gst else amount

    return f"""
    INVOICE
    -------------
    Brand/Sponsor: {brand}
    Service: {service}
    Amount: ₹{final_amount:.2f}{gst_text}
    Thank you for your collaboration!
    """

# Function: Get Policy Response (RAG)
def get_policy_response(question):
    context_docs = db.similarity_search(question)
    context = "\n\n".join([doc.page_content for doc in context_docs])

    template = """
    Use the context below to answer the user's YouTube policy question.
    Do not guess or hallucinate answers.

    Question: {question}
    Context:
    {context}

    Answer:
    """
    chain = get_chain(template)
    return chain.invoke({"question": question, "context": context})

# Function: Ask Rohit Anything (RAG)
def ask_rohit(question):
    context_docs = db.similarity_search(question)
    context = "\n\n".join([doc.page_content for doc in context_docs])

    template = """
    You're a legal assistant AI trained on YouTube community guidelines.
    Use the context below to answer the creator's question clearly.

    Question: {question}
    Context:
    {context}

    Answer:
    """
    chain = get_chain(template)
    return chain.invoke({"question": question, "context": context})


