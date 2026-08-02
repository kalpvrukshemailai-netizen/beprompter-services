import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Phone, Users, CheckCircle, Clock, X, MapPin, Globe, Star } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";

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

export function SalesDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<Profile[]>([]);

  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const [cityFilter, setCityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [websiteFilter, setWebsiteFilter] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { onNavigate("auth"); return; }
      
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      
      // Allow access if sales
      if (!data || data.role !== "sales") {
        onNavigate("home");
        return;
      }
      
      setProfile(data as Profile);
      
      // Fetch CRM leads assigned to this sales rep
      const { data: leadsData } = await supabase.from("crm_leads")
        .select("*")
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false });
        
      if (leadsData) setLeads(leadsData);

      // Fetch developers
      const { data: devsData } = await supabase.from("profiles").select("*").eq("role", "developer");
      if (devsData) setDevelopers(devsData);
      
      setLoading(false);
    })();
  }, []);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    let updateData: any = { status: newStatus };
    const lead = leads.find(l => l.id === leadId);
    
    // Auto-assign developer if converting and none assigned
    if (newStatus === "Converted" && lead && !lead.developer_id && developers.length > 0) {
      const { data: globalLeads } = await supabase.from("crm_leads").select("developer_id").eq("status", "Converted").not("developer_id", "is", null);
      const counts: Record<string, number> = {};
      developers.forEach(d => counts[d.id] = 0);
      globalLeads?.forEach(l => { if (counts[l.developer_id] !== undefined) counts[l.developer_id]++; });
      
      let minId = developers[0].id;
      let minCount = counts[minId];
      developers.forEach(d => {
        if (counts[d.id] < minCount) { minCount = counts[d.id]; minId = d.id; }
      });
      updateData.developer_id = minId;
    }

    const { error } = await supabase.from("crm_leads").update(updateData).eq("id", leadId);
    if (!error) {
      setLeads(leads.map(l => l.id === leadId ? { ...l, ...updateData } : l));
    }
  };

  const updateDeveloper = async (leadId: string, devId: string) => {
    const { error } = await supabase.from("crm_leads").update({ developer_id: devId }).eq("id", leadId);
    if (!error) {
      setLeads(leads.map(l => l.id === leadId ? { ...l, developer_id: devId } : l));
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
            <p className="text-white/30 text-xs tracking-[0.25em] uppercase mb-0.5 text-[#fbbf24]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Sales CRM</p>
            <p className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Welcome back, {profile?.full_name?.split(" ")[0] ?? "Sales"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Sales Team</p>
              <p className="text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{profile?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center">
              <Phone size={14} className="text-[#fbbf24]" />
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
          <StatCard icon={Users} label="Total Leads" value={leads.length.toString()} accent="#fbbf24" />
          <StatCard icon={Clock} label="In Progress" value={leads.filter(l => l.status === "In Progress").length.toString()} accent="#60c8ff" />
          <StatCard icon={CheckCircle} label="Closed" value={leads.filter(l => l.status === "Closed").length.toString()} accent="#34d399" />
          <StatCard icon={Phone} label="Contacted" value={leads.filter(l => l.status === "Contacted").length.toString()} accent="#a78bfa" />
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
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-white font-black text-sm tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>My Leads</p>
                  <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Showing {(() => {
                      return leads.filter(l => {
                        if (cityFilter && (l.city || "").toLowerCase() !== cityFilter.toLowerCase()) return false;
                        if (statusFilter && l.status !== statusFilter) return false;
                        if (ratingFilter) {
                           const leadRating = parseFloat(l.rating) || 0;
                           if (ratingFilter === "4.5+" && leadRating < 4.5) return false;
                           if (ratingFilter === "4.0+" && leadRating < 4.0) return false;
                           if (ratingFilter === "3.0+" && leadRating < 3.0) return false;
                        }
                        if (websiteFilter) {
                           const hasWebsite = l.website && l.website.trim().length > 0;
                           if (websiteFilter === "yes" && !hasWebsite) return false;
                           if (websiteFilter === "no" && hasWebsite) return false;
                        }
                        return true;
                      }).length;
                    })()} leads
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Cities</option>
                    {Array.from(new Set(leads.map(l => l.city).filter(Boolean))).sort().map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                    <option value="Not Converted">Not Converted</option>
                  </select>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Ratings</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.0+">4.0+ Stars</option>
                    <option value="3.0+">3.0+ Stars</option>
                  </select>
                  <select
                    value={websiteFilter}
                    onChange={(e) => setWebsiteFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Website: Any</option>
                    <option value="yes">Has Website</option>
                    <option value="no">No Website</option>
                  </select>
                </div>
              </div>

              {(() => {
                const filteredLeads = leads.filter(l => {
                  if (cityFilter && (l.city || "").toLowerCase() !== cityFilter.toLowerCase()) return false;
                  if (statusFilter && l.status !== statusFilter) return false;
                  if (ratingFilter) {
                     const leadRating = parseFloat(l.rating) || 0;
                     if (ratingFilter === "4.5+" && leadRating < 4.5) return false;
                     if (ratingFilter === "4.0+" && leadRating < 4.0) return false;
                     if (ratingFilter === "3.0+" && leadRating < 3.0) return false;
                  }
                  if (websiteFilter) {
                     const hasWebsite = l.website && l.website.trim().length > 0;
                     if (websiteFilter === "yes" && !hasWebsite) return false;
                     if (websiteFilter === "no" && hasWebsite) return false;
                  }
                  return true;
                });

                if (leads.length === 0) {
                  return (
                    <div className="border border-dashed border-white/10 rounded p-10 text-center">
                      <Users size={28} className="mx-auto mb-3 text-white/15" />
                      <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No leads assigned yet</p>
                    </div>
                  );
                }

                if (filteredLeads.length === 0) {
                  return (
                    <div className="border border-dashed border-white/10 rounded p-10 text-center">
                      <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No leads match these filters.</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Company</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Info</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Rating</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Status</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Assign To</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((l) => (
                        <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                          <td className="p-4">
                            <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{l.name}</p>
                            {l.firm_type && <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">{l.firm_type}</p>}
                            {l.website && (
                              <a href={l.website.startsWith('http') ? l.website : `https://${l.website}`} target="_blank" rel="noreferrer" className="text-white/40 text-xs hover:text-white mt-1 inline-flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <Globe size={10} /> Website
                              </a>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="text-white/80 text-xs flex items-center gap-2 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                              <Phone size={12} className="text-white/30" /> {l.phone || "No phone"}
                            </p>
                            <p className="text-white/60 text-xs flex items-start gap-2 max-w-[200px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                              <MapPin size={12} className="text-white/30 shrink-0 mt-0.5" /> {l.address || "No address"}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-white/90 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{l.rating || "-"}</span>
                              <span className="text-white/40 text-xs ml-1" style={{ fontFamily: "'Inter', sans-serif" }}>({l.reviews || "0"})</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <select
                              value={l.status}
                              onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                              className={`bg-black/50 border border-white/10 text-xs px-3 py-1.5 outline-none rounded transition-colors font-bold uppercase tracking-wider
                                ${l.status === 'Converted' ? 'text-[#34d399]' : l.status === 'Follow-up' ? 'text-[#60c8ff]' : l.status === 'Not Converted' ? 'text-[#f87171]' : 'text-white'}
                              `}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              <option value="New">New</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Converted">Converted</option>
                              <option value="Not Converted">Not Converted</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                        {l.status === 'Converted' ? (
                          developers.length === 0 ? (
                            <span className="text-white/30 text-[10px] uppercase">No devs</span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="text-white/40 text-[9px] uppercase tracking-widest mb-1 font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Developer</span>
                              <select
                                value={l.developer_id || ""}
                                onChange={(e) => updateDeveloper(l.id, e.target.value)}
                                className="bg-black/50 border border-white/10 text-white text-[10px] px-2 py-1 outline-none rounded transition-colors w-28 text-right"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                {developers.map(dev => (
                                  <option key={dev.id} value={dev.id}>{dev.full_name}</option>
                                ))}
                              </select>
                            </div>
                          )
                        ) : (
                          <span className="text-white/20 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                            <button 
                              onClick={() => setActiveLeadId(l.id)}
                              className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors" 
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
              })()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lead Details Overlay */}
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-[#0a0a0a] shadow-2xl flex flex-col border-l border-white/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div>
                <h2 className="text-white font-black text-xl uppercase tracking-wider mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {leads.find(l => l.id === activeLeadId)?.name || "Lead Details"}
                </h2>
                <p className="text-white/40 text-xs uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {leads.find(l => l.id === activeLeadId)?.firm_type || "CRM Profile"}
                </p>
              </div>
              <button onClick={() => setActiveLeadId(null)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {leads.filter(l => l.id === activeLeadId).map(l => (
                <div key={l.id} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white/40 text-xs font-bold uppercase tracking-widest block" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Notes</label>
                      {savingNoteId === l.id && <span className="text-[#34d399] text-[10px] uppercase font-bold tracking-widest animate-pulse" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Saved!</span>}
                    </div>
                    <textarea 
                      className="w-full bg-black/50 border border-white/10 rounded p-4 text-sm text-white/90 h-32 focus:border-white/30 outline-none transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      placeholder="Add your sales notes here..."
                      defaultValue={l.notes || ""}
                      onBlur={async (e) => {
                        setSavingNoteId(l.id);
                        await supabase.from("crm_leads").update({ notes: e.target.value }).eq("id", l.id);
                        setLeads(leads.map(lead => lead.id === l.id ? { ...lead, notes: e.target.value } : lead));
                        setTimeout(() => setSavingNoteId(null), 2000);
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <Phone size={16} className="text-white/40 mb-2" />
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Phone</p>
                      <p className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{l.phone || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <Globe size={16} className="text-white/40 mb-2" />
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Website</p>
                      <p className="text-white text-sm truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {l.website ? <a href={l.website.startsWith('http') ? l.website : `https://${l.website}`} target="_blank" rel="noreferrer" className="hover:underline">{l.website}</a> : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <MapPin size={16} className="text-white/40 mb-2" />
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Address</p>
                      <p className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{l.address || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <MapPin size={16} className="text-white/40 mb-2" />
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>City</p>
                      <p className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{l.city || "N/A"}</p>
                    </div>
                  </div>
                  
                  {l.google_link && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <Globe size={16} className="text-white/40 mb-2" />
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Google Maps Link</p>
                      <p className="text-white text-sm truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <a href={l.google_link} target="_blank" rel="noreferrer" className="text-[#60c8ff] hover:underline">{l.google_link}</a>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
