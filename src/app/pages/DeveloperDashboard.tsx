import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Code, FileText, CheckCircle, Clock, X } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import { ProjectChat } from "@/app/components/ProjectChat";
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
      
      // Allow access if developer
      if (!data || data.role !== "developer") {
        onNavigate("home");
        return;
      }
      
      setProfile(data as Profile);
      
      // Fetch CRM leads assigned to this developer
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
      title="Developer Workspace"
      titleAccent="#34d399"
      userName={profile?.full_name?.split(" ")[0] ?? "Dev"}
      roleName="Engineering Team"
      userEmail={profile?.email ?? ""}
      icon={Code}
      iconAccent="#34d399"
      onSignOut={signOut}
    >
        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <StatCard icon={FileText} label="Total Projects" value={crmLeads.length.toString()} accent="#60c8ff" />
          <StatCard icon={Clock} label="In Progress" value={crmLeads.filter(l => l.project_status === 'In Progress').length.toString()} accent="#fbbf24" />
          <StatCard icon={CheckCircle} label="Completed" value={crmLeads.filter(l => l.project_status === 'Completed').length.toString()} accent="#34d399" />
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

              {crmLeads.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded p-10 text-center">
                  <Code size={28} className="mx-auto mb-3 text-white/15" />
                  <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No projects available</p>
                  <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Wait for sales to assign a converted lead.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Project Name</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Info</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Project Status</th>
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
                            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                              Contact via Sales Rep
                            </p>
                            {l.city && (
                              <p className="text-[#34d399]/80 text-[10px] uppercase tracking-wider mt-1 font-bold">{l.city}</p>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={l.project_status || 'Planning'}
                              onChange={(e) => updateProjectStatus(l.id, e.target.value)}
                              className={`bg-black/50 border border-white/10 text-xs px-3 py-1.5 outline-none rounded transition-colors font-bold uppercase tracking-wider
                                ${l.project_status === 'Completed' ? 'text-[#34d399]' : l.project_status === 'In Progress' ? 'text-[#fbbf24]' : 'text-[#60c8ff]'}
                              `}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              <option value="Planning">Planning</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Review">Review</option>
                              <option value="Completed">Completed</option>
                            </select>
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
                      
                      {/* General Notes */}
                      <div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>General Notes</p>
                        <div className="bg-black/50 border border-white/10 rounded p-4 text-sm text-white/90 min-h-[80px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {l.notes ? (
                            <div dangerouslySetInnerHTML={{ __html: l.notes.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <span className="text-white/30 italic">No notes provided.</span>
                          )}
                        </div>
                      </div>

                      {/* Services Requested */}
                      <div>
                        <p className="text-[#60c8ff]/80 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Services Requested</p>
                        <div className="bg-[#60c8ff]/5 border border-[#60c8ff]/20 rounded p-4 text-sm text-[#60c8ff]/90 min-h-[80px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {l.services_wanted ? (
                            <div dangerouslySetInnerHTML={{ __html: l.services_wanted.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <span className="text-[#60c8ff]/30 italic">No specific services listed.</span>
                          )}
                        </div>
                      </div>

                      {/* Budget & Pricing */}
                      <div>
                        <p className="text-[#fbbf24]/80 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Budget & Pricing</p>
                        <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded p-4 text-sm text-[#fbbf24]/90 min-h-[80px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {l.budget_constraints ? (
                            <div dangerouslySetInnerHTML={{ __html: l.budget_constraints.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <span className="text-[#fbbf24]/30 italic">No budget details provided.</span>
                          )}
                        </div>
                      </div>

                      {/* Objections / Roadblocks */}
                      <div>
                        <p className="text-[#f87171]/80 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Objections / Real Cause</p>
                        <div className="bg-[#f87171]/5 border border-[#f87171]/20 rounded p-4 text-sm text-[#f87171]/90 min-h-[80px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {l.objections ? (
                            <div dangerouslySetInnerHTML={{ __html: l.objections.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <span className="text-[#f87171]/30 italic">No objections logged.</span>
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
    </DashboardLayout>
  );
}
