"use client";

import { motion } from "framer-motion";
import { Icon } from "lucide-react";
import { shark } from "@lucide/lab";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "lg";
}

export default function Logo({ size = "sm" }: LogoProps) {
  const isLarge = size === "lg";

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <motion.div
        whileHover={{ rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className={`${
          isLarge ? "w-14 h-14" : "w-9 h-9"
        } rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center`}
      >
        <Icon
          iconNode={shark}
          className={`${isLarge ? "w-8 h-8" : "w-5 h-5"} text-white`}
        />
      </motion.div>
      <div className="flex flex-col">
        <span
          className={`${
            isLarge ? "text-4xl" : "text-base"
          } font-extrabold leading-tight tracking-tight`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            INSTA
          </span>
          <span className="text-foreground">SHARK</span>
        </span>
        {isLarge ? (
          <span className="text-sm text-muted-foreground leading-tight mt-1">
            AI-Powered Platform
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground leading-tight">
            AI Platform
          </span>
        )}
      </div>
    </Link>
  );
}