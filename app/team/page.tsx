"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Linkedin, 
  Github, 
  Sparkles, 
  Award,
  Layers,
  ArrowRight
} from "lucide-react";
import { teamMembers, TeamMember } from "@/data/team";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type CategoryFilter = "All" | "Executive Board" | "Leads & Coordinators" | "Committee";

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

  const filteredMembers =
    selectedCategory === "All"
      ? teamMembers
      : teamMembers.filter((m) => m.category === selectedCategory);

  const categories: { label: CategoryFilter; count: number }[] = [
    { label: "All", count: teamMembers.length },
    {
      label: "Executive Board",
      count: teamMembers.filter((m) => m.category === "Executive Board").length,
    },
    {
      label: "Leads & Coordinators",
      count: teamMembers.filter((m) => m.category === "Leads & Coordinators").length,
    },
    {
      label: "Committee",
      count: teamMembers.filter((m) => m.category === "Committee").length,
    },
  ];

  return (
    <div 
      data-header-theme="dark"
      className="relative min-h-screen bg-[var(--squid-ink-deep)] text-white pt-28 sm:pt-32 pb-24 overflow-hidden"
    >
      {/* Background Mesh Grid & Atmospheric Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Breathing ambient spotlights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(173,92,255,0.12)_0%,transparent_70%)] blur-[150px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(121,40,202,0.10)_0%,transparent_70%)] blur-[160px]" />
        <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.06)_0%,transparent_70%)] blur-[140px]" />

        {/* Studio Blueprint circles */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full border border-white/[0.02] pointer-events-none" />

        {/* Visible purple grid mesh */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black_60%,transparent_100%)]" />

        {/* Top and bottom subtle vignettes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--squid-ink-deep)] to-transparent pointer-events-none" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Page Hero Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(173,92,255,0.15)] backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#AD5CFF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0AAFF]">
              Meet the Leadership &amp; Committee &bull; 2026/27
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] mb-5 text-white"
          >
            AWS Student Builder Group <br />
            <span className="font-serif italic font-normal text-[#AD5CFF]">
              Executive Board &amp; Team
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Meet the student cloud builders, architects, and coordinators steering our active community, hands-on workshops, and AWS initiatives at University of Kelaniya.
          </motion.p>

          {/* Filter Tabs matching homepage team styling */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl w-fit mx-auto shadow-lg"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    isSelected
                      ? "bg-[#AD5CFF] text-white shadow-none"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-white/[0.08] text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Responsive Member Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.name}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setActiveMember(member)}
                className="group relative h-[400px] sm:h-[420px] rounded-[28px] overflow-hidden border border-white/[0.08] bg-[radial-gradient(ellipse_at_50%_35%,#151f38_0%,var(--squid-ink-card)_55%,var(--squid-ink-deep)_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-[#AD5CFF]/60 hover:shadow-none transition-all duration-500 cursor-pointer"
              >
                {/* Blueprint Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-25" />

                {/* Ambient Spotlight */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(173,92,255,0.22)_0%,transparent_68%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-500" />

                {/* Portrait Cutout */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    priority={index < 4}
                  />
                  {/* Duotone overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--squid-ink-deep)]/50 via-[var(--squid-ink-card)]/25 to-purple-600/15 mix-blend-soft-light pointer-events-none" />
                  <div className="absolute inset-0 bg-purple-950/15 mix-blend-color pointer-events-none" />
                </div>

                {/* Bottom Scrim */}
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[var(--squid-ink-deep)] via-[var(--squid-ink-deep)]/85 to-transparent pointer-events-none z-10" />

                {/* Card Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-20 flex flex-col justify-end text-left pointer-events-auto">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-purple-500/15 border border-purple-400/30 text-purple-200 backdrop-blur-md shadow-[0_2px_8px_rgba(168,85,247,0.15)]">
                      {member.category}
                    </span>
                    <span className="text-[11px] text-[#AD5CFF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-purple-200 transition-colors duration-200">
                    {member.name}
                  </h3>

                  <p className="text-xs sm:text-[13px] font-medium text-slate-300 mt-1 leading-snug">
                    {member.position}
                  </p>

                  {/* Social Profile Icons */}
                  <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/[0.08]">
                    {(member.links?.linkedin || member.linkedin) && (
                      <a
                        href={member.links?.linkedin || member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${member.name}'s LinkedIn Profile`}
                        className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-[#AD5CFF]/30 border border-white/10 hover:border-[#AD5CFF]/50 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {(member.links?.github || member.github) && (
                      <a
                        href={member.links?.github || member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${member.name}'s GitHub Profile`}
                        className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-[#AD5CFF]/30 border border-white/10 hover:border-[#AD5CFF]/50 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                        title="GitHub Profile"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {member.links?.builderProfile && (
                      <a
                        href={member.links.builderProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${member.name}'s AWS Builder Profile`}
                        className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-[#AD5CFF]/30 border border-white/10 hover:border-[#AD5CFF]/50 text-[#AD5CFF] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                        title="AWS Builder Profile"
                      >
                        <Award className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Member Details Modal */}
      <Dialog open={!!activeMember} onOpenChange={(open) => !open && setActiveMember(null)}>
        {activeMember && (
          <DialogContent className="max-w-2xl bg-[#0c1220]/95 border-white/[0.14] text-white backdrop-blur-2xl rounded-3xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] z-[60] overflow-hidden">
            {/* Ambient Internal Corner Glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-[radial-gradient(circle_at_center,rgba(173,92,255,0.25)_0%,transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 bg-[radial-gradient(circle_at_center,rgba(121,40,202,0.15)_0%,transparent_70%)] blur-3xl" />

            {/* Top specular purple light line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#AD5CFF]/70 to-transparent" />

            {/* Accessible Dialog Title & Description */}
            <DialogHeader className="sr-only">
              <DialogTitle>{activeMember.name} Profile Details</DialogTitle>
              <DialogDescription>{activeMember.position} - {activeMember.category}</DialogDescription>
            </DialogHeader>

            <div className="relative z-10 space-y-6">
              {/* Member Header: Large Portrait + Identity + Links */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                {/* Large Cutout Portrait with Blueprint Backdrop */}
                <div className="relative w-32 h-44 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border border-white/20 shadow-[0_12px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)] bg-[radial-gradient(ellipse_at_50%_35%,#151f38_0%,var(--squid-ink-card)_55%,var(--squid-ink-deep)_100%)] shrink-0">
                  {/* Blueprint Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-25" />
                  {/* Ambient Spotlight */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(173,92,255,0.3)_0%,transparent_70%)] pointer-events-none" />
                  <Image
                    src={activeMember.image}
                    alt={activeMember.name}
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover object-top"
                  />
                  {/* Duotone overlays matching cards */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--squid-ink-deep)]/50 via-[var(--squid-ink-card)]/25 to-purple-600/15 mix-blend-soft-light pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--squid-ink-deep)]/70 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 text-[#E0AAFF] shadow-[0_2px_8px_rgba(173,92,255,0.15)] mb-2">
                    <Layers className="w-3 h-3 text-[#AD5CFF]" />
                    {activeMember.category}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {activeMember.name}
                  </h2>

                  <p className="text-base font-semibold text-[#AD5CFF] mt-1">
                    {activeMember.position}
                  </p>

                  {/* Social links - ONLY rendered if they have a non-empty value */}
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-3.5">
                    {(activeMember.links?.linkedin || activeMember.linkedin) && (
                      <a
                        href={activeMember.links?.linkedin || activeMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#AD5CFF]/20 border border-white/10 hover:border-[#AD5CFF]/50 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 hover:scale-105"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-[#AD5CFF]" />
                        <span>LinkedIn</span>
                      </a>
                    )}

                    {(activeMember.links?.github || activeMember.github) && (
                      <a
                        href={activeMember.links?.github || activeMember.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#AD5CFF]/20 border border-white/10 hover:border-[#AD5CFF]/50 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 hover:scale-105"
                      >
                        <Github className="w-3.5 h-3.5 text-slate-300" />
                        <span>GitHub</span>
                      </a>
                    )}

                    {activeMember.links?.builderProfile && (
                      <a
                        href={activeMember.links.builderProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#AD5CFF]/20 border border-white/10 hover:border-[#AD5CFF]/50 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 hover:scale-105"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Builder Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section - ONLY rendered if bio is present and non-empty (hide entirely if empty, no placeholder) */}
              {activeMember.bio && activeMember.bio.trim().length > 0 && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    About &bull; Background
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    {activeMember.bio}
                  </p>
                </div>
              )}

              {/* Responsibilities Section */}
              {activeMember.responsibilities && activeMember.responsibilities.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                    <div className="h-2 w-2 rounded-full bg-[#AD5CFF] shadow-[0_0_8px_rgba(173,92,255,0.8)]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#E0AAFF]">
                      Key Role Responsibilities
                    </h3>
                  </div>

                  <ul className="grid grid-cols-1 gap-2.5">
                    {activeMember.responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs sm:text-sm text-slate-200 leading-snug"
                      >
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#AD5CFF] shadow-[0_0_6px_rgba(173,92,255,0.8)] shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
