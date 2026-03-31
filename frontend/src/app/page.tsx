"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield,
  Zap,
  Bot,
  MessageSquare,
  ArrowRight,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";

const features = [
  {
    icon: Shield,
    title: "Secure Auth",
    description: "Email/password, OTP verification, Google & GitHub SSO",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: MessageSquare,
    title: "RAG Chat",
    description: "Upload PDFs and chat with your documents using AI",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Bot,
    title: "AI Services",
    description: "Multiple AI-powered tools under one platform",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Fast & Modern",
    description: "Built with Next.js, FastAPI, and cutting-edge tech",
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/pricing")}>
              Pricing
            </Button>
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full text-sm text-muted-foreground mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your AI Services,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              One Platform
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            InstAShark brings together powerful AI tools — from document chat to
            analytics — all behind a secure, modern authentication system.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                window.open(
                  "https://github.com/almacode1703/auth_saas_fastapi_01",
                  "_blank",
                )
              }
              className="gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">What's Inside</h2>
          <p className="text-muted-foreground">
            Everything you need to build and scale AI-powered applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">Built With</h2>
          <p className="text-muted-foreground">
            Modern tech stack for modern applications
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            "Next.js",
            "FastAPI",
            "PostgreSQL",
            "Docker",
            "LangChain",
            "ChromaDB",
            "OpenAI",
            "Tailwind CSS",
            "TypeScript",
            "Zustand",
            "React Query",
            "Zod",
          ].map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-2 bg-muted rounded-full text-sm font-medium"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-10 md:p-16 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join InstAShark and unlock the power of AI for your workflow.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/register")}
            className="bg-white text-purple-700 hover:bg-white/90 gap-2 group"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Built with passion by almacode1703
          </p>
        </div>
      </footer>
    </div>
  );
}
