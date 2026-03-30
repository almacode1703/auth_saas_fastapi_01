"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Search,
  MessageSquare,
  Image,
  BarChart3,
  Zap,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const services = [
  {
    name: "InstAShark",
    description: "Instagram analytics and insights powered by AI",
    icon: Search,
    gradient: "from-pink-500 via-purple-500 to-blue-500",
    status: "coming soon",
    route: null,
  },
  {
    name: "RAG Chat",
    description:
      "Chat with your documents using retrieval augmented generation",
    icon: MessageSquare,
    gradient: "from-green-500 to-teal-500",
    status: "active",
    route: "/rag-chat",
  },
  {
    name: "AI Image Gen",
    description: "Generate stunning images with text prompts",
    icon: Image,
    gradient: "from-orange-500 to-red-500",
    status: "coming soon",
    route: null,
  },
  {
    name: "Analytics",
    description: "Deep insights and reports from your data",
    icon: BarChart3,
    gradient: "from-blue-500 to-cyan-500",
    status: "coming soon",
    route: null,
  },
  {
    name: "AI Assistant",
    description: "Your personal AI assistant for everyday tasks",
    icon: Bot,
    gradient: "from-violet-500 to-purple-500",
    status: "coming soon",
    route: null,
  },
  {
    name: "Automation",
    description: "Automate workflows with intelligent triggers",
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
    status: "coming soon",
    route: null,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Choose a service to get started
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  if (service.route) {
                    router.push(service.route);
                  }
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    {service.status === "coming soon" ? (
                      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        Soon
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
