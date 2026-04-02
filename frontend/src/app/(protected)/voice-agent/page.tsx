"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Volume2,
} from "lucide-react";

import { voiceService } from "@/services/voice.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CallState =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "thinking"
  | "disconnected";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_KEY || "";

export default function VoiceAgentPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [selectedVoice, setSelectedVoice] = useState<"raj" | "ayushi">("raj");
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [transcript, setTranscript] = useState("");
  const vapiRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Initialize VAPI
  useEffect(() => {
    const loadVapi = async () => {
      const VapiModule = await import("@vapi-ai/web");
      const VapiClass = VapiModule.default ?? VapiModule;
      vapiRef.current = new VapiClass(VAPI_PUBLIC_KEY);

      vapiRef.current.on("call-start", () => {
        setCallState("listening");
      });

      vapiRef.current.on("speech-start", () => {
        setCallState("speaking");
      });

      vapiRef.current.on("speech-end", () => {
        setCallState("listening");
      });

      vapiRef.current.on("call-end", () => {
        setCallState("disconnected");
        setTimeout(() => setCallState("idle"), 2000);
      });

      vapiRef.current.on("message", (msg: any) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          setTranscript(msg.transcript);
        }
      });

      vapiRef.current.on("error", (err: any) => {
        console.error(err);
        toast.error("Voice error: " + (err.message || "Unknown error"));
        setCallState("idle");
      });
    };

    loadVapi();

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  // Canvas waveform animation
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const time = Date.now() / 1000;

    ctx.clearRect(0, 0, width, height);

    const barCount = 40;
    const barWidth = width / barCount - 2;

    for (let i = 0; i < barCount; i++) {
      let amplitude = 0;

      if (callState === "speaking") {
        amplitude =
          Math.abs(Math.sin(time * 3 + i * 0.4)) * 0.8 +
          Math.abs(Math.cos(time * 5 + i * 0.3)) * 0.4;
        amplitude *= 0.5 + Math.random() * 0.5;
      } else if (callState === "listening") {
        amplitude =
          Math.abs(Math.sin(time * 2 + i * 0.5)) * 0.3 + Math.random() * 0.15;
      } else if (callState === "thinking") {
        amplitude = Math.abs(Math.sin(time * 4 + i * 0.8)) * 0.2;
      } else {
        amplitude = Math.abs(Math.sin(time * 0.8 + i * 0.3)) * 0.08 + 0.02;
      }

      const barHeight = amplitude * height * 0.8;
      const x = i * (barWidth + 2);

      const gradient = ctx.createLinearGradient(
        x,
        centerY - barHeight / 2,
        x,
        centerY + barHeight / 2,
      );

      if (callState === "speaking") {
        gradient.addColorStop(0, "#a855f7");
        gradient.addColorStop(0.5, "#6366f1");
        gradient.addColorStop(1, "#3b82f6");
      } else if (callState === "listening") {
        gradient.addColorStop(0, "#22d3ee");
        gradient.addColorStop(1, "#06b6d4");
      } else if (callState === "thinking") {
        gradient.addColorStop(0, "#f59e0b");
        gradient.addColorStop(1, "#f97316");
      } else {
        gradient.addColorStop(0, "#4b5563");
        gradient.addColorStop(1, "#374151");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 3);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawWaveform);
  }, [callState]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(drawWaveform);
    return () => cancelAnimationFrame(animationRef.current);
  }, [drawWaveform]);

  // Start call
  const handleStartCall = async () => {
    try {
      setCallState("connecting");
      const data = await voiceService.getAssistant(selectedVoice);
      await vapiRef.current.start(data.assistantId);
    } catch (err: any) {
      toast.error(err.error || "Failed to start call");
      setCallState("idle");
    }
  };

  // Stop call
  const handleStopCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  // Toggle mute
  const handleToggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Text chat fallback
  const { mutate: sendText, isPending: isSendingText } = useMutation({
    mutationFn: ({ message, voice }: { message: string; voice: string }) =>
      voiceService.chat(message, voice),
    onSuccess: (data) => {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    },
    onError: (error: any) => {
      toast.error(error.error || "Chat failed");
    },
  });

  const handleSendText = () => {
    if (!textInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", content: textInput }]);
    sendText({ message: textInput, voice: selectedVoice });
    setTextInput("");
  };

  const getStateLabel = () => {
    switch (callState) {
      case "connecting":
        return "Connecting...";
      case "listening":
        return "Listening...";
      case "speaking":
        return `${selectedVoice === "ayushi" ? "Ayushi" : "Raj"} is speaking...`;
      case "thinking":
        return "Thinking...";
      case "disconnected":
        return "Call ended";
      default:
        return "Ready to talk";
    }
  };

  const getStateColor = () => {
    switch (callState) {
      case "connecting":
        return "text-yellow-400";
      case "listening":
        return "text-cyan-400";
      case "speaking":
        return "text-purple-400";
      case "thinking":
        return "text-orange-400";
      case "disconnected":
        return "text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const isInCall = ["listening", "speaking", "thinking", "connecting"].includes(
    callState,
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">AI Voice Agent</h1>
          <p className="text-sm text-muted-foreground">
            Talk or type with your AI assistant
          </p>
        </div>

        {/* Voice selector */}
        <div className="flex items-center gap-2 bg-muted rounded-full p-1">
          <button
            onClick={() => !isInCall && setSelectedVoice("raj")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedVoice === "raj"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🧑 Raj
          </button>
          <button
            onClick={() => !isInCall && setSelectedVoice("ayushi")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedVoice === "ayushi"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            👩 Ayushi
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Avatar */}
        <motion.div
          animate={{
            scale: callState === "speaking" ? [1, 1.05, 1] : 1,
            boxShadow:
              callState === "speaking"
                ? [
                    "0 0 0px rgba(168,85,247,0)",
                    "0 0 60px rgba(168,85,247,0.5)",
                    "0 0 0px rgba(168,85,247,0)",
                  ]
                : callState === "listening"
                  ? "0 0 30px rgba(34,211,238,0.3)"
                  : "0 0 0px rgba(0,0,0,0)",
          }}
          transition={{
            duration: callState === "speaking" ? 1.5 : 0.5,
            repeat: callState === "speaking" ? Infinity : 0,
          }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center text-5xl"
        >
          {selectedVoice === "ayushi" ? "👩" : "🧑"}
        </motion.div>

        {/* State label */}
        <motion.p
          key={callState}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm font-medium ${getStateColor()}`}
        >
          {getStateLabel()}
        </motion.p>

        {/* Waveform */}
        <div className="w-full max-w-lg">
          <canvas
            ref={canvasRef}
            width={500}
            height={100}
            className="w-full h-24"
          />
        </div>

        {/* Transcript */}
        <AnimatePresence>
          {transcript && isInCall && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-lg text-center"
            >
              <p className="text-sm text-muted-foreground italic">
                "{transcript}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call controls */}
        <div className="flex items-center gap-4">
          {!isInCall ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleStartCall}
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25"
              >
                <Phone className="w-6 h-6" />
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleToggleMute}
                  size="lg"
                  variant="outline"
                  className={`w-14 h-14 rounded-full ${isMuted ? "bg-red-500/10 border-red-500/50 text-red-500" : ""}`}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleStopCall}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Text chat section */}
      <div className="border-t border-border">
        {/* Chat messages */}
        {/* Chat messages */}
        {chatMessages.length > 0 && (
          <div className="max-h-40 overflow-y-auto px-6 py-3 space-y-2 max-w-2xl mx-auto">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`text-sm px-3 py-1.5 rounded-2xl max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.content}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Text input */}
        <div className="px-6 py-4">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
            </div>
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              placeholder={`Type a message to ${selectedVoice === "ayushi" ? "Ayushi" : "Raj"}...`}
              disabled={isSendingText}
              className="flex-1"
            />
            <Button
              onClick={handleSendText}
              disabled={isSendingText || !textInput.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
