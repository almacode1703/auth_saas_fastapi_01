"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.replace("/login");
    } else {
      if (!token) {
        useAuthStore.setState({ token: storedToken });
      }
      setIsChecking(false);
    }
  }, [token, router]);
  if (isChecking) return null;

  return <>{children}</>;
}
