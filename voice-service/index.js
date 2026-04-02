import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { VapiClient } from "@vapi-ai/server-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const vapi = new VapiClient({
  token: process.env.VAPI_PRIVATE_KEY,
});

let assistants = {};

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Voice Service is running" });
});

// Create or get assistant with specific voice
app.post("/assistant", async (req, res) => {
  try {
    const { voice = "raj" } = req.body;

    if (assistants[voice]) {
      return res.json({ assistantId: assistants[voice] });
    }

    const voiceConfig =
      voice === "ayushi"
        ? { provider: "azure", voiceId: "en-US-AvaNeural" }
        : { provider: "azure", voiceId: "en-US-AndrewNeural" };
        
    const assistant = await vapi.assistants.create({
      name: `Voice Agent - ${voice}`,
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful voice assistant named ${voice === "ayushi" ? "Ayushi" : "Raj"}. You speak in a friendly, professional tone. Keep responses concise and conversational.`,
          },
        ],
      },
      voice: voiceConfig,
    });

    assistants[voice] = assistant.id;
    res.json({ assistantId: assistant.id });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create assistant" });
  }
});

// Text chat fallback
app.post("/chat", async (req, res) => {
  try {
    const { message, voice = "raj" } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const voiceName = voice === "ayushi" ? "Ayushi" : "Raj";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant named ${voiceName}. Keep responses concise and conversational.`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    res.json({ reply, voice: voiceName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Chat failed" });
  }
});

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
  console.log(`Voice Service running on http://localhost:${PORT}`);
});
