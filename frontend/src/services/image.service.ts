import { IMAGE_URL } from "@/lib/constants";

export const imageService = {
  generate: async (prompt: string, size: string = "1024x1024") => {
    const response = await fetch(`${IMAGE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, size }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Image generation failed" }));
      throw error;
    }

    return response.json();
  },
};