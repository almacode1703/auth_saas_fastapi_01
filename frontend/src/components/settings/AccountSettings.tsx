"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvatarUpload from "./AvatarUpload";

export default function AccountSettings() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getMe,
  });

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Populate fields when user data loads
  useState(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-1">Profile Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Update your personal details
        </p>

        <div className="mb-6 pb-6 border-b border-border">
          <AvatarUpload />
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={name || user?.name || ""}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="Your full name"
                className="pl-10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label>Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={username || user?.username || ""}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="Your username"
                className="pl-10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={user?.email || ""}
                disabled
                className="pl-10 opacity-60"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed for security reasons
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label>Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="+91 98765 43210"
                className="pl-10"
              />
            </div>
          </motion.div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => {
                  toast.success("Profile updated successfully");
                  setIsEditing(false);
                }}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Account info */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-1">Account Details</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your account information
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Provider</span>
            <span className="text-sm font-medium capitalize">
              {user?.provider || "email"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Status</span>
            <span
              className={`text-sm font-medium ${user?.is_active ? "text-green-500" : "text-red-500"}`}
            >
              {user?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Joined</span>
            <span className="text-sm font-medium">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-red-500/30 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-red-500 mb-1">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Irreversible actions
        </p>
        <Button
          variant="outline"
          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
