"use client";

import React from "react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { setToken } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      toast.success(data.message);
      setToken(data.token);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.detail || "OTP verification failed");
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.detail || "Failed to resend OTP");
    },
  });

  const onSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }
    verifyOtp({ email, otp: otpCode });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3"
        >
          <ShieldCheck className="w-7 h-7 text-primary" />
        </motion.div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 sm:gap-3 mb-6"
        >
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 300 }}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={onSubmit} className="w-full group" disabled={isPending}>
            {isPending ? "Verifying..." : (
              <>
                Verify OTP
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 space-y-3"
        >
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={() => {
                if (email) {
                  resendOtp({ email });
                } else {
                  toast.error("Email not found. Please register again.");
                }
              }}
              disabled={isResending}
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back to Login
            </Link>
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}