"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, ExternalLink } from "lucide-react";
import TeamSection from "@/components/team-section";
import Link from "next/link";
import { IconBadge, SbgIconName } from "@/components/icon-badge";

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="relative isolate min-h-screen bg-[var(--squid-ink-deep)] text-white overflow-hidden">
      {/* Background Ambient Spotlights & Subtle Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#AD5CFF]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[40%] -right-24 w-[500px] h-[500px] bg-[#7928CA]/[0.09] rounded-full blur-[150px]" />
        <div className="absolute bottom-40 -left-28 w-[450px] h-[450px] bg-[#AD5CFF]/[0.06] rounded-full blur-[140px]" />

        {/* Visible Subtle Square Grid-Mesh */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,black_70%,transparent_100%)]" />

        {/* Top Vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-us-background.jpg"
            alt="About Us background"
            fill
            className="object-cover opacity-25"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--squid-ink-deep)]/90 via-[var(--squid-ink-deep)]/75 to-[var(--squid-ink-deep)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 z-10 relative text-center">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Who We Are
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight font-ember"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            About AWS Student Builder <span className="text-[#AD5CFF]">Group</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Empowering the next generation of cloud computing practitioners, builders, and architects at the University of Kelaniya.
          </motion.p>
        </div>
      </motion.section>

      {/* Vision & Mission Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="lg:col-span-7 space-y-8" variants={itemVariants}>
              {/* Vision Card */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-[#AD5CFF] shadow-[0_0_12px_#AD5CFF]" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-ember">
                    Our <span className="text-[#AD5CFF]">Vision</span>
                  </h2>
                </div>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed pl-4 border-l border-white/[0.08]">
                  To become the premier student-driven community advancing Cloud Computing education, hands-on architectural design, and technology leadership in Sri Lanka.
                </p>
              </div>

              {/* Mission Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-[#AD5CFF] shadow-[0_0_12px_#AD5CFF]" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-ember">
                    Our <span className="text-[#AD5CFF]">Mission</span>
                  </h2>
                </div>
                <div className="text-slate-300 text-base sm:text-lg leading-relaxed space-y-4 pl-4 border-l border-white/[0.08]">
                  <p>
                    The AWS Student Builder Group at the University of Kelaniya is dedicated to fostering a collaborative ecosystem of cloud builders. We equip students with in-demand cloud skills through industry-relevant events, hands-on workshops, competitive hackathons, and technical publications.
                  </p>
                  <p className="text-sm sm:text-base text-slate-400">
                    Through practical experience, we bridge the gap between academic theory and production cloud environments. To learn more about official student builder initiatives, visit{" "}
                    <Link
                      href="https://aws.amazon.com/developer/community/students/cloudclubs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AD5CFF] hover:text-[#c488ff] hover:underline font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      aws.amazon.com
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission Image with Glass Frame */}
            <motion.div
              className="lg:col-span-5 relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/mission.jpg"
                alt="Our Mission"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--squid-ink-card)]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-white/[0.08] rounded-2xl pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Section */}
      <motion.section
        className="py-20 relative bg-[var(--squid-ink-deep)]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 font-ember">
              What We <span className="text-[#AD5CFF]">Offer</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Empowering student builders with practical skills, community networking, and certified cloud career pathways.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                iconName: "wrench" as SbgIconName,
                title: "AWS Workshops",
                description: "Hands-on technical sessions to master official AWS cloud services, architecture, and deployment patterns.",
              },
              {
                iconName: "teams" as SbgIconName,
                title: "Networking",
                description: "Connect with certified peers, alumni, AWS community heroes, and industry cloud architects.",
              },
              {
                iconName: "bolt" as SbgIconName,
                title: "Hackathons",
                description: "Compete in builder hackathons to solve real-world industry problems using cutting-edge AWS technologies.",
              },
              {
                iconName: "trophy" as SbgIconName,
                title: "Certifications",
                description: "Guidance, study groups, and architectural reviews to help you earn recognized AWS certifications.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="premium-card h-full p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <IconBadge
                      name={item.iconName}
                      variant="primary"
                      size="xl"
                      className="mb-6"
                    />
                    <h3 className="text-xl font-bold text-white tracking-tight mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <TeamSection />
    </div>
  );
}
