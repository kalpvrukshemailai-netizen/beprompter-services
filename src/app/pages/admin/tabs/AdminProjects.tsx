import React, { useState, useMemo } from "react";
import { Download, Plus, Briefcase, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { Profile, supabase, ProjectStatus, deduplicateProfiles } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/auditLog";

export function AdminProjects({ 
  projects, 
  projectMembers, 
  users, 
  onToggleAssignment, 
  updatingId,
  onRefreshProjects
}: {
  projects: any[];
  projectMembers: any[];
  users: Profile[];
  onToggleAssignment: (projectId: string, userId: string) => void;
  updatingId: string | null;
  onRefreshProjects?: () => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("in_progress");
  const [budget, setBudget] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const cleanUsers = useMemo(() => deduplicateProfiles(users), [users]);
  const clientUsers = cleanUsers.filter(u => u.role === "client");
  const teamMembers = cleanUsers.filter(u => u.role === "developer" || u.role === "sales");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);

    try {
      const selectedClient = clientId || (clientUsers[0]?.id || users[0]?.id);
      const newProject = {
        title: title.trim(),
        client_id: selectedClient,
        description: description.trim() || null,
        status: status,
        budget: budget ? parseFloat(budget) : null,
        target_end_date: targetDate || null,
        start_date: new Date().toISOString().slice(0, 10),
      };

      const { data, error } = await supabase.from("projects").insert(newProject).select();
      if (error) {
        console.warn("Supabase project insert warning:", error.message);
      }

      logAuditEvent({
        action: `Project Created: ${title}`,
        resource: `project:${title}`,
        severity: "medium"
      });

      setNotice(`Project "${title}" created successfully.`);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setBudget("");
      setTargetDate("");
      if (onRefreshProjects) onRefreshProjects();
    } catch (err: any) {
      alert("Error creating project: " + err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleUpdateStatus = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
      logAuditEvent({
        action: `Project Status Changed to ${newStatus}`,
        resource: `project:${projectId}`,
        severity: "low"
      });
      if (onRefreshProjects) onRefreshProjects();
    } catch (e) {
      console.warn("Could not update project status:", e);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 04
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Projects & Team Assignment
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Oversee client deployment deliverables, assign developers and sales representatives, and track delivery progress.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Create Project
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {/* Real Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => {
          const client = Array.isArray(p.client) ? p.client[0] : p.client;
          const assignedIds = projectMembers.filter(m => m.project_id === p.id).map(m => m.user_id);
          
          return (
            <div key={p.id} className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {p.title}
                  </h3>
                  <p className="text-white/50 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Client: <strong className="text-white/80">{client?.full_name || client?.company_name || "Platform Client"}</strong>
                    {client?.email && <span className="text-white/40"> ({client.email})</span>}
                  </p>
                  {p.description && (
                    <p className="text-white/60 text-xs mt-2 italic font-light leading-relaxed">
                      "{p.description}"
                    </p>
                  )}
                </div>
                
                {/* Status select */}
                <select 
                  value={p.status}
                  onChange={(e) => handleUpdateStatus(p.id, e.target.value as ProjectStatus)}
                  className={`border rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer ${
                    p.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    p.status === 'in_progress' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
                    p.status === 'review' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                    'bg-white/10 border-white/20 text-white/70'
                  }`}
                >
                  <option value="planning" className="bg-[#111]">Planning</option>
                  <option value="in_progress" className="bg-[#111]">In Progress</option>
                  <option value="review" className="bg-[#111]">In Review</option>
                  <option value="completed" className="bg-[#111]">Completed</option>
                  <option value="on_hold" className="bg-[#111]">On Hold</option>
                </select>
              </div>

              {p.budget && (
                <div className="flex items-center gap-2 text-xs text-white/60 pt-2 border-t border-white/5">
                  <span className="text-white/40 font-bold uppercase text-[10px]">Budget:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{p.budget.toLocaleString()}</span>
                  {p.target_end_date && (
                    <span className="text-white/40 ml-auto font-mono text-[10px]">Due: {p.target_end_date}</span>
                  )}
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Assigned Team Members ({assignedIds.length})
                </p>
                <div className="space-y-2">
                  {teamMembers.length === 0 ? (
                    <p className="text-white/30 text-xs italic">
                      No developers or sales team accounts found. Add team members in Users & Roles.
                    </p>
                  ) : (
                    teamMembers.map(tm => {
                      const isAssigned = assignedIds.includes(tm.id);
                      return (
                        <label 
                          key={tm.id} 
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            isAssigned 
                              ? 'border-blue-500/30 bg-blue-500/5' 
                              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isAssigned} 
                            onChange={() => onToggleAssignment(p.id, tm.id)}
                            disabled={updatingId === `assign-${p.id}`}
                            className="accent-blue-500 w-4 h-4 cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="text-white text-xs font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {tm.full_name}
                            </p>
                            <p className="text-white/40 text-[10px] capitalize" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {tm.role} · {tm.email}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full border border-white/10 rounded-2xl p-12 text-center text-white/40 space-y-4 bg-white/[0.01]">
            <Briefcase size={32} className="mx-auto text-white/20" />
            <h3 className="text-white font-semibold text-sm">No Client Projects Created Yet</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              Start by creating a client delivery project to assign developers and sales representatives.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-white/90"
            >
              + Create First Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Create Client Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. WhatsApp AI Assistant Deployment" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Client Workspace / Tenant</label>
                <select 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                >
                  <option value="" className="bg-[#111]">-- Select Client Workspace --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id} className="bg-[#111]">
                      {u.company_name ? `${u.company_name} (${u.full_name})` : `${u.full_name} (${u.email})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Description / Deliverables</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Integrate Meta Cloud WhatsApp webhook, configure inventory sheet sync, test consultative prompt spine."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30 resize-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Initial Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                  >
                    <option value="planning" className="bg-[#111]">Planning</option>
                    <option value="in_progress" className="bg-[#111]">In Progress</option>
                    <option value="review" className="bg-[#111]">In Review</option>
                    <option value="completed" className="bg-[#111]">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Budget (₹)</label>
                  <input 
                    type="number" 
                    placeholder="25000" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Target End Date</label>
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-white/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
