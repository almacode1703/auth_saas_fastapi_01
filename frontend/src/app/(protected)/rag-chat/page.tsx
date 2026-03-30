"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, FileText, Bot, User, Loader2 } from "lucide-react";

import { ragService } from "@/services/rag.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function RagChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [pdfName, setPdfName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate: uploadPdf, isPending: isUploading } = useMutation({
    mutationFn: ragService.uploadPdf,
    onSuccess: (data) => {
      toast.success(data.message);
      setPdfName(data.message);
      setMessages([{
        role: "assistant",
        content: `PDF uploaded and processed successfully! I found ${data.chunks} chunks of text. Ask me anything about the document.`,
      }]);
    },
    onError: (error: any) => {
      toast.error(error.detail || "Upload failed");
    },
  });

  const { mutate: sendChat, isPending: isChatting } = useMutation({
    mutationFn: ({ query, history }: { query: string; history: Message[] }) =>
      ragService.chat(query, history),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    },
    onError: (error: any) => {
      toast.error(error.detail || "Chat failed");
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPdf(file);
  };

  const handleSend = () => {
    if (!query.trim()) return;

    const userMessage: Message = { role: "user", content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");

    sendChat({ query, history: messages });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">RAG Chat</h1>
          <p className="text-sm text-muted-foreground">
            Upload a PDF and chat with it
          </p>
        </div>
        <div>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No document loaded</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Upload a PDF document to get started. You can then ask questions about its content.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isChatting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your document..."
            disabled={isChatting || messages.length === 0}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isChatting || !query.trim() || messages.length === 0}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}