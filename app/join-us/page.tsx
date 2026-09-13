"use client";

import { motion } from "framer-motion";
import JoinUsForm from "@/components/join-us-form";
import { Briefcase, GraduationCap, Users, Award, Sparkles, ArrowRight } from "lucide-react";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.49 1.33 5.01L2 22l5.13-1.35A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.27a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 1 1 6.99 3.86zm4.51-6.17c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8 1-.15.17-.3.19-.55.06-1.5-.75-2.48-1.33-3.47-3.03-.26-.45.26-.42.75-1.4.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.75 2.68 4.25 3.76 1.62.7 2.26.7 3.06.58.49-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.07-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

function MeetupIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.001 2C6.478 2 2 6.478 2 12.001c0 5.522 4.478 10 10.001 10 5.522 0 10-4.478 10-10C22.001 6.478 17.523 2 12.001 2zm5.064 13.882h-1.92v-4.32c0-.797-.643-1.44-1.44-1.44s-1.44.643-1.44 1.44v4.32h-1.92v-4.32c0-.797-.643-1.44-1.44-1.44s-1.44.643-1.44 1.44v4.32h-1.92V8.118h1.92v1.056c.48-.672 1.248-1.056 2.112-1.056 1.152 0 2.112.576 2.688 1.536.576-.96 1.536-1.536 2.688-1.536 1.728 0 3.072 1.344 3.072 3.072v4.692z" />
    </svg>
  );
}

export default function JoinUs() {
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
            Take your first step towards becoming a cloud computing practitioner and industry-ready architect.
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
                  Fostering an active ecosystem of student cloud builders at the University of Kelaniya — turning fundamental concepts into hands-on cloud deployments and production-grade architectures.
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
                      Hands-on Sessions
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
                {/* Card Header & Fast Steps */}
                <div className="mb-8 border-b border-white/[0.08] pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-white text-2xl font-bold tracking-tight">
                      Membership Registration 2026
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Open Now
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Complete your registration in minutes to unlock community benefits and event RSVPs.
                  </p>

                  {/* Flat Dark Secondary Step Action Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                    <motion.a
                      href="https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="group flex items-center justify-between p-3 rounded-xl border border-white/[0.12] bg-[#0c1220] hover:bg-[#111827] hover:border-[#AD5CFF]/60 shadow-none transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.12] flex items-center justify-center text-[#AD5CFF] shrink-0 group-hover:border-[#AD5CFF]/60 transition-colors">
                          <WhatsAppIcon className="w-4 h-4 text-[#AD5CFF]" />
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-bold text-[#AD5CFF] uppercase tracking-wider">Step 1</div>
                          <div className="text-xs font-semibold text-white transition-colors">Join WhatsApp Group</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#AD5CFF] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                    </motion.a>

                    <motion.a
                      href="https://www.meetup.com/aws-cloud-club-at-university-of-kelaniya/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="group flex items-center justify-between p-3 rounded-xl border border-white/[0.12] bg-[#0c1220] hover:bg-[#111827] hover:border-[#AD5CFF]/60 shadow-none transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.12] flex items-center justify-center text-[#AD5CFF] shrink-0 group-hover:border-[#AD5CFF]/60 transition-colors">
                          <MeetupIcon className="w-4 h-4 text-[#AD5CFF]" />
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-bold text-[#AD5CFF] uppercase tracking-wider">Step 2</div>
                          <div className="text-xs font-semibold text-white transition-colors">Join Official Meetup</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#AD5CFF] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                    </motion.a>
                  </div>
                </div>

                {/* The Registration Form */}
                <JoinUsForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
