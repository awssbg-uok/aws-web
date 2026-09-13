"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

interface User {
  fullName: string;
  email: string;
  studentID: string;
  membershipStatus: string;
  memberSince: string;
}

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj";
const MEETUP_GROUP_URL =
  "https://www.meetup.com/aws-cloud-club-at-university-of-kelaniya/";

const communityLinks = [
  {
    title: "WhatsApp Group",
    description: "Get quick club updates, reminders, and announcements.",
    href: WHATSAPP_GROUP_URL,
    icon: MessageCircle,
  },
  {
    title: "Meetup Group",
    description: "RSVP events, sessions, and workshops officially.",
    href: MEETUP_GROUP_URL,
    icon: CalendarDays,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
        router.push("/login");
      }
    } else {
      // If no user found, redirect to login
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="animate-pulse text-sm tracking-wide">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const membershipStatus = user.membershipStatus?.toLowerCase() || "pending";
  const statusClassName =
    membershipStatus === "active"
      ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-200"
      : "border-amber-400/30 bg-amber-500/20 text-amber-100";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(249,115,22,0.2),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-7 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8 mt-11">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
            Member Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl font-ember">
            Welcome back, {user.fullName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Your member profile and community channels are ready. Use the quick
            links below to stay connected with AWS Cloud Club UOK.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-white sm:text-2xl font-ember">
                Profile Snapshot
              </h2>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClassName}`}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {membershipStatus}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Full Name
                </p>
                <p className="mt-2 text-base font-medium text-slate-100">
                  {user.fullName}
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Student Number
                </p>
                <p className="mt-2 text-base font-medium text-slate-100">
                  {user.studentID}
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-800/60 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Email
                </p>
                <p className="mt-2 break-all text-base font-medium text-slate-100">
                  {user.email}
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-800/60 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Member Since
                </p>
                <p className="mt-2 text-base font-medium text-slate-100">
                  {new Date(user.memberSince).toLocaleDateString()}
                </p>
              </article>
            </div>
          </section>

          <section className="space-y-6">
            <article className="rounded-3xl border border-orange-300/20 bg-orange-500/10 p-6 backdrop-blur-md">
              <h2 className="text-xl font-semibold text-orange-100 font-ember">
                Community Access
              </h2>
              <p className="mt-2 text-sm text-orange-50/90">
                Join both channels so you do not miss announcements and event
                registrations.
              </p>

              <div className="mt-5 space-y-3">
                {communityLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 transition hover:border-orange-300/50 hover:bg-slate-900"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-100">
                            {link.title}
                          </span>
                          <span className="block text-xs text-slate-400">
                            {link.description}
                          </span>
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-orange-200" />
                    </Link>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-200/20 bg-cyan-300/10 p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-cyan-100">
                Stay Event-Ready
              </h3>
              <p className="mt-2 text-sm text-cyan-50/90">
                Meetup is where official event RSVPs happen, while WhatsApp is
                best for quick reminders and urgent announcements.
              </p>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
