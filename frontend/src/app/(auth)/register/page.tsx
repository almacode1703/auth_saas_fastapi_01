"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

import { registerSchema, RegisterFormData } from "@/schemas/register.schema";
import { authService } from "@/services/auth.service";
import SocialButtons from "@/components/auth/SocialButtons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formFields = [
  { name: "username", label: "Username", icon: User, placeholder: "johndoe", type: "text" },
  { name: "name", label: "Full Name", icon: UserPlus, placeholder: "John Doe", type: "text" },
  { name: "email", label: "Email", icon: Mail, placeholder: "john@example.com", type: "email" },
  { name: "password", label: "Password", icon: Lock, placeholder: "••••••••", type: "password" },
];

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data, variables) => {
      toast.success(data.message);
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: any) => {
      toast.error(error.detail || "Registration failed");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3"
        >
          <UserPlus className="w-7 h-7 text-primary" />
        </motion.div>
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Sign up to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor={field.name}>{field.label}</Label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="pl-10"
                  {...register(field.name as keyof RegisterFormData)}
                />
              </div>
              {errors[field.name as keyof RegisterFormData] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors[field.name as keyof RegisterFormData]?.message}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button type="submit" className="w-full group" disabled={isPending}>
              {isPending ? "Creating account..." : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <SocialButtons />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}