"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      themes={["light", "dark", "glass"]}
    >
      {children}
    </NextThemesProvider>
  );
}