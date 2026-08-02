import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, User, MessageSquare, FileText, Clock, ArrowRight, Bot, Zap, Mic, X } from "lucide-react";
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

export function ClientDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { onNavigate("auth"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        if (data.role === "admin") { onNavigate("admin-dashboard"); return; }
        if (data.role === "developer") { onNavigate("developer-dashboard"); return; }
        if (data.role === "sales") { onNavigate("sales-dashboard"); return; }
      }
      setProfile(data as Profile ?? { id: user.id, role: "client", full_name: user.email });
      
      const { data: projectsData } = await supabase.from("projects").select("*").eq("client_id", user.id);
      if (projectsData) setProjects(projectsData);

      setLoading(false);
    })();
  }, []);

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
            <p className="text-white/30 text-xs tracking-[0.25em] uppercase mb-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Client Portal</p>
            <p className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{profile?.company_name}</p>
              <p className="text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{profile?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
              <User size={14} className="text-white/60" />
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
          <StatCard icon={FileText} label="Active Projects" value={projects.length.toString()} accent="#60c8ff" />
          <StatCard icon={MessageSquare} label="Messages" value="0" accent="#a78bfa" />
          <StatCard icon={Clock} label="Hours Saved" value="—" accent="#34d399" />
          <StatCard icon={Bot} label="AI Systems" value="0" accent="#fbbf24" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active projects */}
            <motion.div
              className="border border-white/8 p-6"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-white font-black text-sm tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Your Projects</p>
              </div>
              {projects.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded p-10 text-center">
                  <Bot size={28} className="mx-auto mb-3 text-white/15" />
                  <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No active projects yet</p>
                  <p className="text-white/20 text-xs mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Book a free AI strategy call to get started.
                  </p>
                  <motion.button
                    onClick={() => onNavigate("contact")}
                    className="inline-flex items-center gap-2 bg-white text-black text-xs font-black tracking-widest uppercase px-6 py-3 hover:bg-white/90 transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    BOOK STRATEGY CALL <ArrowRight size={12} />
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((p) => (
                    <div key={p.id} className="border border-white/10 bg-white/5 p-5 flex items-center justify-between">
                       <div>
                         <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.title}</p>
                         <p className="text-white/50 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Status: <span className="text-[#60c8ff] uppercase tracking-wider font-bold">{p.status}</span></p>
                       </div>
                       <button 
                         onClick={() => setActiveProjectId(p.id)}
                         className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors" 
                         style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                       >
                         View Details
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent activity */}
            <motion.div
              className="border border-white/8 p-6"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-white font-black text-sm tracking-wider uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Recent Activity</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-3 border-b border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <p className="text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Account created — welcome to BePrompter</p>
                  <span className="ml-auto text-white/15 text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Just now</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Profile card */}
            <motion.div
              className="border border-white/8 p-6"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-white font-black text-sm tracking-wider uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Your Profile</p>
              <div className="space-y-3">
                {[
                  ["Name", profile?.full_name],
                  ["Company", profile?.company_name],
                  ["Email", profile?.email],
                  ["Industry", profile?.industry ?? "—"],
                  ["Project Type", profile?.project_type ?? "—"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="text-white/30 text-xs uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{l}</span>
                    <span className="text-white/70 text-xs text-right max-w-[55%]" style={{ fontFamily: "'Inter', sans-serif" }}>{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Services CTA */}
            <motion.div
              className="border border-white/8 p-6"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            >
              <p className="text-white font-black text-sm tracking-wider uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Explore Services</p>
              <div className="space-y-2">
                {[
                  { icon: Bot, label: "AI Chatbots", accent: "#60c8ff" },
                  { icon: Mic, label: "AI Voice Agents", accent: "#a78bfa" },
                  { icon: Zap, label: "Workflow Automation", accent: "#34d399" },
                ].map(({ icon: Icon, label, accent }) => (
                  <button
                    key={label}
                    onClick={() => onNavigate("services")}
                    className="w-full flex items-center gap-3 py-2.5 px-3 border border-white/6 hover:border-white/20 transition-colors text-left"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <Icon size={13} style={{ color: accent }} />
                    <span className="text-white/50 text-xs font-semibold uppercase tracking-wide hover:text-white transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</span>
                    <ArrowRight size={10} className="ml-auto text-white/20" />
                  </button>
                ))}
                <button
                  onClick={() => onNavigate("services")}
                  className="w-full text-center text-white/25 hover:text-white text-xs font-bold uppercase tracking-wider py-2 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  View All Services →
                </button>
              </div>
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
    </div>
  );
}
