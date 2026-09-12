"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const handleButtonClick = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 20000);
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        toast.error(data?.message || "Failed to send reset link");
        setIsSubmitting(false);
        return;
      }
      toast.success(data?.message || "Password reset link sent to your email");
      handleButtonClick();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-header-theme="dark"
      className="relative isolate min-h-screen bg-[var(--squid-ink-deep)] text-white pt-28 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Spotlights & Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#AD5CFF]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[45%] -right-24 w-[480px] h-[480px] bg-[#7928CA]/[0.10] rounded-full blur-[150px]" />
        <div className="absolute bottom-10 -left-28 w-[450px] h-[450px] bg-[#AD5CFF]/[0.06] rounded-full blur-[140px]" />

        {/* Visible Square Grid-Mesh Pattern */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,black_70%,transparent_100%)]" />

        {/* Top Vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-white/[0.1] bg-[#0c1220]/85 backdrop-blur-2xl p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_20px_rgba(173,92,255,0.06)] overflow-hidden"
        >
          {/* Top-right subtle ambient purple radial glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-[#AD5CFF]/15 rounded-full blur-2xl" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#AD5CFF]/30 bg-[#AD5CFF]/10 px-3.5 py-1 text-[11px] font-semibold text-purple-200">
              <KeyRound className="w-3.5 h-3.5 text-[#AD5CFF]" />
              Account Security
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Reset <span className="text-[#AD5CFF]">Password</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your registered email address to receive a secure reset link.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus-visible:ring-2 focus-visible:ring-[#AD5CFF]/50 focus-visible:border-[#AD5CFF]/60 focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_16px_rgba(173,92,255,0.25)] transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(173,92,255,0.4)] hover:shadow-[0_4px_28px_rgba(173,92,255,0.65)] border border-white/20 transition-all duration-300 active:scale-[0.99] disabled:opacity-60"
                  disabled={isSubmitting || isButtonDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Back to Login Link */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#AD5CFF] hover:text-[#c084fc] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
