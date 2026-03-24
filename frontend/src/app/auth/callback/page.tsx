"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      toast.success("Logged in successfully");
      router.replace("/dashboard");
    } else {
      toast.error("Login failed");
      router.replace("/login");
    }
  }, [searchParams, setToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Logging you in...</p>
    </div>
  );
}