"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back! Choose a service to get started.
        </p>

        {/* Service cards will go here later */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6 text-center text-muted-foreground">
            Services coming soon...
          </div>
        </div>
      </motion.div>
    </div>
  );
}