import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code, FileText, CheckCircle, Clock, X, Terminal, GitMerge, Archive } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import { StatCard } from "@/app/components/ui/StatCard";
import { DashboardLayout } from "@/app/components/DashboardLayout";

export function DeveloperDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { onNavigate("auth"); return; }
      
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      
      if (!data || data.role !== "developer") {
        onNavigate("home");
        return;
      }
      
      setProfile(data as Profile);
      
      const { data: leadsData } = await supabase.from("crm_leads")
        .select("*")
        .eq("developer_id", user.id)
        .order("created_at", { ascending: false });
      if (leadsData) setCrmLeads(leadsData);
      
      setLoading(false);
    })();
  }, []);

  const updateProjectStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase.from("crm_leads").update({ project_status: newStatus }).eq("id", leadId);
    if (!error) {
      setCrmLeads(crmLeads.map(l => l.id === leadId ? { ...l, project_status: newStatus } : l));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate("home");
  };

  return (
    <DashboardLayout
      loading={loading}
      title="Engineering Workspace"
      titleAccent="#ffffff"
      userName={profile?.full_name?.split(" ")[0] ?? "Dev"}
      roleName="Technical Staff"
      userEmail={profile?.email ?? ""}
      icon={Terminal}
      iconAccent="#ffffff"
      onSignOut={signOut}
    >
        {/* STATS ROW */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden mb-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="bg-[#0a0a0a] p-6">
             <div className="flex items-center gap-3 mb-2 text-white/50">
               <FileText size={16} /> <span className="text-xs font-mono uppercase tracking-widest">Total Projects</span>
             </div>
             <p className="text-4xl font-heading font-medium">{crmLeads.length}</p>
          </div>
          <div className="bg-[#0a0a0a] p-6">
             <div className="flex items-center gap-3 mb-2 text-white/50">
               <Clock size={16} /> <span className="text-xs font-mono uppercase tracking-widest">In Progress</span>
             </div>
             <p className="text-4xl font-heading font-medium">{crmLeads.filter(l => l.project_status === 'In Progress').length}</p>
          </div>
          <div className="bg-[#0a0a0a] p-6">
             <div className="flex items-center gap-3 mb-2 text-white/50">
               <CheckCircle size={16} /> <span className="text-xs font-mono uppercase tracking-widest">Completed</span>
             </div>
             <p className="text-4xl font-heading font-medium">{crmLeads.filter(l => l.project_status === 'Completed').length}</p>
          </div>
        </motion.div>

        {/* PROJECT BOARD */}
        <motion.div
          className="border border-white/10 bg-[#0a0a0a] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-sm font-mono uppercase tracking-widest text-white/70">Project Pipeline</h2>
          </div>

          {crmLeads.length === 0 ? (
            <div className="p-16 text-center">
              <Archive size={24} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60 text-sm font-medium mb-1">No active projects</p>
              <p className="text-white/40 text-xs font-sans">You will be notified when a lead is converted and assigned.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-white/40 font-normal">Project</th>
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-white/40 font-normal">Contact / Firm</th>
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-white/40 font-normal">Status</th>
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-white/40 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-sans">
                  {crmLeads.map((l) => (
                    <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-white/90">{l.name}</p>
                      </td>
                      <td className="p-4 text-white/60">
                        {l.firm_type || "N/A"} {l.city ? `• ${l.city}` : ""}
                      </td>
                      <td className="p-4">
                        <select
                          value={l.project_status || 'Planning'}
                          onChange={(e) => updateProjectStatus(l.id, e.target.value)}
                          className="bg-transparent border border-white/20 text-xs px-2 py-1 outline-none rounded font-medium text-white/70 hover:border-white/40 transition-colors focus:border-white focus:bg-white/10"
                        >
                          <option value="Planning" className="bg-black">Planning</option>
                          <option value="In Progress" className="bg-black">In Progress</option>
                          <option value="Review" className="bg-black">Review</option>
                          <option value="Completed" className="bg-black">Completed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setActiveLeadId(l.id)}
                          className="text-xs font-medium text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white" 
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* SLIDE-OVER PANEL */}
        <AnimatePresence>
          {activeLeadId && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setActiveLeadId(null)}
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="relative w-full max-w-lg h-full flex flex-col bg-[#0a0a0a] border-l border-white/10 shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-white/70">Project Spec</h2>
                  <button 
                    onClick={() => setActiveLeadId(null)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto font-sans flex-1">
                  {(() => {
                    const l = crmLeads.find(l => l.id === activeLeadId);
                    if (!l) return null;
                    return (
                        <div className="space-y-8">
                          
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">General Notes</p>
                            <div className="text-sm text-white/80 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-md">
                              {l.notes ? (
                                <div dangerouslySetInnerHTML={{ __html: l.notes.replace(/\n/g, '<br/>') }} />
                              ) : (
                                <span className="text-white/30 italic">No notes provided.</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Scope / Services</p>
                            <div className="text-sm text-white/80 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-md">
                              {l.services_wanted ? (
                                <div dangerouslySetInnerHTML={{ __html: l.services_wanted.replace(/\n/g, '<br/>') }} />
                              ) : (
                                <span className="text-white/30 italic">No specific scope listed.</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Constraints & Budget</p>
                            <div className="text-sm text-white/80 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-md">
                              {l.budget_constraints ? (
                                <div dangerouslySetInnerHTML={{ __html: l.budget_constraints.replace(/\n/g, '<br/>') }} />
                              ) : (
                                <span className="text-white/30 italic">No constraints provided.</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Risks & Objections</p>
                            <div className="text-sm text-white/80 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-md">
                              {l.objections ? (
                                <div dangerouslySetInnerHTML={{ __html: l.objections.replace(/\n/g, '<br/>') }} />
                              ) : (
                                <span className="text-white/30 italic">No risks logged.</span>
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
        </AnimatePresence>
    </DashboardLayout>
  );
}
