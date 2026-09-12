"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LoginForm from "@/components/login-form";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
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

          {/* Branding Header */}
          <div className="text-center mb-8">
            <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#AD5CFF]/30 bg-[#AD5CFF]/10 px-3.5 py-1 text-[11px] font-semibold text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-[#AD5CFF]" />
              Official Builder Community Portal
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AWS Student Builder Group{" "}
              <span className="text-[#AD5CFF]">Login</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Welcome back! Please enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Bottom Join Us Redirect */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/join-us"
                className="font-semibold text-[#AD5CFF] hover:text-[#c084fc] transition-colors underline-offset-4 hover:underline"
              >
                Join Community
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
