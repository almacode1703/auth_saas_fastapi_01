from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import shutil
import os

from rag import process_pdf, ask_rag

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    query: str
    history: list[ChatMessage] = []


@app.get("/")
def health_check():
    return {"message": "RAG Service is running"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(DATA_DIR, file.filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    chunks = process_pdf(file_path)

    return {
        "message": f"PDF '{file.filename}' processed successfully",
        "chunks": chunks,
    }


@app.post("/chat")
def chat(request: ChatRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    history = [{"role": msg.role, "content": msg.content} for msg in request.history]

    answer = ask_rag(request.query, history)

    return {
        "answer": answer,
        "query": request.query,
    }