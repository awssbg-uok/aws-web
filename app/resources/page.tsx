"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resources } from "@/data/resources";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

export default function Resources() {
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

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Top Pill Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Curated AWS Knowledge Hub
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Learning{" "}
            <span className="text-[#AD5CFF]">
              Resources
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Access our curated collection of AWS documentation, hands-on tutorials, official whitepapers, and cloud architecture tools.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Learning Materials Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-7 w-1.5 rounded-full bg-[#AD5CFF] shadow-[0_0_12px_#AD5CFF]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Learning Materials
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.learning.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="premium-card h-full flex flex-col justify-between">
                    <CardHeader className="p-6">
                      <div className="rounded-xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 p-3 w-12 h-12 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(173,92,255,0.25)] text-[#AD5CFF]">
                        <resource.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg font-bold text-white tracking-tight">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
                      <CardDescription className="text-sm text-slate-400 mb-6 leading-relaxed">
                        {resource.description}
                      </CardDescription>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-full border border-white/15 bg-white/[0.03] text-slate-200 hover:text-white hover:bg-white/[0.08] hover:border-[#AD5CFF]/50 transition-all font-semibold"
                      >
                        <Link href={resource.link} target="_blank">
                          Access Resource
                          <ExternalLink className="ml-2 h-3.5 w-3.5 text-[#AD5CFF]" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tools and Utilities Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-7 w-1.5 rounded-full bg-[#AD5CFF] shadow-[0_0_12px_#AD5CFF]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Tools &amp; Utilities
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="premium-card h-full flex flex-col justify-between">
                    <CardHeader className="p-6">
                      <div className="rounded-xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 p-3 w-12 h-12 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(173,92,255,0.25)] text-[#AD5CFF]">
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg font-bold text-white tracking-tight">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
                      <CardDescription className="text-sm text-slate-400 mb-6 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                      <Button
                        disabled
                        variant="outline"
                        className="w-full rounded-full border border-white/10 bg-white/[0.02] text-slate-500 cursor-not-allowed text-xs font-semibold"
                      >
                        Coming soon
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Additional Resources CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-[radial-gradient(ellipse_at_50%_0%,#1e1038_0%,var(--squid-ink-card)_60%,var(--squid-ink-deep)_100%)] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center mt-12"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#AD5CFF]/20 rounded-full blur-[100px]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Need More Resources?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-7 leading-relaxed">
                Join our AWS Student Builder Group to get access to cloud credits, certification vouchers, guided workshops, and project mentorship.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold px-8 h-12 shadow-[0_8px_25px_rgba(173,92,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/join-us">
                  Become a Member
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

