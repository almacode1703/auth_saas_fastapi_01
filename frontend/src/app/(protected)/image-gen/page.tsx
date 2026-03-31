"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Download, Loader2, ImageIcon, Sparkles } from "lucide-react";

import { imageService } from "@/services/image.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { mutate: generate, isPending } = useMutation({
    mutationFn: () => imageService.generate(prompt),
    onSuccess: (data) => {
      setImageUrl(data.image_url);
      toast.success("Image generated!");
    },
    onError: (error: any) => {
      toast.error(error.detail || "Image generation failed");
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    generate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instashark-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">AI Image Generator</h1>
        <p className="text-sm text-muted-foreground">
          Describe what you want and DALL-E 3 will create it
        </p>
      </div>

      {/* Main area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Empty state */}
          {!imageUrl && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Create something amazing</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Type a detailed prompt below and watch AI bring your imagination to life.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[
                  "A futuristic city at sunset",
                  "A cat astronaut in space",
                  "Abstract watercolor art",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading state */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Generating your image...</h2>
              <p className="text-sm text-muted-foreground">
                This may take 10-20 seconds
              </p>
            </motion.div>
          )}

          {/* Generated image */}
          <AnimatePresence>
            {imageUrl && !isPending && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img
                    src={imageUrl}
                    alt={prompt}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate max-w-[70%]">
                    "{prompt}"
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to create..."
            disabled={isPending}
            className="flex-1"
          />
          <Button
            onClick={handleGenerate}
            disabled={isPending || !prompt.trim()}
            className="gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}