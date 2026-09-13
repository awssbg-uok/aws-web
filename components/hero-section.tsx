"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { IconBadge, SbgIcon } from "@/components/icon-badge";

export const ACCENT_PURPLE = "#AD5CFF";

/**
 * Large authentic 8-bit pixel-art builder mascot illustration
 * matching the AWS Builder Center reference design.
 */
function BuilderMascotFocal({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer 8-bit Frame */}
      <rect x="3" y="2" width="18" height="2" fill="#AD5CFF" />
      <rect x="2" y="3" width="20" height="2" fill="#AD5CFF" />
      <rect x="2" y="5" width="2" height="14" fill="#AD5CFF" />
      <rect x="20" y="5" width="2" height="14" fill="#AD5CFF" />
      <rect x="2" y="19" width="20" height="2" fill="#AD5CFF" />
      <rect x="3" y="20" width="18" height="2" fill="#AD5CFF" />
      <rect x="4" y="4" width="16" height="16" fill="#080d1a" />

      {/* 8-bit White Pixel Eyes */}
      <rect x="6" y="6" width="2" height="2" fill="#FFFFFF" />
      <rect x="9" y="6" width="2" height="2" fill="#FFFFFF" />

      {/* Right Pixel Wink Accent */}
      <rect x="15" y="8" width="3" height="2" fill="#AD5CFF" />
      <rect x="17" y="10" width="2" height="2" fill="#AD5CFF" />

      {/* Builder Chevron '>' */}
      <rect x="6" y="10" width="2" height="2" fill="#AD5CFF" />
      <rect x="8" y="12" width="2" height="2" fill="#FFFFFF" />
      <rect x="6" y="14" width="2" height="2" fill="#AD5CFF" />

      {/* Cursor '_' */}
      <rect x="11" y="14" width="4" height="2" fill="#AD5CFF" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative isolate min-h-[calc(100vh-66px)] overflow-hidden bg-[var(--squid-ink-deep)] px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-28 flex flex-col justify-center"
    >
      {/* Background Grid Mesh - Zero Neon Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_85%_70%_at_50%_35%,black_70%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Top Two-Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT PANEL: Builder Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#0c1220] border border-white/[0.12] p-6 sm:p-8 flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 select-none pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#AD5CFF] text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
                    BUILDER SPOTLIGHT
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    #AWS-SBG-01 &bull; UoK Campus
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#00E582] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00E582]" />
                  <span>Live Sandbox Open</span>
                </div>
              </div>

              {/* Main Content: 2-Column Split (Copy + Large Mascot Illustration) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-6">
                <div className="sm:col-span-7 space-y-4 text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    Weekend Challenge: Deploy your first app on AWS
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    Join our weekly serverless sprint. Build real solutions on AWS free sandbox environments with campus mentors. Enter to earn Builder XP and AWS credits.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 select-none">
                    <Button
                      asChild
                      className="bg-white hover:bg-slate-100 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-none border-0"
                    >
                      <Link href="/join-us">Get started</Link>
                    </Button>
                    <span className="text-xs font-mono text-slate-400 tracking-wide font-medium">
                      Win $100 AWS credits
                    </span>
                  </div>
                </div>

                {/* Right: Dedicated Mascot Focal Container */}
                <div className="sm:col-span-5 flex justify-center sm:justify-end">
                  <div className="w-full max-w-[200px] aspect-square rounded-2xl bg-[#080d18] border border-white/[0.08] p-4 flex items-center justify-center select-none">
                    <BuilderMascotFocal className="w-32 h-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Service Chips inside Left Panel */}
            <div className="pt-4 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#131b2e]/80 border border-white/[0.10]">
                  <IconBadge name="bolt" variant="primary" size="sm" />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-white leading-tight truncate">Serverless</div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate">AWS Lambda</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#131b2e]/80 border border-white/[0.10]">
                  <IconBadge name="bolt" variant="primary" size="sm" />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-white leading-tight truncate">Bedrock</div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate">Generative AI</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#131b2e]/80 border border-white/[0.10]">
                  <IconBadge name="drop" variant="secondary" size="sm" />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-white leading-tight truncate">DynamoDB</div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate">NoSQL Store</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#131b2e]/80 border border-white/[0.10]">
                  <IconBadge name="drop" variant="secondary" size="sm" />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-white leading-tight truncate">Amazon S3</div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate">Object Store</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL: Main Brand & Value Proposition Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-[#0c1220] border border-white/[0.12] p-6 sm:p-8 flex flex-col justify-between shadow-xl text-left"
          >
            <div>
              {/* Top Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.10] text-xs font-mono text-slate-300 w-fit select-none mb-6">
                <span className="w-2 h-2 rounded-full bg-[#00E582]" />
                <span>AWS Student Builder Group &bull; University of Kelaniya</span>
              </div>

              {/* Headline with Solid Color-Block Highlight */}
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-white tracking-tight leading-[1.18] mb-5">
                Where student builders turn ideas into{" "}
                <span className="bg-[#AD5CFF] text-white px-3 py-1 rounded-xl inline-block mt-1 sm:mt-0 font-black">
                  cloud reality
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal mb-8">
                Learn AWS by building real systems. Explore generative AI with Amazon Bedrock, architect serverless cloud infrastructure, and launch production-grade projects with the student developer community at the University of Kelaniya.
              </p>
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.06]">
              <Button
                asChild
                className="bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold text-sm px-6 py-3 h-auto rounded-xl transition-all shadow-none border border-transparent"
              >
                <Link href="/join-us" className="inline-flex items-center gap-2">
                  <span>Join the builder community</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-[#111827] hover:bg-[#1a2333] border border-white/[0.14] text-white font-semibold text-sm px-5 py-3 h-auto rounded-xl transition-all shadow-none"
              >
                <Link href="/events" className="inline-flex items-center gap-2.5">
                  <IconBadge name="clock" variant="secondary" size="xs" />
                  <span>Explore builder events</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR: Builder Pathways & Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-[#0c1220]/90 border border-white/[0.12] p-4 sm:p-5 mt-6 sm:mt-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl"
        >
          {/* Left: Builder Pathways */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-3 select-none mr-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                BUILDER PATHWAYS
              </span>
              <Link
                href="/resources"
                className="text-xs font-mono text-[#AD5CFF] hover:underline font-semibold"
              >
                View all 4 tracks &rarr;
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 select-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2e]/80 border border-white/[0.10] text-xs font-medium text-slate-200">
                <IconBadge name="wrench" variant="primary" size="xs" />
                <span>Learning</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2e]/80 border border-white/[0.10] text-xs font-medium text-slate-200">
                <IconBadge name="teams" variant="secondary" size="xs" />
                <span>Community</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2e]/80 border border-white/[0.10] text-xs font-medium text-slate-200">
                <IconBadge name="ladder" variant="secondary" size="xs" />
                <span>Career</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2e]/80 border border-white/[0.10] text-xs font-medium text-slate-200">
                <IconBadge name="trophy" variant="secondary" size="xs" />
                <span>Awards</span>
              </div>
            </div>
          </div>

          {/* Right: Stats Counter */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 justify-start lg:justify-end w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.08] select-none">
            <div className="flex items-center gap-2.5">
              <IconBadge name="teams" variant="secondary" size="sm" />
              <div className="text-left">
                <div className="text-sm font-bold text-white leading-tight">500+</div>
                <div className="text-[11px] text-slate-400 leading-tight">Student builders</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <IconBadge name="wrench" variant="secondary" size="sm" />
              <div className="text-left">
                <div className="text-sm font-bold text-white leading-tight">15+</div>
                <div className="text-[11px] text-slate-400 leading-tight">Cloud projects</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <IconBadge name="trophy" variant="secondary" size="sm" />
              <div className="text-left">
                <div className="text-sm font-bold text-white leading-tight">50+</div>
                <div className="text-[11px] text-slate-400 leading-tight">AWS certified</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
