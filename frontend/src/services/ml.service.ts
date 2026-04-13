import { ML_URL } from "@/lib/constants";

export interface HousePricePredictRequest {
  location: string;
  total_sqft: number;
  bath: number;
  bhk: number;
}

export interface HousePricePredictResponse {
  predicted_price_lakhs: number;
  predicted_price_rupees: number;
  input: HousePricePredictRequest;
}

export const mlService = {
  housePrice: {
    getLocations: async (): Promise<{ locations: string[] }> => {
      const response = await fetch(`${ML_URL}/supervised/house-price/locations`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Failed to load locations" }));
        throw error;
      }
      return response.json();
    },

    predict: async (data: HousePricePredictRequest): Promise<HousePricePredictResponse> => {
      const response = await fetch(`${ML_URL}/supervised/house-price/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Prediction failed" }));
        throw error;
      }
      return response.json();
    },
  },
};