"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Check,
  X,
  RefreshCw,
  Clock,
  Mail,
  User,
  GraduationCap,
  Calendar,
  AlertTriangle,
  MessageSquare,
  FileText,
  Building,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";

interface ApplicationItem {
  _id: string;
  fullName: string;
  email: string;
  studentId: string;
  faculty: string;
  year: number;
  contactNumber: string;
  address?: string;
  interests?: string;
  linkedin?: string;
  github?: string;
  membershipStatus: "pending" | "active" | "inactive" | "rejected";
  role: "member" | "admin";
  createdAt: string;
}

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ConfirmState {
  open: boolean;
  type: "approve" | "reject";
  application: ApplicationItem | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"applications" | "messages">("applications");
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    open: false,
    type: "approve",
    application: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Auth Guard
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.role !== "admin") {
        router.push("/login");
        return;
      }
      setToken(storedToken);
      setIsAuthorized(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  // 2. Fetch Applications
  const fetchApplications = useCallback(async (authToken: string) => {
    setLoadingApps(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired or unauthorized. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load applications");
      }

      const data = await res.json();
      setApplications(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching applications";
      toast.error(msg);
    } finally {
      setLoadingApps(false);
    }
  }, [router]);

  // 3. Fetch Messages
  const fetchMessages = useCallback(async (authToken: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/messages`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired or unauthorized. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await res.json();
      setMessages(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching messages";
      toast.error(msg);
    } finally {
      setLoadingMessages(false);
    }
  }, [router]);

  // Initial load once authorized
  useEffect(() => {
    if (isAuthorized && token) {
      fetchApplications(token);
      fetchMessages(token);
    }
  }, [isAuthorized, token, fetchApplications, fetchMessages]);

  // 4. Action Handler with Confirmation
  const handleConfirmAction = async () => {
    if (!token || !confirmModal.application) return;

    const { type, application } = confirmModal;
    setIsProcessing(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/${application._id}/${type}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Failed to ${type} application`);
      }

      toast.success(
        type === "approve"
          ? `Approved ${application.fullName}. Welcome email dispatched.`
          : `Rejected application for ${application.fullName}.`
      );

      setConfirmModal({ open: false, type: "approve", application: null });
      // Refresh applications list
      await fetchApplications(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to ${type} application`;
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="animate-pulse text-sm tracking-wide">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Gradients - subtle, no harsh glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(173,92,255,0.14),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(180deg,#020617_0%,#0c1220_100%)] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        {/* Header Console Banner */}
        <section className="mb-7 rounded-3xl border border-white/10 bg-[#0c1220]/80 p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <IconBadge name="key" variant="primary" size="xs" />
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#AD5CFF]">
                  Admin Console
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl font-ember">
                Admin Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Review pending membership applications, grant approvals with automatic welcome emails, and view member inquiries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (token) {
                    if (activeTab === "applications") fetchApplications(token);
                    else fetchMessages(token);
                  }
                }}
                disabled={loadingApps || loadingMessages}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs gap-2 rounded-xl transition-all duration-200"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    (activeTab === "applications" ? loadingApps : loadingMessages)
                      ? "animate-spin"
                      : ""
                  }`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="mt-8 flex gap-2 border-b border-white/10 pb-px">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 select-none ${
                activeTab === "applications"
                  ? "bg-[#AD5CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Pending Applications</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "applications"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 select-none ${
                activeTab === "messages"
                  ? "bg-[#AD5CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "messages"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {messages.length}
              </span>
            </button>
          </div>
        </section>

        {/* Tab 1: Pending Applications */}
        {activeTab === "applications" && (
          <section className="space-y-4">
            {loadingApps ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#AD5CFF]" />
                <p className="mt-4 text-sm text-slate-300">Loading pending applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <IconBadge name="double-bracket-smile" variant="secondary" size="xl" className="mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-white font-ember">
                  No Pending Applications
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  All membership registrations have been reviewed. Check back later for new submissions.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 shadow-2xl backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-200">
                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      <tr>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Faculty & Year</th>
                        <th className="px-6 py-4">Submitted</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {applications.map((app) => (
                        <tr
                          key={app._id}
                          className="hover:bg-white/[0.02] transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-[#AD5CFF] shrink-0">
                                {app.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate">{app.fullName}</p>
                                <p className="text-xs text-slate-400 truncate">{app.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-300">
                            {app.studentId}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-slate-200">{app.faculty}</p>
                            <p className="text-[11px] text-slate-400">Year {app.year}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  setConfirmModal({
                                    open: true,
                                    type: "approve",
                                    application: app,
                                  })
                                }
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 h-8 rounded-lg gap-1.5 transition-all duration-150"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setConfirmModal({
                                    open: true,
                                    type: "reject",
                                    application: app,
                                  })
                                }
                                className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/60 text-xs px-3 py-1.5 h-8 rounded-lg gap-1.5 transition-all duration-150"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Messages */}
        {activeTab === "messages" && (
          <section className="space-y-4">
            {loadingMessages ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#AD5CFF]" />
                <p className="mt-4 text-sm text-slate-300">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <IconBadge name="speaker" variant="secondary" size="xl" className="mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-white font-ember">
                  No Messages Found
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Your contact form inbox is currently empty.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <article
                    key={msg._id}
                    className="rounded-2xl border border-white/10 bg-[#0c1220]/70 p-5 sm:p-6 backdrop-blur-md transition-all duration-200 hover:border-white/20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-white/5 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-white">{msg.name}</span>
                          <span className="text-xs text-slate-400">({msg.email})</span>
                        </div>
                        <h4 className="mt-1.5 text-sm font-medium text-[#AD5CFF]">
                          {msg.subject}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && confirmModal.application && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1220] p-6 shadow-2xl text-slate-100">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  confirmModal.type === "approve"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {confirmModal.type === "approve" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white font-ember">
                  {confirmModal.type === "approve"
                    ? "Approve Membership"
                    : "Reject Membership"}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Are you sure you want to{" "}
                  <strong className={confirmModal.type === "approve" ? "text-emerald-300" : "text-rose-300"}>
                    {confirmModal.type}
                  </strong>{" "}
                  the application for{" "}
                  <span className="text-white font-medium">
                    {confirmModal.application.fullName}
                  </span>{" "}
                  ({confirmModal.application.studentId})?
                </p>

                {confirmModal.type === "approve" && (
                  <p className="mt-2 text-xs text-slate-400 bg-white/5 rounded-lg p-2.5 border border-white/5">
                    This will grant active membership and immediately dispatch the official welcome email with community links.
                  </p>
                )}

                {confirmModal.type === "reject" && (
                  <p className="mt-2 text-xs text-rose-300/90 bg-rose-500/10 rounded-lg p-2.5 border border-rose-500/20">
                    This will mark the application as rejected. The record is preserved in history and login will be denied.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() =>
                  setConfirmModal({ open: false, type: "approve", application: null })
                }
                className="border-white/15 bg-transparent hover:bg-white/10 text-slate-300 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={isProcessing}
                onClick={handleConfirmAction}
                className={`font-semibold rounded-xl text-white ${
                  confirmModal.type === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-rose-600 hover:bg-rose-500"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : confirmModal.type === "approve"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
