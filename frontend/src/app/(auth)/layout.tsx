"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/shared/LottieAnimations";
import Logo from "@/components/shared/Logo";

const animationMap: Record<string, string> = {
  "/login": "/animations/Login.json",
  "/register": "/animations/Registration.json",
  "/verify-otp": "/animations/Email.json",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return null;

  const currentAnimation = animationMap[pathname] || animationMap["/login"];

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Animation */}
      <div className="shrink-0 h-32 md:h-auto md:w-[35%] lg:w-[40%] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 lg:p-8 md:order-1 lg:order-2">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-24 h-24 md:w-full md:max-w-xs lg:max-w-md"
        >
          <LottieAnimation src={currentAnimation} />
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto md:w-[65%] lg:w-[60%] md:order-2 lg:order-1">
        <div className="min-h-full flex items-center justify-center py-6 px-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-6 flex justify-center">
              <Logo />
            </div>
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
