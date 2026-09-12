"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Search,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  id: string;
  category: "general" | "membership" | "events" | "certifications";
  question: string;
  answer: string;
  links?: { text: string; url: string }[];
}

const faqs: FAQItem[] = [
  {
    id: "what-is-sbg",
    category: "general",
    question: "What is the AWS Student Builder Group (AWS SBG)?",
    answer:
      "The AWS Student Builder Group at the University of Kelaniya is an official student-led cloud community powered by Amazon Web Services. We empower students and independent builders through hands-on cloud architectures, collaborative projects, technical workshops, and mentorship from industry cloud experts.",
    links: [
      {
        text: "Explore AWS Student Communities",
        url: "https://aws.amazon.com/developer/community/students/",
      },
      {
        text: "AWS Educate Platform",
        url: "https://www.awseducate.com/",
      },
    ],
  },
  {
    id: "how-to-join",
    category: "membership",
    question: "How do I become a member?",
    answer:
      "Membership is open to all passionate undergraduates and learners at the University of Kelaniya. You can register directly through our Join Us portal, join our WhatsApp and Discord discussion channels, and participate in our upcoming community orientation.",
    links: [
      {
        text: "Register on Join Us Portal",
        url: "/join-us",
      },
    ],
  },
  {
    id: "next-intake",
    category: "membership",
    question: "When is the next membership intake?",
    answer:
      "Official membership recruitment cycles open at the start of each semester. However, our technical workshops, open-source projects, and webinar sessions are free and open to everyone in the university year-round.",
  },
  {
    id: "prior-experience",
    category: "general",
    question: "Do I need prior cloud or programming experience to join?",
    answer:
      "No prior cloud knowledge is needed! We structure our curriculum starting from cloud fundamentals (AWS Global Infrastructure, EC2, S3, IAM) up to advanced serverless, containerization, and generative AI architectures. All you need is curiosity and a desire to build.",
  },
  {
    id: "events-workshops",
    category: "events",
    question: "What kinds of events and workshops do you organize?",
    answer:
      "We host monthly hands-on AWS Builder workshops, cloud hackathons, AWS Jam game-days, speaker sessions with certified Solutions Architects, and collaborative study jams preparing students for global cloud careers.",
    links: [
      {
        text: "View Upcoming & Past Events",
        url: "/events",
      },
    ],
  },
  {
    id: "certifications",
    category: "certifications",
    question: "Can I prepare for AWS Certifications through the community?",
    answer:
      "Absolutely. We run dedicated peer study groups for AWS Certified Cloud Practitioner (CLF-C02) and AWS Certified Solutions Architect - Associate (SAA-C03), complete with study guides, practice quizzes, lab access, and sponsored certification voucher giveaways during select community milestones.",
    links: [
      {
        text: "Browse Curated Learning Resources",
        url: "/resources",
      },
    ],
  },
  {
    id: "lead-team",
    category: "membership",
    question: "How can I join the Executive Committee or become a Lead?",
    answer:
      "Calls for Executive Committee and Core Team roles (Technical Leads, Event Organizers, Media & Design, Outreach) are announced annually. Active, engaged contributors who consistently attend events and help peer builders are prioritized for leadership roles.",
  },
];

const categories = [
  { id: "all", label: "All Questions", icon: Sparkles },
  { id: "general", label: "General", icon: HelpCircle },
  { id: "membership", label: "Membership", icon: Users },
  { id: "events", label: "Events", icon: BookOpen },
  { id: "certifications", label: "Certifications", icon: Award },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("what-is-sbg");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      data-header-theme="dark"
      className="relative isolate min-h-screen bg-[var(--squid-ink-deep)] pt-28 pb-24 text-white overflow-hidden"
    >
      {/* Background Ambient Spotlights & Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[460px] bg-[#AD5CFF]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[42%] -right-28 w-[500px] h-[500px] bg-[#7928CA]/[0.10] rounded-full blur-[150px]" />
        <div className="absolute bottom-12 -left-28 w-[450px] h-[450px] bg-[#AD5CFF]/[0.06] rounded-full blur-[140px]" />

        {/* Visible Square Grid-Mesh */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,black_70%,transparent_100%)]" />

        {/* Top & Bottom Vignettes */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Top Pill Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Help Center & Community FAQ
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Frequently Asked{" "}
            <span className="text-[#AD5CFF]">Questions</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about joining, building, and growing with the AWS Student Builder Group at University of Kelaniya.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0c1220]/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#AD5CFF] focus:ring-2 focus:ring-[#AD5CFF]/20 transition-all duration-300 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.35)]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#AD5CFF] text-white shadow-[0_0_16px_rgba(173,92,255,0.4)] border border-[#AD5CFF]"
                      : "bg-[#0c1220]/70 text-slate-300 border border-white/10 hover:border-[#AD5CFF]/40 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-white/10 bg-[#0c1220]/60 backdrop-blur-xl">
              <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">No matching questions found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try searching for different keywords or clear the category filter.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`relative rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-hidden ${
                    isOpen
                      ? "bg-[#0c1220]/90 border-[#AD5CFF]/60 shadow-[0_8px_30px_rgba(173,92,255,0.14)]"
                      : "bg-[#0c1220]/70 border-white/[0.08] hover:border-[#AD5CFF]/35 hover:bg-[#0c1220]/85"
                  }`}
                >
                  {/* Subtle top-right ambient glow when open */}
                  {isOpen && (
                    <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-[#AD5CFF]/20 rounded-full blur-2xl" />
                  )}

                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="flex justify-between items-center w-full text-left p-5 sm:p-6 gap-4 group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-200 transition-colors leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-[#AD5CFF] border-[#AD5CFF] text-white rotate-180 shadow-[0_0_12px_rgba(173,92,255,0.6)]"
                          : "bg-[#AD5CFF]/10 border-[#AD5CFF]/30 text-[#AD5CFF] group-hover:bg-[#AD5CFF]/20 group-hover:border-[#AD5CFF]/50"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/[0.06]">
                          <p>{faq.answer}</p>

                          {faq.links && faq.links.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/[0.05] flex flex-wrap gap-3">
                              {faq.links.map((link, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={link.url}
                                  target={link.url.startsWith("http") ? "_blank" : undefined}
                                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#AD5CFF] hover:text-[#c084fc] transition-colors"
                                >
                                  {link.text}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom Contact Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-14 rounded-2xl border border-white/10 bg-[#0c1220]/80 p-6 sm:p-8 backdrop-blur-xl text-center relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#AD5CFF]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 flex items-center justify-center text-[#AD5CFF] mx-auto mb-4 shadow-[0_0_15px_rgba(173,92,255,0.25)]">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-6">
            Can’t find what you’re looking for? Reach out to our student leadership team directly and we'll be happy to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold rounded-full px-6 shadow-[0_4px_20px_rgba(173,92,255,0.4)] hover:shadow-[0_4px_28px_rgba(173,92,255,0.65)] transition-all duration-300"
            >
              <Link href="/contact-us">
                Contact Us <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-full px-6 transition-all duration-300"
            >
              <Link href="/join-us">Join Community</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
