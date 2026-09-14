"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirm) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      toast.success(data.message);
      router.push("/login");
      setIsSubmitting(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
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
              <ShieldCheck className="w-3.5 h-3.5 text-[#AD5CFF]" />
              Account Verification
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-ember">
              Set New <span className="text-[#AD5CFF]">Password</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter and confirm your new account password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-slate-200">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="h-11 pr-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-slate-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-xs sm:text-sm font-medium text-slate-200">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  minLength={8}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Reenter your new password"
                  className="h-11 pr-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-slate-500 focus-visible:border-[#AD5CFF] shadow-none transition-colors duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold rounded-xl shadow-none border border-transparent transition-colors duration-200 active:scale-[0.99] disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>

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
};

export default ResetPasswordPage;
