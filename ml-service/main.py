from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from supervised_ml.house_price_prediction.router import router as house_price_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/")
def health_check():
    return {
        "message": "ML Service is running",
        "services": {
            "supervised": ["house_price_prediction"],
            "unsupervised": [],
            "deep_learning": [],
            "nlp": [],
            "opencv": [],
            "agentic_ai": [],
        },
    }


# Register ML service routers
app.include_router(
    house_price_router,
    prefix="/supervised/house-price",
    tags=["supervised-ml"],
)