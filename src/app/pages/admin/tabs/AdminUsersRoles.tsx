import React, { useState, useMemo } from "react";
import { UserRole, Profile, supabase, deduplicateProfiles } from "@/lib/supabase";
import { Search, Download, Trash2, Edit2, UserPlus, Check, X, Shield, Phone, Building, Link as LinkIcon } from "lucide-react";
import { logAuditEvent } from "@/lib/auditLog";

export function AdminUsersRoles({ 
  users, 
  onRoleChange, 
  onRemove, 
  onRefreshUsers,
  onUpdateUser,
  onAddUser
}: {
  users: Profile[];
  onRoleChange: (id: string, role: UserRole, email?: string) => void;
  onRemove: (id: string, email?: string) => void;
  onRefreshUsers?: () => void;
  onUpdateUser?: (updated: Profile) => void;
  onAddUser?: (created: Profile) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Invite Form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("sales");
  const [inviteCompany, setInviteCompany] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteSheet, setInviteSheet] = useState("");

  const cleanUsers = useMemo(() => deduplicateProfiles(users), [users]);
  const salesCount = cleanUsers.filter(u => u.role === "sales").length;
  const clientCount = cleanUsers.filter(u => u.role === "client").length;
  const adminCount = cleanUsers.filter(u => u.role === "admin").length;
  const devCount = cleanUsers.filter(u => u.role === "developer").length;

  const filteredUsers = useMemo(() => {
    return cleanUsers.filter(u => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (u.full_name || "").toLowerCase().includes(q) ||
               (u.email || "").toLowerCase().includes(q) ||
               (u.company_name || "").toLowerCase().includes(q) ||
               (u.phone || "").includes(q);
      }
      return true;
    });
  }, [cleanUsers, roleFilter, searchQuery]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSubmitting(true);

    try {
      const newId = "usr-" + Math.random().toString(36).substr(2, 9);
      const newProfile: Profile = {
        id: newId,
        email: inviteEmail.trim().toLowerCase(),
        full_name: inviteName.trim() || inviteEmail.split("@")[0],
        role: inviteRole,
        company_name: inviteCompany.trim() || null,
        phone: invitePhone.trim() || null,
        google_sheet_url: inviteSheet.trim() || null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from("profiles").upsert(newProfile);
      if (error) {
        console.warn("Supabase upsert note:", error.message);
      }

      logAuditEvent({
        action: `User Created: ${newProfile.full_name} (${newProfile.role})`,
        resource: `profile:${newProfile.email}`,
        severity: "medium"
      });

      setNotice(`User ${newProfile.full_name} (${newProfile.email}) added successfully.`);
      setShowInviteModal(false);
      setInviteName("");
      setInviteEmail("");
      setInviteCompany("");
      setInvitePhone("");
      setInviteSheet("");
      if (onAddUser) onAddUser(newProfile);
      if (onRefreshUsers) onRefreshUsers();
    } catch (err: any) {
      alert("Error adding user: " + err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);

    try {
      if (!editingUser.id.startsWith("usr-")) {
        await supabase.from("profiles").update({
          full_name: editingUser.full_name,
          company_name: editingUser.company_name,
          phone: editingUser.phone,
          google_sheet_url: editingUser.google_sheet_url,
          role: editingUser.role
        }).eq("id", editingUser.id);
      } else {
        await supabase.from("profiles").update({
          full_name: editingUser.full_name,
          company_name: editingUser.company_name,
          phone: editingUser.phone,
          google_sheet_url: editingUser.google_sheet_url,
          role: editingUser.role
        }).eq("email", editingUser.email.toLowerCase());
      }
    } catch (err) {
      console.warn("Supabase update note:", err);
    }

    logAuditEvent({
      action: `Profile Updated: ${editingUser.full_name}`,
      resource: `profile:${editingUser.id}`,
      severity: "low"
    });

    setNotice(`Profile for ${editingUser.full_name} updated successfully.`);
    if (onUpdateUser) onUpdateUser(editingUser);
    setEditingUser(null);
    setIsSubmitting(false);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleExportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Email,Role,Company,Phone,GoogleSheet,CreatedAt\n" +
      cleanUsers.map(u => `"${u.id}","${u.full_name || ''}","${u.email}","${u.role}","${u.company_name || ''}","${u.phone || ''}","${u.google_sheet_url || ''}","${u.created_at}"`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `beprompter_users_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 02
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            People, access and accountability.
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Manage {cleanUsers.length} active platform accounts across Sales, Clients, Developers, and Administrators.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportUsers}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download size={12} /> Export CSV
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors cursor-pointer"
          >
            <UserPlus size={14} /> + Add / Invite User
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {/* Real Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Total Platform Users</p>
          <p className="text-3xl font-semibold text-white mb-2 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>{cleanUsers.length}</p>
          <p className="text-xs text-white/40">{salesCount} Sales · {clientCount} Client · {devCount} Dev · {adminCount} Admin</p>
        </div>
        <div className="border border-blue-500/10 bg-blue-500/[0.01] rounded-xl p-5 hover:bg-blue-500/[0.02] transition-colors">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Sales Team Reps</p>
          <p className="text-3xl font-semibold text-blue-400 mb-2 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>{salesCount}</p>
          <p className="text-xs text-white/40">Active calling & CRM assignment</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Client Workspaces</p>
          <p className="text-3xl font-semibold text-white mb-2 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>{clientCount}</p>
          <p className="text-xs text-white/40">Registered tenant accounts</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Security</p>
          <p className="text-3xl font-semibold text-emerald-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Active</p>
          <p className="text-xs text-white/40">RLS enforced on all user profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Users & Role Directory</h3>
              <span className="text-xs text-white/40">Showing {filteredUsers.length} of {cleanUsers.length} accounts</span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Filter by name, email, company, phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-9 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors" 
                />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none"
              >
                <option value="all" className="bg-[#111]">All Roles</option>
                <option value="admin" className="bg-[#111]">Admin</option>
                <option value="sales" className="bg-[#111]">Sales</option>
                <option value="client" className="bg-[#111]">Client</option>
                <option value="developer" className="bg-[#111]">Developer</option>
              </select>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 bg-white/[0.02]">
                    <th className="py-3 px-4 font-medium">USER</th>
                    <th className="py-3 px-4 font-medium">COMPANY & CONTACT</th>
                    <th className="py-3 px-4 font-medium">ROLE</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{u.full_name || "—"}</p>
                        <p className="text-white/40 text-[10px]">{u.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white/70 text-[11px] space-y-0.5">
                          {u.company_name && <p className="font-medium text-white/90">{u.company_name}</p>}
                          {u.phone && <p className="text-white/50 font-mono text-[10px]">{u.phone}</p>}
                          {u.google_sheet_url && (
                            u.google_sheet_url.startsWith("http") ? (
                              <a href={u.google_sheet_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-[10px] flex items-center gap-1">
                                <LinkIcon size={10} /> Google Sheet ↗
                              </a>
                            ) : (
                              <button 
                                onClick={() => setEditingUser(u)} 
                                className="text-blue-400 hover:underline text-[10px] flex items-center gap-1 cursor-pointer"
                                title="Click to configure Google Sheet URL"
                              >
                                <LinkIcon size={10} /> Connect Sheet
                              </button>
                            )
                          )}
                          {!u.company_name && !u.phone && !u.google_sheet_url && <span className="text-white/30">—</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select 
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value as UserRole;
                            onRoleChange(u.id, newRole, u.email);
                            logAuditEvent({
                              action: `Role Changed: ${u.full_name} -> ${newRole}`,
                              resource: `profile:${u.id}`,
                              severity: "medium"
                            });
                            setNotice(`Role for ${u.full_name || u.email} updated to ${newRole.toUpperCase()}.`);
                            setTimeout(() => setNotice(null), 3500);
                          }}
                          className={`border rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors ${
                            u.role === 'admin' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                            u.role === 'sales' ? 'bg-[#fbbf24]/10 border-[#fbbf24]/30 text-[#fbbf24]' :
                            u.role === 'client' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
                            'bg-purple-500/10 border-purple-500/30 text-purple-300'
                          }`}
                        >
                          <option value="admin" className="bg-[#111] text-red-400">Admin</option>
                          <option value="sales" className="bg-[#111] text-[#fbbf24]">Sales</option>
                          <option value="client" className="bg-[#111] text-blue-400">Client</option>
                          <option value="developer" className="bg-[#111] text-purple-400">Developer</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(u)}
                            className="px-2.5 py-1 border border-white/10 rounded text-[10px] text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => setUserToDelete(u)}
                            className="px-2.5 py-1 border border-red-500/20 text-red-400 rounded text-[10px] hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-white/30 text-xs">
                        No user accounts match the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Permissions & Security Summary */}
        <div className="space-y-8 border-l border-white/10 pl-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Platform RBAC Matrix</h3>
              <button 
                onClick={() => setShowMatrixModal(true)}
                className="text-[10px] text-white/70 hover:text-white uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                title="Inspect platform access control matrix"
              >
                <Shield size={11} className="text-emerald-400" />
                <span>Security Matrix</span>
              </button>
            </div>
            
            <div className="border border-white/10 rounded-xl p-4 mb-4 text-xs bg-white/[0.01]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/40 uppercase text-[10px] font-bold">Policy Enforced</span>
                <span className="text-emerald-400 font-mono text-[10px]">Active</span>
              </div>
              <p className="text-white font-medium mb-1">Row Level Security (RLS)</p>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Sales representatives are isolated to assigned leads. Clients only access their provisioned workspace.
              </p>
            </div>
            
            <table className="w-full text-[11px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 font-medium">CAPABILITY</th>
                  <th className="py-2 font-medium text-center">ADMIN</th>
                  <th className="py-2 font-medium text-center">SALES</th>
                  <th className="py-2 font-medium text-center">CLIENT</th>
                </tr>
              </thead>
              <tbody className="text-white/80 divide-y divide-white/5">
                <tr>
                  <td className="py-2">User & Role Editing</td>
                  <td className="py-2 text-center text-emerald-400">✓</td>
                  <td className="py-2 text-center text-white/20">—</td>
                  <td className="py-2 text-center text-white/20">—</td>
                </tr>
                <tr>
                  <td className="py-2">Sales CRM Lead Calling</td>
                  <td className="py-2 text-center text-emerald-400">✓</td>
                  <td className="py-2 text-center text-emerald-400">Assigned</td>
                  <td className="py-2 text-center text-white/20">—</td>
                </tr>
                <tr>
                  <td className="py-2">CSV Uploads & Reassignment</td>
                  <td className="py-2 text-center text-emerald-400">✓</td>
                  <td className="py-2 text-center text-white/20">—</td>
                  <td className="py-2 text-center text-white/20">—</td>
                </tr>
                <tr>
                  <td className="py-2">Google Sheet Association</td>
                  <td className="py-2 text-center text-emerald-400">✓</td>
                  <td className="py-2 text-center text-white/20">—</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                </tr>
                <tr>
                  <td className="py-2">Project Delivery Management</td>
                  <td className="py-2 text-center text-emerald-400">✓</td>
                  <td className="py-2 text-center text-white/60">View</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Add New Platform User</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Verma" 
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="rahul.verma@example.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                >
                  <option value="sales" className="bg-[#111]">Sales Representative</option>
                  <option value="client" className="bg-[#111]">Client Tenant</option>
                  <option value="developer" className="bg-[#111]">Developer</option>
                  <option value="admin" className="bg-[#111]">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Phone Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="+91 98765 43210" 
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              {inviteRole === "client" && (
                <>
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Company / Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Properties" 
                      value={inviteCompany}
                      onChange={(e) => setInviteCompany(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Google Sheet URL</label>
                    <input 
                      type="url" 
                      placeholder="https://docs.google.com/spreadsheets/d/..." 
                      value={inviteSheet}
                      onChange={(e) => setInviteSheet(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-white/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Edit User Profile</h3>
              <button onClick={() => setEditingUser(null)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editingUser.full_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                >
                  <option value="admin" className="bg-[#111]">Admin</option>
                  <option value="sales" className="bg-[#111]">Sales</option>
                  <option value="client" className="bg-[#111]">Client</option>
                  <option value="developer" className="bg-[#111]">Developer</option>
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Company / Organization</label>
                <input 
                  type="text" 
                  value={editingUser.company_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, company_name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="+91 99999 99999"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Google Sheet URL</label>
                <input 
                  type="url" 
                  value={editingUser.google_sheet_url || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, google_sheet_url: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-white/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Remove Team Member</h3>
                <p className="text-xs text-white/50">Are you sure you want to remove this member?</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white/40">Member:</span>
                <span className="text-white font-medium">{userToDelete.full_name || "Unnamed"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Email:</span>
                <span className="font-mono text-white/80">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Role:</span>
                <span className="uppercase text-amber-400 font-bold text-[10px] tracking-wider">{userToDelete.role}</span>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              This action will immediately remove this user account from the platform and revoke their dashboard privileges.
            </p>

            <div className="pt-2 flex justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const idToRemove = userToDelete.id;
                  const emailToRemove = userToDelete.email;
                  const nameToRemove = userToDelete.full_name || userToDelete.email;
                  setUserToDelete(null);
                  onRemove(idToRemove, emailToRemove);
                  logAuditEvent({
                    action: `User Removed: ${nameToRemove}`,
                    resource: `profile:${idToRemove}`,
                    severity: "critical"
                  });
                  setNotice(`User ${nameToRemove} has been successfully removed.`);
                  setTimeout(() => setNotice(null), 4000);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Matrix Detailed Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-2xl w-full p-7 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} className="text-emerald-400" />
                  <h3 className="text-base font-semibold text-white">Platform RBAC & Security Specification</h3>
                </div>
                <p className="text-xs text-white/50">Comprehensive capability isolation & Row-Level Security rules.</p>
              </div>
              <button onClick={() => setShowMatrixModal(false)} className="text-white/40 hover:text-white text-sm">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
                <h4 className="font-semibold text-emerald-300 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Row Level Security (RLS) Active
                </h4>
                <p className="text-emerald-400/80 text-[11px] leading-relaxed">
                  Every SQL query against <code className="bg-black/40 px-1 py-0.5 rounded text-white">crm_leads</code>, <code className="bg-black/40 px-1 py-0.5 rounded text-white">projects</code>, and <code className="bg-black/40 px-1 py-0.5 rounded text-white">profiles</code> verifies authentication token claims.
                </p>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/50 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">CRM Scope</th>
                      <th className="py-2.5 px-3">Workspaces</th>
                      <th className="py-2.5 px-3">User Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-red-400">ADMIN</td>
                      <td className="py-2.5 px-3">Full Global Access</td>
                      <td className="py-2.5 px-3">All Workspaces</td>
                      <td className="py-2.5 px-3 text-emerald-400">Read / Write / Delete</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#fbbf24]">SALES</td>
                      <td className="py-2.5 px-3">Assigned Leads Only</td>
                      <td className="py-2.5 px-3">Read-only CRM</td>
                      <td className="py-2.5 px-3 text-white/30">None</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-blue-400">CLIENT</td>
                      <td className="py-2.5 px-3">Own Workspace Data</td>
                      <td className="py-2.5 px-3">Self Tenant Only</td>
                      <td className="py-2.5 px-3 text-white/30">Own Profile</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-purple-400">DEVELOPER</td>
                      <td className="py-2.5 px-3">AI Webhook Logs</td>
                      <td className="py-2.5 px-3">Assigned Projects</td>
                      <td className="py-2.5 px-3 text-white/30">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 bg-white text-black font-semibold text-xs rounded hover:bg-white/90"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
