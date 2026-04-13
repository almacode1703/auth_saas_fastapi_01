from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

router = APIRouter()

# Load model and locations at startup
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "house_price_model.pkl")
LOCATIONS_PATH = os.path.join(MODEL_DIR, "locations.pkl")

model = joblib.load(MODEL_PATH)
locations = joblib.load(LOCATIONS_PATH)

print(f"[house_price_prediction] Model loaded. {len(locations)} locations.")


class PredictRequest(BaseModel):
    location: str
    total_sqft: float
    bath: int
    bhk: int


@router.get("/locations")
def get_locations():
    """Return sorted list of valid locations for the frontend dropdown."""
    return {"locations": locations}


@router.post("/predict")
def predict_house_price(request: PredictRequest):
    if request.total_sqft < 300:
        raise HTTPException(status_code=400, detail="Total sqft must be at least 300")
    if request.bhk < 1 or request.bhk > 20:
        raise HTTPException(status_code=400, detail="BHK must be between 1 and 20")
    if request.bath < 1 or request.bath > 20:
        raise HTTPException(status_code=400, detail="Bathrooms must be between 1 and 20")
    if request.total_sqft / request.bhk < 300:
        raise HTTPException(
            status_code=400,
            detail=f"Too small for {request.bhk} BHK (need at least {request.bhk * 300} sqft)",
        )

    location = request.location if request.location in locations else "other"

    input_df = pd.DataFrame([{
        "location": location,
        "total_sqft": request.total_sqft,
        "bath": request.bath,
        "bhk": request.bhk,
    }])

    predicted_price = model.predict(input_df)[0]
    predicted_price = max(predicted_price, 0)

    return {
        "predicted_price_lakhs": round(float(predicted_price), 2),
        "predicted_price_rupees": round(float(predicted_price) * 100000, 2),
        "input": {
            "location": request.location,
            "total_sqft": request.total_sqft,
            "bath": request.bath,
            "bhk": request.bhk,
        },
    }