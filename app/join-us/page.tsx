"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import JoinUsForm from "@/components/join-us-form";
import { Briefcase, GraduationCap, Users, Award, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function JoinUs() {
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/registration-status`);
        if (res.ok) {
          const data = await res.json();
          setRegistrationOpen(Boolean(data.registrationOpen));
        } else {
          setRegistrationOpen(true);
        }
      } catch {
        setRegistrationOpen(true);
      }
    };

    checkRegistrationStatus();
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--squid-ink-deep)] pt-24 pb-20 overflow-hidden">
      {/* Background Mesh Grid & Atmospheric Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft Radial ambient spotlights with gentle breathing animation */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/3 w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,transparent_70%)] blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-[150px]" 
        />
        <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.06)_0%,transparent_70%)] blur-[130px]" />

        {/* Visible purple grid mesh */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black_60%,transparent_100%)]" />

        {/* Top and bottom subtle vignettes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 text-[#E0AAFF] text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(173,92,255,0.15)] backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#AD5CFF]" />
            Join the Community
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-ember">
            Join AWS Student Builder Group <span className="text-[#AD5CFF]">UOK</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal">
            Take your first step towards becoming a cloud computing practitioner and industry ready architect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Reference-Inspired 3D Glass Hero Card + Why Join Us Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Reference-Inspired 3D Glass Banner Card with gentle hover float */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="premium-card p-7 sm:p-8"
            >
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-ember">
                  Students by day.
                </h2>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#AD5CFF] leading-tight mb-4 font-ember">
                  Cloud builders by night.
                </h2>
                <p className="text-sm sm:text-base text-gray-300/90 leading-relaxed font-normal mb-8">
                  Fostering an active ecosystem of student cloud builders at the University of Kelaniya — turning fundamental concepts into hands on cloud deployments and production grade architectures.
                </p>

                {/* Stat Counters with 3D Dividers */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-ember">500+</div>
                    <div className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                      Community Builders
                    </div>
                  </div>
                  <div className="space-y-1 border-l border-white/[0.08] pl-4">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-ember">20+</div>
                    <div className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                      Hands on Sessions
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Why Join Us 4-Box Grid with 3D Glassmorphic Cards */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>Why Join Us?</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: GraduationCap,
                    title: "Learning",
                    description: "Structured AWS curriculum, certification vouchers, and architectural guidance.",
                  },
                  {
                    icon: Users,
                    title: "Community",
                    description: "Network with cloud architects, fellow student developers, and AWS mentors.",
                  },
                  {
                    icon: Briefcase,
                    title: "Career",
                    description: "Exclusive industry events, project showcases, and tech hiring opportunities.",
                  },
                  {
                    icon: Award,
                    title: "Recognition",
                    description: "Global community badges, credentials, and hackathon awards.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                    whileHover={{ y: -5, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="premium-card p-5 h-full flex flex-col justify-between cursor-default">
                      <div>
                        {/* 3D Glass Icon Tile with subtle rotate on card hover */}
                        <div className="rounded-xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 p-2.5 w-11 h-11 flex items-center justify-center mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(173,92,255,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <item.icon className="w-5 h-5 text-[#AD5CFF]" />
                        </div>
                        <h4 className="font-semibold text-white text-base mb-1.5">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Glass Registration Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl border border-white/[0.12] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent bg-[#0c1220]/95 backdrop-blur-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden">
              {/* Internal Volumetric Lighting Spotlights */}
              <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(173,92,255,0.2)_0%,transparent_70%)] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(173,92,255,0.15)_0%,transparent_70%)] blur-3xl" />

              {/* 3D Top Specular Light Beam with soft pulse */}
              <motion.div 
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#AD5CFF]/70 to-transparent" 
              />

              <div className="p-6 sm:p-9 relative z-10">
                {/* Card Header */}
                <div className="mb-8 border-b border-white/[0.08] pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-white text-2xl font-bold tracking-tight font-ember">
                      Membership Registration
                    </h3>
                    {registrationOpen === null ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Checking Status...</span>
                      </div>
                    ) : registrationOpen ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Open Now
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold shadow-[0_2px_8px_rgba(244,63,94,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Registration Closed
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {registrationOpen === false
                      ? "Membership registrations are currently paused for the current intake."
                      : "Complete your registration in minutes to unlock community benefits and event RSVPs."}
                  </p>
                </div>

                {/* The Registration Form OR Closed Message */}
                {registrationOpen === false ? (
                  <div className="py-10 px-4 sm:px-6 text-center space-y-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="text-xl font-bold text-white font-ember">
                        Applications Are Currently Closed
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Thank you for your interest in the AWS Student Builder Group at the University of Kelaniya. Member registration is currently paused.
                      </p>
                      <p className="text-xs text-gray-400">
                        Stay connected via our community channels and RSVP to upcoming workshops on Meetup.
                      </p>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href="https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors"
                      >
                        WhatsApp Community
                      </a>
                      <a
                        href="https://www.meetup.com/aws-sbg-at-university-of-kelaniya/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E0393E] hover:bg-[#c93338] text-white transition-colors"
                      >
                        Meetup Group
                      </a>
                      <Link
                        href="/contact-us"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                ) : (
                  <JoinUsForm />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
