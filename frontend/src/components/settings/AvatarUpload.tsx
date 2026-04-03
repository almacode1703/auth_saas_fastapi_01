"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, Trash2, Loader2 } from "lucide-react";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";

export default function AvatarUpload() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getMe,
  });

  const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
    mutationFn: authService.uploadAvatar,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error.detail || "Upload failed");
    },
  });

  const { mutate: removeAvatar, isPending: isRemoving } = useMutation({
    mutationFn: authService.removeAvatar,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error.detail || "Remove failed");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    uploadAvatar(file);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = user?.avatar ? `${API_URL}${user.avatar}` : null;

  return (
    <div className="flex items-center gap-6">
      {/* Avatar preview */}
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-20 h-20 rounded-full overflow-hidden border-2 border-border"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              {user?.name ? getInitials(user.name) : "?"}
            </div>
          )}
        </motion.div>

        {/* Camera overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Info and actions */}
      <div className="space-y-2">
        <div>
          <p className="font-medium">{user?.name || "User"}</p>
          <p className="text-sm text-muted-foreground">
            {avatarUrl ? "Click avatar to change" : "Upload a profile picture"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs gap-1"
          >
            <Camera className="w-3 h-3" />
            {avatarUrl ? "Change" : "Upload"}
          </Button>
          {avatarUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeAvatar()}
              disabled={isRemoving}
              className="text-xs gap-1 text-red-500 hover:text-red-500"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
