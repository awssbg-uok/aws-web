"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  Info,
  RefreshCw,
  Send,
  Users,
  ShieldAlert,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";

interface User {
  fullName: string;
  email: string;
  studentID: string;
  year?: number;
  faculty?: string;
  membershipStatus: string;
  memberSince: string;
}

interface TeamQAPair {
  question: string;
  answer: string;
}

interface StoredTeamInterest {
  team: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  answers?: TeamQAPair[];
  experience?: string;
}

interface TeamAppInfo {
  _id: string;
  teamsInterested: (string | StoredTeamInterest)[];
  createdAt: string;
  updatedAt: string;
}

const AVAILABLE_TEAMS = [
  {
    id: "tech",
    title: "Technical Team",
    category: "Architecture & Development",
    description: "Cloud computing demos, hands-on architectural workshops, technical labs, and hackathons.",
    questions: [
      "What programming languages, cloud tools, or technical frameworks have you worked with?",
      "What specific projects or workshops would you like to contribute to or lead in the Technical team?",
    ],
  },
  {
    id: "pr",
    title: "Public Relations (PR) Team",
    category: "Outreach & Partnerships",
    description: "External sponsor outreach, student relations, industry guest coordination, and community growth.",
    questions: [
      "What experience do you have with student outreach, public speaking, or communications?",
      "How would you engage students across campus to attend and participate in AWS events?",
    ],
  },
  {
    id: "hr",
    title: "Human Resources (HR) Team",
    category: "Operations & People",
    description: "Internal team culture, meeting facilitation, volunteer onboarding, and member coordination.",
    questions: [
      "What experience do you have with organizing group activities, team coordination, or conflict resolution?",
      "What ideas do you have to foster a collaborative and energetic culture within the AWS SBG community?",
    ],
  },
  {
    id: "content",
    title: "Content & Editorial Team",
    category: "Publications & Copy",
    description: "Technical blogs, article publishing, newsletters, event recaps, and social announcements.",
    questions: [
      "What experience do you have with technical writing, blogs, social media content, or copywriting?",
      "What formats (e.g., newsletters, step-by-step tutorials, event recaps) are you most interested in creating?",
    ],
  },
  {
    id: "designing",
    title: "UI/UX & Designing Team",
    category: "Creative & Brand",
    description: "Visual identity, event banners, UI design for web projects, social flyers, and multimedia assets.",
    questions: [
      "What design software or tools (e.g. Figma, Canva, Adobe Creative Cloud) are you proficient in?",
      "Share a link or describe a design project, graphic, or UI mockup you are proud of creating.",
    ],
  },
];

