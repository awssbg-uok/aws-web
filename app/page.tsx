"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroSection from "@/components/hero-section";
import TeamSection from "@/components/team-section";
import { IconBadge, SbgIconName } from "@/components/icon-badge";

export default function Home() {
  return (
    <div data-header-theme="dark" className="bg-[var(--squid-ink-deep)] text-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section (Why Join) */}
      <section className="relative py-24 sm:py-32 bg-[var(--squid-ink-deep)] overflow-hidden border-t border-white/[0.06]">
        {/* Soft Ambient Spotlight */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#AD5CFF]/[0.06] rounded-full blur-[160px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
                <Sparkles className="h-2.5 w-2.5" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
                Community Benefits
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Why Join AWS Student Builder Group?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Accelerate your cloud career through hands-on architectures, mentorship from industry experts, and a thriving community of student developers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                iconName: "drop" as SbgIconName,
                title: "Learn AWS Services",
                description:
                  "Get hands-on experience building scalable applications with Serverless, Bedrock, DynamoDB, and ECS.",
                delay: 0.1,
              },
              {
                iconName: "teams" as SbgIconName,
                title: "Network with Experts",
                description:
                  "Connect with AWS Community Heroes, Solutions Architects, and passionate student builders across Sri Lanka.",
                delay: 0.2,
              },
              {
                iconName: "trophy" as SbgIconName,
                title: "Earn Certifications",
                description:
                  "Access structured study groups, practice labs, and exam voucher guidance for AWS Cloud Practitioner and Solutions Architect certifications.",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="premium-card h-full text-center p-8 flex flex-col justify-between">
                  <CardHeader className="p-0 mb-6">
                    <IconBadge
                      name={feature.iconName}
                      variant="primary"
                      size="2xl"
                      className="mx-auto mb-5"
                    />
                    <CardTitle className="text-xl font-bold text-white tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section ("Who We Are") */}
      <section id="about" className="relative py-24 sm:py-32 bg-[var(--squid-ink-deep)] overflow-hidden border-t border-white/[0.06]">
        {/* Soft Ambient Spotlight */}
        <div className="pointer-events-none absolute top-1/3 -right-28 w-[600px] h-[600px] bg-[#7928CA]/[0.10] rounded-full blur-[160px]" />
        <div className="pointer-events-none absolute bottom-10 -left-28 w-[500px] h-[500px] bg-[#AD5CFF]/[0.06] rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text & Key Highlights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="space-y-7"
            >
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
                <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
                  <Sparkles className="h-2.5 w-2.5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
                  Leadership &bull; University of Kelaniya
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Who We <span className="text-[#AD5CFF]">Are</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                AWS Student Builder Group Captains and coordinators are passionate student leaders dedicated to sharing cloud computing knowledge with the developer community on campus. Join us to unlock opportunities in:
              </p>

              <ul className="space-y-4 pt-2">
                {[
                  {
                    iconName: "clock" as SbgIconName,
                    text: "Organizing and leading AWS-focused technical events",
                  },
                  {
                    iconName: "teams" as SbgIconName,
                    text: "Growing your network with AWS experts and industry leaders",
                  },
                  {
                    iconName: "wrench" as SbgIconName,
                    text: "Gaining hands-on experience building on AWS infrastructure",
                  },
                  {
                    iconName: "trophy" as SbgIconName,
                    text: "Receiving official AWS credits, exam discounts, and swag",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="flex items-center space-x-3.5"
                  >
                    <IconBadge
                      name={item.iconName}
                      variant="primary"
                      size="lg"
                      className="shrink-0"
                    />
                    <span className="text-slate-200 font-medium text-sm sm:text-base">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Premium Framed Team Photo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative h-[440px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] group"
            >
              <Image
                src="/team-photo.jpg"
                alt="AWS Student Builder Group Team"
                fill
                style={{ objectFit: "cover" }}
                className="transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--squid-ink-deep)] via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute inset-0 bg-purple-950/15 mix-blend-color pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Carousel Section */}
      <TeamSection />

      {/* CTA Section */}
      <section
        data-header-theme="dark"
        className="relative py-24 sm:py-32 overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#1e1038_0%,var(--squid-ink-card)_60%,var(--squid-ink-deep)_100%)] border-t border-white/[0.10]"
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
              Ready to Start Your Cloud Journey?
            </h2>
            <p className="text-base sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the AWS Student Builder Group at University of Kelaniya today and take your first step towards building production cloud architectures.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold px-8 h-12 border border-transparent transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/join-us">
                Join the builder community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
