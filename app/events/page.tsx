"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Youtube } from "lucide-react";
import { events } from "@/data/events";

export default function Events() {
  return (
    <div className="relative isolate min-h-screen bg-[var(--squid-ink-deep)] pt-28 pb-20 overflow-hidden text-white">
      {/* Background Ambient Spotlights & Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[460px] bg-[#AD5CFF]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[40%] -right-28 w-[520px] h-[520px] bg-[#7928CA]/[0.10] rounded-full blur-[150px]" />
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
              Builder Meetups &amp; Technical Sessions
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Upcoming{" "}
            <span className="text-[#AD5CFF]">
              Events
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join us for hands-on workshops, architecture deep dives, hackathons, and networking sessions. Join our{" "}
            <Link
              href="https://www.meetup.com/aws-cloud-club-at-university-of-kelaniya/"
              className="text-[#AD5CFF] hover:text-[#c084fc] font-semibold underline underline-offset-4 decoration-[#AD5CFF]/50 transition-colors"
              target="_blank"
            >
              Meetup community
            </Link>{" "}
            for instant RSVP notifications.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="premium-card h-full flex flex-col justify-between overflow-hidden group">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Image Overlay Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--squid-ink-card)] via-transparent to-black/30 pointer-events-none" />

                  {/* Category Pill Badge with Purple Accent */}
                  <div className="absolute top-4 right-4 bg-[#AD5CFF] text-white font-bold text-xs px-3 py-1 rounded-full shadow-[0_4px_15px_rgba(173,92,255,0.45)] border border-white/20 backdrop-blur-md">
                    {event.category}
                  </div>
                </div>

                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-xl font-bold text-white tracking-tight leading-snug group-hover:text-purple-200 transition-colors">
                    {event.title}
                  </CardTitle>
                  <div className="space-y-2 mt-4 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center text-xs sm:text-sm text-slate-300">
                      <Calendar className="w-4 h-4 mr-2.5 text-[#AD5CFF] shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-slate-300">
                      <Clock className="w-4 h-4 mr-2.5 text-[#AD5CFF] shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-slate-300">
                      <MapPin className="w-4 h-4 mr-2.5 text-[#AD5CFF] shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
                  <CardDescription className="text-sm text-slate-400 mb-6 leading-relaxed">
                    {event.description}
                  </CardDescription>
                  <Button
                    asChild
                    className="w-full rounded-full border border-[#AD5CFF]/40 bg-[#AD5CFF]/15 text-[#E0AAFF] hover:bg-[#AD5CFF] hover:text-white transition-all shadow-[0_4px_16px_rgba(173,92,255,0.2)] font-semibold h-11"
                  >
                    <Link href={event.registrationLink}>
                      {event.registrationLinkText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Past Events YouTube Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center max-w-2xl mx-auto rounded-2xl border border-white/[0.08] bg-[var(--squid-ink-card)]/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Youtube className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Missed a Previous Session?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-5 leading-relaxed">
            Recordings, technical slide decks, and code walk-throughs from past workshops are archived on our official YouTube channel.
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-full border border-white/15 bg-white/[0.03] text-slate-200 hover:text-white hover:bg-white/[0.08] hover:border-red-500/50 transition-all font-semibold px-6"
          >
            <Link
              href="https://youtube.com/@awscloudclubkelaniya?si=iIQeppQfq_Hd2fNM"
              target="_blank"
            >
              Visit YouTube Channel
              <ArrowRight className="ml-2 h-4 w-4 text-red-400" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

