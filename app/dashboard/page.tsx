"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  BadgeCheck,
  Calendar,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  CheckCircle2,
  RefreshCw,
  Send,
  Users,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { events } from "@/data/events";

interface User {
  fullName: string;
  email: string;
  studentID: string;
  year?: number;
  faculty?: string;
  membershipStatus: string;
  memberSince: string;
}

interface TeamInterestItem {
  team: string;
  experience?: string;
}

interface TeamAppInfo {
  _id: string;
  teamsInterested: (string | TeamInterestItem)[];
  createdAt: string;
  updatedAt: string;
}

const AVAILABLE_TEAMS = [
  {
    id: "tech",
    title: "Technical Team",
    category: "Architecture & Hands-On",
    description: "Cloud computing demos, hands-on architectural workshops, and hackathons.",
  },
  {
    id: "pr",
    title: "Public Relations (PR) Team",
    category: "Outreach & Growth",
    description: "External sponsor outreach, student relations, and speaker coordination.",
  },
  {
    id: "hr",
    title: "Human Resources (HR) Team",
    category: "Operations & People",
    description: "Internal team culture, meeting facilitation, and volunteer onboarding.",
  },
  {
    id: "content",
    title: "Content & Editorial Team",
    category: "Publications & Copy",
    description: "Technical blogs, article publishing, newsletters, and social announcements.",
  },
  {
    id: "designing",
    title: "UI/UX & Designing Team",
    category: "Creative & Brand",
    description: "Visual identity, event banners, UI design for web projects, and flyers.",
  },
];

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LwH3BiTgyxQCcqQXYPvMhj";
const MEETUP_GROUP_URL =
  "https://www.meetup.com/aws-sbg-at-university-of-kelaniya/";

const communityLinks = [
  {
    title: "WhatsApp Group",
    description: "Quick club updates, reminders, and community chat.",
    href: WHATSAPP_GROUP_URL,
    iconName: "speaker" as const,
  },
  {
    title: "Meetup Group",
    description: "Official event RSVPs, technical sessions, and meetups.",
    href: MEETUP_GROUP_URL,
    iconName: "clock" as const,
  },
];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Welcome back";
}

