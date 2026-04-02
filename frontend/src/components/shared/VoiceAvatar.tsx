"use client";

import { motion } from "framer-motion";

interface VoiceAvatarProps {
  voice: "raj" | "ayushi";
  state: "idle" | "connecting" | "listening" | "speaking" | "thinking" | "disconnected";
}

export default function VoiceAvatar({ voice, state }: VoiceAvatarProps) {
  const isActive = ["listening", "speaking", "thinking"].includes(state);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      {isActive && (
        <>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-40 h-40 rounded-full ${
              state === "speaking" ? "bg-purple-500/20" :
              state === "listening" ? "bg-cyan-500/20" :
              "bg-amber-500/20"
            }`}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className={`absolute w-36 h-36 rounded-full ${
              state === "speaking" ? "bg-purple-500/30" :
              state === "listening" ? "bg-cyan-500/30" :
              "bg-amber-500/30"
            }`}
          />
        </>
      )}

      {/* Glow ring */}
      <motion.div
        animate={{
          boxShadow: state === "speaking"
            ? ["0 0 20px rgba(168,85,247,0.3)", "0 0 50px rgba(168,85,247,0.6)", "0 0 20px rgba(168,85,247,0.3)"]
            : state === "listening"
            ? ["0 0 20px rgba(34,211,238,0.3)", "0 0 40px rgba(34,211,238,0.5)", "0 0 20px rgba(34,211,238,0.3)"]
            : state === "connecting"
            ? ["0 0 15px rgba(250,204,21,0.3)", "0 0 30px rgba(250,204,21,0.5)", "0 0 15px rgba(250,204,21,0.3)"]
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`w-28 h-28 rounded-full flex items-center justify-center border-2 ${
          state === "speaking" ? "border-purple-500" :
          state === "listening" ? "border-cyan-500" :
          state === "connecting" ? "border-yellow-500" :
          state === "disconnected" ? "border-red-500" :
          "border-border"
        }`}
      >
        {/* Avatar SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {voice === "raj" ? (
            <>
              {/* Male professional avatar */}
              <circle cx="40" cy="40" r="38" fill="url(#rajBg)" />
              <circle cx="40" cy="32" r="14" fill="#D4A574" />
              <ellipse cx="40" cy="68" rx="22" ry="16" fill="#1E40AF" />
              <rect x="32" y="46" width="16" height="10" rx="2" fill="#D4A574" />
              <circle cx="35" cy="30" r="2" fill="#1a1a2e" />
              <circle cx="45" cy="30" r="2" fill="#1a1a2e" />
              <path d="M36 36 Q40 39 44 36" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M26 22 Q32 16 40 18 Q48 16 54 22 Q52 14 40 12 Q28 14 26 22Z" fill="#1a1a2e" />
              <rect x="30" y="52" width="20" height="2" rx="1" fill="white" opacity="0.6" />
              <defs>
                <radialGradient id="rajBg">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </radialGradient>
              </defs>
            </>
          ) : (
            <>
              {/* Female professional avatar */}
              <circle cx="40" cy="40" r="38" fill="url(#ayushiBg)" />
              <circle cx="40" cy="32" r="14" fill="#E8B89D" />
              <ellipse cx="40" cy="68" rx="22" ry="16" fill="#7C3AED" />
              <rect x="32" y="46" width="16" height="10" rx="2" fill="#E8B89D" />
              <circle cx="35" cy="30" r="2" fill="#1a1a2e" />
              <circle cx="45" cy="30" r="2" fill="#1a1a2e" />
              <path d="M36 36 Q40 39 44 36" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M22 28 Q24 14 40 12 Q56 14 58 28 Q56 22 50 20 L48 32 Q44 26 40 32 Q36 26 32 32 L30 20 Q24 22 22 28Z" fill="#1a1a2e" />
              <circle cx="35" cy="30" r="0.8" fill="white" />
              <circle cx="45" cy="30" r="0.8" fill="white" />
              <rect x="30" y="52" width="20" height="2" rx="1" fill="white" opacity="0.6" />
              <defs>
                <radialGradient id="ayushiBg">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </radialGradient>
              </defs>
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}