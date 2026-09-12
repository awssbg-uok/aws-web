"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        form.setError("password", { type: "manual", message: data.message });
        setIsSubmitting(false);
        return;
      }

      const { user, token } = data;

      // Save user info and token to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success("Login Successful", {
        duration: 2000,
        position: "top-center",
      });

      form.reset();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        duration: 2000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 w-full mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm font-medium text-slate-200">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g. builder@kln.ac.lk"
                  className="h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus-visible:ring-2 focus-visible:ring-[#AD5CFF]/50 focus-visible:border-[#AD5CFF]/60 focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_16px_rgba(173,92,255,0.25)] transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm font-medium text-slate-200">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 pr-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus-visible:ring-2 focus-visible:ring-[#AD5CFF]/50 focus-visible:border-[#AD5CFF]/60 focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_16px_rgba(173,92,255,0.25)] transition-all duration-200"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#AD5CFF] hover:text-[#c084fc] transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormMessage className="text-rose-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-11 bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(173,92,255,0.4)] hover:shadow-[0_4px_28px_rgba(173,92,255,0.65)] border border-white/20 transition-all duration-300 active:scale-[0.99] disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
