"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, Shield, Bell } from "lucide-react";
import AccountSettings from "@/components/settings/AccountSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account and preferences
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar tabs */}
          <div className="md:w-56 shrink-0">
            <nav className="flex md:flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "account" && <AccountSettings />}
              {activeTab === "appearance" && <AppearanceSettings />}
              {activeTab === "security" && (
                <div className="border border-border rounded-xl p-8 text-center">
                  <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-1">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Coming soon — Two-factor authentication, sessions, and more</p>
                </div>
              )}
              {activeTab === "notifications" && (
                <div className="border border-border rounded-xl p-8 text-center">
                  <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-1">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Coming soon — Email alerts, push notifications, and more</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}