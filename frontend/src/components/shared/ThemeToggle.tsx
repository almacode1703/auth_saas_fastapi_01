"use client";

import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";

const themes = [
  { id: "light", label: "Light", icon: Sun, color: "text-amber-500" },
  { id: "dark", label: "Dark", icon: Moon, color: "text-blue-400" },
  { id: "glass", label: "Glass", icon: Sparkles, color: "text-purple-400" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = themes.find((t) => t.id === theme) || themes[1];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors"
      >
        <CurrentIcon className={`w-4 h-4 ${currentTheme.color}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 rounded-lg border border-border bg-background shadow-lg overflow-hidden"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  theme === t.id
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/50"
                }`}
              >
                <t.icon className={`w-4 h-4 ${t.color}`} />
                {t.label}
                {theme === t.id && (
                  <motion.div
                    layoutId="activeTheme"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}