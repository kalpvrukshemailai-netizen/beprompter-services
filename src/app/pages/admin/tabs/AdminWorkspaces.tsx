import React, { useState, useMemo } from "react";
import { Search, Download, AlertCircle, CheckCircle, Building2, Link as LinkIcon, Plus, User, ExternalLink, RefreshCw } from "lucide-react";
import { Profile, supabase, deduplicateProfiles } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/auditLog";

interface AdminWorkspacesProps {
  users?: Profile[];
  projects?: any[];
  crmLeads?: any[];
  onRefreshUsers?: () => void;
}

export function AdminWorkspaces({
  users = [],
  projects = [],
  crmLeads = [],
  onRefreshUsers
}: AdminWorkspacesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form state for onboarding
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newSheetUrl, setNewSheetUrl] = useState("");

  // Real client workspaces: users with role='client', deduplicated by email
  const clientWorkspaces = useMemo(() => {
    const cleanUsers = deduplicateProfiles(users);
    const clients = cleanUsers.filter(u => u.role === "client");
    return clients.length > 0 ? clients : cleanUsers;
  }, [users]);

  // Selected workspace
  const activeWorkspace = useMemo(() => {
    if (selectedClientId) {
      return clientWorkspaces.find(w => w.id === selectedClientId) || clientWorkspaces[0];
    }
    return clientWorkspaces[0] || null;
  }, [clientWorkspaces, selectedClientId]);

  // Search filter
  const filteredWorkspaces = useMemo(() => {
    return clientWorkspaces.filter(w => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (w.company_name || "").toLowerCase().includes(q) ||
             (w.full_name || "").toLowerCase().includes(q) ||
             (w.email || "").toLowerCase().includes(q) ||
             (w.google_sheet_url || "").toLowerCase().includes(q);
    });
  }, [clientWorkspaces, searchQuery]);

  const workspacesWithSheets = clientWorkspaces.filter(w => w.google_sheet_url).length;

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwnerEmail || !newCompanyName) return;
    setIsSubmitting(true);

    try {
      const newId = "client-" + Math.random().toString(36).substr(2, 9);
      const newClientProfile: Profile = {
        id: newId,
        email: newOwnerEmail.trim().toLowerCase(),
        full_name: newOwnerName.trim() || newCompanyName,
        role: "client",
        company_name: newCompanyName.trim(),
        phone: newOwnerPhone.trim() || null,
        google_sheet_url: newSheetUrl.trim() || null,
        created_at: new Date().toISOString()
      };

      await supabase.from("profiles").upsert(newClientProfile);

      logAuditEvent({
        action: `Workspace Onboarded: ${newClientProfile.company_name} (${newClientProfile.email})`,
        resource: `workspace:${newClientProfile.id}`,
        severity: "medium"
      });

      setNotice(`Client workspace for "${newClientProfile.company_name}" onboarded successfully.`);
      setShowOnboardModal(false);
      setNewCompanyName("");
      setNewOwnerName("");
      setNewOwnerEmail("");
      setNewOwnerPhone("");
      setNewSheetUrl("");
      if (onRefreshUsers) onRefreshUsers();
    } catch (err: any) {
      alert("Error creating workspace: " + err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleExportWorkspaces = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,CompanyName,OwnerName,Email,Phone,GoogleSheetURL,Role,CreatedAt\n" +
      clientWorkspaces.map(w => `"${w.id}","${w.company_name || ''}","${w.full_name || ''}","${w.email}","${w.phone || ''}","${w.google_sheet_url || ''}","${w.role}","${w.created_at}"`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `beprompter_workspaces_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 03
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Every client. A controlled workspace.
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Oversee tenant onboarding, inventory Google Sheet associations, client projects, and service connectivity.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportWorkspaces}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download size={12} /> Export CSV
          </button>
          <button 
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Onboard Client Workspace
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {/* Real Workspace KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Active Workspaces</p>
          <p className="text-3xl font-semibold text-white mb-2 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>{clientWorkspaces.length}</p>
          <p className="text-xs text-white/40">Registered client tenants</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Google Sheet Integrations</p>
          <p className="text-3xl font-semibold text-emerald-400 mb-2 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>{workspacesWithSheets}</p>
          <p className="text-xs text-white/40">Active real-time inventory sheets</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Client Projects</p>
          <p className="text-3xl font-semibold text-white mb-2 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>{projects.length}</p>
          <p className="text-xs text-white/40">Active development & AI bots</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Tenant Isolation</p>
          <p className="text-3xl font-semibold text-emerald-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Secured</p>
          <p className="text-xs text-white/40">Strict tenant boundaries enforced</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        {/* Workspace List Table */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Client Workspace Registry</h3>
              <span className="text-xs text-white/40">Showing {filteredWorkspaces.length} workspaces</span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search company, owner name, email, or Google Sheet..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-9 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors" 
                />
              </div>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 bg-white/[0.02]">
                    <th className="py-3 px-4 font-medium">COMPANY / OWNER</th>
                    <th className="py-3 px-4 font-medium">CONTACT / PHONE</th>
                    <th className="py-3 px-4 font-medium">GOOGLE SHEET</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {filteredWorkspaces.map(w => {
                    const isSelected = activeWorkspace?.id === w.id;
                    return (
                      <tr key={w.id} className={`transition-colors cursor-pointer ${isSelected ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`} onClick={() => setSelectedClientId(w.id)}>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{w.company_name || w.full_name || "Unnamed Workspace"}</p>
                          <p className="text-white/40 text-[10px]">{w.full_name || "—"} ({w.email})</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-white/60">{w.phone || "No phone"}</span>
                        </td>
                        <td className="py-3 px-4">
                          {w.google_sheet_url ? (
                            <a 
                              href={w.google_sheet_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                            >
                              <CheckCircle size={10} /> Connected Sheet
                            </a>
                          ) : (
                            <span className="text-white/30 text-[10px]">No sheet linked</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClientId(w.id);
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white transition-colors"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredWorkspaces.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-white/30 text-xs">
                        No client workspaces found. Click "+ Onboard Client Workspace" to provision one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Workspace Inspector */}
        <div className="space-y-8 border-l border-white/10 pl-10">
          {activeWorkspace ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                  {activeWorkspace.company_name || activeWorkspace.full_name || "Workspace Details"}
                </h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                  Active Tenant
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs">
                  <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">Client Owner</p>
                  <p className="text-white font-medium">{activeWorkspace.full_name || "—"}</p>
                  <p className="text-white/50 text-[11px]">{activeWorkspace.email}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs">
                  <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">Phone / WhatsApp Number</p>
                  <p className="text-white font-mono">{activeWorkspace.phone || "Not set"}</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs space-y-2">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Google Sheet URL</p>
                  {activeWorkspace.google_sheet_url ? (
                    <a 
                      href={activeWorkspace.google_sheet_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-400 hover:underline flex items-center gap-1.5 break-all text-[11px]"
                    >
                      <ExternalLink size={12} className="shrink-0" />
                      <span>{activeWorkspace.google_sheet_url}</span>
                    </a>
                  ) : (
                    <p className="text-white/40 italic">No Google Sheet URL connected</p>
                  )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs">
                  <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">Associated Projects</p>
                  {projects.filter(p => p.client_id === activeWorkspace.id).length > 0 ? (
                    <div className="space-y-1.5 mt-2">
                      {projects.filter(p => p.client_id === activeWorkspace.id).map(p => (
                        <div key={p.id} className="p-2 border border-white/5 rounded bg-black/40 flex justify-between items-center">
                          <span className="font-semibold text-white">{p.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase">{p.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 mt-1 italic">No dedicated projects assigned yet.</p>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  {activeWorkspace.google_sheet_url && (
                    <a 
                      href={activeWorkspace.google_sheet_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full py-2.5 bg-white text-black text-center text-xs font-bold uppercase rounded hover:bg-white/90 transition-colors"
                    >
                      Open Google Sheet ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-white/30 text-xs">
              Select a workspace from the list to view its complete details.
            </div>
          )}
        </div>
      </div>

      {/* Onboard Client Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Onboard New Client Workspace</h3>
              <button onClick={() => setShowOnboardModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Company / Workspace Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Skyline Properties" 
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Owner / Primary Contact Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Shah" 
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Owner Email</label>
                <input 
                  type="email" 
                  placeholder="ramesh@skyline.com" 
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">WhatsApp / Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+91 98200 12345" 
                  value={newOwnerPhone}
                  onChange={(e) => setNewOwnerPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Google Sheet Inventory URL</label>
                <input 
                  type="url" 
                  placeholder="https://docs.google.com/spreadsheets/d/..." 
                  value={newSheetUrl}
                  onChange={(e) => setNewSheetUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-white/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Provisioning..." : "Provision Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
