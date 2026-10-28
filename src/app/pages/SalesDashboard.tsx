import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Phone, Users, CheckCircle, Check, Copy, Clock, X, MapPin, Globe, Star, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { supabase, Profile, isLeadAssignedToRep, isAdminEmail } from "@/lib/supabase";
import { INITIAL_OPERATIONAL_LEADS } from "@/lib/operationalLeads";
import { StatCard } from "@/app/components/ui/StatCard";
import { LayoutDashboard, Kanban, ListTodo, FileText, Settings, HelpCircle, ChevronDown, ChevronRight, Search, Plus, Download } from "lucide-react";
import { OverviewTab } from "./sales/OverviewTab";
import { PipelineTab } from "./sales/PipelineTab";
import { ActivityTab } from "./sales/ActivityTab";
import { ScriptsTab } from "./sales/ScriptsTab";

const CopyableText = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!text || text === "—") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!text || text === "—") return <span className="text-white/30 text-xs">—</span>;

  return (
    <div 
      className="group flex items-center gap-2 cursor-pointer w-full"
      onDoubleClick={handleCopy}
      onTouchStart={(e) => {
        const now = Date.now();
        const target = e.currentTarget as any;
        const lastTap = target.lastTap || 0;
        if (now - lastTap < 300) {
          handleCopy(e);
          target.lastTap = 0;
        } else {
          target.lastTap = now;
        }
      }}
    >
      <p className="text-white/80 text-xs max-w-[130px] truncate" style={{ fontFamily: "'Inter', sans-serif" }} title={text}>
        {text}
      </p>
      <button 
        onClick={handleCopy}
        className="text-white/20 hover:text-[#fbbf24] transition-colors md:opacity-0 md:group-hover:opacity-100 flex-shrink-0"
        title="Copy"
      >
        {copied ? <Check size={12} className="text-[#34d399]" /> : <Copy size={12} />}
      </button>
    </div>
  );
};

