"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ContactForm from "@/components/contact-form";
import { MessageSquare, Sparkles } from "lucide-react";
import { contacts } from "@/data/contact-us";
import Link from "next/link";

export default function ContactUs() {
  return (
    <div className="relative isolate min-h-screen bg-[var(--squid-ink-deep)] text-white overflow-hidden">
      {/* Background Ambient Spotlights & Grid Mesh */}
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
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact-us-hero-purple.jpg"
            alt="Contact Us"
            fill
            sizes="100vw"
            className="object-cover opacity-30 object-center"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--squid-ink-deep)]/85 via-[var(--squid-ink-deep)]/70 to-[var(--squid-ink-deep)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto"
        >
          {/* Top Pill Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Get In Touch
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white font-ember">
            Have Any <span className="text-[#AD5CFF]">Questions?</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We are here to help and answer any questions about our builder events, student programs, and cloud initiatives.
          </p>
        </motion.div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 sm:py-20 relative bg-[var(--squid-ink-deep)]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {contacts.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <div className="premium-card p-7 sm:p-8 text-center h-full flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 p-4 flex items-center justify-center mb-5 text-[#AD5CFF] shadow-[0_0_20px_rgba(173,92,255,0.25)]">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight">
                    {item?.title}
                  </h3>
                  <div className="flex-1 flex items-center justify-center w-full my-auto">
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed text-sm sm:text-base font-normal text-center">
                      {item.title === "Email Us" ? (
                        <a
                          href={`mailto:${item.content}`}
                          className="hover:text-[#AD5CFF] transition-colors inline-block"
                        >
                          {item.content}
                        </a>
                      ) : (
                        item?.content
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Form Section */}
      <section className="py-20 relative bg-[var(--squid-ink-deep)]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 font-ember">
              Let&apos;s <span className="text-[#AD5CFF]">Talk</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Send us your feedback, inquiries, or community collaboration ideas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[460px] rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.7845032280488!2d79.91473789512455!3d6.97419502281288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2581cbe3d06f5%3A0x17c98045f95e4fe2!2sFaculty%20of%20Science%20University%20of%20Kelaniya!5e0!3m2!1sen!2slk!4v1735723482327!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="premium-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                  <div className="w-10 h-10 rounded-xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 flex items-center justify-center text-[#AD5CFF] shadow-[0_0_12px_rgba(173,92,255,0.25)]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Send Us a Message</h3>
                    <p className="text-xs text-slate-400">We typically respond within 24 hours.</p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Resources Callout */}
      <section className="py-20 bg-[var(--squid-ink-deep)] border-t border-white/[0.08] text-white relative">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-white font-ember">
              Looking to <span className="text-[#AD5CFF]">Get Involved?</span>
            </h2>
            <p className="text-base text-slate-400 mb-8 leading-relaxed">
              Explore our builder learning resources, workshop pathways, and join our active student developer community.
            </p>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold transition-all duration-200"
            >
              Explore Learning Resources
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
