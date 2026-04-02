import { VOICE_URL } from "@/lib/constants";

export const voiceService = {
  getAssistant: async (voice: string = "raj") => {
    const response = await fetch(`${VOICE_URL}/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voice }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to get assistant" }));
      throw error;
    }

    return response.json();
  },

  chat: async (message: string, voice: string = "raj") => {
    const response = await fetch(`${VOICE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, voice }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Chat failed" }));
      throw error;
    }

    return response.json();
  },
};