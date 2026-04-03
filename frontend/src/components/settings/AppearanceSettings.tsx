"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles, Monitor, Check } from "lucide-react";

const themes = [
  {
    id: "light",
    label: "Light",
    description: "Clean and bright interface",
    icon: Sun,
    color: "text-amber-500",
    bg: "bg-white",
    border: "border-amber-500",
    preview: "bg-gray-100",
  },
  {
    id: "dark",
    label: "Dark",
    description: "Easy on the eyes, perfect for night",
    icon: Moon,
    color: "text-blue-400",
    bg: "bg-gray-900",
    border: "border-blue-500",
    preview: "bg-gray-800",
  },
  {
    id: "glass",
    label: "Glass",
    description: "Frosted glass with purple accents",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-gray-950",
    border: "border-purple-500",
    preview: "bg-purple-950",
  },
  {
    id: "system",
    label: "System",
    description: "Follows your device settings",
    icon: Monitor,
    color: "text-green-400",
    bg: "bg-gradient-to-br from-white to-gray-900",
    border: "border-green-500",
    preview: "bg-gradient-to-r from-gray-100 to-gray-800",
  },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Theme selection */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-1">Theme</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose how InstAShark looks to you
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((t, index) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setTheme(t.id)}
              className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                theme === t.id
                  ? `${t.border} bg-primary/5`
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              {/* Check mark */}
              {theme === t.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}

              {/* Preview bar */}
              <div className={`w-full h-16 rounded-lg mb-3 ${t.preview} border border-border overflow-hidden`}>
                <div className="p-2 flex flex-col gap-1">
                  <div className={`w-16 h-1.5 rounded-full ${theme === t.id ? "bg-primary/40" : "bg-muted-foreground/20"}`} />
                  <div className={`w-24 h-1.5 rounded-full ${theme === t.id ? "bg-primary/30" : "bg-muted-foreground/15"}`} />
                  <div className={`w-12 h-1.5 rounded-full ${theme === t.id ? "bg-primary/20" : "bg-muted-foreground/10"}`} />
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-2 mb-1">
                <t.icon className={`w-4 h-4 ${t.color}`} />
                <span className="font-medium text-sm">{t.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Font size (future ready) */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-1">Font Size</h3>
        <p className="text-sm text-muted-foreground mb-4">Adjust text size across the app</p>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">A</span>
          <input
            type="range"
            min="12"
            max="20"
            defaultValue="16"
            className="flex-1 accent-primary"
          />
          <span className="text-lg text-muted-foreground">A</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
      </div>

      {/* Accent color (future ready) */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-1">Accent Color</h3>
        <p className="text-sm text-muted-foreground mb-4">Personalize your interface color</p>

        <div className="flex items-center gap-3">
          {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-amber-500", "bg-red-500", "bg-cyan-500"].map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full ${color} border-2 border-transparent hover:border-foreground/30 transition-all hover:scale-110`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
      </div>
    </div>
  );
}