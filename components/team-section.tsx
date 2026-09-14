"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Linkedin, Github, Zap, ArrowRight } from "lucide-react";
import { teamMembers, TeamMember } from "@/data/team";

type CategoryFilter = "All" | "Core Team" | "Leads & Coordinators" | "Committee";

export default function TeamSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredMembers = selectedCategory === "All"
    ? teamMembers
    : teamMembers.filter((m) => m.category === selectedCategory);

  const updateScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    } else {
      setScrollProgress(100);
    }
  };

  useEffect(() => {
    updateScrollState();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", updateScrollState);
      window.addEventListener("resize", updateScrollState);
    }
    return () => {
      if (slider) slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [filteredMembers]);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = 320; // approximate card width + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const categories: { label: CategoryFilter; count: number }[] = [
    { label: "All", count: teamMembers.length },
    { label: "Core Team", count: teamMembers.filter(m => m.category === "Core Team").length },
    { label: "Leads & Coordinators", count: teamMembers.filter(m => m.category === "Leads & Coordinators").length },
    { label: "Committee", count: teamMembers.filter(m => m.category === "Committee").length },
  ];

  return (
    <section
      id="team"
      data-header-theme="dark"
      className="relative py-24 sm:py-32 bg-[var(--squid-ink-deep)] text-white overflow-hidden select-none"
    >
      {/* Background Ambient Glow & Wireframe Ring */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial ambient glow - unified with hero palette */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--ambient-glow-violet)] rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[var(--ambient-glow-sky)] rounded-full blur-[140px]" />

        {/* Ambient Wireframe Circles (Cinematic aesthetic) */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full border border-white/[0.02] pointer-events-none" />

        {/* Visible purple grid mesh */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_75%_60%_at_50%_40%,black_70%,transparent_100%)]" />

        {/* Top and bottom subtle vignettes */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--squid-ink-deep)] to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-950/30 px-3.5 py-1.5 shadow-lg backdrop-blur-md"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-purple-500/20 ring-1 ring-purple-500/30">
              <Zap className="h-2.5 w-2.5 fill-purple-400 text-purple-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-purple-200">
              Core Team &amp; Committee &bull; 2026/27
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] font-ember"
          >
            Steered by passionate <br />
            <span className="font-serif italic font-normal text-[#AD5CFF]">
              student cloud builders
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
          >
            The dedicated team of student architects, organizers, and engineers driving the AWS Student Builder Group at University of Kelaniya.
          </motion.p>
        </div>

        {/* Category Filters & Slider Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Filter Tabs (Unified Squid Ink navy container) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[var(--squid-ink-card)]/90 p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl shadow-lg">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.label);
                    if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
                  }}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600/20 text-purple-200 border border-purple-500/35 shadow-none"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  {cat.label} <span className={isActive ? "text-purple-300/75 text-[10px]" : "opacity-50 text-[10px]"}>({cat.count})</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterUnderline"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#AD5CFF] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Understated Navigation Arrow Buttons (Squid Ink Navy) */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll team left"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "border-white/[0.10] bg-[var(--squid-ink-card)]/90 text-slate-300 hover:text-white hover:bg-purple-950/40 hover:border-purple-400/50 shadow-md active:scale-95"
                  : "border-white/[0.05] bg-white/[0.01] text-slate-600 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll team right"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "border-white/[0.10] bg-[var(--squid-ink-card)]/90 text-slate-300 hover:text-white hover:bg-purple-950/40 hover:border-purple-400/50 shadow-md active:scale-95"
                  : "border-white/[0.05] bg-white/[0.01] text-slate-600 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div
          ref={sliderRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Carousel Progress Track (Understated Purple Palette) */}
        <div className="mt-4 max-w-xs mx-auto flex items-center gap-3">
          <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
        </div>

        {/* Meet the Full Team CTA Button */}
        <div className="mt-10 text-center">
          <Link
            href="/team"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold text-sm shadow-none border border-transparent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Meet the Full Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.035 }}
      className="group relative flex-none w-[265px] sm:w-[285px] h-[390px] sm:h-[415px] rounded-[28px] overflow-hidden border border-white/[0.08] bg-[radial-gradient(ellipse_at_50%_35%,#151f38_0%,var(--squid-ink-card)_55%,var(--squid-ink-deep)_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-[#AD5CFF]/60 hover:shadow-none transition-all duration-500"
    >
      {/* Subtle Studio Blueprint Grid (Unified with hero tech aesthetic) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-25" />

      {/* Ambient Purple Spotlight behind cutout */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(168,85,247,0.22)_0%,transparent_68%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-500" />

      {/* Edge-to-Edge Member Portrait Cutout Image with Zoom on Hover */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          unoptimized
          sizes="320px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
          priority={index < 8}
        />
        {/* Duotone/Color Overlay (Squid Ink navy-to-purple gradient blend unified with site palette) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--squid-ink-deep)]/50 via-[var(--squid-ink-card)]/25 to-purple-600/15 mix-blend-soft-light pointer-events-none" />
        <div className="absolute inset-0 bg-purple-950/15 mix-blend-color pointer-events-none" />
      </div>

      {/* Dark gradient scrim (transparent to Squid Ink near-black) overlaid on the bottom third of the image */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[var(--squid-ink-deep)] via-[var(--squid-ink-deep)]/85 to-transparent pointer-events-none z-10" />

      {/* Card Content rendered directly inside that scrim on top of the photo */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-20 flex flex-col justify-end text-left pointer-events-auto">
        {/* Role Badge with purple accent token */}
        <div className="mb-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-purple-500/15 border border-purple-400/30 text-purple-200 backdrop-blur-md shadow-[0_2px_8px_rgba(168,85,247,0.15)]">
            {member.category}
          </span>
        </div>

        {/* Member Name */}
        <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-purple-200 transition-colors duration-200">
          {member.name}
        </h3>

        {/* Member Position */}
        <p className="text-xs sm:text-[13px] font-medium text-slate-300 mt-1 leading-snug">
          {member.position}
        </p>

        {/* Social Profile Icon Buttons (LinkedIn & GitHub) */}
        <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/[0.08]">
          <a
            href={member.linkedin || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name}'s LinkedIn Profile`}
            className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-purple-600/40 border border-white/10 hover:border-purple-400/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>

          <a
            href={member.github || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name}'s GitHub Profile`}
            className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-purple-600/40 border border-white/10 hover:border-purple-400/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
            title="GitHub Profile"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
