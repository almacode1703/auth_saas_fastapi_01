"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { API_URL } from "@/lib/constants";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  ImageIcon,
  Home,
  Volume2,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getMe,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full overflow-hidden bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {user?.avatar ? (
                  <img
                    src={`${API_URL}${user.avatar}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : user?.name ? (
                  getInitials(user.name)
                ) : (
                  "?"
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-background shadow-lg"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold">{user?.name || "User"}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-4 border-b border-border space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Username</span>
                        <span>{user?.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="capitalize">
                          {user?.provider || "email"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span
                          className={
                            user?.is_active ? "text-green-500" : "text-red-500"
                          }
                        >
                          {user?.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span>
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Home
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/dashboard");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/rag-chat");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        RAG Chat
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/image-gen");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Image Gen
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/voice-agent");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        Voice Agent
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/settings");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted text-red-500 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
