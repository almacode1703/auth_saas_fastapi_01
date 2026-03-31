from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

client = OpenAI()


class ImageRequest(BaseModel):
    prompt: str
    size: str = "1024x1024"


@app.get("/")
def health_check():
    return {"message": "Image Service is running"}


@app.post("/generate")
async def generate_image(request: ImageRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            size=request.size,
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url

        return {
            "image_url": image_url,
            "prompt": request.prompt,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))