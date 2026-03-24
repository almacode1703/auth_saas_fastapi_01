"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { loginSchema, LoginFormData } from "@/schemas/login.schema";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SocialButtons from "@/components/auth/SocialButtons";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success(data.message);
      setToken(data.token);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.detail || "Login failed");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

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
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}