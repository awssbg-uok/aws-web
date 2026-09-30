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
  SlidersHorizontal,
  Filter,
  ArrowUpDown,
  UserMinus,
  UserCheck,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  ExternalLink,
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
  permissions?: string[];
  createdAt: string;
}

interface YearAuditMismatch {
  id?: string;
  name: string;
  studentId: string;
  storedYear: number;
  expectedYear: number;
}

interface YearAuditUnparseable {
  id?: string;
  name: string;
  studentId: string;
  storedYear: number;
  flag: string;
}

interface YearAuditReport {
  academicYearReference: number;
  summary: {
    totalAudited: number;
    mismatchCount: number;
    unparseableCount: number;
  };
  mismatches: YearAuditMismatch[];
  unparseable: YearAuditUnparseable[];
}

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface AdminTeamInterestItem {
  team: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  answers?: { question: string; answer: string }[];
  experience?: string;
}

interface AdminTeamApplicationItem {
  _id: string;
  applicantId: string;
  applicantSnapshot: {
    fullName: string;
    email: string;
    studentId: string;
    contactNumber?: string;
  };
  teamsInterested: (string | AdminTeamInterestItem)[];
  createdAt: string;
  updatedAt: string;
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

const TEAM_CONFIG_MAP: Record<string, { label: string; badgeClass: string }> = {
  tech: { label: "Technical", badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  pr: { label: "Public Relations", badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  hr: { label: "Human Resources", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  content: { label: "Content Creation", badgeClass: "bg-pink-500/10 text-pink-400 border-pink-500/30" },
  designing: { label: "Designing", badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
};

const EXPERIENCE_LEVEL_MAP: Record<string, { label: string; badgeClass: string }> = {
  beginner: { label: "Beginner", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  intermediate: { label: "Intermediate", badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  advanced: { label: "Advanced", badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "owner" | null>(null);
  const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"applications" | "members" | "messages" | "teams">("applications");
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [allMembers, setAllMembers] = useState<ApplicationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [teamApplications, setTeamApplications] = useState<AdminTeamApplicationItem[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingTeamApps, setLoadingTeamApps] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("all");
  const [teamRecruitmentOpen, setTeamRecruitmentOpen] = useState<boolean>(false);
  const [togglingRecruitment, setTogglingRecruitment] = useState(false);
  const [teamAppSearchQuery, setTeamAppSearchQuery] = useState("");
  const [viewingTeamApp, setViewingTeamApp] = useState<AdminTeamApplicationItem | null>(null);
  const [deleteTeamAppConfirm, setDeleteTeamAppConfirm] = useState<{
    open: boolean;
    app: AdminTeamApplicationItem | null;
    deleting: boolean;
  }>({
    open: false,
    app: null,
    deleting: false,
  });

  // Bulk Approve State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  // Members tab multi-select filters & search
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  // Owner-only permission toggle loading
  const [togglingPermissionId, setTogglingPermissionId] = useState<string | null>(null);

  // Bulk Deactivate state
  const [deactivateYearInput, setDeactivateYearInput] = useState<string>("2020");
  const [deactivatePreviewOpen, setDeactivatePreviewOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Bulk Activate state
  const [activatePreviewOpen, setActivatePreviewOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Year Audit state
  const [auditReport, setAuditReport] = useState<YearAuditReport | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditTab, setAuditTab] = useState<"mismatches" | "unparseable">("mismatches");
  const [auditSortField, setAuditSortField] = useState<"name" | "studentId" | "storedYear" | "expectedYear">("studentId");
  const [auditSortAsc, setAuditSortAsc] = useState(true);

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

  const hasMemberManagement = currentUserRole === "owner" || currentUserPermissions.includes("memberManagement");

  // 1. Auth Guard
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("post_login_redirect", "/admin");
      }
      router.push("/login?redirect=/admin");
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
      setCurrentUserPermissions(Array.isArray(parsedUser.permissions) ? parsedUser.permissions : []);
      setIsAuthorized(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("post_login_redirect", "/admin");
      }
      router.push("/login?redirect=/admin");
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

  // 2d. Fetch Team Recruitment Status
  const fetchTeamRecruitmentStatus = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/team-recruitment-status`);
      if (res.ok) {
        const data = await res.json();
        setTeamRecruitmentOpen(data.teamRecruitmentOpen);
      }
    } catch {
      // ignore error
    }
  }, []);

  // 2e. Fetch Team Applications
  const fetchTeamApplications = useCallback(async (authToken: string, teamFilter: string = "all") => {
    setLoadingTeamApps(true);
    try {
      const queryParam = teamFilter !== "all" ? `?team=${teamFilter}` : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/team-applications${queryParam}`,
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
        throw new Error("Failed to load team applications");
      }

      const data = await res.json();
      setTeamApplications(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching team applications";
      toast.error(msg);
    } finally {
      setLoadingTeamApps(false);
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
      fetchAllMembers(token);
      fetchMessages(token);
      fetchRegistrationStatus();
      fetchTeamRecruitmentStatus();
      fetchTeamApplications(token, "all");
    }
  }, [isAuthorized, token, fetchApplications, fetchAllMembers, fetchMessages, fetchRegistrationStatus, fetchTeamRecruitmentStatus, fetchTeamApplications]);

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

  // Delete Team Application (Owner Only)
  const handleDeleteTeamApp = async () => {
    if (!token || !deleteTeamAppConfirm.app) return;
    setDeleteTeamAppConfirm((prev) => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/team-applications/${deleteTeamAppConfirm.app._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete team application");
      }
      toast.success("Team application record deleted successfully");
      setTeamApplications((prev) =>
        prev.filter((item) => item._id !== deleteTeamAppConfirm.app?._id)
      );
      if (viewingTeamApp?._id === deleteTeamAppConfirm.app._id) {
        setViewingTeamApp(null);
      }
      setDeleteTeamAppConfirm({ open: false, app: null, deleting: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting record";
      toast.error(msg);
      setDeleteTeamAppConfirm((prev) => ({ ...prev, deleting: false }));
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

  // 7b. Toggle Team Recruitment (Owner Only)
  const handleToggleTeamRecruitment = async () => {
    if (!token || currentUserRole !== "owner") return;
    setTogglingRecruitment(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/team-recruitment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ open: !teamRecruitmentOpen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update team recruitment");
      setTeamRecruitmentOpen(data.teamRecruitmentOpen);
      toast.success(`Team Recruitment is now ${data.teamRecruitmentOpen ? "OPEN" : "CLOSED"}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating team recruitment");
    } finally {
      setTogglingRecruitment(false);
    }
  };

  // 8. Toggle Member Management Permission (Owner Only)
  const handleTogglePermission = async (user: ApplicationItem) => {
    if (!token || currentUserRole !== "owner") return;
    if (user.role !== "admin") return;

    const hasPerm = user.permissions?.includes("memberManagement");
    const action = hasPerm ? "revoke-permission" : "grant-permission";
    setTogglingPermissionId(user._id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permission: "memberManagement" }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || `Failed to ${hasPerm ? "revoke" : "grant"} permission`);

      toast.success(
        hasPerm
          ? `Revoked 'memberManagement' from ${user.fullName}`
          : `Granted 'memberManagement' to ${user.fullName}`
      );
      await fetchAllMembers(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating permission";
      toast.error(msg);
    } finally {
      setTogglingPermissionId(null);
    }
  };

  // 9. Bulk Deactivate by Intake Year Handler
  const handleConfirmBulkDeactivate = async () => {
    if (!token) return;
    const year = deactivateYearInput.trim();
    if (!/^\d{4}$/.test(year)) {
      toast.error("Please enter a valid 4-digit intake year");
      return;
    }

    setIsDeactivating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/bulk-deactivate-by-intake-year`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ intakeYear: parseInt(year, 10) }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to deactivate cohort");

      toast.success(data.message || `Successfully deactivated intake ${year}`);
      setDeactivatePreviewOpen(false);
      await fetchAllMembers(token);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error deactivating cohort");
    } finally {
      setIsDeactivating(false);
    }
  };

  // 10. Bulk Activate Inactive Handler
  const handleConfirmBulkActivate = async () => {
    if (!token) return;
    setIsActivating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/bulk-activate-inactive`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to activate inactive members");

      toast.success(data.message || "Successfully activated inactive members");
      setActivatePreviewOpen(false);
      await fetchAllMembers(token);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error activating members");
    } finally {
      setIsActivating(false);
    }
  };

  // 11. Run Academic Year Audit Handler
  const handleRunAudit = async () => {
    if (!token) return;
    setLoadingAudit(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/year-audit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to run year audit");
      }
      const data: YearAuditReport = await res.json();
      setAuditReport(data);
      toast.success(
        `Audit complete: ${data.summary.mismatchCount} mismatches, ${data.summary.unparseableCount} unparseable`
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error running audit");
    } finally {
      setLoadingAudit(false);
    }
  };

  // 12. Export Audit as CSV
  const handleExportAuditCSV = () => {
    if (!auditReport) return;

    const headers = ["Category", "Name", "Student ID", "Stored Year", "Expected Year", "Note / Flag"];
    const rows: string[][] = [];

    auditReport.mismatches.forEach((m) => {
      rows.push([
        "Mismatch",
        `"${(m.name || "").replace(/"/g, '""')}"`,
        `"${m.studentId}"`,
        String(m.storedYear),
        String(m.expectedYear),
        `Diff: ${m.storedYear - m.expectedYear}`,
      ]);
    });

    auditReport.unparseable.forEach((u) => {
      rows.push([
        "Unparseable",
        `"${(u.name || "").replace(/"/g, '""')}"`,
        `"${u.studentId}"`,
        String(u.storedYear),
        "N/A",
        `"${u.flag}"`,
      ]);
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `academic_year_audit_${auditReport.academicYearReference || 2025}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Academic year audit exported as CSV");
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

  // Derived available faculties and academic years
  const availableFaculties = useMemo(() => {
    const set = new Set<string>();
    allMembers.forEach((m) => {
      if (m.faculty) set.add(m.faculty.trim());
    });
    return Array.from(set).sort();
  }, [allMembers]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    allMembers.forEach((m) => {
      if (typeof m.year === "number") set.add(m.year);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [allMembers]);

  // Multi-select filters combined with AND between categories and OR within category
  const filteredMembers = useMemo(() => {
    return searchedMembers.filter((m) => {
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(m.membershipStatus);
      const matchesFaculty =
        selectedFaculties.length === 0 || selectedFaculties.includes(m.faculty);
      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(m.year);

      return matchesStatus && matchesFaculty && matchesYear;
    });
  }, [searchedMembers, selectedStatuses, selectedFaculties, selectedYears]);

  // Previews for bulk actions
  const deactivatePreviewList = useMemo(() => {
    const year = deactivateYearInput.trim();
    if (!/^\d{4}$/.test(year)) return [];
    const regex = new RegExp(`(?:/${year}/|-${year}-)`);
    return allMembers.filter(
      (m) =>
        regex.test(m.studentId) &&
        m.role !== "admin" &&
        m.role !== "owner"
    );
  }, [allMembers, deactivateYearInput]);

  const activatePreviewList = useMemo(() => {
    return allMembers.filter(
      (m) =>
        m.membershipStatus === "inactive" &&
        m.year < 5 &&
        m.role !== "admin" &&
        m.role !== "owner"
    );
  }, [allMembers]);

  // Sorted year audit lists
  const sortedMismatches = useMemo(() => {
    if (!auditReport?.mismatches) return [];
    return [...auditReport.mismatches].sort((a, b) => {
      let valA: string | number = a[auditSortField] ?? "";
      let valB: string | number = b[auditSortField] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return auditSortAsc ? -1 : 1;
      if (valA > valB) return auditSortAsc ? 1 : -1;
      return 0;
    });
  }, [auditReport, auditSortField, auditSortAsc]);

  const sortedUnparseable = useMemo(() => {
    if (!auditReport?.unparseable) return [];
    return [...auditReport.unparseable].sort((a, b) => {
      const valA = (a.studentId || "").toLowerCase();
      const valB = (b.studentId || "").toLowerCase();
      if (valA < valB) return auditSortAsc ? -1 : 1;
      if (valA > valB) return auditSortAsc ? 1 : -1;
      return 0;
    });
  }, [auditReport, auditSortAsc]);

  // Filtered and searched team applications
  const filteredTeamApps = useMemo(() => {
    let list = teamApplications;
    const q = teamAppSearchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((app) => {
        const name = app.applicantSnapshot?.fullName?.toLowerCase() || "";
        const email = app.applicantSnapshot?.email?.toLowerCase() || "";
        const sid = app.applicantSnapshot?.studentId?.toLowerCase() || "";
        return name.includes(q) || email.includes(q) || sid.includes(q);
      });
    }
    return list;
  }, [teamApplications, teamAppSearchQuery]);

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

              {/* Owner-Only Team Recruitment Status Switch */}
              {currentUserRole === "owner" && (
                <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Team Recruitment
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        teamRecruitmentOpen ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {teamRecruitmentOpen ? "OPEN" : "CLOSED"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    disabled={togglingRecruitment}
                    onClick={handleToggleTeamRecruitment}
                    className={`text-xs h-7 px-2.5 font-bold rounded-lg ${
                      teamRecruitmentOpen
                        ? "bg-rose-600 hover:bg-rose-500 text-white"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {teamRecruitmentOpen ? "Close" : "Open"}
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
                    else if (activeTab === "messages") fetchMessages(token);
                    else fetchTeamApplications(token, selectedTeamFilter);
                  }
                }}
                disabled={loadingApps || loadingMembers || loadingMessages || loadingTeamApps}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs gap-2 rounded-xl transition-all duration-200 h-8 sm:h-9"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    (activeTab === "applications"
                      ? loadingApps
                      : activeTab === "members"
                      ? loadingMembers
                      : activeTab === "messages"
                      ? loadingMessages
                      : loadingTeamApps)
                      ? "animate-spin"
                      : ""
                  }`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="mt-6 sm:mt-8 grid grid-cols-4 sm:flex sm:gap-2 border-b border-white/10 pb-px gap-1 sm:gap-2">
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

            <button
              onClick={() => {
                setActiveTab("teams");
                if (token) fetchTeamApplications(token, selectedTeamFilter);
              }}
              className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2.5 px-1.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-200 select-none sm:shrink-0 ${
                activeTab === "teams"
                  ? "bg-[#AD5CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Users className="hidden sm:inline-block sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">
                <span className="inline sm:hidden">Teams</span>
                <span className="hidden sm:inline">Team Applications</span>
              </span>
              <span
                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  activeTab === "teams"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {teamApplications.length}
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
          <section className="space-y-6">
            {/* Gated Member Management Section */}
            {hasMemberManagement && (
              <div className="rounded-3xl border border-[#AD5CFF]/30 bg-[#0c1220]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(173,92,255,0.12),transparent_70%)] pointer-events-none" />

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#AD5CFF]/20 text-[#D8B4FE] border border-[#AD5CFF]/40">
                        {currentUserRole === "owner" ? "Owner Operations" : "Member Management"}
                      </span>
                      <span className="text-xs text-slate-400">Privileged Administration</span>
                    </div>
                    <h2 className="mt-1 text-lg sm:text-xl font-bold text-white font-ember flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-[#AD5CFF]" />
                      Academic Cohort & Member Management
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      Intake graduation lifecycle management, bulk status transitions, and formula-based academic year discrepancy audits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={handleRunAudit}
                      disabled={loadingAudit}
                      className="bg-[#AD5CFF] hover:bg-[#9b45f4] text-white font-semibold text-xs rounded-xl gap-1.5 h-9 px-3.5 shadow-md shadow-[#AD5CFF]/20 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? "animate-spin" : ""}`} />
                      <span>{loadingAudit ? "Auditing..." : "Run Year Audit"}</span>
                    </Button>
                  </div>
                </div>

                {/* Operations Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {/* Tool 1: Bulk Deactivate by Intake Year */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                          <UserMinus className="w-4 h-4 text-rose-400" />
                          <span>Bulk Deactivate by Intake Year</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          Graduation
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Matches student IDs containing <code className="text-slate-300 font-mono">/&lt;year&gt;/</code> or <code className="text-slate-300 font-mono">-&lt;year&gt;-</code>. Sets status to <strong className="text-slate-200">inactive</strong> and academic year to <strong className="text-slate-200">5</strong>. Admins and owners are protected.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="relative flex-1 sm:max-w-[140px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-mono text-slate-400">Intake</span>
                        <input
                          type="text"
                          maxLength={4}
                          value={deactivateYearInput}
                          onChange={(e) => setDeactivateYearInput(e.target.value.replace(/\D/g, ""))}
                          placeholder="2020"
                          className="w-full h-9 pl-14 pr-3 text-xs font-mono rounded-xl border border-white/15 bg-white/5 text-white focus:border-[#AD5CFF] focus:outline-none"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setDeactivatePreviewOpen(true)}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs rounded-xl gap-1.5 h-9"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Preview & Deactivate ({deactivatePreviewList.length})</span>
                      </Button>
                    </div>
                  </div>

                  {/* Tool 2: Bulk Activate Inactive */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>Bulk Activate Inactive Members</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Reactivation
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Reactivates all currently inactive members where academic year &lt; 5. Excludes graduated cohorts (Year 5+) and admins/owners to keep graduation deactivations intact.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => setActivatePreviewOpen(true)}
                        className="w-full sm:w-auto bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs rounded-xl gap-1.5 h-9"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Preview & Activate ({activatePreviewList.length})</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tool 3: Year Audit Report Panel */}
                {auditReport && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-6 space-y-4 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-[#AD5CFF]" />
                          <h3 className="font-bold text-white text-sm sm:text-base font-ember">
                            Academic Year Audit Report
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Formula: <code className="text-[#D8B4FE] font-mono">Expected Year = {auditReport.academicYearReference} - Intake Year</code> (Reference: {auditReport.academicYearReference})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleExportAuditCSV}
                          className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-xs rounded-xl gap-1.5 h-8"
                        >
                          <Download className="w-3.5 h-3.5 text-[#AD5CFF]" />
                          <span>Export CSV</span>
                        </Button>
                      </div>
                    </div>

                    {/* Audit Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="text-[11px] text-slate-400 font-medium">Reference Year</p>
                        <p className="text-lg font-bold text-white font-mono">{auditReport.academicYearReference}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="text-[11px] text-slate-400 font-medium">Total Audited</p>
                        <p className="text-lg font-bold text-white font-mono">{auditReport.summary.totalAudited}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-[11px] text-amber-300 font-medium">Year Mismatches</p>
                        <p className="text-lg font-bold text-amber-400 font-mono">{auditReport.summary.mismatchCount}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <p className="text-[11px] text-rose-300 font-medium">Unparseable Format</p>
                        <p className="text-lg font-bold text-rose-400 font-mono">{auditReport.summary.unparseableCount}</p>
                      </div>
                    </div>

                    {/* Sub-tab Switcher: Mismatches vs Unparseable */}
                    <div className="flex items-center gap-2 pt-1 border-b border-white/10">
                      <button
                        type="button"
                        onClick={() => setAuditTab("mismatches")}
                        className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                          auditTab === "mismatches"
                            ? "border-[#AD5CFF] text-[#D8B4FE]"
                            : "border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>Year Discrepancies</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {auditReport.summary.mismatchCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAuditTab("unparseable")}
                        className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                          auditTab === "unparseable"
                            ? "border-[#AD5CFF] text-[#D8B4FE]"
                            : "border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>Unparseable Format</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {auditReport.summary.unparseableCount}
                        </span>
                      </button>
                    </div>

                    {/* Audit Sub-view 1: Mismatches Table */}
                    {auditTab === "mismatches" && (
                      <div className="space-y-2">
                        {sortedMismatches.length === 0 ? (
                          <p className="text-xs text-slate-400 py-4 text-center">Zero academic year mismatches found! All student records align with the reference formula.</p>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-left text-xs text-slate-200">
                              <thead className="bg-white/5 uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
                                <tr>
                                  <th
                                    className="px-4 py-3 cursor-pointer hover:text-white select-none"
                                    onClick={() => {
                                      if (auditSortField === "name") setAuditSortAsc(!auditSortAsc);
                                      else { setAuditSortField("name"); setAuditSortAsc(true); }
                                    }}
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>Member Name</span>
                                      <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                  </th>
                                  <th
                                    className="px-4 py-3 cursor-pointer hover:text-white select-none"
                                    onClick={() => {
                                      if (auditSortField === "studentId") setAuditSortAsc(!auditSortAsc);
                                      else { setAuditSortField("studentId"); setAuditSortAsc(true); }
                                    }}
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>Student ID</span>
                                      <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                  </th>
                                  <th
                                    className="px-4 py-3 cursor-pointer hover:text-white select-none text-center"
                                    onClick={() => {
                                      if (auditSortField === "storedYear") setAuditSortAsc(!auditSortAsc);
                                      else { setAuditSortField("storedYear"); setAuditSortAsc(true); }
                                    }}
                                  >
                                    <div className="flex items-center justify-center gap-1">
                                      <span>Stored Year</span>
                                      <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                  </th>
                                  <th
                                    className="px-4 py-3 cursor-pointer hover:text-white select-none text-center"
                                    onClick={() => {
                                      if (auditSortField === "expectedYear") setAuditSortAsc(!auditSortAsc);
                                      else { setAuditSortField("expectedYear"); setAuditSortAsc(true); }
                                    }}
                                  >
                                    <div className="flex items-center justify-center gap-1">
                                      <span>Expected Year</span>
                                      <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                  </th>
                                  <th className="px-4 py-3 text-right">Discrepancy</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-900/40">
                                {sortedMismatches.map((item, idx) => (
                                  <tr key={item.id || idx} className="hover:bg-white/[0.03]">
                                    <td className="px-4 py-2.5 font-medium text-white">{item.name}</td>
                                    <td className="px-4 py-2.5 font-mono text-slate-300">{item.studentId}</td>
                                    <td className="px-4 py-2.5 text-center font-mono text-amber-300 font-bold">Year {item.storedYear}</td>
                                    <td className="px-4 py-2.5 text-center font-mono text-emerald-300 font-bold">Year {item.expectedYear}</td>
                                    <td className="px-4 py-2.5 text-right font-mono text-slate-400">
                                      {item.storedYear > item.expectedYear
                                        ? `+${item.storedYear - item.expectedYear} yr ahead`
                                        : `${item.storedYear - item.expectedYear} yr behind`}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audit Sub-view 2: Unparseable Table */}
                    {auditTab === "unparseable" && (
                      <div className="space-y-2">
                        {sortedUnparseable.length === 0 ? (
                          <p className="text-xs text-slate-400 py-4 text-center">No unparseable student IDs! All records match either slash or dash year syntax.</p>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-left text-xs text-slate-200">
                              <thead className="bg-white/5 uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
                                <tr>
                                  <th className="px-4 py-3">Member Name</th>
                                  <th className="px-4 py-3">Student ID</th>
                                  <th className="px-4 py-3 text-center">Stored Year</th>
                                  <th className="px-4 py-3 text-right">Flag</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-900/40">
                                {sortedUnparseable.map((item, idx) => (
                                  <tr key={item.id || idx} className="hover:bg-white/[0.03]">
                                    <td className="px-4 py-2.5 font-medium text-white">{item.name}</td>
                                    <td className="px-4 py-2.5 font-mono text-rose-300">{item.studentId || "Empty ID"}</td>
                                    <td className="px-4 py-2.5 text-center font-mono text-slate-300">Year {item.storedYear}</td>
                                    <td className="px-4 py-2.5 text-right">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                                        {item.flag || "unparseable format"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Search Box & Multi-Select Filters */}
            <div className="space-y-3">
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

              {/* Multi-Select Filters Panel */}
              <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0c1220]/80 shadow-md backdrop-blur-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Filter className="w-3.5 h-3.5 text-[#AD5CFF]" />
                    <span>Multi-Select Filters (AND across categories, OR within)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      Showing <strong className="text-white">{filteredMembers.length}</strong> of {allMembers.length} members
                    </span>
                    {(selectedStatuses.length > 0 || selectedFaculties.length > 0 || selectedYears.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStatuses([]);
                          setSelectedFaculties([]);
                          setSelectedYears([]);
                        }}
                        className="text-xs text-[#AD5CFF] hover:text-[#D8B4FE] hover:underline flex items-center gap-1 font-medium"
                      >
                        <X className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category 1: Status */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Membership Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["active", "pending", "inactive", "rejected"] as const).map((st) => {
                        const isSelected = selectedStatuses.includes(st);
                        const count = allMembers.filter((m) => m.membershipStatus === st).length;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              setSelectedStatuses((prev) =>
                                isSelected ? prev.filter((s) => s !== st) : [...prev, st]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border capitalize transition-all flex items-center gap-1.5 select-none ${
                              isSelected
                                ? "bg-[#AD5CFF] text-white border-[#AD5CFF] shadow-sm"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${
                                isSelected ? "bg-white border-white text-[#AD5CFF]" : "border-slate-500 bg-transparent"
                              }`}
                            >
                              {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                            </div>
                            <span>{st}</span>
                            <span className={`text-[10px] px-1 rounded-full ${isSelected ? "bg-white/20 text-white" : "text-slate-400"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 2: Faculty */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Faculty
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {availableFaculties.map((fac) => {
                        const isSelected = selectedFaculties.includes(fac);
                        const count = allMembers.filter((m) => m.faculty === fac).length;
                        const shortName = fac.replace(/^Faculty of\s+/i, "");
                        return (
                          <button
                            key={fac}
                            type="button"
                            onClick={() => {
                              setSelectedFaculties((prev) =>
                                isSelected ? prev.filter((f) => f !== fac) : [...prev, fac]
                              );
                            }}
                            title={fac}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 select-none ${
                              isSelected
                                ? "bg-[#AD5CFF] text-white border-[#AD5CFF] shadow-sm"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${
                                isSelected ? "bg-white border-white text-[#AD5CFF]" : "border-slate-500 bg-transparent"
                              }`}
                            >
                              {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                            </div>
                            <span className="truncate max-w-[130px]">{shortName}</span>
                            <span className={`text-[10px] px-1 rounded-full ${isSelected ? "bg-white/20 text-white" : "text-slate-400"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 3: Academic Year */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Academic Year
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableYears.map((yr) => {
                        const isSelected = selectedYears.includes(yr);
                        const count = allMembers.filter((m) => m.year === yr).length;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setSelectedYears((prev) =>
                                isSelected ? prev.filter((y) => y !== yr) : [...prev, yr]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 select-none ${
                              isSelected
                                ? "bg-[#AD5CFF] text-white border-[#AD5CFF] shadow-sm"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${
                                isSelected ? "bg-white border-white text-[#AD5CFF]" : "border-slate-500 bg-transparent"
                              }`}
                            >
                              {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                            </div>
                            <span>Year {yr}</span>
                            <span className={`text-[10px] px-1 rounded-full ${isSelected ? "bg-white/20 text-white" : "text-slate-400"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loadingMembers ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#AD5CFF]" />
                <p className="mt-4 text-sm text-slate-300">Loading members list...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#AD5CFF]">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white font-ember">
                  No members match your criteria
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Try adjusting or clearing your search keywords and multi-select filters.
                </p>
                <div className="mt-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMemberSearchQuery("");
                      setSelectedStatuses([]);
                      setSelectedFaculties([]);
                      setSelectedYears([]);
                    }}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs rounded-xl gap-2"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Clear All Filters</span>
                  </Button>
                </div>
              </div>
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
                          {member.role === "admin" && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                member.permissions?.includes("memberManagement")
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  : "bg-white/5 text-slate-400 border-white/10"
                              }`}
                            >
                              Mgmt: {member.permissions?.includes("memberManagement") ? "Enabled" : "Disabled"}
                            </span>
                          )}
                        </div>

                        {/* Owner action if applicable */}
                        {currentUserRole === "owner" && (
                          <div className="pt-2 border-t border-white/5 space-y-2">
                            {member.role === "owner" ? (
                              <span className="text-xs text-slate-500 italic">Cannot modify</span>
                            ) : member.role === "admin" ? (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={togglingPermissionId === member._id}
                                  onClick={() => handleTogglePermission(member)}
                                  className={`w-full text-xs px-3 py-1.5 h-8 rounded-lg transition-all border flex items-center justify-center gap-1.5 ${
                                    member.permissions?.includes("memberManagement")
                                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                      : "border-slate-700 bg-white/5 text-slate-300 hover:bg-white/10"
                                  }`}
                                >
                                  {togglingPermissionId === member._id ? (
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                  )}
                                  <span>
                                    {member.permissions?.includes("memberManagement")
                                      ? "Revoke Member Mgmt"
                                      : "Grant Member Mgmt"}
                                  </span>
                                </Button>
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
                              </div>
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
                        <th className="px-6 py-4">Role & Perms</th>
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
                                <div className="flex flex-col gap-1 items-start">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${
                                      roleColors[member.role] || roleColors.member
                                    }`}
                                  >
                                    {member.role}
                                  </span>
                                  {member.role === "admin" && (
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                        member.permissions?.includes("memberManagement")
                                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                          : "bg-white/5 text-slate-400 border-white/10"
                                      }`}
                                    >
                                      Mgmt: {member.permissions?.includes("memberManagement") ? "Enabled" : "Disabled"}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Owner-Only Actions Column */}
                              {currentUserRole === "owner" && (
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  {member.role === "owner" ? (
                                    <span className="text-xs text-slate-500 italic pr-2">Cannot modify</span>
                                  ) : member.role === "admin" ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={togglingPermissionId === member._id}
                                        onClick={() => handleTogglePermission(member)}
                                        className={`border text-xs px-2.5 py-1 h-7 rounded-lg transition-all flex items-center gap-1.5 ${
                                          member.permissions?.includes("memberManagement")
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50"
                                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                                        }`}
                                        title={
                                          member.permissions?.includes("memberManagement")
                                            ? "Click to revoke Member Management permission"
                                            : "Click to grant Member Management permission"
                                        }
                                      >
                                        {togglingPermissionId === member._id ? (
                                          <RefreshCw className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <ShieldCheck className="h-3 w-3" />
                                        )}
                                        <span>
                                          {member.permissions?.includes("memberManagement")
                                            ? "Revoke Mgmt"
                                            : "Grant Mgmt"}
                                        </span>
                                      </Button>
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
                                        Demote
                                      </Button>
                                    </div>
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

        {/* Tab 4: Team Applications */}
        {activeTab === "teams" && (
          <section className="space-y-5">
            {/* Filter and Search Bar */}
            <div className="rounded-2xl border border-white/10 bg-[#0c1220]/70 p-4 sm:p-5 backdrop-blur-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={teamAppSearchQuery}
                    onChange={(e) => setTeamAppSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or student ID..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#AD5CFF] focus:ring-1 focus:ring-[#AD5CFF] transition-all"
                  />
                  {teamAppSearchQuery && (
                    <button
                      onClick={() => setTeamAppSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Counter Badge */}
                <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-300">
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-medium">
                    Showing <strong className="text-white">{filteredTeamApps.length}</strong> applicant{filteredTeamApps.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              {/* Team Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter Team:
                </span>
                {[
                  { id: "all", label: "All Teams" },
                  { id: "tech", label: "Technical" },
                  { id: "pr", label: "PR" },
                  { id: "hr", label: "HR" },
                  { id: "content", label: "Content" },
                  { id: "designing", label: "Designing" },
                ].map((pill) => {
                  const isActive = selectedTeamFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => {
                        setSelectedTeamFilter(pill.id);
                        if (token) fetchTeamApplications(token, pill.id);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#AD5CFF] text-white shadow-lg shadow-purple-900/30"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Content */}
            {loadingTeamApps ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#AD5CFF]" />
                <p className="mt-4 text-sm text-slate-300">Loading team applications...</p>
              </div>
            ) : filteredTeamApps.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#0c1220]/70 p-12 text-center">
                <IconBadge name="teams" variant="secondary" size="xl" className="mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-white font-ember">
                  No Team Applications Found
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {teamAppSearchQuery || selectedTeamFilter !== "all"
                    ? "Try adjusting your search query or team filter."
                    : "No members have applied to join a core team yet."}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#0c1220]/70 backdrop-blur-md overflow-hidden shadow-xl">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-white/[0.03] text-xs uppercase font-semibold text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Teams Interested</th>
                        <th className="px-6 py-4">Applied Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {filteredTeamApps.map((item) => (
                        <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#AD5CFF]/20 to-purple-900/30 border border-[#AD5CFF]/30 flex items-center justify-center text-sm font-bold text-[#AD5CFF] shrink-0">
                                {(item.applicantSnapshot?.fullName || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {item.applicantSnapshot?.fullName || "Unknown Member"}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                  {item.applicantSnapshot?.studentId || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{item.applicantSnapshot?.email || "N/A"}</span>
                              </div>
                              {item.applicantSnapshot?.contactNumber && (
                                <a
                                  href={`https://wa.me/${item.applicantSnapshot.contactNumber.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
                                  title="Chat / Add on WhatsApp"
                                >
                                  <Phone className="h-3 w-3 shrink-0" />
                                  <span>{item.applicantSnapshot.contactNumber}</span>
                                  <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {item.teamsInterested?.map((interest, idx) => {
                                const teamKey = typeof interest === "string" ? interest : interest?.team;
                                const expLevel = typeof interest === "object" ? interest?.experienceLevel : undefined;
                                const experience = typeof interest === "object" ? interest?.experience : "";
                                const conf = TEAM_CONFIG_MAP[teamKey] || {
                                  label: teamKey,
                                  badgeClass: "bg-white/10 text-slate-300 border-white/10",
                                };
                                const levelConf = expLevel ? EXPERIENCE_LEVEL_MAP[expLevel] : null;

                                return (
                                  <div key={idx} className="inline-flex items-center gap-1.5 bg-white/[0.02] px-2 py-1 rounded-xl border border-white/5">
                                    <span
                                      title={experience ? `Experience: ${experience}` : undefined}
                                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${conf.badgeClass}`}
                                    >
                                      {conf.label}
                                    </span>
                                    {levelConf && (
                                      <span
                                        className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold border uppercase tracking-wider ${levelConf.badgeClass}`}
                                      >
                                        {levelConf.label}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>
                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setViewingTeamApp(item)}
                                className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 gap-1.5 text-xs rounded-xl"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#AD5CFF]" />
                                <span>View Details</span>
                              </Button>
                              {currentUserRole === "owner" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeleteTeamAppConfirm({ open: true, app: item, deleting: false })}
                                  className="h-8 border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 gap-1.5 text-xs rounded-xl transition-colors"
                                  title="Delete application record (Owner only)"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  <span>Delete</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-white/10">
                  {filteredTeamApps.map((item) => (
                    <div key={item._id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#AD5CFF]/20 to-purple-900/30 border border-[#AD5CFF]/30 flex items-center justify-center text-sm font-bold text-[#AD5CFF] shrink-0">
                            {(item.applicantSnapshot?.fullName || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">
                              {item.applicantSnapshot?.fullName || "Unknown Member"}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {item.applicantSnapshot?.studentId || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-slate-300 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.applicantSnapshot?.email || "N/A"}</span>
                        </div>
                        {item.applicantSnapshot?.contactNumber && (
                          <a
                            href={`https://wa.me/${item.applicantSnapshot.contactNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
                            title="Chat / Add on WhatsApp"
                          >
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{item.applicantSnapshot.contactNumber}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                          </a>
                        )}
                      </div>

                      <div className="pt-1">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Teams:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.teamsInterested?.map((interest, idx) => {
                            const teamKey = typeof interest === "string" ? interest : interest?.team;
                            const expLevel = typeof interest === "object" ? interest?.experienceLevel : undefined;
                            const experience = typeof interest === "object" ? interest?.experience : "";
                            const conf = TEAM_CONFIG_MAP[teamKey] || {
                              label: teamKey,
                              badgeClass: "bg-white/10 text-slate-300 border-white/10",
                            };
                            const levelConf = expLevel ? EXPERIENCE_LEVEL_MAP[expLevel] : null;

                            return (
                              <div key={idx} className="inline-flex items-center gap-1.5 bg-white/[0.02] px-2 py-1 rounded-xl border border-white/5">
                                <span
                                  title={experience ? `Experience: ${experience}` : undefined}
                                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${conf.badgeClass}`}
                                >
                                  {conf.label}
                                </span>
                                {levelConf && (
                                  <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold border uppercase tracking-wider ${levelConf.badgeClass}`}
                                  >
                                    {levelConf.label}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingTeamApp(item)}
                          className="h-7 border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 gap-1.5 text-[11px] rounded-lg"
                        >
                          <Eye className="w-3 h-3 text-[#AD5CFF]" />
                          <span>View Details</span>
                        </Button>
                        {currentUserRole === "owner" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteTeamAppConfirm({ open: true, app: item, deleting: false })}
                            className="h-7 border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 gap-1.5 text-[11px] rounded-lg transition-colors"
                            title="Delete application record (Owner only)"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                            <span>Delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Detail-Review Modal for Team Application */}
      <Dialog open={!!viewingTeamApp} onOpenChange={(open) => !open && setViewingTeamApp(null)}>
        {viewingTeamApp && (
          <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-2xl max-h-[90vh] flex flex-col p-0 bg-[#0c1220]/95 border border-purple-500/30 text-[#e2e8f0] backdrop-blur-2xl rounded-3xl z-[60] overflow-hidden shadow-2xl">
            <DialogHeader className="p-6 border-b border-white/10 text-left">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#AD5CFF]/20 to-purple-900/30 border border-[#AD5CFF]/30 flex items-center justify-center text-lg font-bold text-[#AD5CFF] shrink-0">
                  {(viewingTeamApp.applicantSnapshot?.fullName || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-xl font-extrabold text-white font-ember">
                    {viewingTeamApp.applicantSnapshot?.fullName || "Applicant"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                    <span>{viewingTeamApp.applicantSnapshot?.studentId}</span>
                    <span>&bull;</span>
                    <span>{viewingTeamApp.applicantSnapshot?.email}</span>
                    {viewingTeamApp.applicantSnapshot?.contactNumber && (
                      <>
                        <span>&bull;</span>
                        <a
                          href={`https://wa.me/${viewingTeamApp.applicantSnapshot.contactNumber.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{viewingTeamApp.applicantSnapshot.contactNumber}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 overscroll-contain">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Teams Applied &bull; Responses
              </div>
              {viewingTeamApp.teamsInterested?.map((interest, idx) => {
                const teamKey = typeof interest === "string" ? interest : interest?.team;
                const expLevel = typeof interest === "object" ? interest?.experienceLevel : undefined;
                const answers = typeof interest === "object" && Array.isArray(interest?.answers) ? interest.answers : [];
                const legacyExp = typeof interest === "object" ? interest?.experience : "";
                const conf = TEAM_CONFIG_MAP[teamKey] || { label: teamKey, badgeClass: "bg-white/10 text-slate-300 border-white/10" };
                const levelConf = expLevel ? EXPERIENCE_LEVEL_MAP[expLevel] : null;

                return (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${conf.badgeClass}`}>
                        {conf.label}
                      </span>
                      {levelConf && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${levelConf.badgeClass}`}>
                          Experience: {levelConf.label}
                        </span>
                      )}
                    </div>

                    {answers.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        {answers.map((ans, aIdx) => (
                          <div key={aIdx} className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                            {ans.question && (
                              <div className="text-xs font-semibold text-[#AD5CFF]">{ans.question}</div>
                            )}
                            <div className="text-xs text-slate-300 leading-relaxed">&ldquo;{ans.answer}&rdquo;</div>
                          </div>
                        ))}
                      </div>
                    ) : legacyExp ? (
                      <div className="pt-2 border-t border-white/5 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                        <div className="text-xs font-semibold text-purple-400 mb-1">Experience:</div>
                        <div className="text-xs text-slate-300 leading-relaxed">&ldquo;{legacyExp}&rdquo;</div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic pt-1 border-t border-white/5">No additional answers provided.</div>
                    )}
                  </div>
                );
              })}
            </div>

            {currentUserRole === "owner" && (
              <div className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Owner Privileges
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const target = viewingTeamApp;
                    setDeleteTeamAppConfirm({ open: true, app: target, deleting: false });
                  }}
                  className="h-8 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs rounded-xl gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </Button>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Modal for Team Application (Owner Only) */}
      <Dialog
        open={deleteTeamAppConfirm.open}
        onOpenChange={(open) => {
          if (!open && !deleteTeamAppConfirm.deleting) {
            setDeleteTeamAppConfirm({ open: false, app: null, deleting: false });
          }
        }}
      >
        <DialogContent className="max-w-md bg-[#0c1220]/95 border border-red-500/30 text-[#e2e8f0] backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-[70]">
          <DialogHeader className="text-left space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-white font-ember">
              Delete Team Application Record
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the operations team application for{" "}
              <strong className="text-white">
                {deleteTeamAppConfirm.app?.applicantSnapshot?.fullName || "this applicant"}
              </strong>{" "}
              ({deleteTeamAppConfirm.app?.applicantSnapshot?.studentId})?
              <br />
              <span className="text-red-400/90 block mt-2 font-medium">
                This action is irreversible. All team selections and answers will be permanently deleted.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTeamAppConfirm({ open: false, app: null, deleting: false })}
              disabled={deleteTeamAppConfirm.deleting}
              className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-xl h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteTeamApp}
              disabled={deleteTeamAppConfirm.deleting}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-lg shadow-red-950/40"
            >
              {deleteTeamAppConfirm.deleting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Bulk Deactivate by Intake Year Preview Modal */}
      {deactivatePreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0c1220] p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl shrink-0 bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white font-ember">
                  Confirm Bulk Deactivation (Intake Year {deactivateYearInput})
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  This action marks non-admin/non-owner members matching intake year {deactivateYearInput} as <strong className="text-rose-300">inactive</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeactivatePreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02]">
              {deactivatePreviewList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No active or pending members found matching intake year <span className="text-white font-mono">{deactivateYearInput}</span>.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <div className="px-4 py-2.5 bg-white/5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-2">
                    <span className="col-span-5">Member</span>
                    <span className="col-span-3">Student ID</span>
                    <span className="col-span-2">Current Status</span>
                    <span className="col-span-2 text-right">Role</span>
                  </div>
                  {deactivatePreviewList.map((m) => (
                    <div key={m._id} className="px-4 py-2.5 text-xs grid grid-cols-12 gap-2 items-center hover:bg-white/[0.02]">
                      <div className="col-span-5 min-w-0">
                        <p className="font-medium text-white truncate">{m.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{m.email}</p>
                      </div>
                      <span className="col-span-3 font-mono text-slate-300 truncate">{m.studentId}</span>
                      <span className="col-span-2 capitalize text-amber-300 text-[11px]">{m.membershipStatus}</span>
                      <span className="col-span-2 text-right uppercase text-slate-400 text-[11px] font-medium">{m.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Total matching records: <strong className="text-white">{deactivatePreviewList.length}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => setDeactivatePreviewOpen(false)}
                  className="border-white/15 bg-transparent hover:bg-white/10 text-slate-300 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isProcessing || deactivatePreviewList.length === 0}
                  onClick={handleConfirmBulkDeactivate}
                  className="bg-rose-600 hover:bg-rose-500 font-semibold rounded-xl text-white"
                >
                  {isProcessing ? "Processing..." : `Deactivate ${deactivatePreviewList.length} Members`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reactivate Inactive Preview Modal */}
      {activatePreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0c1220] p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white font-ember">
                  Confirm Bulk Reactivation
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  This will reactivate currently <strong className="text-slate-300">inactive</strong> members with <strong className="text-emerald-300">Year &lt; 5</strong>. Members in Year 5 or above remain inactive.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivatePreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02]">
              {activatePreviewList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No inactive members with Year &lt; 5 eligible for reactivation.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <div className="px-4 py-2.5 bg-white/5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-2">
                    <span className="col-span-5">Member</span>
                    <span className="col-span-3">Student ID</span>
                    <span className="col-span-2">Faculty</span>
                    <span className="col-span-2 text-right">Year</span>
                  </div>
                  {activatePreviewList.map((m) => (
                    <div key={m._id} className="px-4 py-2.5 text-xs grid grid-cols-12 gap-2 items-center hover:bg-white/[0.02]">
                      <div className="col-span-5 min-w-0">
                        <p className="font-medium text-white truncate">{m.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{m.email}</p>
                      </div>
                      <span className="col-span-3 font-mono text-slate-300 truncate">{m.studentId}</span>
                      <span className="col-span-2 text-slate-300 text-[11px] truncate">{m.faculty}</span>
                      <span className="col-span-2 text-right text-emerald-300 text-[11px] font-semibold">Year {m.year}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Eligible records (Year &lt; 5): <strong className="text-white">{activatePreviewList.length}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => setActivatePreviewOpen(false)}
                  className="border-white/15 bg-transparent hover:bg-white/10 text-slate-300 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isProcessing || activatePreviewList.length === 0}
                  onClick={handleConfirmBulkActivate}
                  className="bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl text-white"
                >
                  {isProcessing ? "Reactivating..." : `Reactivate ${activatePreviewList.length} Members`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
