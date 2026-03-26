"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/shared/LottieAnimations";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Animation - Top on mobile, Left on tablet, Right on desktop */}
      <div className="w-full md:w-[35%] lg:w-[40%] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-6 md:p-4 lg:p-12 md:order-1 lg:order-2">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-32 h-32 md:w-full md:max-w-xs lg:max-w-md"
        >
          <LottieAnimation src={currentAnimation} />
        </motion.div>
      </div>

      {/* Form - Bottom on mobile, Right on tablet, Left on desktop */}
      <div className="w-full md:w-[65%] lg:w-[60%] flex items-center justify-center p-6 md:p-4 lg:p-8 md:order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}