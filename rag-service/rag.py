from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os

VECTOR_DB_DIR = "vector_db"
DATA_DIR = "data"

embeddings = OpenAIEmbeddings()


def get_vector_db():
    return Chroma(
        collection_name="rag_collection",
        embedding_function=embeddings,
        persist_directory=VECTOR_DB_DIR,
    )


def process_pdf(file_path: str):
    """Load a PDF, split into chunks, and store in vector DB"""
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
    )
    chunks = text_splitter.split_documents(docs)

    vector_db = get_vector_db()
    vector_db.add_documents(chunks)

    return len(chunks)


def ask_rag(query: str, chat_history: list = []):
    """Ask a question using RAG with optional chat history"""
    vector_db = get_vector_db()
    results = vector_db.similarity_search(query, k=6)

    context = "\n\n".join([r.page_content for r in results])

    # Build conversation history string
    history_str = ""
    if chat_history:
        for msg in chat_history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_str += f"{role}: {content}\n"

    llm = ChatOpenAI(model="gpt-4o-mini")

    response = llm.invoke(
        f"""
You are a helpful assistant. Answer the question based on the context below.
If the answer is not in the context, say "I don't have enough information to answer that."

Chat History:
{history_str}

Context:
{context}

Question:
{query}
"""
    )

    return response.content
