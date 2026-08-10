import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Phone, Users, CheckCircle, Clock, X, MapPin, Globe, Star, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import { StatCard } from "@/app/components/ui/StatCard";
import { DashboardLayout } from "@/app/components/DashboardLayout";


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
  const [reviewCountFilter, setReviewCountFilter] = useState<string>("");
  const [websiteFilter, setWebsiteFilter] = useState<string>("");
  
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

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

  const filteredLeads = leads.filter(l => {
    if (cityFilter && (l.city || "").toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (statusFilter && l.status !== statusFilter) return false;
    if (ratingFilter) {
       const leadRating = parseFloat(l.rating) || 0;
       if (ratingFilter === "4.5+" && leadRating < 4.5) return false;
       if (ratingFilter === "4.0+" && leadRating < 4.0) return false;
       if (ratingFilter === "3.0+" && leadRating < 3.0) return false;
    }
    if (reviewCountFilter) {
       const leadReviews = parseInt(String(l.reviews || "0").replace(/\D/g, '')) || 0;
       if (reviewCountFilter === "10+" && leadReviews < 10) return false;
       if (reviewCountFilter === "50+" && leadReviews < 50) return false;
       if (reviewCountFilter === "100+" && leadReviews < 100) return false;
    }
    if (websiteFilter) {
       const hasWebsite = l.website && l.website.trim().length > 0;
       if (websiteFilter === "yes" && !hasWebsite) return false;
       if (websiteFilter === "no" && hasWebsite) return false;
    }
    return true;
  });

  const sortedLeads = [...filteredLeads];
  if (sortConfig) {
    sortedLeads.sort((a, b) => {
      if (sortConfig.key === 'rating') {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        if (ratingA < ratingB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (ratingA > ratingB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc'; // default for rating is usually desc to see best first
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <DashboardLayout
      loading={loading}
      title="Sales Team HQ"
      titleAccent="#fbbf24"
      userName={profile?.full_name?.split(" ")[0] ?? "Rep"}
      roleName="Growth Team"
      userEmail={profile?.email ?? ""}
      icon={Phone}
      iconAccent="#fbbf24"
      onSignOut={signOut}
    >
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
                    Showing {filteredLeads.length} leads
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
                    value={reviewCountFilter}
                    onChange={(e) => setReviewCountFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Any # of Reviews</option>
                    <option value="10+">10+ Reviews</option>
                    <option value="50+">50+ Reviews</option>
                    <option value="100+">100+ Reviews</option>
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

              {leads.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded p-10 text-center">
                  <Users size={28} className="mx-auto mb-3 text-white/15" />
                  <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No leads assigned yet</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-20 text-center border-t border-white/5">
                  <Users size={32} className="mx-auto text-white/10 mb-4" />
                  <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>No leads match these filters.</p>
                </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Company</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Info</th>
                        <th 
                          className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors" 
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                          onClick={() => handleSort('rating')}
                        >
                          <div className="flex items-center gap-2">
                            Rating
                            {sortConfig?.key === 'rating' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                            ) : (
                              <ArrowUpDown size={12} className="opacity-50" />
                            )}
                          </div>
                        </th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Status</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedLeads.map((l) => (
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
                              <span className="text-white/40 text-xs ml-1" style={{ fontFamily: "'Inter', sans-serif" }}>({String(l.reviews || "0").replace(/\D/g, '')})</span>
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
              )}
            </motion.div>
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
                  {l.status === 'Converted' && (
                    <div className="bg-[#34d399]/10 border border-[#34d399]/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[#34d399] font-bold text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Developer Assignment</p>
                        <p className="text-white/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Select the developer to hand this project over to.</p>
                      </div>
                      
                      {developers.length === 0 ? (
                        <div className="bg-black/50 px-3 py-2 rounded border border-white/10 text-white/40 text-xs">No Developers Available</div>
                      ) : (
                        <select
                          value={l.developer_id || ""}
                          onChange={(e) => updateDeveloper(l.id, e.target.value)}
                          className="bg-black/50 border border-[#34d399]/30 text-white text-sm px-4 py-2 outline-none rounded transition-colors min-w-[200px]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <option value="" disabled>Select Developer...</option>
                          {developers.map(dev => (
                            <option key={dev.id} value={dev.id}>{dev.full_name || dev.email}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-black text-sm uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Discovery Notes</h3>
                    </div>
                    
                    {/* General Notes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white/40 text-xs font-bold uppercase tracking-widest block" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>General Notes</label>
                        {savingNoteId === l.id + 'notes' && <span className="text-[#34d399] text-[10px] uppercase font-bold tracking-widest animate-pulse" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Saved!</span>}
                      </div>
                      <textarea 
                        className="w-full bg-black/50 border border-white/10 rounded p-4 text-sm text-white/90 h-24 focus:border-white/30 outline-none transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        placeholder="General context about the client..."
                        defaultValue={l.notes || ""}
                        onBlur={async (e) => {
                          setSavingNoteId(l.id + 'notes');
                          await supabase.from("crm_leads").update({ notes: e.target.value }).eq("id", l.id);
                          setLeads(leads.map(lead => lead.id === l.id ? { ...lead, notes: e.target.value } : lead));
                          setTimeout(() => setSavingNoteId(null), 2000);
                        }}
                      />
                    </div>

                    {/* Services Wanted */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[#60c8ff]/80 text-xs font-bold uppercase tracking-widest block" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Services Requested</label>
                        {savingNoteId === l.id + 'services' && <span className="text-[#34d399] text-[10px] uppercase font-bold tracking-widest animate-pulse" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Saved!</span>}
                      </div>
                      <textarea 
                        className="w-full bg-[#60c8ff]/5 border border-[#60c8ff]/20 rounded p-4 text-sm text-white/90 h-20 focus:border-[#60c8ff]/50 outline-none transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        placeholder="What exact services do they need? (e.g., Website, SEO, Branding)"
                        defaultValue={l.services_wanted || ""}
                        onBlur={async (e) => {
                          setSavingNoteId(l.id + 'services');
                          await supabase.from("crm_leads").update({ services_wanted: e.target.value }).eq("id", l.id);
                          setLeads(leads.map(lead => lead.id === l.id ? { ...lead, services_wanted: e.target.value } : lead));
                          setTimeout(() => setSavingNoteId(null), 2000);
                        }}
                      />
                    </div>

                    {/* Budget & Pricing */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[#fbbf24]/80 text-xs font-bold uppercase tracking-widest block" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Budget & Pricing</label>
                        {savingNoteId === l.id + 'budget' && <span className="text-[#34d399] text-[10px] uppercase font-bold tracking-widest animate-pulse" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Saved!</span>}
                      </div>
                      <textarea 
                        className="w-full bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded p-4 text-sm text-white/90 h-20 focus:border-[#fbbf24]/50 outline-none transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        placeholder="What is their budget? Is price an issue?"
                        defaultValue={l.budget_constraints || ""}
                        onBlur={async (e) => {
                          setSavingNoteId(l.id + 'budget');
                          await supabase.from("crm_leads").update({ budget_constraints: e.target.value }).eq("id", l.id);
                          setLeads(leads.map(lead => lead.id === l.id ? { ...lead, budget_constraints: e.target.value } : lead));
                          setTimeout(() => setSavingNoteId(null), 2000);
                        }}
                      />
                    </div>

                    {/* Objections / Roadblocks */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[#f87171]/80 text-xs font-bold uppercase tracking-widest block" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Objections / Real Cause</label>
                        {savingNoteId === l.id + 'objections' && <span className="text-[#34d399] text-[10px] uppercase font-bold tracking-widest animate-pulse" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Saved!</span>}
                      </div>
                      <textarea 
                        className="w-full bg-[#f87171]/5 border border-[#f87171]/20 rounded p-4 text-sm text-white/90 h-20 focus:border-[#f87171]/50 outline-none transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        placeholder="Why are they hesitant? What is the real roadblock preventing a sale?"
                        defaultValue={l.objections || ""}
                        onBlur={async (e) => {
                          setSavingNoteId(l.id + 'objections');
                          await supabase.from("crm_leads").update({ objections: e.target.value }).eq("id", l.id);
                          setLeads(leads.map(lead => lead.id === l.id ? { ...lead, objections: e.target.value } : lead));
                          setTimeout(() => setSavingNoteId(null), 2000);
                        }}
                      />
                    </div>
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

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <button
                      onClick={() => setActiveLeadId(null)}
                      className="w-full bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 py-4 font-black uppercase tracking-widest text-sm transition-colors rounded"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {l.status === 'Converted' && l.developer_id ? "Save & Send to Developer" : "Save Lead Details"}
                    </button>
                    <p className="text-white/30 text-[10px] text-center mt-3 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Notes automatically save as you type
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
