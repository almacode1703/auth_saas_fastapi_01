"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to Auth SaaS</h1>
          <p className="text-lg text-white/80">
            Secure authentication powered by FastAPI & Next.js
          </p>
        </motion.div>
      </div>
    </div>
  );
}