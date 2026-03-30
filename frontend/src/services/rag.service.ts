import { RAG_URL } from "@/lib/constants";

const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const ragService = {
  uploadPdf: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${RAG_URL}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Upload failed" }));
      throw error;
    }

    return response.json();
  },

  chat: async (query: string, history: { role: string; content: string }[]) => {
    const token = getToken();
    const response = await fetch(`${RAG_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ query, history }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Chat failed" }));
      throw error;
    }

    return response.json();
  },
};