"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Check,
  Copy,
  Database,
  FolderGit2,
  Layers3,
  Server,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * HeroSection — refreshed visual direction
 *
 * Design goals:
 * - Less floating-card clutter than the previous centered composition.
 * - Stronger editorial hierarchy: message first, architecture second.
 * - AWS orange is used as an accent instead of flooding the whole hero.
 * - The right side behaves like a small cloud-workspace / architecture canvas.
 * - Keeps the existing public exports so this can replace the current file safely.
 */

export const HERO_THEME: "orange" | "purple" = "orange";

const ORANGE = "#FF9900";

function ServiceIcon({ type }: { type: "bedrock" | "lambda" | "db" | "s3" }) {
  if (type === "lambda") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[#FF9900]">
        <path
          d="M7.5 4h3l4.5 12.5L17.5 4H20l-4.2 11.5c-.8 2.2-2.1 3.5-4.3 3.5H9v-2.2h2.2c1.1 0 1.8-.6 2.3-1.8L7.5 4Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "bedrock") {
    return <Sparkles className="h-5 w-5 text-violet-300" />;
  }

  if (type === "s3") {
    return <Server className="h-5 w-5 text-emerald-300" />;
  }

  return <Database className="h-5 w-5 text-sky-300" />;
}

function ArchitectureNode({
  type,
  name,
  detail,
  className = "",
  left,
  top,
  right,
  bottom,
}: {
  type: "bedrock" | "lambda" | "db" | "s3";
  name: string;
  detail: string;
  className?: string;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      style={{ left, top, right, bottom }}
      className={`group absolute z-20 w-[140px] sm:w-[150px] rounded-2xl border border-white/[0.10] bg-[#0c1220]/90 p-2.5 sm:p-3 shadow-[0_18px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
          <ServiceIcon type={type} />
        </div>
        <div className="min-w-0 text-left">
          <div className="truncate text-[10.5px] sm:text-[11px] font-bold tracking-tight text-white">{name}</div>
          <div className="mt-0.5 truncate text-[8.5px] sm:text-[9px] font-medium text-slate-500">{detail}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function FloatingSBGTerminal() {
  const [copied, setCopied] = useState(false);
  const command = "aws sbg deploy --cohort generative-ai";

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Command copied", {
        position: "bottom-right",
        style: {
          background: "#0B101E",
          color: "#FFEACC",
          border: "1px solid rgba(255,153,0,0.3)",
        },
      });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy command");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="w-full overflow-hidden rounded-2xl border border-white/[0.10] bg-[#090e19]/95 text-left shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className="ml-1 flex items-center gap-1.5 font-mono text-[9px] font-medium text-slate-500">
            <Terminal className="h-3 w-3 text-[#FF9900]" />
            builder-shell · ap-southeast-1
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy deployment command"
          className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="space-y-2.5 px-4 py-3.5 font-mono text-[10px] leading-relaxed sm:text-[11px]">
        <div>
          <span className="font-bold text-[#FF9900]">$</span>{" "}
          <span className="text-slate-200">aws sbg deploy --cohort generative-ai</span>
        </div>
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400">CREATE_COMPLETE</span>
            <span className="text-slate-500">Bedrock::Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400">CREATE_COMPLETE</span>
            <span className="text-slate-500">Lambda::Function</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.07] pt-2 text-[9px]">
          <span className="text-slate-600">SBG CloudFormation</span>
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Compact architecture canvas used by the redesigned hero.
 * It intentionally avoids a heavy SVG illustration so the UI stays crisp
 * across desktop, tablet and mobile widths.
 */
export function IsometricCloudArchitecture() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="relative mx-auto aspect-[1.12/1] w-full max-w-[560px]"
    >
      <div className="absolute inset-[6%] rounded-[36px] border border-white/[0.07] bg-[#0a101c]/70 shadow-[0_35px_100px_rgba(0,0,0,0.55)] backdrop-blur-sm" />
      <div className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF9900]/[0.08] blur-[70px]" />

      {/* Architecture workspace frame */}
      <div className="absolute inset-[10%] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(19,29,46,0.85),rgba(6,10,18,0.95))] shadow-2xl">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="absolute left-5 top-3.5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          live architecture
        </div>

        {/* Connection paths */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 420" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="hero-flow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF9900" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#FF9900" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FF9900" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M250 120V155M250 155L110 205M250 155L390 205M110 235V325M390 235V325" stroke="url(#hero-flow)" strokeWidth="1.8" strokeDasharray="5 6" />
          <circle cx="250" cy="155" r="4" fill="#FF9900" opacity="0.9" />
          <circle cx="110" cy="205" r="3.5" fill="#FF9900" opacity="0.8" />
          <circle cx="390" cy="205" r="3.5" fill="#FF9900" opacity="0.8" />
          <circle cx="110" cy="325" r="3.5" fill="#10B981" opacity="0.8" />
          <circle cx="390" cy="325" r="3.5" fill="#FF9900" opacity="0.8" />
        </svg>

        {/* Core Bedrock: Centered at Top with generous clearance */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute left-1/2 top-[10%] z-30 -translate-x-1/2"
        >
          <div className="relative flex h-[78px] w-[124px] items-center justify-center rounded-2xl border border-[#FF9900]/35 bg-[#111827]/95 shadow-[0_0_35px_rgba(255,153,0,0.18)]">
            <div className="absolute -inset-px rounded-2xl bg-[#FF9900]/[0.05]" />
            <div className="relative text-center">
              <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF9900]/10 ring-1 ring-[#FF9900]/25">
                <Sparkles className="h-4 w-4 text-[#FF9900]" />
              </div>
              <div className="text-[10.5px] font-bold text-white">Amazon Bedrock</div>
              <div className="mt-0.5 text-[8px] font-medium text-slate-400">GenAI core</div>
            </div>
          </div>
          <span className="absolute -right-2.5 -top-1.5 rounded-full border border-emerald-400/20 bg-[#07120e] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-emerald-400">ready</span>
        </motion.div>

        {/* Middle Tier: Lambda (left) & DynamoDB (right) */}
        <ArchitectureNode type="lambda" name="AWS Lambda" detail="serverless compute" left="5%" top="42%" />
        <ArchitectureNode type="db" name="DynamoDB" detail="NoSQL data layer" right="5%" top="42%" />

        {/* Bottom Tier: S3 (left) & API Gateway (right) */}
        <ArchitectureNode type="s3" name="Amazon S3" detail="object storage" left="5%" bottom="10%" />
        <ArchitectureNode type="lambda" name="API Gateway" detail="edge routing" right="5%" bottom="10%" />

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.07] bg-black/20 px-3 py-0.5 text-[7px] font-medium uppercase tracking-[0.18em] text-slate-500">
          build → deploy → scale
        </div>
      </div>

      {/* Small status chips outside the canvas */}
      <div className="absolute right-0 top-[12%] hidden rounded-xl border border-white/[0.08] bg-[#0b111d]/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:block">
        <div className="text-[8px] uppercase tracking-[0.14em] text-slate-500">region</div>
        <div className="mt-0.5 font-mono text-[10px] font-semibold text-slate-300">ap-southeast-1</div>
      </div>
      <div className="absolute bottom-[12%] left-0 hidden rounded-xl border border-[#FF9900]/15 bg-[#0b111d]/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:block">
        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-[#FF9900]">
          <Zap className="h-3 w-3" />
          cloud native
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#FF9900]/15 bg-[#FF9900]/[0.07] text-[#FF9900]">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-[12px] font-bold leading-none text-white sm:text-[13px]">{value}</div>
        <div className="mt-1 whitespace-nowrap text-[9px] font-medium text-slate-500 sm:text-[10px]">{label}</div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100vh-66px)] overflow-hidden bg-[#060a12] px-4 pb-10 pt-24 text-white sm:px-6 sm:pt-28 lg:px-8 lg:pt-24 flex flex-col justify-center">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[18%] h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[#FF9900]/[0.055] blur-[150px]" />
        <div className="absolute -right-40 top-[20%] h-[520px] w-[520px] rounded-full bg-violet-500/[0.035] blur-[150px]" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-500/[0.025] blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.23] [background-image:linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060a12] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060a12] to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-8 xl:gap-14">
        {/* Copy */}
        <div className="relative z-10 max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF9900]/10 ring-1 ring-[#FF9900]/20">
              <Zap className="h-3 w-3 fill-[#FF9900] text-[#FF9900]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-300 sm:text-[11px]">
              AWS Student Builder Group
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-[10px] font-medium text-[#FF9900]">UOK</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="max-w-[720px] text-3xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.2rem]"
          >
            Where student builders
            <span className="mt-1.5 block text-slate-400/80">turn ideas into</span>
            <span className="mt-1.5 block">
              <span className="relative inline-block text-[#FF9900]">
                cloud reality.
                <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-[#FF9900] to-transparent opacity-60" />
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-4 sm:mt-5 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-[15px]"
          >
            Learn AWS by building real things. Explore generative AI with Amazon Bedrock,
            architect serverless systems, and ship production-ready cloud projects with a
            community of student builders at the University of Kelaniya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-6 sm:mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group h-11 sm:h-12 rounded-xl border border-[#FFB444]/30 bg-[#FF9900] px-6 font-bold text-[#080c14] shadow-[0_10px_35px_rgba(255,153,0,0.22)] transition-all hover:bg-[#ffab2e] hover:shadow-[0_14px_45px_rgba(255,153,0,0.32)]"
            >
              <Link href="/join-us">
                Join the builder community
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 sm:h-12 rounded-xl border-white/[0.10] bg-white/[0.025] px-5 font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
            >
              <Link href="/events">
                <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                Explore builder events
              </Link>
            </Button>
          </motion.div>

          {/* Proof / metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-7 sm:mt-8 flex flex-wrap gap-x-6 sm:gap-x-7 gap-y-3 border-t border-white/[0.07] pt-5 sm:pt-6"
          >
            <Metric icon={<Users className="h-3.5 w-3.5" />} value="500+" label="Student builders" />
            <Metric icon={<FolderGit2 className="h-3.5 w-3.5" />} value="15+" label="Cloud projects" />
            <Metric icon={<Layers3 className="h-3.5 w-3.5" />} value="50+" label="AWS certifications" />
          </motion.div>
        </div>

        {/* Architecture / terminal stage */}
        <div className="relative z-10 mx-auto w-full max-w-[650px] lg:justify-self-end">
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#FF9900]/[0.035] blur-[80px]" />
            <IsometricCloudArchitecture />
          </div>

          <div className="relative mx-auto mt-3 sm:mt-4 w-[92%] max-w-[500px]">
            <FloatingSBGTerminal />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.45 }}
            className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-[#0a101b]/80 px-3.5 py-2 text-[9px] font-medium text-slate-500 backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            Build it here. Deploy it anywhere.
          </motion.div>
        </div>
      </div>
    </section>
  );
}