const EXPERIENCE_LEVELS: {
  id: "beginner" | "intermediate" | "advanced";
  label: string;
  desc: string;
  badgeClass: string;
}[] = [
  {
    id: "beginner",
    label: "Beginner",
    desc: "Eager to learn & build fundamentals",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    desc: "Hands-on experience & small projects",
    badgeClass: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  },
  {
    id: "advanced",
    label: "Advanced",
    desc: "Strong skills & ready to lead / mentor",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
];

export default function TeamApplicationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Recruitment Status & Existing Applications
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [memberYear, setMemberYear] = useState<number | null>(null);
  const [existingApp, setExistingApp] = useState<TeamAppInfo | null>(null);
  const [alreadyRequestedTeams, setAlreadyRequestedTeams] = useState<string[]>([]);

  // Multi-step Flow State
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<Record<string, "beginner" | "intermediate" | "advanced">>({});
  const [answersMap, setAnswersMap] = useState<Record<string, Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastSubmittedTeamNames, setLastSubmittedTeamNames] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("post_login_redirect", "/operations-teams");
      }
      router.push("/login?redirect=/operations-teams");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // Fetch recruitment status and existing application
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/team-applications/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            if (typeof window !== "undefined") {
              sessionStorage.setItem("post_login_redirect", "/operations-teams");
            }
            router.push("/login?redirect=/operations-teams");
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((data) => {
          if (data) {
            setRecruitmentOpen(Boolean(data.teamRecruitmentOpen));
            if (typeof data.memberYear === "number") {
              setMemberYear(data.memberYear);
            }
            if (data.application) {
              setExistingApp(data.application);
              const app = data.application;
              if (Array.isArray(app.teamsInterested)) {
                const requested: string[] = [];
                app.teamsInterested.forEach((item: string | StoredTeamInterest) => {
                  const teamKey = typeof item === "string" ? item : item?.team;
                  if (teamKey) {
                    const normalized = teamKey.toLowerCase().trim();
                    if (!requested.includes(normalized)) {
                      requested.push(normalized);
                    }
                  }
                });
                setAlreadyRequestedTeams(requested);
              }
            } else {
              setExistingApp(null);
              setAlreadyRequestedTeams([]);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to load application details:", err);
          toast.error("Error loading application status.");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("post_login_redirect", "/operations-teams");
      }
      router.push("/login?redirect=/operations-teams");
    }
  }, [router]);

  const toggleTeam = (teamId: string) => {
    if (alreadyRequestedTeams.includes(teamId.toLowerCase())) return;
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleLevelChange = (teamId: string, level: "beginner" | "intermediate" | "advanced") => {
    setExperienceLevels((prev) => ({
      ...prev,
      [teamId]: level,
    }));
  };

  const handleAnswerChange = (teamId: string, question: string, text: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] || {}),
        [question]: text.slice(0, 500),
      },
    }));
  };

  const handleProceedToStep2 = () => {
    const validTeams = selectedTeams.filter(
      (t) => !alreadyRequestedTeams.includes(t.toLowerCase())
    );
    if (validTeams.length === 0) {
      toast.error("Please select at least one new team to continue.");
      return;
    }
    // Set default experience level if not set
    setExperienceLevels((prev) => {
      const updated = { ...prev };
      validTeams.forEach((t) => {
        if (!updated[t]) {
          updated[t] = "beginner";
        }
      });
      return updated;
    });
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!token) return;

    const validNewTeams = selectedTeams.filter(
      (id) => !alreadyRequestedTeams.includes(id.toLowerCase())
    );

    if (validNewTeams.length === 0) {
      toast.error("Please select at least one new team to apply for.");
      return;
    }

    // Validate that experienceLevel is set for every selected team
    for (const teamId of validNewTeams) {
      const level = experienceLevels[teamId];
      if (!level || !["beginner", "intermediate", "advanced"].includes(level)) {
        toast.error(`Please select your experience level for ${teamId.toUpperCase()}.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        teamsInterested: validNewTeams.map((teamId) => {
          const teamConfig = AVAILABLE_TEAMS.find((t) => t.id === teamId);
          const rawAnswers = answersMap[teamId] || {};
          const answersList: TeamQAPair[] = [];

          if (teamConfig) {
            teamConfig.questions.forEach((q) => {
              const ans = (rawAnswers[q] || "").trim();
              if (ans) {
                answersList.push({
                  question: q.slice(0, 500),
                  answer: ans.slice(0, 500),
                });
              }
            });
          }

          return {
            team: teamId,
            experienceLevel: experienceLevels[teamId],
            answers: answersList.slice(0, 5),
          };
        }),
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
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit team application.");
      }

      toast.success(data.message || "Application submitted successfully!");
      if (data.application) {
        setExistingApp(data.application);
        if (Array.isArray(data.application.teamsInterested)) {
          const updatedRequested: string[] = [];
          data.application.teamsInterested.forEach((item: string | StoredTeamInterest) => {
            const teamKey = typeof item === "string" ? item : item?.team;
            if (teamKey) {
              const normalized = teamKey.toLowerCase().trim();
              if (!updatedRequested.includes(normalized)) {
                updatedRequested.push(normalized);
              }
            }
          });
          setAlreadyRequestedTeams(updatedRequested);
        }
      } else {
        setAlreadyRequestedTeams((prev) => [
          ...prev,
          ...validNewTeams.map((t) => t.toLowerCase()),
        ]);
      }

      setLastSubmittedTeamNames(
        validNewTeams.map((id) => AVAILABLE_TEAMS.find((t) => t.id === id)?.title || id)
      );
      setSelectedTeams([]);
      setCurrentStep(1);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting application";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--squid-ink-deep)] text-slate-300">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-[#AD5CFF]" />
          <p className="text-sm font-medium tracking-wide">Loading application portal...</p>
        </div>
      </div>
    );
  }

  // Guard 1: Recruitment Closed
  if (!recruitmentOpen) {
    return (
      <div className="min-h-screen bg-[var(--squid-ink-deep)] text-[#e2e8f0] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0c1220]/90 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <Info className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-ember">
            Recruitment Closed
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Operations teams recruitment is currently closed. Thank you for your interest! Keep an eye on our community channels for future announcements.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button className="w-full bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs h-10">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Guard 2: Academic Year Check (Only 1st and 2nd years)
  const effectiveYear = memberYear ?? user?.year;
  const isEligibleYear = effectiveYear === 1 || effectiveYear === 2;

  if (!isEligibleYear) {
    return (
      <div className="min-h-screen bg-[var(--squid-ink-deep)] text-[#e2e8f0] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0c1220]/90 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-purple-500/10 border border-[#AD5CFF]/30 flex items-center justify-center text-[#AD5CFF] mb-5">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-ember">
            Exclusive to Undergraduates
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Operations teams recruitment is exclusively open to 1st and 2nd year undergraduates of the University of Kelaniya.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button className="w-full bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs h-10">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--squid-ink-deep)] text-[#e2e8f0] pb-24 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {alreadyRequestedTeams.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#AD5CFF]" />
              <span>
                {alreadyRequestedTeams.length}{" "}
                {alreadyRequestedTeams.length === 1 ? "Team" : "Teams"} Requested
              </span>
            </div>
          )}
        </div>

        {/* Page Hero Header */}
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#AD5CFF]/15 via-[#0c1220]/90 to-[#0c1220]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#AD5CFF]/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200">
              <IconBadge name="teams" variant="primary" size="xs" />
              <span>Operations Teams Recruitment</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-ember">
              AWS Student Builder Group Operations Teams
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Join the student leadership driving cloud computing, hands-on architectures, and community initiatives at the University of Kelaniya.
            </p>

            {/* Stepper Progress Indicator */}
            <div className="pt-4 flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  currentStep === 1
                    ? "bg-[#AD5CFF] border-[#AD5CFF] text-white shadow-md shadow-purple-950/40"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
                <span>Team Selection</span>
              </div>
              <div className="h-0.5 w-8 bg-white/10" />
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  currentStep === 2
                    ? "bg-[#AD5CFF] border-[#AD5CFF] text-white shadow-md shadow-purple-950/40"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
                <span>Experience & Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 via-[#0c1220]/90 to-[#0c1220]/95 p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white font-ember">
                Application Received!
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Your application for{" "}
              <strong className="text-white">
                {lastSubmittedTeamNames.join(", ")}
              </strong>{" "}
              has been received. You&apos;ll be added to your requested groups soon. Our team will manually review your submission.
            </p>
            {user?.email && (
              <p className="text-xs text-slate-400">
                A confirmation email has also been sent to <strong className="text-slate-300">{user.email}</strong>.
              </p>
            )}
            <div className="pt-2 flex items-center gap-3">
              <Link href="/dashboard">
                <Button className="bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs h-10 px-6 shadow-lg shadow-purple-950/40">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Team Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {AVAILABLE_TEAMS.length > 0 &&
            AVAILABLE_TEAMS.every((team) =>
              alreadyRequestedTeams.includes(team.id.toLowerCase())
            ) ? (
              <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#AD5CFF]/15 via-[#0c1220]/90 to-[#0c1220]/95 p-8 sm:p-12 text-center space-y-5 shadow-2xl backdrop-blur-xl">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/20 border border-[#AD5CFF]/40 flex items-center justify-center text-[#AD5CFF]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-ember">
                    You&apos;ve applied to all available teams!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                    You have already requested to join every operations team. Our executive team will manually review your applications and add you to the respective groups soon.
                  </p>
                </div>
                <div className="pt-3 flex justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs h-10 px-6 shadow-lg shadow-purple-950/40">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white font-ember">
                      Step 1: Choose Your Teams
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select one or more teams you wish to apply for.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-purple-300">
                    {selectedTeams.length} selected
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_TEAMS.map((team) => {
                    const isAlreadyRequested = alreadyRequestedTeams.includes(team.id.toLowerCase());
                    const isSelected = selectedTeams.includes(team.id);

                    return (
                      <div
                        key={team.id}
                        onClick={() => {
                          if (!isAlreadyRequested) {
                            toggleTeam(team.id);
                          }
                        }}
                        className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between select-none ${
                          isAlreadyRequested
                            ? "opacity-55 bg-white/[0.02] border-white/5 cursor-not-allowed"
                            : isSelected
                            ? "cursor-pointer bg-purple-500/15 border-[#AD5CFF] shadow-[0_0_24px_rgba(173,92,255,0.25)]"
                            : "cursor-pointer bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                isAlreadyRequested ? "text-slate-500" : "text-purple-300"
                              }`}
                            >
                              {team.category}
                            </span>
                            {isAlreadyRequested ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300 shrink-0">
                                <Check className="w-3 h-3 text-[#AD5CFF]" />
                                Already Requested
                              </span>
                            ) : (
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "bg-[#AD5CFF] border-[#AD5CFF] text-white"
                                    : "border-slate-500 bg-white/5"
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            )}
                          </div>
                          <h3
                            className={`text-base font-bold font-ember ${
                              isAlreadyRequested ? "text-slate-400" : "text-white"
                            }`}
                          >
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

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div className="text-xs text-slate-400">
                    {selectedTeams.length === 0 ? (
                      <span className="text-slate-400">Select at least one new team above to proceed.</span>
                    ) : (
                      <span className="text-purple-300 font-medium">Selected {selectedTeams.length} new team(s)</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleProceedToStep2}
                    disabled={selectedTeams.length === 0}
                    className="bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs gap-2 px-6 h-11 shadow-lg shadow-purple-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Continue to Experience & Questions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* STEP 2: Experience & Questions */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white font-ember">
                  Step 2: Experience Level & Role Questions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify your experience level and answer the questions for each team you selected.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-xl h-8 px-3 gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modify Teams</span>
              </Button>
            </div>

            <div className="space-y-6">
              {selectedTeams.map((teamId) => {
                const team = AVAILABLE_TEAMS.find((t) => t.id === teamId);
                const currentLevel = experienceLevels[teamId] || "beginner";
                const teamAnswers = answersMap[teamId] || {};

                return (
                  <div
                    key={teamId}
                    className="rounded-3xl border border-white/10 bg-[#0c1220]/80 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md"
                  >
                    {/* Team Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
                          {team?.category}
                        </span>
                        <h3 className="text-lg font-bold text-white font-ember">
                          {team?.title || teamId}
                        </h3>
                      </div>
                    </div>

                    {/* Experience Level Selector (Required) */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-200">
                        Experience Level <span className="text-[#AD5CFF]">*</span>:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {EXPERIENCE_LEVELS.map((level) => {
                          const isLevelSelected = currentLevel === level.id;
                          return (
                            <div
                              key={level.id}
                              onClick={() => handleLevelChange(teamId, level.id)}
                              className={`cursor-pointer rounded-2xl border p-3.5 transition-all select-none ${
                                isLevelSelected
                                  ? "bg-purple-500/15 border-[#AD5CFF] shadow-[0_0_16px_rgba(173,92,255,0.2)]"
                                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${level.badgeClass}`}>
                                  {level.label}
                                </span>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isLevelSelected
                                      ? "border-[#AD5CFF] bg-[#AD5CFF]"
                                      : "border-slate-500"
                                  }`}
                                >
                                  {isLevelSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-snug">
                                {level.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4 pt-2">
                      <div className="text-xs font-semibold text-slate-200">
                        Role Questions (Optional, up to 500 characters each):
                      </div>

                      {team?.questions.map((question, qIdx) => {
                        const answerText = teamAnswers[question] || "";
                        return (
                          <div
                            key={qIdx}
                            className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <label className="text-xs font-medium text-slate-300 leading-relaxed">
                                {qIdx + 1}. {question}
                              </label>
                              <span
                                className={`text-[10px] font-mono shrink-0 ${
                                  answerText.length >= 500 ? "text-amber-400 font-bold" : "text-slate-400"
                                }`}
                              >
                                {answerText.length}/500
                              </span>
                            </div>
                            <textarea
                              rows={3}
                              maxLength={500}
                              value={answerText}
                              onChange={(e) =>
                                handleAnswerChange(teamId, question, e.target.value)
                              }
                              placeholder="Type your response here..."
                              className="w-full rounded-xl border border-white/10 bg-[#060a12]/90 p-3 text-xs text-white placeholder-slate-500 focus:border-[#AD5CFF] focus:outline-none focus:ring-1 focus:ring-[#AD5CFF] transition resize-none leading-relaxed"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 2 Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs gap-1.5 px-4 h-11"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Team Selection</span>
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || selectedTeams.length === 0}
                className="bg-[#AD5CFF] hover:bg-[#9745ea] text-white font-semibold rounded-xl text-xs gap-2 px-8 h-11 shadow-lg shadow-purple-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {alreadyRequestedTeams.length > 0
                        ? "Submit Additional Teams"
                        : "Submit Application"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
