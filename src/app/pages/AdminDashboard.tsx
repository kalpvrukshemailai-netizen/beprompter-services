import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, User, ShieldAlert, Users, Shield, RefreshCw, Mail, ArrowLeft, FileText, Upload, FileUp, Trash2 } from "lucide-react";
import { supabase, Profile, UserRole } from "@/lib/supabase";
import { DashboardLayout } from "@/app/components/DashboardLayout";

export function AdminDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const [cityFilter, setCityFilter] = useState<string>("");
  const [fileFilter, setFileFilter] = useState<string>("");
  const [bulkAssignRep, setBulkAssignRep] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { onNavigate("auth"); return; }
      
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      
      // Security Check: Kick out non-admins
      if (!profileData || profileData.role !== "admin") {
        onNavigate("home");
        return;
      }
      
      setProfile(profileData as Profile);
      await Promise.all([fetchUsers(), fetchProjects(), fetchLeads(), fetchCrmLeads()]);
      setLoading(false);
    })();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data as Profile[]);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (!error) {
      await fetchUsers();
    } else {
      console.error("Failed to update role:", error);
    }
    setUpdatingId(null);
  };

  const handleRemoveUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this member? This action cannot be undone.")) return;
    
    setUpdatingId(userId);
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    
    if (!error) {
      await fetchUsers();
    } else {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member: " + error.message);
    }
    setUpdatingId(null);
  };

  const fetchProjects = async () => {
    const { data: pData } = await supabase.from("projects").select(`
      *,
      client:profiles!projects_client_id_fkey(full_name, email, company_name)
    `).order("created_at", { ascending: false });
    const { data: mData } = await supabase.from("project_members").select("*");
    
    if (pData) setProjects(pData);
    if (mData) setProjectMembers(mData);
  };

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
  };

  const fetchCrmLeads = async () => {
    const { data } = await supabase.from("crm_leads").select("*").order("created_at", { ascending: false });
    if (data) setCrmLeads(data);
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingCsv(true);
    const text = await file.text();
    const rows = text.split('\n').filter(row => row.trim());
    if (rows.length < 2) {
      setUploadingCsv(false);
      return;
    }
    
    // Expected columns: google,Name,ratin,review,Firm,Address,Phone,website,City
    const newLeads = [];
    for (let i = 1; i < rows.length; i++) {
      let cols = [];
      let current = "";
      let inQuotes = false;
      for (let char of rows[i]) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { cols.push(current.trim()); current = ""; }
        else current += char;
      }
      cols.push(current.trim());
      
      if (cols.length >= 8 && cols[1]) { // Ensure it's not a completely empty/invalid row
        newLeads.push({
          google_link: cols[0] || null,
          name: cols[1] || "Unknown",
          rating: cols[2] || null,
          reviews: cols[3] || null,
          firm_type: cols[4] || null,
          address: cols[5] || null,
          phone: cols[6] || null,
          website: cols[7] || null,
          city: cols[8] || null,
          source_file: file.name,
        });
      }
    }
    
    if (newLeads.length > 0) {
      // Chunking inserts to avoid URL limits if the file is massive
      for (let i = 0; i < newLeads.length; i += 100) {
        await supabase.from("crm_leads").insert(newLeads.slice(i, i + 100));
      }
      await fetchCrmLeads();
    }
    setUploadingCsv(false);
    e.target.value = ''; // Reset input
  };

  const handleBulkAssign = async () => {
    if (!bulkAssignRep) return;
    
    let filteredLeads = crmLeads;
    if (fileFilter) filteredLeads = filteredLeads.filter(l => l.source_file === fileFilter);
    if (cityFilter) filteredLeads = filteredLeads.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
    
    const unassignedIds = filteredLeads.filter(l => !l.assigned_to).map(l => l.id);
    
    if (unassignedIds.length === 0) return;
    
    setUpdatingId('bulk-assign');
    try {
      // Chunking to avoid URL Too Large error
      for (let i = 0; i < unassignedIds.length; i += 100) {
        const { error } = await supabase.from("crm_leads").update({ assigned_to: bulkAssignRep }).in("id", unassignedIds.slice(i, i + 100));
        if (error) throw error;
      }
      await fetchCrmLeads();
      setBulkAssignRep("");
    } catch (err: any) {
      console.error("Bulk assign failed:", err);
      alert("Failed to assign leads: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignCrmLead = async (leadId: string, userId: string) => {
    setUpdatingId(`assign-crm-${leadId}`);
    const { error } = await supabase.from("crm_leads").update({ assigned_to: userId }).eq("id", leadId);
    if (!error) {
      await fetchCrmLeads();
    }
    setUpdatingId(null);
  };

  const handleToggleAssignment = async (projectId: string, userId: string) => {
    setUpdatingId(`assign-${projectId}`);
    const isAssigned = projectMembers.some(m => m.project_id === projectId && m.user_id === userId);
    
    if (isAssigned) {
      await supabase.from("project_members").delete().match({ project_id: projectId, user_id: userId });
    } else {
      await supabase.from("project_members").insert({ project_id: projectId, user_id: userId });
    }
    await fetchProjects();
    setUpdatingId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate("home");
  };

  return (
    <DashboardLayout
      loading={loading}
      title={<><ShieldAlert size={12} className="text-red-400" /> Admin Control Center</>}
      titleAccent="white"
      userName={profile?.full_name?.split(" ")[0] ?? "Admin"}
      roleName="Admin Access"
      userEmail={profile?.email ?? ""}
      icon={Shield}
      iconAccent="#ef4444"
      onSignOut={signOut}
    >
        <div className="flex items-center gap-3 mb-6">
          <Users size={20} className="text-white/40" />
          <h2 className="text-white font-black text-xl uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            User & Role Management
          </h2>
        </div>

        <div className="border border-white/8 rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Name</th>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</th>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Company</th>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{u.full_name || "—"}</p>
                      <p className="text-white/30 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>ID: {u.id.substring(0, 8)}...</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white/60 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{u.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white/60 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{u.company_name || "—"}</p>
                    </td>
                    <td className="p-4 text-right">
                      {updatingId === u.id ? (
                        <div className="flex items-center justify-end gap-2 text-white/50 text-xs py-1.5 px-3">
                          <RefreshCw size={12} className="animate-spin" /> Updating...
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none focus:border-white/40 rounded transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            disabled={u.id === profile?.id} // Prevent admin from demoting themselves by accident
                          >
                            <option value="client">Client</option>
                            <option value="developer">Developer</option>
                            <option value="sales">Sales</option>
                            <option value="admin">Admin</option>
                          </select>
                          {u.id !== profile?.id && (
                            <button
                              onClick={() => handleRemoveUser(u.id)}
                              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Remove Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-6 mt-16">
          <ShieldAlert size={20} className="text-white/40" />
          <h2 className="text-white font-black text-xl uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Project Assignment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const client = Array.isArray(p.client) ? p.client[0] : p.client;
            const assignedIds = projectMembers.filter(m => m.project_id === p.id).map(m => m.user_id);
            const teamMembers = users.filter(u => u.role === "developer" || u.role === "sales");
            
            return (
              <div key={p.id} className="border border-white/8 rounded-lg p-6" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.title}</h3>
                    <p className="text-white/50 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Client: {client?.full_name ?? "Unknown"}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-white/10 text-white/70">
                    {p.status.replace("_", " ")}
                  </span>
                </div>
                
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 mt-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Assign Team Members
                </p>
                <div className="space-y-2">
                  {teamMembers.length === 0 ? (
                    <p className="text-white/30 text-xs italic">No developers or sales team available.</p>
                  ) : (
                    teamMembers.map(tm => {
                      const isAssigned = assignedIds.includes(tm.id);
                      return (
                        <label key={tm.id} className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${isAssigned ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                          <input 
                            type="checkbox" 
                            checked={isAssigned} 
                            onChange={() => handleToggleAssignment(p.id, tm.id)}
                            disabled={updatingId === `assign-${p.id}`}
                            className="accent-red-500"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{tm.full_name}</p>
                            <p className="text-white/40 text-xs capitalize" style={{ fontFamily: "'Inter', sans-serif" }}>{tm.role}</p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="col-span-full border border-white/8 rounded-lg p-8 text-center text-white/30 text-sm" style={{ backgroundColor: "rgba(255,255,255,0.02)", fontFamily: "'Inter', sans-serif" }}>
              No projects exist yet.
            </div>
          )}
        </div>

        {/* Leads Section */}
        <div className="flex items-center gap-3 mb-6 mt-16">
          <Mail size={20} className="text-white/40" />
          <h2 className="text-white font-black text-xl uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Inbound Leads (Contact Forms)
          </h2>
        </div>

        <div className="border border-white/8 rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Date</th>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact</th>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Interest</th>
                  <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Budget</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                    <td className="p-4 align-top">
                      <p className="text-white/60 text-xs whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {new Date(l.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{l.name}</p>
                      <p className="text-white/60 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{l.email}</p>
                      {l.phone && <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{l.phone}</p>}
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-white/90 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{l.service_interest || "—"}</p>
                      {l.message && (
                        <p className="text-white/50 text-xs mt-2 max-w-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                          "{l.message}"
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-right align-top">
                      <span className="text-white/90 text-sm font-semibold px-2 py-1 rounded bg-white/5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {l.budget || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      No leads have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CRM Leads Distribution Section */}
        <div className="flex items-center justify-between mb-6 mt-16">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[#fbbf24]/70" />
            <h2 className="text-white font-black text-xl uppercase tracking-wider text-[#fbbf24]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Sales CRM Distribution
            </h2>
          </div>
          <div>
            <label className={`
              flex items-center gap-2 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 
              text-[#fbbf24] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded
              ${uploadingCsv ? 'opacity-50 pointer-events-none' : ''}
            `} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {uploadingCsv ? <RefreshCw size={14} className="animate-spin" /> : <FileUp size={14} />}
              {uploadingCsv ? 'Uploading...' : 'Upload CSV Leads'}
              <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={uploadingCsv} />
            </label>
          </div>
        </div>

        {!fileFilter ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(crmLeads.map(l => l.source_file).filter(Boolean))).sort().map(f => {
              const fileLeads = crmLeads.filter(l => l.source_file === f);
              const unassigned = fileLeads.filter(l => !l.assigned_to).length;
              return (
                <div key={f} className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-lg p-5 hover:bg-[#fbbf24]/10 transition-colors cursor-pointer" onClick={() => setFileFilter(f)}>
                  <div className="flex items-center gap-3 mb-3">
                    <FileText size={20} className="text-[#fbbf24]" />
                    <h3 className="text-white font-bold truncate flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>{f}</h3>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">Total Leads: <strong className="text-white">{fileLeads.length}</strong></span>
                    <span className={unassigned > 0 ? "text-[#fbbf24]" : "text-[#34d399]"}>{unassigned} unassigned</span>
                  </div>
                </div>
              );
            })}
            {Array.from(new Set(crmLeads.map(l => l.source_file).filter(Boolean))).length === 0 && (
              <div className="col-span-full border border-dashed border-white/10 rounded p-10 text-center">
                <FileUp size={28} className="mx-auto mb-3 text-white/15" />
                <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No CSV files uploaded yet</p>
                <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Upload a CSV file to begin assigning leads.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => { setFileFilter(""); setCityFilter(""); setBulkAssignRep(""); }}
                  className="flex items-center gap-2 bg-black/50 hover:bg-black/80 border border-[#fbbf24]/30 text-white text-xs px-3 py-2 outline-none rounded transition-colors w-full md:w-auto"
                >
                  <ArrowLeft size={14} /> Back to Files
                </button>
                <div className="flex flex-col">
                  <label className="text-[#fbbf24]/70 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Current File</label>
                  <div className="bg-black/30 border border-[#fbbf24]/30 text-[#fbbf24] font-bold text-xs px-3 py-2 outline-none rounded transition-colors w-full md:w-48 truncate flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <FileText size={12} /> {fileFilter}
                  </div>
                </div>
            
            <div className="flex flex-col">
              <label className="text-[#fbbf24]/70 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Filter by City</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-black/50 border border-[#fbbf24]/30 text-white text-xs px-3 py-2 outline-none rounded transition-colors w-full md:w-48"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">All Cities</option>
                {Array.from(new Set(crmLeads.map(l => l.city).filter(Boolean))).sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[#fbbf24]/70 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Bulk Assign Filtered Leads</label>
              <div className="flex items-center gap-2">
                <select
                  value={bulkAssignRep}
                  onChange={(e) => setBulkAssignRep(e.target.value)}
                  className="bg-black/50 border border-[#fbbf24]/30 text-white text-xs px-3 py-2 outline-none rounded transition-colors w-full md:w-48"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="">-- Select Sales Rep --</option>
                  {users.filter(u => u.role === "sales").map(rep => (
                    <option key={rep.id} value={rep.id}>{rep.full_name}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkAssign}
                  disabled={!bulkAssignRep || updatingId === 'bulk-assign'}
                  className="bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 text-[#fbbf24] border border-[#fbbf24]/50 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {updatingId === 'bulk-assign' ? 'Assigning...' : 'Assign All Unassigned'}
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              Showing {(() => {
                let f = crmLeads;
                if (fileFilter) f = f.filter(l => l.source_file === fileFilter);
                if (cityFilter) f = f.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
                return f.length;
              })()} leads
            </p>
          </div>
        </div>

        <div className="border border-[#fbbf24]/20 rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(251,191,36,0.02)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#fbbf24]/20" style={{ backgroundColor: "rgba(251,191,36,0.05)" }}>
                  <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Company</th>
                  <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Info</th>
                  <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Rating</th>
                  <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Status</th>
                  <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Assign To Sales Rep</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let filtered = crmLeads;
                  if (fileFilter) filtered = filtered.filter(l => l.source_file === fileFilter);
                  if (cityFilter) filtered = filtered.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
                  return filtered.map((l) => {
                    const salesReps = users.filter(u => u.role === "sales");
                    return (
                    <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{l.name}</p>
                        {l.firm_type && <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">{l.firm_type}</p>}
                        {l.website && (
                          <a href={l.website.startsWith('http') ? l.website : `https://${l.website}`} target="_blank" rel="noreferrer" className="text-[#60c8ff] text-xs hover:underline mt-1 inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Website
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="text-white/80 text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {l.phone || "No phone"}
                        </p>
                        <p className="text-white/60 text-xs max-w-[200px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {l.address || "No address"}
                        </p>
                        {l.city && (
                          <p className="text-[#fbbf24]/80 text-[10px] uppercase tracking-wider mt-1 font-bold">{l.city}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-white/90 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>⭐ {l.rating || "-"}</span>
                          <span className="text-white/40 text-xs ml-1" style={{ fontFamily: "'Inter', sans-serif" }}>({String(l.reviews || "0").replace(/\D/g, '')})</span>
                        </div>
                        {l.google_link && (
                          <a href={l.google_link} target="_blank" rel="noreferrer" className="text-[#60c8ff] text-[10px] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Google Maps</a>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                          ${l.status === 'Converted' ? 'bg-[#34d399]/10 text-[#34d399]' : l.status === 'Follow-up' ? 'bg-[#60c8ff]/10 text-[#60c8ff]' : l.status === 'Not Converted' ? 'bg-[#f87171]/10 text-[#f87171]' : 'bg-white/10 text-white'}
                        `} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {salesReps.length === 0 ? (
                          <span className="text-white/30 text-xs">No sales reps available</span>
                        ) : (
                          <select
                            value={l.assigned_to || ""}
                            onChange={(e) => handleAssignCrmLead(l.id, e.target.value)}
                            disabled={updatingId === `assign-crm-${l.id}`}
                            className="bg-black/50 border border-[#fbbf24]/30 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <option value="">-- Unassigned --</option>
                            {salesReps.map(rep => (
                              <option key={rep.id} value={rep.id}>{rep.full_name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                  });
                })()}
                {(() => {
                  let filtered = crmLeads;
                  if (fileFilter) filtered = filtered.filter(l => l.source_file === fileFilter);
                  if (cityFilter) filtered = filtered.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
                  
                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                          No CRM leads available for this selection.
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })()}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

    </DashboardLayout>
  );
}
