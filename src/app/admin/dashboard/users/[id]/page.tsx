"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DbUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profilePhoto: string;
  departments: string[];
  workspaces: string[];
  permissions: string[];
  phone: string;
  dob: string;
  isArchived: boolean;
  activeSince: string;
  createdBy: string;
}

interface UserEditPageProps {
  params: Promise<{ id: string }>;
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState<DbUser | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<DbUser[]>([]);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  
  // Password Reset fields
  const [password, setPassword] = useState("");
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  // Acting Supervisor fields
  const [actingDept, setActingDept] = useState("");
  const [actingSupervisorId, setActingSupervisorId] = useState("");
  const [actingStart, setActingStart] = useState("");
  const [actingEnd, setActingEnd] = useState("");
  const [actingReason, setActingReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actingUpdating, setActingUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // 1. Fetch current logged-in user profile
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .catch((err) => console.error("Error fetching current user:", err));

    // 2. Fetch all users for acting supervisor selector
    fetch("/api/users?limit=100")
      .then((res) => res.json())
      .then((data) => setAllUsers(data.users))
      .catch((err) => console.error("Error fetching users list:", err));

    // 3. Fetch target user account details
    fetch(`/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user details");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFullName(data.fullName);
        setEmail(data.email);
        setRole(data.role);
        setStatus(data.status);
        setPhone(data.phone || "");
        setDob(data.dob || "");
        setDepartments(data.departments);
        setWorkspaces(data.workspaces);
        if (data.departments && data.departments.length > 0) {
          setActingDept(data.departments[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load user");
        setLoading(false);
      });
  }, [id]);

  const handleDeptChange = (dept: string) => {
    if (departments.includes(dept)) {
      setDepartments(departments.filter((d) => d !== dept));
    } else {
      setDepartments([...departments, dept]);
    }
  };

  const handleWorkspaceChange = (ws: string) => {
    if (workspaces.includes(ws)) {
      setWorkspaces(workspaces.filter((w) => w !== ws));
    } else {
      setWorkspaces([...workspaces, ws]);
    }
  };

  const generateTempPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let temp = "";
    for (let i = 0; i < 10; i++) {
      temp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(temp);
    setForcePasswordChange(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          role,
          status,
          departments,
          workspaces,
          phone,
          dob,
          password: password.trim() !== "" ? password : undefined,
          forcePasswordChange,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      setSuccessMsg("User account updated successfully!");
      setPassword("");
      
      // Reload updated details
      const userRes = await fetch(`/api/users/${id}`);
      const userData = await userRes.json();
      setUser(userData);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!user) return;
    const currentlyArchived = user.isArchived;
    const actionText = currentlyArchived ? "restore" : "archive";
    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;

    try {
      setUpdating(true);
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !currentlyArchived }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `${actionText} failed`);
      }

      setSuccessMsg(`User ${currentlyArchived ? "restored" : "archived"} successfully.`);
      
      // Reload updated details
      const userRes = await fetch(`/api/users/${id}`);
      const userData = await userRes.json();
      setUser(userData);
    } catch (err: any) {
      setError(err.message || `Failed to ${actionText} user`);
    } finally {
      setUpdating(false);
    }
  };

  const handleImpersonate = async () => {
    if (!user) return;
    if (!confirm(`Are you sure you want to impersonate user @${user.username}?`)) return;

    try {
      const res = await fetch("/api/auth/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impersonation failed");

      alert(`Session switched! Impersonating @${user.username}.`);
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      alert(err.message || "Failed to impersonate");
    }
  };

  const handleActingSupervisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActingUpdating(true);
    setError("");
    setSuccessMsg("");

    try {
      // Find department ID corresponding to selected name
      const deptRes = await fetch("/api/users"); // Wait, we can load from list
      // Instead, pass the name and the backend handles matching
      const targetDeptName = actingDept || (user?.departments?.[0]);
      
      // Fetch department details first
      const res = await fetch("/api/departments/acting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: targetDeptName, // We can resolve by name on backend or pass name directly
          actingSupervisorId: actingSupervisorId || null,
          actingStart: actingStart || undefined,
          actingEnd: actingEnd || undefined,
          actingReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign acting supervisor");

      setSuccessMsg("Temporary Acting Supervisor configuration updated successfully!");
      setActingSupervisorId("");
      setActingStart("");
      setActingEnd("");
      setActingReason("");
    } catch (err: any) {
      setError(err.message || "Failed to set Acting Supervisor");
    } finally {
      setActingUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-xs text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
        Loading user account details...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href="/admin/dashboard" className="text-xs font-bold text-brand-red uppercase tracking-wider hover:underline">
          &larr; Back to Dashboard
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold">
          {error}
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.role === "OWNER";
  const isOwnerOrAdmin = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Link href="/admin/dashboard" className="text-xs font-bold text-brand-red uppercase tracking-wider hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-dark dark:text-white mt-3">
            User Account Console
          </h1>
          <p className="text-xs text-neutral-450 mt-1">
            User ID: <span className="font-mono text-neutral-500">{user?.id}</span> &bull; Active Since {user ? new Date(user.activeSince).toLocaleDateString() : ""}
          </p>
        </div>

        <div className="flex items-center space-x-3.5">
          {isOwner && user?.role !== "OWNER" && (
            <button
              type="button"
              onClick={handleImpersonate}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm border border-neutral-250 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-350 cursor-pointer transition-colors"
            >
              Impersonate User
            </button>
          )}

          <button
            type="button"
            onClick={handleArchive}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm border cursor-pointer transition-colors ${
              user?.isArchived
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                : "bg-red-500/10 text-red-600 border-red-500/25 hover:bg-red-500/20"
            }`}
          >
            {user?.isArchived ? "Restore User Account" : "Archive User Account"}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded text-xs font-bold">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metadata & Photo card */}
        <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 flex flex-col items-center text-center space-y-5 transition-colors">
          <img
            src={user?.profilePhoto || "/images/default-avatar.png"}
            alt={user?.fullName}
            className="h-28 w-28 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 bg-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-avatar.png";
            }}
          />
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-lg text-brand-dark dark:text-white leading-tight">
              {user?.fullName}
            </h2>
            <span className="text-xs text-neutral-450 font-mono block">@{user?.username}</span>
            <span className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 border rounded-sm mt-1.5 ${
              user?.role === "OWNER"
                ? "bg-red-500/10 text-red-600 border-red-500/20"
                : user?.role === "ADMIN"
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                : user?.role === "SUPERVISOR"
                ? "bg-purple-500/10 text-purple-650 border-purple-500/20"
                : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-900/50 dark:text-neutral-400 dark:border-neutral-850"
            }`}>
              {user?.role}
            </span>
          </div>

          <div className="w-full text-left space-y-3.5 pt-5 border-t border-neutral-100 dark:border-neutral-850 text-xs font-medium">
            <div>
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Email</span>
              <span className="text-brand-dark dark:text-neutral-200">{user?.email}</span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Created By</span>
              <span className="text-brand-dark dark:text-neutral-200">{user?.createdBy}</span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Account Status</span>
              <span className={`text-xs font-bold uppercase ${user?.isArchived ? "text-red-500" : "text-emerald-500"}`}>
                {user?.isArchived ? "Archived (No Login)" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-6 transition-colors duration-300">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-red border-b border-neutral-100 dark:border-neutral-850 pb-2">
              Edit Account Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={user?.role === "OWNER" && !isOwner}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                >
                  <option value="EMPLOYEE">Employee (Editor/Writer)</option>
                  <option value="SUPERVISOR">Supervisor (Content Reviewer)</option>
                  <option value="ADMIN">Admin (Workspace Manager)</option>
                  {isOwner && <option value="OWNER">Owner (System Director)</option>}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="No phone set"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Departments check list */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 block">
                Departments
              </label>
              <div className="flex flex-wrap gap-4">
                {["Publication", "Marketing", "Research", "Support"].map((dept) => (
                  <label key={dept} className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-350 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={departments.includes(dept)}
                      onChange={() => handleDeptChange(dept)}
                      className="accent-brand-red cursor-pointer"
                    />
                    <span>{dept}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Workspaces check list */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 block">
                Workspaces
              </label>
              <div className="flex flex-wrap gap-4">
                {["Publication", "Marketing", "Research"].map((ws) => (
                  <label key={ws} className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-350 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={workspaces.includes(ws)}
                      onChange={() => handleWorkspaceChange(ws)}
                      className="accent-brand-red cursor-pointer"
                    />
                    <span>{ws} Workspace</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Credentials / Password change */}
            <div className="space-y-4 pt-5 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-red">
                Credentials &amp; Reset Password
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 flex justify-between items-center">
                    <span>New Password</span>
                    <button
                      type="button"
                      onClick={generateTempPassword}
                      className="text-[9px] text-brand-red hover:underline uppercase tracking-wide normal-case"
                    >
                      Generate Temp Password
                    </button>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank to keep unchanged"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="forcePasswordChange"
                    checked={forcePasswordChange}
                    onChange={(e) => setForcePasswordChange(e.target.checked)}
                    className="accent-brand-red h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="forcePasswordChange" className="text-xs font-bold text-neutral-600 dark:text-neutral-355 cursor-pointer select-none">
                    Force Password Change on Next Login
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="submit"
                disabled={updating}
                className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {updating ? "Saving Changes..." : "Save Account Settings"}
              </button>
            </div>
          </form>

          {/* Acting Supervisor Assignment Form (restricted to Admin/Owner, visible if user is a Supervisor or belongs to departments) */}
          {isOwnerOrAdmin && (
            <form onSubmit={handleActingSupervisorSubmit} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-6 transition-colors duration-300">
              <div className="border-b border-neutral-100 dark:border-neutral-850 pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-red">
                  Temporary Acting Supervisor Delegation
                </h3>
                <p className="text-[10px] text-neutral-450 mt-1">
                  Assign a temporary supervisor to manage this user's departments. Leave selector blank to clear assignment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                    Select Supervised Department
                  </label>
                  <select
                    value={actingDept}
                    onChange={(e) => setActingDept(e.target.value)}
                    className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                  >
                    {user?.departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                    Select Temporary Supervisor
                  </label>
                  <select
                    value={actingSupervisorId}
                    onChange={(e) => setActingSupervisorId(e.target.value)}
                    className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                  >
                    <option value="">-- No Acting Assignment (Clear) --</option>
                    {allUsers
                      .filter((u) => u.id !== id && u.role !== "OWNER")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} (@{u.username})
                        </option>
                      ))}
                  </select>
                </div>

                {actingSupervisorId !== "" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={actingStart}
                        onChange={(e) => setActingStart(e.target.value)}
                        className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={actingEnd}
                        onChange={(e) => setActingEnd(e.target.value)}
                        className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                        Delegation Reason / Notes
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Parental leave, vacation override..."
                        value={actingReason}
                        onChange={(e) => setActingReason(e.target.value)}
                        className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-5 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="submit"
                  disabled={actingUpdating}
                  className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actingUpdating ? "Updating Settings..." : "Save Delegation Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
