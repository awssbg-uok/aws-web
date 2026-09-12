"use client";

import { motion } from "framer-motion";
import { Download, BookOpen } from "lucide-react";

export default function NewsletterPage() {
  return (
    <div className="relative isolate min-h-screen bg-[var(--squid-ink-deep)] pt-28 pb-20 overflow-hidden text-white">
      {/* Background Ambient Spotlights & Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#AD5CFF]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[45%] -right-24 w-[500px] h-[500px] bg-[#7928CA]/[0.10] rounded-full blur-[150px]" />
        <div className="absolute bottom-10 -left-28 w-[450px] h-[450px] bg-[#AD5CFF]/[0.06] rounded-full blur-[140px]" />

        {/* Visible Subtle Square Grid-Mesh */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,black_70%,transparent_100%)]" />

        {/* Top Vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          {/* Top Pill Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
              <BookOpen className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Official Community Publication
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            AWS Student Builder Group{" "}
            <span className="text-[#AD5CFF]">Newsletter</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Read our inaugural newsletter featuring student cloud builder stories, project spotlights, and upcoming AWS community initiatives.
          </p>
        </motion.div>

        {/* PDF Viewer Wrapped in Premium Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-5xl premium-card p-3 sm:p-5 rounded-2xl border border-white/[0.1] shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 px-2 border-b border-white/[0.08] mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-medium text-slate-300">
                Newsletter Issue 1 &bull; February 2026
              </span>
            </div>
            <a
              href="/Newsletter_Issue1_February2026.pdf"
              download
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#AD5CFF] hover:text-purple-300 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Quick Download
            </a>
          </div>

          <iframe
            src="/Newsletter_Issue1_February2026.pdf"
            className="w-full h-[75vh] min-h-[600px] rounded-xl border border-white/[0.06] bg-[#0c1220]"
            title="AWS Student Builder Group Newsletter"
          />
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <a
            href="/Newsletter_Issue1_February2026.pdf"
            download
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#AD5CFF] to-[#8c32e6] hover:from-[#9d4eed] hover:to-[#7928ca] text-white font-semibold rounded-xl shadow-[0_8px_25px_-4px_rgba(173,92,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-purple-400/30 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            Download PDF Edition
          </a>
        </motion.div>
      </div>
    </div>
  );
}
