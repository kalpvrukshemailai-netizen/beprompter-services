import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Code, FileText, CheckCircle, Clock, X } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import { ProjectChat } from "@/app/components/ProjectChat";

function StatCard({ icon: Icon, label, value, accent = "#60c8ff" }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div className="border border-white/8 p-6 flex items-start gap-4" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-white font-black text-2xl leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
        <p className="text-white/40 text-xs uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</p>
      </div>
    </div>
  );
}

export function DeveloperDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { onNavigate("auth"); return; }
      
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      
      // Allow access if developer
      if (!data || data.role !== "developer") {
        onNavigate("home");
        return;
      }
      
      setProfile(data as Profile);
      
      const { data: assignments } = await supabase.from("project_members").select("project_id").eq("user_id", user.id);
      const assignedIds = assignments?.map(a => a.project_id) || [];
      
      let projectsData: any[] = [];
      if (assignedIds.length > 0) {
        const { data } = await supabase.from("projects")
          .select("*, profiles(full_name, company_name)")
          .in("id", assignedIds)
          .order("created_at", { ascending: false });
        if (data) projectsData = data;
      }
      setProjects(projectsData);

      // Fetch CRM leads assigned to this developer
      const { data: leadsData } = await supabase.from("crm_leads")
        .select("*")
        .eq("developer_id", user.id)
        .order("created_at", { ascending: false });
      if (leadsData) setCrmLeads(leadsData);
      
      setLoading(false);
    })();
  }, []);

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
    if (!error) {
      setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Top bar */}
      <div className="border-b border-white/8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/30 text-xs tracking-[0.25em] uppercase mb-0.5 text-[#34d399]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Developer Workspace</p>
            <p className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Welcome back, {profile?.full_name?.split(" ")[0] ?? "Dev"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Engineering Team</p>
              <p className="text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{profile?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center">
              <Code size={14} className="text-[#34d399]" />
            </div>
            <motion.button
              onClick={signOut}
              className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={13} /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <StatCard icon={FileText} label="Total Projects" value={projects.length.toString()} accent="#60c8ff" />
          <StatCard icon={Clock} label="In Progress" value={projects.filter(p => p.status === "in_progress").length.toString()} accent="#fbbf24" />
          <StatCard icon={CheckCircle} label="Completed" value={projects.filter(p => p.status === "completed").length.toString()} accent="#34d399" />
          <StatCard icon={Code} label="Open Tasks" value="0" accent="#a78bfa" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active projects */}
            <motion.div
              className="border border-white/8 p-6"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-white font-black text-sm tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Project Board</p>
              </div>

              {projects.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded p-10 text-center">
                  <Code size={28} className="mx-auto mb-3 text-white/15" />
                  <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No projects available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Project Name</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Client</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Status</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{p.title}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-white/60 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{p.profiles?.company_name || p.profiles?.full_name || "Unknown Client"}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={p.status}
                              onChange={(e) => updateProjectStatus(p.id, e.target.value)}
                              className={`bg-black/50 border border-white/10 text-xs px-3 py-1.5 outline-none rounded transition-colors font-bold uppercase tracking-wider
                                ${p.status === 'completed' ? 'text-[#34d399]' : p.status === 'in_progress' ? 'text-[#fbbf24]' : 'text-white'}
                              `}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              <option value="planning">Planning</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => setActiveProjectId(p.id)}
                              className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors" 
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              View Board
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Converted CRM Leads */}
            <motion.div
              className="border border-white/8 p-6"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-white font-black text-sm tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Converted Leads (CRM)</p>
              </div>

              {crmLeads.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded p-10 text-center">
                  <FileText size={28} className="mx-auto mb-3 text-white/15" />
                  <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No leads assigned yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Company</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Info</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crmLeads.map((l) => (
                        <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{l.name}</p>
                            {l.firm_type && <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">{l.firm_type}</p>}
                          </td>
                          <td className="p-4">
                            <p className="text-white/80 text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {l.phone || "No phone"}
                            </p>
                            {l.city && (
                              <p className="text-[#34d399]/80 text-[10px] uppercase tracking-wider mt-1 font-bold">{l.city}</p>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => setActiveLeadId(l.id)}
                              className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors" 
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              View Notes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Project Details / Chat Overlay */}
      {activeProjectId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveProjectId(null)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-[#0a0a0a] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white font-black text-xl uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {projects.find(p => p.id === activeProjectId)?.title || "Project Details"}
              </h2>
              <button onClick={() => setActiveProjectId(null)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ProjectChat projectId={activeProjectId} currentUserId={profile?.id || ""} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Lead Notes Overlay */}
      {activeLeadId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveLeadId(null)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-xl h-full flex flex-col border-l border-white/10 shadow-2xl"
            style={{ backgroundColor: "#0f0f0f" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-black text-xl uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Lead Details</h2>
              <button 
                onClick={() => setActiveLeadId(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {(() => {
                const l = crmLeads.find(l => l.id === activeLeadId);
                if (!l) return null;
                return (
                  <div className="space-y-6">
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Sales Notes</p>
                      <div className="bg-black/50 border border-white/10 rounded p-4 text-sm text-white/90 min-h-[120px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {l.notes ? (
                          <div dangerouslySetInnerHTML={{ __html: l.notes.replace(/\n/g, '<br/>') }} />
                        ) : (
                          <span className="text-white/30 italic">No notes provided by sales rep.</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