function calculateMembershipDays(dateString: string): number {
  if (!dateString) return 0;
  const joinDate = new Date(dateString);
  if (isNaN(joinDate.getTime())) return 0;
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - joinDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function formatEmailWithBreaks(email: string) {
  if (!email || !email.includes("@")) return email;
  const atIndex = email.indexOf("@");
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);

  const lastDotIndex = domain.lastIndexOf(".");
  if (lastDotIndex > 0) {
    const domainName = domain.slice(0, lastDotIndex);
    const tld = domain.slice(lastDotIndex);
    return (
      <>
        <span>{local}</span>
        <wbr />
        <span>{domainName}</span>
        <wbr />
        <span>{tld}</span>
      </>
    );
  }

  return (
    <>
      <span>{local}</span>
      <wbr />
      <span>{domain}</span>
    </>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");

  const [token, setToken] = useState<string | null>(null);
  const [teamRecruitmentOpen, setTeamRecruitmentOpen] = useState(false);
  const [verifiedMemberYear, setVerifiedMemberYear] = useState<number | null>(null);
  const [existingTeamApp, setExistingTeamApp] = useState<TeamAppInfo | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [teamExperiences, setTeamExperiences] = useState<Record<string, string>>({});
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [submittingTeam, setSubmittingTeam] = useState(false);
  const [teamSubmissionSuccess, setTeamSubmissionSuccess] = useState(false);

  useEffect(() => {
    setGreeting(getTimeGreeting());
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
    } else {
      router.push("/login");
      return;
    }

    if (storedToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/team-applications/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setTeamRecruitmentOpen(Boolean(data.teamRecruitmentOpen));
            if (typeof data.memberYear === "number") {
              setVerifiedMemberYear(data.memberYear);
            }
            if (data.application) {
              setExistingTeamApp(data.application);
              if (Array.isArray(data.application.teamsInterested)) {
                const teams: string[] = [];
                const exps: Record<string, string> = {};
                data.application.teamsInterested.forEach((item: string | TeamInterestItem) => {
                  if (typeof item === "string") {
                    teams.push(item);
                  } else if (item && typeof item === "object" && item.team) {
                    teams.push(item.team);
                    if (item.experience) {
                      exps[item.team] = item.experience;
                    }
                  }
                });
                setSelectedTeams(teams);
                setTeamExperiences(exps);
              }
            }
          }
        })
        .catch(() => {});
    }
  }, [router]);

  const handleToggleTeam = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((t) => t !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmitTeamApplication = async () => {
    if (!token) return;
    if (selectedTeams.length === 0) {
      toast.error("Please select at least one team.");
      return;
    }

    setSubmittingTeam(true);
    try {
      const payload = {
        teamsInterested: selectedTeams.map((teamId) => ({
          team: teamId,
          experience: (teamExperiences[teamId] || "").trim().slice(0, 500),
        })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit team application");

      toast.success(data.message || "Team application submitted successfully!");
      if (data.application) {
        setExistingTeamApp(data.application);
      }
      setTeamSubmissionSuccess(true);
      setIsExperienceModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting application";
      toast.error(msg);
    } finally {
      setSubmittingTeam(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--squid-ink-deep)] text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#AD5CFF] border-t-transparent" />
          <p className="text-sm font-medium tracking-wide">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const membershipStatus = user.membershipStatus?.toLowerCase() || "pending";
  const statusClassName =
    membershipStatus === "active"
      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
      : "border-purple-400/30 bg-[#AD5CFF]/15 text-purple-200";

  const memberDays = calculateMembershipDays(user.memberSince);
  const formattedMemberSince = user.memberSince
    ? new Date(user.memberSince).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  // Filter for events strictly after today's date, sorted ascending
  const now = new Date();
  const upcomingEvents = events
    .map((e) => ({
      ...e,
      parsedDate: new Date(e.date),
    }))
    .filter(
      (e) =>
        !isNaN(e.parsedDate.getTime()) &&
        e.parsedDate > now &&
        e.status !== "ended" &&
        e.status !== "past"
    )
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[var(--squid-ink-deep)] pt-28 pb-20 text-slate-100">
      {/* Background Ambient Spotlights & Purple Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[460px] bg-[#AD5CFF]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[40%] -right-28 w-[520px] h-[520px] bg-[#7928CA]/[0.10] rounded-full blur-[150px]" />
        <div className="absolute bottom-10 -left-28 w-[450px] h-[450px] bg-[#AD5CFF]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,black_70%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--squid-ink-deep)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Header Banner */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="premium-card mb-8 p-6 sm:p-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AD5CFF]/30 bg-[#0c1220]/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#AD5CFF]/20 text-[#AD5CFF]">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Member Dashboard
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-ember">
            {greeting}, {user.fullName}
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Your member profile and community channels are active. Use the quick
            links below to stay connected with AWS Student Builder Group UOK.
          </p>

          {/* Prominent Next Event Highlight (Hidden if no upcoming events exist) */}
          {nextEvent && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0c1220]/80 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#AD5CFF]/20 text-[#AD5CFF] border border-[#AD5CFF]/30">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider font-ember-mono">
                      Your Next Event
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white tracking-tight sm:text-base">
                    {nextEvent.title}{" "}
                    <span className="text-xs font-normal text-slate-400 sm:text-sm">
                      &bull; {nextEvent.date}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#AD5CFF]/40 bg-[#AD5CFF]/15 px-4 py-2 text-xs font-semibold text-[#E0AAFF] hover:bg-[#AD5CFF] hover:text-white transition-all shadow-none"
              >
                <span>View details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </motion.section>

        {/* Join a Team Card (Visible only when teamRecruitmentOpen is true AND member year is 1 or 2) */}
        {teamRecruitmentOpen && (verifiedMemberYear === 1 || verifiedMemberYear === 2 || (verifiedMemberYear === null && (user.year === 1 || user.year === 2))) && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#AD5CFF]/15 via-[#0c1220]/90 to-[#0c1220]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#AD5CFF]/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2">
                    <Sparkles className="h-3 w-3 text-[#AD5CFF]" />
                    <span>Core Team Recruitment Open</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-ember">
                    Join a Core Team
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Open exclusively for 1st & 2nd year undergraduates. Gain hands-on leadership experience, cloud architecture skills, and coordinate campus events. Select the teams you are interested in:
                  </p>
                </div>

                {existingTeamApp && (
                  <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Application Active</span>
                  </div>
                )}
              </div>

              {/* Team Options Grid - Step 1 */}
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {AVAILABLE_TEAMS.map((team) => {
                    const isSelected = selectedTeams.includes(team.id);
                    return (
                      <div
                        key={team.id}
                        onClick={() => handleToggleTeam(team.id)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between select-none ${
                          isSelected
                            ? "bg-purple-500/15 border-[#AD5CFF] shadow-[0_0_20px_rgba(173,92,255,0.2)]"
                            : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                              {team.category}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#AD5CFF] border-[#AD5CFF] text-white"
                                  : "border-slate-500 bg-white/5"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <h3 className="text-base font-bold text-white font-ember">
                            {team.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {team.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step 1 Action Row: Continue Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-slate-400">
                    {selectedTeams.length > 0 ? (
                      <span>
                        Selected: <strong className="text-purple-300">{selectedTeams.length}</strong> {selectedTeams.length === 1 ? "team" : "teams"}
                      </span>
                    ) : (
                      <span className="text-amber-300">Please choose at least one team above to proceed.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={() => setIsExperienceModalOpen(true)}
                      disabled={selectedTeams.length === 0}
                      className="bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs gap-2 px-6 h-10 shadow-lg shadow-purple-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Step 2: Experience Modal */}
                <Dialog open={isExperienceModalOpen} onOpenChange={setIsExperienceModalOpen}>
                  <DialogContent className="max-w-xl bg-[#0c1220] border border-purple-500/30 text-white p-6 sm:p-7 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    <DialogHeader className="space-y-1.5 pb-2 border-b border-white/10 text-left">
                      <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-purple-200 w-fit">
                        <Sparkles className="h-3 w-3 text-[#AD5CFF]" />
                        <span>Step 2 of 2 &bull; Experience</span>
                      </div>
                      <DialogTitle className="text-xl font-extrabold text-white font-ember">
                        Tell Us About Your Experience
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-300">
                        Share any relevant projects, background, or learning interests for your selected teams (optional, up to 500 characters per team).
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1">
                      {selectedTeams.map((teamId) => {
                        const team = AVAILABLE_TEAMS.find((t) => t.id === teamId);
                        const currentExp = teamExperiences[teamId] || "";
                        return (
                          <div
                            key={teamId}
                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5 transition-colors hover:border-purple-500/30"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                                  {team?.category || "Core Team"}
                                </span>
                                <span className="text-sm font-bold text-white font-ember">
                                  {team?.title || teamId}
                                </span>
                              </div>
                              <span
                                className={`text-[11px] font-mono ${
                                  currentExp.length >= 500 ? "text-amber-400 font-bold" : "text-slate-400"
                                }`}
                              >
                                {currentExp.length}/500
                              </span>
                            </div>
                            <label className="block text-xs text-slate-300 font-medium">
                              Tell us about your experience with {team?.title || teamId}, if any:
                            </label>
                            <textarea
                              rows={3}
                              maxLength={500}
                              value={currentExp}
                              onChange={(e) =>
                                setTeamExperiences((prev) => ({
                                  ...prev,
                                  [teamId]: e.target.value.slice(0, 500),
                                }))
                              }
                              placeholder="e.g. Projects, workshops, hackathons, skills, or why you want to join..."
                              className="w-full rounded-xl border border-white/10 bg-[#060a12]/80 p-3 text-xs text-white placeholder-slate-500 focus:border-[#AD5CFF] focus:outline-none focus:ring-1 focus:ring-[#AD5CFF] transition resize-none leading-relaxed"
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsExperienceModalOpen(false)}
                        className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs gap-1.5 px-4 h-10"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitTeamApplication}
                        disabled={submittingTeam}
                        className="bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs gap-2 px-6 h-10 shadow-lg shadow-purple-950/40"
                      >
                        {submittingTeam ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : existingTeamApp ? (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Update Application</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Application</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Post-Submission Channel Link Banner */}
                {(teamSubmissionSuccess || existingTeamApp) && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        You are registered for{" "}
                        <strong>
                          {selectedTeams
                            .map((t) => AVAILABLE_TEAMS.find((at) => at.id === t)?.title || t)
                            .join(", ")}
                        </strong>
                        ! Join the official team channel for updates:
                      </span>
                    </div>
                    <a
                      href="https://whatsapp.com/channel/0029VaPlaceholderAWS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20ba5a] transition-all shadow-md shrink-0 text-center justify-center"
                    >
                      <span>Join WhatsApp Channel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* 2-Column Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Left Column: Profile Snapshot */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="premium-card p-6 sm:p-7 flex flex-col justify-between"
          >
            <div>
              <div className="mb-6 flex items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-ember">
                  Profile Snapshot
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusClassName}`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {membershipStatus}
                </span>
              </div>

              {/* Restructured Profile Grid: Full Width Name & Email, 2-Column Row for Student Number & Member Since */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name (Full Width) */}
                <article className="sm:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 p-4 transition-colors hover:border-white/15 min-h-[88px] flex flex-col justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-ember-mono">
                    Full Name
                  </p>
                  <p className="mt-1.5 text-base sm:text-lg font-semibold text-white leading-snug break-words">
                    {user.fullName}
                  </p>
                </article>

                {/* Email Address (Full Width) */}
                <article className="sm:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 p-4 transition-colors hover:border-white/15 min-h-[88px] flex flex-col justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-ember-mono">
                    Email Address
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-white leading-snug break-normal">
                    {formatEmailWithBreaks(user.email)}
                  </p>
                </article>

                {/* Student Number (Left Column) */}
                <article className="rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 p-4 transition-colors hover:border-white/15 min-h-[88px] flex flex-col justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-ember-mono">
                    Student Number
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-white truncate">
                    {user.studentID}
                  </p>
                </article>

                {/* Member Since (Right Column) */}
                <article className="rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 p-4 transition-colors hover:border-white/15 min-h-[88px] flex flex-col justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-ember-mono">
                    Member Since
                  </p>
                  <div>
                    <p className="mt-1.5 text-base font-semibold text-white">
                      Member for {memberDays} {memberDays === 1 ? "day" : "days"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Joined {formattedMemberSince}
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </motion.section>

          {/* Right Column: Community Access & Event Readiness */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Community Access Card */}
            <article className="premium-card p-6 sm:p-7">
              <h2 className="text-xl font-bold text-white tracking-tight font-ember">
                Community Access
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Join both official channels to receive announcements, workshop
                materials, and RSVP notifications.
              </p>

              <div className="mt-5 space-y-3">
                {communityLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0c1220]/70 px-4 py-3.5 transition-all hover:border-[#AD5CFF]/40 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3.5">
                      <IconBadge name={link.iconName} variant="primary" size="md" />
                      <div>
                        <span className="block text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                          {link.title}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {link.description}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-[#AD5CFF]" />
                  </Link>
                ))}
              </div>
            </article>

            {/* Stay Event-Ready Card (re-themed to match --squid-ink-card) */}
            <article className="premium-card p-6 sm:p-7">
              <div className="flex items-center gap-2.5 mb-2">
                <IconBadge name="bolt" variant="secondary" size="xs" />
                <h3 className="text-lg font-bold text-white tracking-tight font-ember">
                  Stay Event Ready
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Meetup is where official event RSVPs happen, while WhatsApp is
                best for quick reminders, announcements, and direct community
                engagement.
              </p>
            </article>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
