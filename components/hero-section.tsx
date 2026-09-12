"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Cloud,
  Cpu,
  Database,
  FolderGit2,
  Layers3,
  Sparkles,
  Users,
} from "lucide-react";

export const ACCENT_PURPLE = "#AD5CFF";

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#AD5CFF]/30 bg-[#AD5CFF]/15 text-[#AD5CFF] shadow-[0_0_15px_rgba(173,92,255,0.2)]">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-[14px] font-bold leading-none text-white sm:text-[15px]">{value}</div>
        <div className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-400 sm:text-[11px]">{label}</div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative isolate min-h-[calc(100vh-66px)] overflow-hidden bg-[var(--squid-ink-deep)] px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-28 flex flex-col justify-center"
    >
      {/* Background Grid Mesh & Purple Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Soft Ambient Spotlights */}
        <div className="absolute left-1/2 top-[18%] h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-[#AD5CFF]/[0.08] blur-[160px]" />
        <div className="absolute -right-24 top-[22%] h-[500px] w-[500px] rounded-full bg-[#7928CA]/[0.12] blur-[150px]" />
        <div className="absolute -left-28 bottom-10 h-[420px] w-[420px] rounded-full bg-[#AD5CFF]/[0.06] blur-[140px]" />

        {/* Visible Square Grid-Mesh Pattern (Purple-tinted, crisp, clearly defined) */}
        <div className="absolute inset-0 opacity-[0.60] purple-grid-mesh [mask-image:radial-gradient(ellipse_85%_70%_at_50%_35%,black_70%,transparent_100%)]" />

        {/* Section Edge Vignettes for seamless header and next-section transitions */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 xl:gap-14">
        {/* Left Column: Copy, Headline & Actions */}
        <div className="relative z-10 max-w-2xl text-left">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-[#0c1220]/80 px-4 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AD5CFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AD5CFF] shadow-[0_0_8px_#AD5CFF]" />
            </span>
            <span className="text-xs font-medium text-slate-200 tracking-wide">
              AWS Student Builder Group &bull; University of Kelaniya
            </span>
          </motion.div>

          {/* Headline — "Where student builders turn ideas into cloud reality." */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.4rem] xl:text-[3.9rem]"
          >
            Where student builders
            <span className="mt-2.5 block text-slate-300">
              turn ideas into{" "}
              <span className="inline-flex items-center px-3.5 py-0.5 sm:px-4 sm:py-1 rounded-xl sm:rounded-2xl bg-[#280c47] border border-[#AD5CFF]/60 text-[#E0AAFF] shadow-[0_0_25px_rgba(173,92,255,0.4),inset_0_1px_2px_rgba(255,255,255,0.25)] font-black align-baseline mx-1">
                cloud reality
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-[16px]"
          >
            Learn AWS by building real systems. Explore generative AI with Amazon Bedrock,
            architect serverless cloud infrastructure, and launch production-grade projects with
            the student developer community at the University of Kelaniya.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            {/* Primary Solid Purple Pill Button */}
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full bg-[#AD5CFF] hover:bg-[#9d4eed] px-7 font-bold text-white shadow-[0_8px_25px_rgba(173,92,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/join-us">
                Join the builder community
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* Secondary Dark Outline Pill Button */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border border-white/15 bg-white/[0.03] px-6 font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              <Link href="/events">
                <Calendar className="mr-2 h-4 w-4 text-[#AD5CFF]" />
                Explore builder events
              </Link>
            </Button>
          </motion.div>

          {/* Stats Row with Purple Accents */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-9 flex flex-wrap gap-x-8 gap-y-3.5 border-t border-white/[0.08] pt-6"
          >
            <Metric icon={<Users className="h-4 w-4" />} value="500+" label="Student builders" />
            <Metric icon={<FolderGit2 className="h-4 w-4" />} value="15+" label="Cloud projects" />
            <Metric icon={<Layers3 className="h-4 w-4" />} value="50+" label="AWS certifications" />
          </motion.div>
        </div>

        {/* Right Column: Fully Coded 3D Isometric Graphic Platform */}
        <div className="relative flex w-full items-center justify-center pt-4 lg:pt-0">
          <IsometricCloudDiagram />
        </div>
      </div>
    </section>
  );
}

function IsometricCloudDiagram() {
  return (
    <div className="relative flex w-full max-w-[520px] items-center justify-center select-none">
      {/* Soft Ambient Radial Purple Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(173,92,255,0.32)_0%,rgba(121,40,202,0.16)_48%,transparent_75%)] blur-[75px]" />

      {/* Main Animated Graphic Stage */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotateZ: [-0.6, 0.6, -0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full aspect-[520/410]"
      >
        {/* Layer 1: Isometric SVG Geometry & Connector Lines */}
        <svg
          viewBox="0 0 520 410"
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ambient Base Shadow Gradient */}
            <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#AD5CFF" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#7928CA" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Platform Base Gradients */}
            <linearGradient id="platformTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a0f4f" />
              <stop offset="50%" stopColor="#1a0836" />
              <stop offset="100%" stopColor="#100324" />
            </linearGradient>
            <linearGradient id="platformLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15062b" />
              <stop offset="100%" stopColor="#0a0215" />
            </linearGradient>
            <linearGradient id="platformRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#250949" />
              <stop offset="100%" stopColor="#110426" />
            </linearGradient>

            {/* Central Isometric Cube Gradients (3 distinct faces for authentic 3D shading) */}
            {/* Top Face: Key light from above/left */}
            <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="40%" stopColor="#C084FC" />
              <stop offset="85%" stopColor="#AD5CFF" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
            {/* Left Face: Deep shadow side */}
            <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="50%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#18042b" />
            </linearGradient>
            {/* Right Face: Mid-tone bounce side */}
            <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b2ce0" />
              <stop offset="55%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#34085c" />
            </linearGradient>

            {/* Glowing Neon Filters */}
            <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="blur2" />
              <feComposite in="SourceGraphic" in2="blur2" operator="over" />
            </filter>
          </defs>

          {/* Ground Footprint & Ambient Drop Shadow */}
          <ellipse cx="260" cy="308" rx="145" ry="54" fill="url(#baseShadow)" />

          {/* CONNECTOR LINES (Subtle curved dashed glowing paths linking central platform to the 4 service chips) */}
          <g opacity="0.9">
            {/* Connector 1: Top-Left (Serverless / Lambda) — subtle organic bezier curve */}
            <path
              d="M 198 140 C 160 140, 142 98, 118 98"
              stroke="#AD5CFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.8"
            />
            <circle cx="198" cy="140" r="3.5" fill="#AD5CFF" filter="url(#purpleGlow)" />
            <circle cx="118" cy="98" r="2.5" fill="#AD5CFF" />

            {/* Connector 2: Bottom-Left (DynamoDB / NoSQL) — subtle organic bezier curve */}
            <path
              d="M 148 245 C 132 256, 126 274, 118 290"
              stroke="#AD5CFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.8"
            />
            <circle cx="148" cy="245" r="3.5" fill="#34D399" filter="url(#purpleGlow)" />
            <circle cx="118" cy="290" r="2.5" fill="#34D399" />

            {/* Connector 3: Top-Right (Amazon S3 / Storage) — subtle organic bezier curve */}
            <path
              d="M 322 140 C 360 140, 378 98, 402 98"
              stroke="#AD5CFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.8"
            />
            <circle cx="322" cy="140" r="3.5" fill="#38BDF8" filter="url(#purpleGlow)" />
            <circle cx="402" cy="98" r="2.5" fill="#38BDF8" />

            {/* Connector 4: Bottom-Right (Amazon Bedrock / Gen AI) — subtle organic bezier curve */}
            <path
              d="M 372 245 C 388 256, 394 274, 402 290"
              stroke="#AD5CFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.8"
            />
            <circle cx="372" cy="245" r="3.5" fill="#AD5CFF" filter="url(#purpleGlow)" />
            <circle cx="402" cy="290" r="2.5" fill="#AD5CFF" />
          </g>

          {/* LOWER PEDESTAL PLATFORM (Tier 1 Base) */}
          <g>
            {/* Left face of base pedestal */}
            <polygon
              points="148,245 260,302 260,322 148,265"
              fill="url(#platformLeft)"
              stroke="#AD5CFF"
              strokeWidth="1.2"
              strokeOpacity="0.3"
            />
            {/* Right face of base pedestal */}
            <polygon
              points="260,302 372,245 372,265 260,322"
              fill="url(#platformRight)"
              stroke="#AD5CFF"
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />
            {/* Top face of base pedestal */}
            <polygon
              points="260,188 372,245 260,302 148,245"
              fill="url(#platformTop)"
              stroke="#AD5CFF"
              strokeWidth="1.4"
              strokeOpacity="0.5"
            />

            {/* Circuit grid traces on pedestal top */}
            <line x1="204" y1="216" x2="260" y2="245" stroke="#AD5CFF" strokeWidth="1" strokeOpacity="0.35" />
            <line x1="316" y1="216" x2="260" y2="245" stroke="#AD5CFF" strokeWidth="1" strokeOpacity="0.35" />
            <line x1="260" y1="245" x2="260" y2="302" stroke="#AD5CFF" strokeWidth="1.2" strokeOpacity="0.3" />
          </g>

          {/* FLOATING ORBITAL HOLOGRAPHIC RING */}
          <ellipse
            cx="260"
            cy="172"
            rx="96"
            ry="48"
            fill="none"
            stroke="#AD5CFF"
            strokeWidth="1.2"
            strokeDasharray="7 5"
            strokeOpacity="0.5"
          />

          {/* CENTRAL 3D ISOMETRIC CUBE (Tier 2 The Cloud Platform Core) */}
          <g filter="url(#purpleGlow)">
            {/* Left face (Shadow side) */}
            <polygon
              points="198,140 260,175 260,240 198,205"
              fill="url(#cubeLeft)"
              stroke="#AD5CFF"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
            {/* Left face detail: horizontal server vents */}
            <line x1="208" y1="160" x2="248" y2="183" stroke="#AD5CFF" strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1="208" y1="174" x2="248" y2="197" stroke="#AD5CFF" strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1="208" y1="188" x2="248" y2="211" stroke="#AD5CFF" strokeWidth="1.2" strokeOpacity="0.45" />

            {/* Right face (Mid-tone bounce side) */}
            <polygon
              points="260,175 322,140 322,205 260,240"
              fill="url(#cubeRight)"
              stroke="#AD5CFF"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />
            {/* Right face detail: data rack slits */}
            <line x1="272" y1="183" x2="312" y2="160" stroke="#F3E8FF" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="272" y1="197" x2="312" y2="174" stroke="#F3E8FF" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="272" y1="211" x2="312" y2="188" stroke="#F3E8FF" strokeWidth="1.2" strokeOpacity="0.4" />

            {/* Front vertical specular ridge */}
            <line x1="260" y1="175" x2="260" y2="240" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.8" />

            {/* Top face (Illuminated top with ambient light) */}
            <polygon
              points="260,105 322,140 260,175 198,140"
              fill="url(#cubeTop)"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeOpacity="0.85"
            />

            {/* Concentric isometric diamond on top face */}
            <polygon
              points="260,117 302,140 260,163 218,140"
              fill="#260c44"
              stroke="#F3E8FF"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />

            {/* Center Core Light Node on top face */}
            <circle cx="260" cy="140" r="5" fill="#FFFFFF" filter="url(#strongGlow)" />
            <circle cx="260" cy="140" r="2.8" fill="#E0AAFF" />
          </g>

          {/* Sub-node 1: Small floating data crystal on left */}
          <g transform="translate(-4, 0)">
            <polygon points="172,216 183,222 183,234 172,228" fill="#3b0764" stroke="#AD5CFF" strokeWidth="0.8" />
            <polygon points="183,222 194,216 194,228 183,234" fill="#581c87" stroke="#AD5CFF" strokeWidth="0.8" />
            <polygon points="183,210 194,216 183,222 172,216" fill="#AD5CFF" stroke="#F3E8FF" strokeWidth="0.8" />
          </g>

          {/* Sub-node 2: Small floating data crystal on right */}
          <g transform="translate(14, 0)">
            <polygon points="326,216 337,222 337,234 326,228" fill="#3b0764" stroke="#AD5CFF" strokeWidth="0.8" />
            <polygon points="337,222 348,216 348,228 337,234" fill="#581c87" stroke="#AD5CFF" strokeWidth="0.8" />
            <polygon points="337,210 348,216 337,222 326,216" fill="#AD5CFF" stroke="#F3E8FF" strokeWidth="0.8" />
          </g>
        </svg>

        {/* Layer 2: The 4 Compact Service Badges (Directly anchored to connector lines) */}
        {/* Chip 1: Top-Left (Serverless Compute) */}
        <div className="absolute top-[24%] left-0 -translate-y-1/2 flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0c1220]/92 px-2.5 py-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.6),0_0_12px_rgba(173,92,255,0.15)] backdrop-blur-md">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#AD5CFF]/20 border border-[#AD5CFF]/40 text-[#AD5CFF]">
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold text-white">Serverless</div>
            <div className="mt-0.5 text-[8px] font-medium text-slate-400">AWS Lambda</div>
          </div>
        </div>

        {/* Chip 2: Bottom-Left (DynamoDB Data Layer) */}
        <div className="absolute top-[71%] left-0 -translate-y-1/2 flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0c1220]/92 px-2.5 py-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.6),0_0_12px_rgba(52,211,153,0.15)] backdrop-blur-md">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Database className="h-3.5 w-3.5" />
          </div>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold text-white">DynamoDB</div>
            <div className="mt-0.5 text-[8px] font-medium text-slate-400">NoSQL Engine</div>
          </div>
        </div>

        {/* Chip 3: Top-Right (Cloud Storage) */}
        <div className="absolute top-[24%] right-0 -translate-y-1/2 flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0c1220]/92 px-2.5 py-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.6),0_0_12px_rgba(56,189,248,0.15)] backdrop-blur-md">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400">
            <Cloud className="h-3.5 w-3.5" />
          </div>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold text-white">Amazon S3</div>
            <div className="mt-0.5 text-[8px] font-medium text-slate-400">Object Store</div>
          </div>
        </div>

        {/* Chip 4: Bottom-Right (Generative AI) */}
        <div className="absolute top-[71%] right-0 -translate-y-1/2 flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0c1220]/92 px-2.5 py-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.6),0_0_12px_rgba(173,92,255,0.15)] backdrop-blur-md">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#AD5CFF]/20 border border-[#AD5CFF]/40 text-[#AD5CFF]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold text-white">Bedrock</div>
            <div className="mt-0.5 text-[8px] font-medium text-slate-400">Generative AI</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
