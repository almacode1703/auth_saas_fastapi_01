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
  X,
  Volume2,
} from "lucide-react";

import { voiceService } from "@/services/voice.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoiceAvatar from "@/components/shared/VoiceAvatar";

type CallState = "idle" | "connecting" | "listening" | "speaking" | "thinking" | "disconnected";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_KEY || "";

export default function VoiceAgentPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [selectedVoice, setSelectedVoice] = useState<"raj" | "ayushi">("raj");
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [transcript, setTranscript] = useState("");
  const vapiRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Initialize VAPI
  useEffect(() => {
    const loadVapi = async () => {
      const VapiModule = await import("@vapi-ai/web");
      const VapiClass = VapiModule.default ?? VapiModule;
      vapiRef.current = new VapiClass(VAPI_PUBLIC_KEY);

      vapiRef.current.on("call-start", () => setCallState("listening"));
      vapiRef.current.on("speech-start", () => setCallState("speaking"));
      vapiRef.current.on("speech-end", () => setCallState("listening"));
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
    return () => { if (vapiRef.current) vapiRef.current.stop(); };
  }, []);

  // Canvas waveform
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

    const barCount = 50;
    const gap = 3;
    const barWidth = (width - gap * barCount) / barCount;

    for (let i = 0; i < barCount; i++) {
      let amplitude = 0;
      if (callState === "speaking") {
        amplitude = Math.abs(Math.sin(time * 3 + i * 0.4)) * 0.7 +
          Math.abs(Math.cos(time * 5 + i * 0.3)) * 0.4;
        amplitude *= (0.5 + Math.random() * 0.5);
      } else if (callState === "listening") {
        amplitude = Math.abs(Math.sin(time * 2 + i * 0.5)) * 0.25 +
          Math.random() * 0.1;
      } else if (callState === "thinking") {
        amplitude = Math.abs(Math.sin(time * 4 + i * 0.8)) * 0.15;
      } else if (callState === "connecting") {
        amplitude = Math.abs(Math.sin(time * 6 + i * 0.6)) * 0.1;
      } else {
        amplitude = Math.abs(Math.sin(time * 0.8 + i * 0.3)) * 0.05 + 0.015;
      }

      const barHeight = Math.max(amplitude * height * 0.8, 2);
      const x = i * (barWidth + gap);

      const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);
      if (callState === "speaking") {
        gradient.addColorStop(0, "#a855f7");
        gradient.addColorStop(0.5, "#8b5cf6");
        gradient.addColorStop(1, "#6366f1");
      } else if (callState === "listening") {
        gradient.addColorStop(0, "#22d3ee");
        gradient.addColorStop(1, "#06b6d4");
      } else if (callState === "thinking") {
        gradient.addColorStop(0, "#f59e0b");
        gradient.addColorStop(1, "#f97316");
      } else if (callState === "connecting") {
        gradient.addColorStop(0, "#facc15");
        gradient.addColorStop(1, "#eab308");
      } else {
        gradient.addColorStop(0, "#4b5563");
        gradient.addColorStop(1, "#374151");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawWaveform);
  }, [callState]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(drawWaveform);
    return () => cancelAnimationFrame(animationRef.current);
  }, [drawWaveform]);

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

  const handleStopCall = () => {
    if (vapiRef.current) vapiRef.current.stop();
  };

  const handleToggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const { mutate: sendText, isPending: isSendingText } = useMutation({
    mutationFn: ({ message, voice }: { message: string; voice: string }) =>
      voiceService.chat(message, voice),
    onSuccess: (data) => {
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
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
      case "connecting": return "Connecting...";
      case "listening": return "Listening to you...";
      case "speaking": return `${selectedVoice === "ayushi" ? "Ayushi" : "Raj"} is speaking...`;
      case "thinking": return "Processing...";
      case "disconnected": return "Call ended";
      default: return "Ready to talk";
    }
  };

  const getStateColor = () => {
    switch (callState) {
      case "connecting": return "text-yellow-400";
      case "listening": return "text-cyan-400";
      case "speaking": return "text-purple-400";
      case "thinking": return "text-orange-400";
      case "disconnected": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const isInCall = ["listening", "speaking", "thinking", "connecting"].includes(callState);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                AI Voice Agent
              </h1>
              <p className="text-xs text-muted-foreground">Talk or type with your AI assistant</p>
            </div>
          </div>

          {/* Voice selector */}
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur rounded-full p-1 border border-border">
            <button
              onClick={() => !isInCall && setSelectedVoice("raj")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedVoice === "raj"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Raj
            </button>
            <button
              onClick={() => !isInCall && setSelectedVoice("ayushi")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedVoice === "ayushi"
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ayushi
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Voice panel */}
        <motion.div
          animate={{ width: chatOpen ? "50%" : "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full flex flex-col items-center justify-center relative"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-blue-950/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Avatar */}
            <VoiceAvatar voice={selectedVoice} state={callState} />

            {/* Name */}
            <div className="text-center">
              <h2 className="text-lg font-semibold">
                {selectedVoice === "ayushi" ? "Ayushi" : "Raj"}
              </h2>
              <motion.p
                key={callState}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${getStateColor()}`}
              >
                {getStateLabel()}
              </motion.p>
            </div>

            {/* Waveform */}
            <div className="w-80">
              <canvas
                ref={canvasRef}
                width={400}
                height={80}
                className="w-full h-16"
              />
            </div>

            {/* Transcript */}
            <AnimatePresence>
              {transcript && isInCall && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-sm text-center px-4"
                >
                  <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call controls */}
            <div className="flex items-center gap-5">
              {!isInCall ? (
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={handleStartCall}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all"
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={handleToggleMute}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                        isMuted
                          ? "bg-red-500/10 border-red-500/50 text-red-500"
                          : "bg-background/50 border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={handleStopCall}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all"
                    >
                      <PhoneOff className="w-6 h-6 text-white" />
                    </button>
                  </motion.div>
                </>
              )}

              {/* Chat toggle */}
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                    chatOpen
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-500"
                      : "bg-background/50 border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full border-l border-border flex flex-col overflow-hidden bg-background"
            >
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Chat with {selectedVoice === "ayushi" ? "Ayushi" : "Raj"}
                  </span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Type a message to start chatting
                    </p>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <span className={`text-sm px-3 py-2 rounded-2xl max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                        : "bg-muted text-foreground"
                    }`}>
                      {msg.content}
                    </span>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="px-4 py-3 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                    placeholder="Type a message..."
                    disabled={isSendingText}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendText}
                    disabled={isSendingText || !textInput.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}