export function SalesDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<Profile[]>([]);
  const [allGlobalLeads, setAllGlobalLeads] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "pipeline" | "activity" | "scripts">("overview");
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  
  const [errorInfo, setErrorInfo] = useState<any>(null);

  if (errorInfo) {
    return (
      <div className="p-10 text-red-500 bg-black min-h-screen">
        <h1 className="text-2xl mb-4">Dashboard Crashed!</h1>
        <pre className="text-xs">{errorInfo.toString()}</pre>
        <pre className="text-xs mt-4">{errorInfo.stack}</pre>
      </div>
    );
  }

  const [fileFilter, setFileFilter] = useState<string>("");
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
        if (isAdminEmail(user.email)) {
          onNavigate("admin-dashboard");
          return;
        }
        onNavigate("home");
        return;
      }
      
      setProfile(data as Profile);
      
      // Fetch CRM leads assigned to this sales rep.
      // assigned_to can be stored as UUID, full email, username prefix, or any
      // partial string (e.g. "namitakumari", "namitakumari4000", full email, UUID).
      // Strategy: fetch a broad candidate set from DB using ilike patterns + exact
      // UUID, then do a final client-side pass with isLeadAssignedToRep to be accurate.
      const repEmail = user.email || "";
      const repUsername = repEmail ? repEmail.split("@")[0] : ""; // e.g. "namitakumari4000"
      // Core name fragment used for ilike (everything before digits, or first 8 chars)
      const repNameFragment = repUsername.replace(/[0-9]+$/, "") || repUsername.slice(0, 8);
      // e.g. "namitakumari"

      const fetchAllPagesByOr = async (orFilter: string): Promise<any[]> => {
        const results: any[] = [];
        let pg = 0;
        const pageSize = 1000;
        while (true) {
          const { data: chunk } = await supabase.from("crm_leads")
            .select("*")
            .or(orFilter)
            .order("created_at", { ascending: false })
            .range(pg * pageSize, (pg + 1) * pageSize - 1);
          if (chunk && chunk.length > 0) {
            results.push(...chunk);
            if (chunk.length < pageSize) break;
          } else break;
          pg++;
        }
        return results;
      };

      // Fetch ALL profile rows for this email — admin's deduplicateProfiles may have
      // picked a DIFFERENT profile UUID than user.id when bulk-assigning leads.
      // We must query with every UUID associated with this email.
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", repEmail);
      const allProfileIds = (allProfiles || []).map((p: any) => p.id).filter(Boolean);

      // Build a broad OR filter covering all possible assigned_to formats:
      //   - Every profile UUID for this email (catches duplicate profile scenarios)
      //   - Auth UUID (user.id)
      //   - Full email string
      //   - Username prefix (namitakumari4000)
      //   - ilike pattern on name fragment (namitakumari) to catch partial/display-name writes
      const idSet = new Set<string>([user.id, ...allProfileIds]);
      const orParts: string[] = Array.from(idSet).map(id => `assigned_to.eq.${id}`);
      if (repEmail) orParts.push(`assigned_to.eq.${repEmail}`);
      if (repUsername && !idSet.has(repUsername)) orParts.push(`assigned_to.eq.${repUsername}`);
      if (repNameFragment && repNameFragment.length >= 4) {
        orParts.push(`assigned_to.ilike.%${repNameFragment}%`);
      }

      const rawLeads = await fetchAllPagesByOr(orParts.join(","));

      // Deduplicate by ID only — trust the DB query filter (no client-side isLeadAssignedToRep
      // drop, since the ilike-scoped OR already limits to this rep's leads)
      const seenIds = new Set<string>();
      let allLeads: any[] = [];
      for (const lead of rawLeads) {
        if (!seenIds.has(lead.id)) {
          seenIds.add(lead.id);
          allLeads.push(lead);
        }
      }
      
      if (allLeads.length === 0) {
        // Fall back to shared operational CRM leads
        localStorage.removeItem("beprompter_crm_leads_v5");
        localStorage.removeItem("beprompter_crm_leads_v4");
        localStorage.removeItem("beprompter_crm_leads_v3");
        // Use v7 (current admin cache key)
        const cachedStr = localStorage.getItem("beprompter_crm_leads_v7") ||
                          localStorage.getItem("beprompter_crm_leads_v6");
        let pool = INITIAL_OPERATIONAL_LEADS;
        if (cachedStr) {
          try {
            const parsed = JSON.parse(cachedStr);
            if (Array.isArray(parsed) && parsed.length > 0) pool = parsed;
          } catch (e) {}
        }
        allLeads = pool.filter(l => isLeadAssignedToRep(l.assigned_to, { id: user.id, email: repEmail }));
        setAllGlobalLeads(pool.map(l => ({ status: l.status, assigned_to: l.assigned_to })));
      } else {
        // Fetch global leads for stats
        const { data: globalData } = await supabase.from("crm_leads").select("status, assigned_to");
        if (globalData) setAllGlobalLeads(globalData);
      }

      setLeads(allLeads);

      // Fetch developers
      const { data: devsData } = await supabase.from("profiles").select("*").eq("role", "developer");
      if (devsData) setDevelopers(devsData);
      
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["overview", "leads", "pipeline", "activity", "scripts"].includes(hash)) {
        setActiveTab(hash as any);
      }
    };
    handleHashChange(); // Run once on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: "overview" | "leads" | "pipeline" | "activity" | "scripts") => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleCreateLead = async (initialStatus = "New") => {
    const name = window.prompt("Enter lead name or company:");
    if (!name || !profile) return;
    
    try {
      const { data, error } = await supabase.from("crm_leads").insert([{
        name,
        status: initialStatus,
        assigned_to: profile.id
      }]).select().single();
      
      if (data && !error) {
        setLeads(prev => [data, ...prev]);
        setActiveLeadId(data.id);
      }
    } catch (e) {
      console.error("Error creating lead", e);
    }
  };

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

    setLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, ...updateData } : l);
      syncLeadUpdateToCache(leadId, updateData);
      return updated;
    });

    try {
      await supabase.from("crm_leads").update(updateData).eq("id", leadId);
    } catch (e) {}
  };

  const syncLeadUpdateToCache = (leadId: string, partial: any) => {
    try {
      const cachedStr = localStorage.getItem("beprompter_crm_leads_v4");
      if (cachedStr) {
        const pool = JSON.parse(cachedStr);
        const updated = pool.map((l: any) => l.id === leadId ? { ...l, ...partial } : l);
        localStorage.setItem("beprompter_crm_leads_v4", JSON.stringify(updated));
      }
    } catch (e) {}
  };

  const updateDeveloper = async (leadId: string, devId: string) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, developer_id: devId } : l);
      syncLeadUpdateToCache(leadId, { developer_id: devId });
      return updated;
    });

    try {
      await supabase.from("crm_leads").update({ developer_id: devId }).eq("id", leadId);
    } catch (e) {}
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
    if (fileFilter && l.source_file !== fileFilter) return false;
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
    <ErrorBoundary onError={(err) => setErrorInfo(err)}>
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
        {/* Logo */}
        <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="font-black text-xl tracking-tighter text-white">BE</div>
          <div className="font-black text-[10px] tracking-[0.2em] text-white">BEPROMPTER</div>
        </div>

        {/* Workspace Dropdown */}
        <div className="px-4 mb-6">
          <button className="w-full flex items-center justify-between p-2 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="text-left">
              <p className="text-xs text-white font-medium">Sales workspace</p>
              <p className="text-[10px] text-white/50">Professional plan</p>
            </div>
            <ChevronDown size={14} className="text-white/50" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="px-4 space-y-1 flex-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3 px-2 mt-2">Workspace</p>
          <button onClick={() => handleTabChange("overview")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}><LayoutDashboard size={14} /> Overview</button>
          <button onClick={() => handleTabChange("leads")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'leads' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}><Users size={14} /> My Leads</button>
          <button onClick={() => handleTabChange("pipeline")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'pipeline' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}><Kanban size={14} /> Pipeline</button>
          <button onClick={() => handleTabChange("activity")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'activity' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}><ListTodo size={14} /> Activity & Follow-ups</button>
          <button onClick={() => handleTabChange("scripts")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'scripts' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}><FileText size={14} /> Sales Scripts</button>
        </div>

        {/* Target Widget */}
        <div className="p-4 mx-4 mb-6 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest mb-2">October Target</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg font-semibold text-white">₹8.4L</span>
            <span className="text-xs text-white/40">/ 12L</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white rounded-full" style={{ width: '70%' }} />
          </div>
          <p className="text-[9px] text-white/40">70% achieved · 22 days left</p>
        </div>

        {/* Bottom menu */}
        <div className="px-4 pb-6 space-y-1 border-t border-white/10 pt-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-white/50 hover:bg-white/5 hover:text-white/90"><Settings size={14} /> Settings</button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-white/50 hover:bg-white/5 hover:text-white/90"><HelpCircle size={14} /> Help & resources</button>
          
          <div className="flex items-center justify-between px-3 py-2 mt-2 group cursor-pointer" onClick={signOut}>
            <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white">
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-white font-medium truncate">{profile?.full_name}</p>
                  <p className="text-[10px] text-white/50 truncate">Sales executive</p>
                </div>
            </div>
            <LogOut size={12} className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto relative bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-10 py-8">
          {/* Header Breadcrumbs */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
              BEPROMPTER <ChevronRight size={10} /> <span className="text-white/80">{
                activeTab === "overview" ? "Overview" :
                activeTab === "leads" ? "My Leads" :
                activeTab === "pipeline" ? "Pipeline" :
                activeTab === "activity" ? "Activity & Follow-ups" : "Sales Scripts"
              }</span>
            </div>
            <div className="text-[10px] text-white/30 font-mono">
              Fri, 04 Oct 2024
            </div>
          </div>

          {activeTab === "overview" && <OverviewTab leads={leads} globalLeads={allGlobalLeads} onLeadClick={setActiveLeadId} />}
          {activeTab === "pipeline" && <PipelineTab leads={leads} onLeadClick={setActiveLeadId} onAddOpportunity={handleCreateLead} onUpdateStatus={updateLeadStatus} />}
          {activeTab === "activity" && <ActivityTab leads={leads} onLeadClick={setActiveLeadId} onAddOpportunity={() => handleCreateLead("Follow-up")} />}
          {activeTab === "scripts" && <ScriptsTab />}
          
          {/* Leads Tab Content */}
          <div className={activeTab === "leads" ? "block animate-in fade-in duration-500" : "hidden"}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-light tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                Every relationship starts here.
              </h1>
              <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-transparent border border-white/20 text-white rounded hover:bg-white/5 transition-colors">
                    <Download size={14} /> Import leads
                  </button>
                  <button onClick={() => handleCreateLead()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-white/90 transition-colors">
                    <Plus size={14} /> Add lead
                  </button>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div className="relative w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="text" placeholder="Search by lead name or phone..." className="w-full bg-white/5 border border-transparent focus:border-white/20 rounded pl-9 pr-3 py-1.5 text-xs text-white outline-none transition-colors" />
                </div>
                <div className="flex gap-4">
                    <button className="text-xs text-white/60 hover:text-white">Saved views</button>
                    <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">Export leads</button>
                </div>
            </div>

            <div className="border border-white/8 p-6 rounded-lg bg-white/[0.02]">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-white font-black text-sm tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>My Leads</p>
                  <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Showing {filteredLeads.length} leads
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={fileFilter}
                    onChange={(e) => {
                      setFileFilter(e.target.value);
                      setCityFilter("");
                    }}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Files</option>
                    {Array.from(new Set(leads.map(l => l.source_file).filter(Boolean))).sort().map(f => (
                      <option key={f as string} value={f as string}>{f as string}</option>
                    ))}
                  </select>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs px-3 py-1.5 outline-none rounded transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Cities</option>
                    {Array.from(new Set(leads.filter(l => !fileFilter || l.source_file === fileFilter).map(l => l.city).filter(c => {
                      if (!c) return false;
                      if (c === "·" || c === "-") return false;
                      if (c.includes('@')) return false;
                      return true;
                    }))).sort().map(c => (
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
                    <option value="Not Answered">Not Answered</option>
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
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Lead</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest hidden md:table-cell" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Phone</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest hidden md:table-cell" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>City</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest hidden lg:table-cell" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Status</th>
                        <th className="p-4 text-white/40 text-xs font-bold uppercase tracking-widest text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedLeads.map((l) => {
                        const emailKey = l.dynamic_data ? Object.keys(l.dynamic_data).find(k => k.toLowerCase().includes('email')) : null;
                        const email = emailKey ? l.dynamic_data[emailKey] : null;
                        return (
                        <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                          <td className="p-4 align-top">
                            <p className="text-white/90 text-sm font-semibold max-w-[200px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{l.name}</p>
                            <div className="md:hidden mt-2 space-y-2 mb-2">
                              {l.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-white/40 flex-shrink-0" /><CopyableText text={l.phone} /></div>}
                              {l.city && <div className="flex items-center gap-2"><MapPin size={12} className="text-white/40 flex-shrink-0" /><span className="text-xs text-white/60">{l.city}</span></div>}
                              {email && <div className="flex items-center gap-2 lg:hidden"><LogOut size={12} className="text-white/40 flex-shrink-0 rotate-180" /><CopyableText text={email} /></div>}
                            </div>
                            {l.website && (
                              <a href={l.website.startsWith('http') ? l.website : `https://${l.website}`} target="_blank" rel="noreferrer" className="text-white/40 text-xs hover:text-white inline-flex items-center gap-1 mt-1 md:mt-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <Globe size={10} /> Website
                              </a>
                            )}
                          </td>
                          <td className="p-4 align-top hidden md:table-cell">
                            {l.phone ? <CopyableText text={l.phone} /> : <span className="text-white/30 text-xs">—</span>}
                          </td>
                          <td className="p-4 align-top hidden md:table-cell">
                            <p className="text-white/60 text-xs max-w-[150px] truncate" style={{ fontFamily: "'Inter', sans-serif" }} title={l.city}>
                              {l.city || "—"}
                            </p>
                          </td>
                          <td className="p-4 align-top hidden lg:table-cell">
                            {email ? <CopyableText text={email} /> : <span className="text-white/30 text-xs">—</span>}
                          </td>
                          <td className="p-4 align-top">
                            <select
                              value={l.status}
                              onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                              className={`bg-black/50 border border-white/10 text-xs px-3 py-1.5 outline-none rounded transition-colors font-bold uppercase tracking-wider
                                ${l.status === 'Converted' ? 'text-[#34d399]' : l.status === 'Follow-up' ? 'text-[#60c8ff]' : l.status === 'Not Answered' ? 'text-[#fb923c]' : l.status === 'Not Converted' ? 'text-[#f87171]' : 'text-white'}
                              `}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              <option value="New">New</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Not Answered">Not Answered</option>
                              <option value="Converted">Converted</option>
                              <option value="Not Converted">Not Converted</option>
                            </select>
                          </td>
                          <td className="p-4 align-top text-right">
                            <button 
                              onClick={() => setActiveLeadId(l.id)}
                              className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors" 
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
                          syncLeadUpdateToCache(l.id, { notes: e.target.value });
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
                          syncLeadUpdateToCache(l.id, { services_wanted: e.target.value });
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
                          syncLeadUpdateToCache(l.id, { budget_constraints: e.target.value });
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
                          syncLeadUpdateToCache(l.id, { objections: e.target.value });
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
                  
                  {l.dynamic_data && Object.keys(l.dynamic_data).length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(l.dynamic_data).filter(([k]) => k !== 'Row COLOUR LEGEND' && k !== '#').map(([key, val]) => (
                        <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{key}</p>
                          <p className="text-white text-sm break-words" style={{ fontFamily: "'Inter', sans-serif" }}>{String(val || "—")}</p>
                        </div>
                      ))}
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
    </div>
    </div>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: any) { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { this.props.onError(error); }
  render() { return this.state.hasError ? null : this.props.children; }
}
