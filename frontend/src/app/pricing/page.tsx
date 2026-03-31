"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, X, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic features",
    icon: Zap,
    gradient: "from-gray-500 to-gray-600",
    popular: false,
    features: [
      { name: "5 RAG queries per day", included: true },
      { name: "2 image generations per day", included: true },
      { name: "1 PDF upload (max 5MB)", included: true },
      { name: "Basic chat history", included: true },
      { name: "Email support", included: false },
      { name: "API access", included: false },
      { name: "Priority processing", included: false },
      { name: "Custom AI models", included: false },
    ],
  },
  {
    name: "Basic",
    price: "$2.99",
    period: "per month",
    description: "For individuals who need more power",
    icon: Crown,
    gradient: "from-purple-500 to-blue-500",
    popular: true,
    features: [
      { name: "100 RAG queries per day", included: true },
      { name: "50 image generations per day", included: true },
      { name: "10 PDF uploads (max 20MB)", included: true },
      { name: "Full chat history", included: true },
      { name: "Email support", included: true },
      { name: "API access", included: true },
      { name: "Priority processing", included: false },
      { name: "Custom AI models", included: false },
    ],
  },
  {
    name: "Advanced",
    price: "$9.99",
    period: "per month",
    description: "For power users and teams",
    icon: Rocket,
    gradient: "from-pink-500 via-purple-500 to-blue-500",
    popular: false,
    features: [
      { name: "Unlimited RAG queries", included: true },
      { name: "Unlimited image generations", included: true },
      { name: "Unlimited PDF uploads (max 50MB)", included: true },
      { name: "Full chat history", included: true },
      { name: "Priority email support", included: true },
      { name: "Full API access", included: true },
      { name: "Priority processing", included: true },
      { name: "Custom AI models", included: true },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full text-sm text-muted-foreground mb-6">
            <Zap className="w-3.5 h-3.5" />
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              plan
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you need more. Pay with credit card or Solana.
          </p>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 scale-105"
                  : "border-border"
              } bg-background p-6`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan icon */}
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}
              >
                <plan.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Plan info */}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-6 gap-2 group ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => router.push("/register")}
              >
                {plan.price === "$0" ? "Start Free" : "Subscribe"}
              </Button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Payment methods */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Accepted payment methods</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
              <span>💳</span> Credit Card
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
              <span>🟣</span> Solana Pay
            </div>
          </div>
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