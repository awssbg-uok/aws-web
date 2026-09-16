"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Check,
  X,
  Search,
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
  ShieldAlert,
  ShieldCheck,
  Users,
  Eye,
  Phone,
  MapPin,
  Linkedin,
  Github,
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
  role: "member" | "admin" | "owner";
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

interface RoleConfirmState {
  open: boolean;
  action: "promote" | "demote";
  user: ApplicationItem | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "owner" | null>(null);

  const [activeTab, setActiveTab] = useState<"applications" | "members" | "messages">("applications");
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [allMembers, setAllMembers] = useState<ApplicationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Bulk Approve State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  // Members tab filter & search
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "rejected" | "inactive">("all");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  // Owner-only registration toggle
  const [registrationOpen, setRegistrationOpen] = useState<boolean>(true);
  const [togglingRegistration, setTogglingRegistration] = useState(false);

  // Role promote/demote modal
  const [roleConfirm, setRoleConfirm] = useState<RoleConfirmState>({
    open: false,
    action: "promote",
    user: null,
  });

  // Single application modal
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    open: false,
    type: "approve",
    application: null,
  });
  const [viewingApp, setViewingApp] = useState<ApplicationItem | null>(null);
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
      if (parsedUser?.role !== "admin" && parsedUser?.role !== "owner") {
        router.push("/login");
        return;
      }
      setToken(storedToken);
      setCurrentUserRole(parsedUser.role);
      setIsAuthorized(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  // 2. Fetch Applications (Pending)
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

  // 2b. Fetch All Members
  const fetchAllMembers = useCallback(async (authToken: string) => {
    setLoadingMembers(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/all`,
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
        throw new Error("Failed to load members list");
      }

      const data = await res.json();
      setAllMembers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching members";
      toast.error(msg);
    } finally {
      setLoadingMembers(false);
    }
  }, [router]);

  // 2c. Fetch Registration Status
  const fetchRegistrationStatus = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/registration-status`);
      if (res.ok) {
        const data = await res.json();
        setRegistrationOpen(data.registrationOpen);
      }
    } catch {
      // ignore error
    }
  }, []);

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
      fetchAllMembers(token);
      fetchMessages(token);
      fetchRegistrationStatus();
    }
  }, [isAuthorized, token, fetchApplications, fetchAllMembers, fetchMessages, fetchRegistrationStatus]);

  // 4. Action Handler with Confirmation (Single Approve / Reject)
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
      // Refresh lists
      await fetchApplications(token);
      await fetchAllMembers(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to ${type} application`;
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Bulk Approve Handler
  const handleBulkApprove = async () => {
    if (!token || selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/bulk-approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: selectedIds }),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to bulk approve");

      if (result.succeeded > 0) {
        const estSec = Math.max(1, Math.round(result.succeeded * 0.6));
        const failMsg = result.failed > 0 ? ` (${result.failed} skipped/failed)` : "";
        toast.success(
          `${result.succeeded} application${result.succeeded === 1 ? "" : "s"} approved${failMsg}. Welcome emails are being sent in the background over the next ~${estSec} seconds.`,
          { duration: 6000 }
        );
      } else {
        toast.error(`No applications approved (${result.failed} skipped/failed).`);
      }

      setSelectedIds([]);
      setBulkConfirmOpen(false);
      await fetchApplications(token);
      await fetchAllMembers(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error during bulk approval";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. Role Promote/Demote Handler (Owner Only)
  const handleRoleChange = async () => {
    if (!token || !roleConfirm.user) return;
    setIsProcessing(true);
    const { action, user } = roleConfirm;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || `Failed to ${action} user`);

      toast.success(action === "promote" ? `${user.fullName} promoted to Admin` : `${user.fullName} demoted to Member`);
      setRoleConfirm({ open: false, action: "promote", user: null });
      await fetchAllMembers(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to ${action} user`;
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Toggle Registration (Owner Only)
  const handleToggleRegistration = async () => {
    if (!token || currentUserRole !== "owner") return;
    setTogglingRegistration(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/registration`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ open: !registrationOpen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update registration");
      setRegistrationOpen(data.registrationOpen);
      toast.success(`Registration is now ${data.registrationOpen ? "OPEN" : "CLOSED"}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating registration");
    } finally {
      setTogglingRegistration(false);
    }
  };

  // Client-side search and filtering for members
  const searchedMembers = useMemo(() => {
    const q = memberSearchQuery.trim().toLowerCase();
    if (!q) return allMembers;
    return allMembers.filter((m) => {
      const nameMatch = m.fullName?.toLowerCase().includes(q);
      const emailMatch = m.email?.toLowerCase().includes(q);
      const studentIdMatch = m.studentId?.toLowerCase().includes(q);
      return Boolean(nameMatch || emailMatch || studentIdMatch);
    });
  }, [allMembers, memberSearchQuery]);

  const filteredMembers = useMemo(() => {
    if (statusFilter === "all") return searchedMembers;
    return searchedMembers.filter((m) => m.membershipStatus === statusFilter);
  }, [searchedMembers, statusFilter]);

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
        <section className="mb-7 rounded-3xl border border-white/10 bg-[#0c1220]/80 p-4 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <IconBadge name="key" variant="primary" size="xs" />
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#AD5CFF]">
                  Admin Console {currentUserRole === "owner" && "• Owner Privileges"}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl font-ember">
                Admin Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Review pending membership applications, manage member roles, grant approvals with automatic welcome emails, and view community inquiries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Owner-Only Registration Status Switch */}
              {currentUserRole === "owner" && (
                <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Registration
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        registrationOpen ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {registrationOpen ? "OPEN" : "CLOSED"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    disabled={togglingRegistration}
                    onClick={handleToggleRegistration}
                    className={`text-xs h-7 px-2.5 font-bold rounded-lg ${
                      registrationOpen
                        ? "bg-rose-600 hover:bg-rose-500 text-white"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {registrationOpen ? "Close" : "Open"}
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (token) {
                    if (activeTab === "applications") fetchApplications(token);
                    else if (activeTab === "members") fetchAllMembers(token);
                    else fetchMessages(token);
                  }
                }}
                disabled={loadingApps || loadingMembers || loadingMessages}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs gap-2 rounded-xl transition-all duration-200 h-8 sm:h-9"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    (activeTab === "applications" ? loadingApps : activeTab === "members" ? loadingMembers : loadingMessages)
                      ? "animate-spin"
                      : ""
                  }`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 sm:flex sm:gap-2 border-b border-white/10 pb-px gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2.5 px-1.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-200 select-none sm:shrink-0 ${
                activeTab === "applications"
                  ? "bg-[#AD5CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <FileText className="hidden sm:inline-block sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">
                <span className="inline sm:hidden">Pending</span>
                <span className="hidden sm:inline">Pending Applications</span>
              </span>
              <span
                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  activeTab === "applications"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("members")}
              className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2.5 px-1.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-200 select-none sm:shrink-0 ${
                activeTab === "members"
                  ? "bg-[#AD5CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Users className="hidden sm:inline-block sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">Members</span>
              <span
                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  activeTab === "members"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {allMembers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2.5 px-1.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-200 select-none sm:shrink-0 ${
                activeTab === "messages"
                  ? "bg-[#AD5CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <MessageSquare className="hidden sm:inline-block sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">Messages</span>
              <span
                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 ${
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
                {/* Bulk Approve Action Bar */}
                <div className="p-3.5 px-4 sm:px-6 bg-white/[0.02] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      id="select-all-pending"
                      checked={applications.length > 0 && selectedIds.length === applications.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(applications.map((a) => a._id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-[#AD5CFF] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="select-all-pending" className="cursor-pointer select-none">
                      <span>{selectedIds.length} of {applications.length} selected</span>
                    </label>
                  </div>
                  <Button
                    size="sm"
                    disabled={selectedIds.length === 0}
                    onClick={() => setBulkConfirmOpen(true)}
                    className="bg-[#AD5CFF] hover:bg-[#9d4eed] disabled:opacity-40 text-white font-semibold text-xs px-3.5 py-1.5 h-8 rounded-lg gap-1.5 w-full sm:w-auto"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Bulk Approve Selected ({selectedIds.length})</span>
                  </Button>
                </div>

                {/* Mobile Cards View (< 768px) */}
                <div className="block md:hidden divide-y divide-white/5">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="p-4 space-y-3.5 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Top Row: Checkbox + Avatar + Name & Email */}
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app._id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, app._id]);
                            else setSelectedIds(selectedIds.filter((id) => id !== app._id));
                          }}
                          className="mt-1 rounded border-slate-700 bg-slate-900 text-[#AD5CFF] focus:ring-0 cursor-pointer shrink-0"
                        />
                        <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-[#AD5CFF] shrink-0">
                          {app.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white truncate text-sm">{app.fullName}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{app.email}</p>
                        </div>
                      </div>

                      {/* Middle Row: Badges for Student ID, Faculty/Year, Date */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {app.studentId}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {app.faculty} • Year {app.year}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-auto">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Bottom Action Bar: 3 buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingApp(app)}
                          className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs px-2 py-1.5 h-8 rounded-lg gap-1 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              type: "approve",
                              application: app,
                            })
                          }
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-2 py-1.5 h-8 rounded-lg gap-1 transition-all"
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
                          className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/60 text-xs px-2 py-1.5 h-8 rounded-lg gap-1 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (>= 768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-200">
                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      <tr>
                        <th className="px-4 py-4 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={applications.length > 0 && selectedIds.length === applications.length}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedIds(applications.map((a) => a._id));
                              else setSelectedIds([]);
                            }}
                            className="rounded border-slate-700 bg-slate-900 text-[#AD5CFF] focus:ring-0 cursor-pointer"
                          />
                        </th>
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
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(app._id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedIds([...selectedIds, app._id]);
                                else setSelectedIds(selectedIds.filter((id) => id !== app._id));
                              }}
                              className="rounded border-slate-700 bg-slate-900 text-[#AD5CFF] focus:ring-0 cursor-pointer"
                            />
                          </td>
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
                                variant="outline"
                                onClick={() => setViewingApp(app)}
                                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs px-2.5 py-1.5 h-8 rounded-lg gap-1.5 transition-all duration-150"
                                title="View application details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View</span>
                              </Button>

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

        {/* Tab 2: Members */}
        {activeTab === "members" && (
          <section className="space-y-4">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Search by name, email, or student ID..."
                className="h-10 w-full rounded-xl border border-white/10 bg-[#0c1220]/70 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 shadow-sm backdrop-blur-md transition-colors focus:border-[#AD5CFF] focus:outline-none focus:ring-1 focus:ring-[#AD5CFF]"
              />
              {memberSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMemberSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white">
                    <X className="h-3 w-3" />
                  </span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "pending", "active", "rejected", "inactive"] as const).map((filter) => {
                const count =
                  filter === "all"
                    ? searchedMembers.length
                    : searchedMembers.filter((m) => m.membershipStatus === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all select-none ${
                      statusFilter === filter
                        ? "bg-[#AD5CFF] text-white"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {filter} ({count})
                  </button>
                );
              })}
            </div>

            {loadingMembers ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#AD5CFF]" />
                <p className="mt-4 text-sm text-slate-300">Loading members list...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              memberSearchQuery.trim() ? (
                <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#AD5CFF]">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white font-ember">
                    No members match your search
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    No members found matching &ldquo;{memberSearchQuery}&rdquo;
                    {statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}.
                  </p>
                  <div className="mt-5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMemberSearchQuery("")}
                      className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs rounded-xl gap-2"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Clear Search</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                  <IconBadge name="teams" variant="secondary" size="xl" className="mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold text-white font-ember">
                    No Members Found
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    No members matched the &ldquo;{statusFilter}&rdquo; filter.
                  </p>
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 shadow-2xl backdrop-blur-md overflow-hidden">
                {/* Mobile Members Cards View (< 768px) */}
                <div className="block md:hidden divide-y divide-white/5">
                  {filteredMembers.map((member) => {
                    const statusColors: Record<string, string> = {
                      active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                      pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
                      rejected: "border-rose-500/30 bg-rose-500/10 text-rose-300",
                      inactive: "border-slate-500/30 bg-slate-500/10 text-slate-400",
                    };

                    const roleColors: Record<string, string> = {
                      owner: "border-amber-400/40 bg-amber-400/15 text-amber-300",
                      admin: "border-purple-400/40 bg-purple-500/15 text-purple-300",
                      member: "border-white/10 bg-white/5 text-slate-400",
                    };

                    return (
                      <div
                        key={member._id}
                        className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Top: Avatar + Name + Email */}
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-[#AD5CFF] shrink-0">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate text-sm">{member.fullName}</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{member.email}</p>
                          </div>
                        </div>

                        {/* Middle: Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            {member.studentId}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            {member.faculty} • Year {member.year}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                              statusColors[member.membershipStatus] || statusColors.inactive
                            }`}
                          >
                            {member.membershipStatus}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${
                              roleColors[member.role] || roleColors.member
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>

                        {/* Owner action if applicable */}
                        {currentUserRole === "owner" && (
                          <div className="pt-2 border-t border-white/5">
                            {member.role === "owner" ? (
                              <span className="text-xs text-slate-500 italic">Cannot modify</span>
                            ) : member.role === "admin" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setRoleConfirm({
                                    open: true,
                                    action: "demote",
                                    user: member,
                                  })
                                }
                                className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/60 text-xs px-3 py-1.5 h-8 rounded-lg transition-all"
                              >
                                Demote to Member
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setRoleConfirm({
                                    open: true,
                                    action: "promote",
                                    user: member,
                                  })
                                }
                                className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/60 text-xs px-3 py-1.5 h-8 rounded-lg transition-all"
                              >
                                Promote to Admin
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View (>= 768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-200">
                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      <tr>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Faculty & Year</th>
                        <th className="px-6 py-4">Membership Status</th>
                        <th className="px-6 py-4">Role</th>
                        {currentUserRole === "owner" && (
                          <th className="px-6 py-4 text-right">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredMembers.map((member) => {
                          const statusColors: Record<string, string> = {
                            active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                            pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
                            rejected: "border-rose-500/30 bg-rose-500/10 text-rose-300",
                            inactive: "border-slate-500/30 bg-slate-500/10 text-slate-400",
                          };

                          const roleColors: Record<string, string> = {
                            owner: "border-amber-400/40 bg-amber-400/15 text-amber-300",
                            admin: "border-purple-400/40 bg-purple-500/15 text-purple-300",
                            member: "border-white/10 bg-white/5 text-slate-400",
                          };

                          return (
                            <tr
                              key={member._id}
                              className="hover:bg-white/[0.02] transition-colors duration-150"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-[#AD5CFF] shrink-0">
                                    {member.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-white truncate">{member.fullName}</p>
                                    <p className="text-xs text-slate-400 truncate">{member.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-300">
                                {member.studentId}
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-xs text-slate-200">{member.faculty}</p>
                                <p className="text-[11px] text-slate-400">Year {member.year}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                                    statusColors[member.membershipStatus] || statusColors.inactive
                                  }`}
                                >
                                  {member.membershipStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${
                                    roleColors[member.role] || roleColors.member
                                  }`}
                                >
                                  {member.role}
                                </span>
                              </td>

                              {/* Owner-Only Actions Column */}
                              {currentUserRole === "owner" && (
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  {member.role === "owner" ? (
                                    <span className="text-xs text-slate-500 italic pr-2">Cannot modify</span>
                                  ) : member.role === "admin" ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setRoleConfirm({
                                          open: true,
                                          action: "demote",
                                          user: member,
                                        })
                                      }
                                      className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/60 text-xs px-3 py-1 h-7 rounded-lg transition-all"
                                    >
                                      Demote to Member
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setRoleConfirm({
                                          open: true,
                                          action: "promote",
                                          user: member,
                                        })
                                      }
                                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/60 text-xs px-3 py-1 h-7 rounded-lg transition-all"
                                    >
                                      Promote to Admin
                                    </Button>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Messages */}
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
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="font-semibold text-white text-sm sm:text-base">{msg.name}</span>
                          <span className="text-xs text-slate-400 break-all sm:break-normal">({msg.email})</span>
                        </div>
                        <h4 className="mt-1.5 text-sm font-medium text-[#AD5CFF]">
                          {msg.subject}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap self-start sm:self-auto shrink-0">
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

      {/* Detail-Review Modal for Pending Application */}
      <Dialog open={!!viewingApp} onOpenChange={(open) => !open && setViewingApp(null)}>
        {viewingApp && (
          <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-2xl max-h-[90vh] flex flex-col p-0 bg-[#0c1220]/95 border border-white/10 text-[#e2e8f0] backdrop-blur-2xl rounded-3xl z-[60] overflow-hidden shadow-2xl">
            {/* Accessible Dialog Title & Description */}
            <DialogHeader className="sr-only">
              <DialogTitle>Application Details - {viewingApp.fullName}</DialogTitle>
              <DialogDescription>
                Reviewing membership application for {viewingApp.fullName} ({viewingApp.studentId})
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Modal Content */}
            <div className="relative z-10 space-y-6 overflow-y-auto p-6 sm:p-8 overscroll-contain">
              {/* Header: Avatar, Name, Email, Student ID, Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#AD5CFF]/20 to-purple-900/30 border border-[#AD5CFF]/30 flex items-center justify-center text-xl font-bold text-[#AD5CFF] shrink-0 shadow-inner">
                    {viewingApp.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-ember">
                        {viewingApp.fullName}
                      </h2>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-semibold">
                        {viewingApp.studentId}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span>{viewingApp.email}</span>
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 self-start sm:self-auto">
                  <Calendar className="h-3.5 w-3.5 text-[#AD5CFF]" />
                  <span>Submitted {new Date(viewingApp.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
              </div>

              {/* Academic Info & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic Information */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <GraduationCap className="h-4 w-4 text-[#AD5CFF]" />
                    <span>Academic Information</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{viewingApp.faculty}</p>
                    <p className="text-xs text-slate-400">
                      Academic Standing: <span className="text-slate-200 font-semibold">Year {viewingApp.year}</span>
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Phone className="h-4 w-4 text-[#AD5CFF]" />
                    <span>Contact Details</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{viewingApp.contactNumber || "Not provided"}</p>
                    {viewingApp.address ? (
                      <p className="text-xs text-slate-400 flex items-start gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{viewingApp.address}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No address provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links (only if provided) */}
              {(viewingApp.linkedin || viewingApp.github) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Social & Developer Profiles
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {viewingApp.linkedin && (
                      <a
                        href={viewingApp.linkedin.startsWith("http") ? viewingApp.linkedin : `https://${viewingApp.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#AD5CFF]/15 border border-white/10 hover:border-[#AD5CFF]/40 text-xs text-slate-200 hover:text-white transition-all duration-150"
                      >
                        <Linkedin className="h-3.5 w-3.5 text-[#AD5CFF]" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                    {viewingApp.github && (
                      <a
                        href={viewingApp.github.startsWith("http") ? viewingApp.github : `https://${viewingApp.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs text-slate-200 hover:text-white transition-all duration-150"
                      >
                        <Github className="h-3.5 w-3.5 text-slate-300" />
                        <span>GitHub Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Statement of Interest */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Statement of Interest / Why Join
                </h4>
                <div className="max-h-48 overflow-y-auto rounded-2xl bg-white/[0.02] border border-white/10 p-4 text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                  {viewingApp.interests && viewingApp.interests.trim().length > 0 ? (
                    viewingApp.interests
                  ) : (
                    <span className="text-slate-500 italic">No statement of interest was provided.</span>
                  )}
                </div>
              </div>

              {/* In-Modal Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingApp(null)}
                  className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs px-4 py-2 h-9 rounded-xl"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const app = viewingApp;
                      setViewingApp(null);
                      setConfirmModal({
                        open: true,
                        type: "reject",
                        application: app,
                      });
                    }}
                    className="flex-1 sm:flex-initial border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/60 text-xs px-4 py-2 h-9 rounded-xl gap-1.5 transition-all duration-150"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      const app = viewingApp;
                      setViewingApp(null);
                      setConfirmModal({
                        open: true,
                        type: "approve",
                        application: app,
                      });
                    }}
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 transition-all duration-150"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Single Application Confirmation Modal */}
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

      {/* Bulk Approve Confirmation Modal */}
      {bulkConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1220] p-6 shadow-2xl text-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Check className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white font-ember">
                  Bulk Approve Applications
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Are you sure you want to approve{" "}
                  <strong className="text-emerald-300">
                    {selectedIds.length} application{selectedIds.length === 1 ? "" : "s"}
                  </strong>
                  ?
                </p>
                <div className="mt-3 text-xs text-slate-400 bg-white/5 rounded-lg p-3 border border-white/5 space-y-1">
                  <p>• Membership status will update to <strong>active</strong> for all valid pending records.</p>
                  <p>• The branded welcome email will be dispatched to each recipient.</p>
                  <p>• Any record not currently in pending status will be safely skipped.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() => setBulkConfirmOpen(false)}
                className="border-white/15 bg-transparent hover:bg-white/10 text-slate-300 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={isProcessing || selectedIds.length === 0}
                onClick={handleBulkApprove}
                className="bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl text-white"
              >
                {isProcessing
                  ? "Approving..."
                  : `Confirm Approval (${selectedIds.length})`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal (Owner Only) */}
      {roleConfirm.open && roleConfirm.user && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1220] p-6 shadow-2xl text-slate-100">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  roleConfirm.action === "promote"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {roleConfirm.action === "promote" ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <ShieldAlert className="h-5 w-5" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white font-ember">
                  {roleConfirm.action === "promote"
                    ? "Promote to Admin"
                    : "Demote to Member"}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Are you sure you want to{" "}
                  <strong
                    className={
                      roleConfirm.action === "promote"
                        ? "text-purple-300"
                        : "text-amber-300"
                    }
                  >
                    {roleConfirm.action}
                  </strong>{" "}
                  <span className="text-white font-medium">
                    {roleConfirm.user.fullName}
                  </span>{" "}
                  ({roleConfirm.user.studentId}) to{" "}
                  <strong>
                    {roleConfirm.action === "promote" ? "Admin" : "Member"}
                  </strong>
                  ?
                </p>

                <p className="mt-2 text-xs text-slate-400 bg-white/5 rounded-lg p-2.5 border border-white/5">
                  {roleConfirm.action === "promote"
                    ? "This grants the user full administrative access to review applications and manage community inquiries."
                    : "This revokes administrative access. The user will retain standard active member privileges."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() =>
                  setRoleConfirm({ open: false, action: "promote", user: null })
                }
                className="border-white/15 bg-transparent hover:bg-white/10 text-slate-300 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={isProcessing}
                onClick={handleRoleChange}
                className={`font-semibold rounded-xl text-white ${
                  roleConfirm.action === "promote"
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "bg-amber-600 hover:bg-amber-500"
                }`}
              >
                {isProcessing
                  ? "Updating Role..."
                  : roleConfirm.action === "promote"
                  ? "Confirm Promotion"
                  : "Confirm Demotion"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
