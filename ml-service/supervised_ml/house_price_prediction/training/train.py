"""
House Price Prediction - Training Script
Cleans Bengaluru housing data and trains a Linear Regression model.
Run once: python train.py
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "Bengaluru_House_Data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "house_price_model.pkl")
LOCATIONS_PATH = os.path.join(BASE_DIR, "models", "locations.pkl")


def convert_sqft(x):
    """Handle ranges like '1133 - 1384' → average. Drop non-numeric like '34.46Sq. Meter'."""
    try:
        return float(x)
    except ValueError:
        if "-" in str(x):
            parts = x.split("-")
            try:
                return (float(parts[0]) + float(parts[1])) / 2
            except ValueError:
                return None
        return None


def extract_bhk(x):
    """'2 BHK' → 2, '4 Bedroom' → 4"""
    try:
        return int(str(x).split(" ")[0])
    except (ValueError, AttributeError):
        return None


def clean_data(df):
    print(f"Initial rows: {len(df)}")

    # Drop noisy columns
    df = df.drop(columns=["area_type", "availability", "society", "balcony"])

    # Drop rows with missing critical values
    df = df.dropna(subset=["location", "size", "bath", "total_sqft"])
    print(f"After dropna: {len(df)}")

    # Clean size → bhk
    df["bhk"] = df["size"].apply(extract_bhk)
    df = df.drop(columns=["size"])
    df = df.dropna(subset=["bhk"])

    # Clean total_sqft
    df["total_sqft"] = df["total_sqft"].apply(convert_sqft)
    df = df.dropna(subset=["total_sqft"])
    print(f"After sqft clean: {len(df)}")

    # Clean location (strip whitespace)
    df["location"] = df["location"].apply(lambda x: x.strip())

    # Feature engineer: price per sqft (lakhs per sqft, converted to rupees per sqft)
    df["price_per_sqft"] = df["price"] * 100000 / df["total_sqft"]

    # Dimensionality reduction: locations with < 10 listings → 'other'
    location_counts = df["location"].value_counts()
    locations_less_than_10 = location_counts[location_counts <= 10].index
    df["location"] = df["location"].apply(
        lambda x: "other" if x in locations_less_than_10 else x
    )
    print(f"Unique locations: {df['location'].nunique()}")

    # Outlier: sqft per BHK should be >= 300
    df = df[~(df["total_sqft"] / df["bhk"] < 300)]
    print(f"After sqft/bhk outlier removal: {len(df)}")

    # Outlier: price_per_sqft — remove per-location outliers (>1 std from mean)
    def remove_pps_outliers(data):
        out = pd.DataFrame()
        for loc, subdf in data.groupby("location"):
            m = np.mean(subdf["price_per_sqft"])
            s = np.std(subdf["price_per_sqft"])
            reduced = subdf[(subdf["price_per_sqft"] > m - s) & (subdf["price_per_sqft"] <= m + s)]
            out = pd.concat([out, reduced], ignore_index=True)
        return out

    df = remove_pps_outliers(df)
    print(f"After pps outlier removal: {len(df)}")

    # Outlier: bathrooms should not exceed bhk + 2
    df = df[df["bath"] < df["bhk"] + 2]
    print(f"After bath outlier removal: {len(df)}")

    # Drop price_per_sqft — it was only for outlier detection
    df = df.drop(columns=["price_per_sqft"])

    return df


def train_model(df):
    X = df[["location", "total_sqft", "bath", "bhk"]]
    y = df["price"]

    # One-hot encode location, pass other features through
    preprocessor = ColumnTransformer(
        transformers=[("loc", OneHotEncoder(handle_unknown="ignore"), ["location"])],
        remainder="passthrough",
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression()),
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)

    train_score = r2_score(y_train, pipeline.predict(X_train))
    test_score = r2_score(y_test, pipeline.predict(X_test))
    print(f"Train R²: {train_score:.4f}")
    print(f"Test R²:  {test_score:.4f}")

    return pipeline, sorted(df["location"].unique().tolist())


def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    print("\nCleaning data...")
    df = clean_data(df)

    print("\nTraining model...")
    model, locations = train_model(df)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(locations, LOCATIONS_PATH)

    print(f"\nModel saved to: {MODEL_PATH}")
    print(f"Locations saved to: {LOCATIONS_PATH}")
    print(f"Total unique locations: {len(locations)}")


if __name__ == "__main__":
    main()