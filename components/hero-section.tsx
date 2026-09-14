"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { IconBadge, SbgIcon } from "@/components/icon-badge";
import { QRCodeSVG } from "qrcode.react";

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
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_80%_48%_at_50%_28%,black_30%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[var(--squid-ink-deep)] via-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Top Two-Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT PANEL: Builder Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#0c1220] border border-white/[0.12] p-6 sm:p-8 flex flex-col shadow-xl"
          >
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 select-none pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#AD5CFF] text-white text-[11px] font-ember-mono font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
                  BUILDER SPOTLIGHT
                </span>
                <span className="text-xs font-ember-mono text-slate-400 font-medium">
                  #AWS-SBG-01 &bull; UoK Campus
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-ember-mono text-[#00E582] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00E582]" />
                <span>Official Meetup Group</span>
              </div>
            </div>

            {/* Main Content: 2-Column Split (Copy + Scannable Meetup QR Code) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-6 sm:py-8">
              <div className="sm:col-span-7 space-y-4 text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug font-ember">
                  Join our Meetup community
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  RSVP to upcoming cloud workshops, architecture hackathons, and technical sessions via our official Meetup group. Connect with student builders across campus.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 select-none">
                  <Button
                    asChild
                    className="bg-white hover:bg-slate-100 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-none border-0"
                  >
                    <a
                      href="https://www.meetup.com/aws-sbg-at-university-of-kelaniya/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join on Meetup
                    </a>
                  </Button>
                  <span className="text-xs font-ember-mono text-slate-400 tracking-wide font-medium">
                    Scan or click to RSVP
                  </span>
                </div>
              </div>

              {/* Right: Dedicated Scannable QR Code Container */}
              <div className="sm:col-span-5 flex justify-center sm:justify-end">
                <div className="w-full max-w-[170px] aspect-square rounded-2xl bg-white p-3.5 flex flex-col items-center justify-center select-none shadow-xl border border-white/20">
                  <QRCodeSVG
                    value="https://www.meetup.com/aws-sbg-at-university-of-kelaniya/"
                    size={142}
                    level="H"
                    className="w-full h-full"
                  />
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.10] text-xs font-ember-mono text-slate-300 w-fit select-none mb-6">
                <span className="w-2 h-2 rounded-full bg-[#00E582]" />
                <span>AWS Student Builder Group &bull; University of Kelaniya</span>
              </div>

              {/* Headline with Solid Color-Block Highlight */}
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-white tracking-tight leading-[1.18] mb-5 font-ember">
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
      </div>
    </section>
  );
}
