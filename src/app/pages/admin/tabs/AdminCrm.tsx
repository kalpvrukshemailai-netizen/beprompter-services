
import React, { useState, useMemo } from "react";
import {
  Trash2, FileUp, FileText, ArrowLeft, RefreshCw,
  Phone, User, CheckCircle2, Clock, XCircle, AlertCircle,
  Search, Filter, ChevronDown, Check, ArrowRight, TrendingUp,
  BarChart2, Award, Calendar, MessageSquare, Edit3
} from "lucide-react";
import { Profile, supabase, deduplicateProfiles, isLeadAssignedToRep, ADMIN_EMAILS } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/auditLog";
import { INITIAL_OPERATIONAL_LEADS } from "@/lib/operationalLeads";

interface AdminCrmProps {
  crmLeads: any[];
  users: Profile[];
  uploadingCsv: boolean;
  fileFilter: string;
  cityFilter: string;
  bulkAssignRep: string;
  updatingId: string | null;
  setFileFilter: (v: string) => void;
  setCityFilter: (v: string) => void;
  setBulkAssignRep: (v: string) => void;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDuplicates: () => void;
  handleDeleteFileLeads: () => void;
  handleBulkAssign: () => void;
  handleBulkUnassign: () => void;
  onRefreshLeads?: () => void;
}

export function AdminCrm({
  crmLeads = [],
  users = [],
  uploadingCsv,
  fileFilter,
  cityFilter,
  bulkAssignRep,
  updatingId,
  setFileFilter,
  setCityFilter,
  setBulkAssignRep,
  handleCsvUpload,
  handleRemoveDuplicates,
  handleDeleteFileLeads,
  handleBulkAssign,
  handleBulkUnassign,
  onRefreshLeads
}: AdminCrmProps) {
  const CRM_LEADS_STORAGE_KEY = "beprompter_crm_leads_v7";

  // Sanitize any false legacy assignments
  const sanitizeLeads = (list: any[]) => {
    return (list || []).map(l => {
      if (l.assigned_to && (String(l.assigned_to).includes("garv") || String(l.assigned_to).includes("ranjeet"))) {
        return {
          ...l,
          assigned_to: null,
          status: "New",
          notes: (l.dynamic_data && l.dynamic_data.Firm) ? l.dynamic_data.Firm : (l.firm_type || ""),
          services_wanted: "",
          budget_constraints: "",
          objections: ""
        };
      }
      return l;
    });
  };

  // Real leads strictly from database or operational state
  const [localLeads, setLocalLeads] = useState<any[]>(() => {
    if (crmLeads && crmLeads.length > 0) return sanitizeLeads(crmLeads);
    try {
      const cached = localStorage.getItem(CRM_LEADS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return sanitizeLeads(parsed);
      }
    } catch (e) { }
    return sanitizeLeads(INITIAL_OPERATIONAL_LEADS);
  });

  React.useEffect(() => {
    localStorage.removeItem("beprompter_crm_leads_v5");
    localStorage.removeItem("beprompter_crm_leads_v4");
    localStorage.removeItem("beprompter_crm_leads_v3");
    localStorage.removeItem("beprompter_crm_leads_v2");
    localStorage.removeItem("beprompter_crm_leads");
  }, []);

  // Sales reps list strictly deduplicated and filtered for role === 'sales' (including Namita)
  const salesReps = useMemo(() => {
    const cleanUsers = deduplicateProfiles(users);
    const reps = cleanUsers.filter(u =>
      u.role === "sales" ||
      (u.email && u.email.toLowerCase() === "namitakumari4000@gmail.com")
    );
    return reps;
  }, [users]);

  // Filters
  const [selectedRepFilter, setSelectedRepFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLeadModal, setActiveLeadModal] = useState<any | null>(null);
  const [quickNote, setQuickNote] = useState<string>("");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Sync when prop crmLeads changes
  React.useEffect(() => {
    if (crmLeads && crmLeads.length > 0) {
      setLocalLeads(sanitizeLeads(crmLeads));
    }
  }, [crmLeads]);

  // Overall Performance Aggregates from real leads
  const performanceStats = useMemo(() => {
    const total = localLeads.length;
    const assigned = localLeads.filter(l => l.assigned_to).length;
    const callsDone = localLeads.filter(l => l.status && l.status !== "New").length;
    const pendingCalls = localLeads.filter(l => !l.status || l.status === "New").length;
    const followups = localLeads.filter(l => l.status === "Follow-up").length;
    const converted = localLeads.filter(l => l.status === "Converted").length;
    const notAnswered = localLeads.filter(l => l.status === "Not Answered").length;
    const notConverted = localLeads.filter(l => l.status === "Not Converted").length;
    const conversionRate = callsDone > 0 ? ((converted / callsDone) * 100).toFixed(1) : "0.0";

    return { total, assigned, callsDone, pendingCalls, followups, converted, notAnswered, notConverted, conversionRate };
  }, [localLeads]);

  // Per-Sales-Rep Performance Breakdown matching rep ID or rep Email
  const repPerformance = useMemo(() => {
    return salesReps.map(rep => {
      const repLeads = localLeads.filter(l => isLeadAssignedToRep(l.assigned_to, rep));
      const assignedCount = repLeads.length;
      const callsDoneCount = repLeads.filter(l => l.status && l.status !== "New").length;
      const pendingCount = repLeads.filter(l => !l.status || l.status === "New").length;
      const followUpCount = repLeads.filter(l => l.status === "Follow-up").length;
      const convertedCount = repLeads.filter(l => l.status === "Converted").length;
      const notAnsweredCount = repLeads.filter(l => l.status === "Not Answered").length;
      const notConvertedCount = repLeads.filter(l => l.status === "Not Converted").length;
      const convRate = callsDoneCount > 0 ? ((convertedCount / callsDoneCount) * 100).toFixed(1) : "0.0";

      return {
        rep,
        assignedCount,
        callsDoneCount,
        pendingCount,
        followUpCount,
        convertedCount,
        notAnsweredCount,
        notConvertedCount,
        convRate
      };
    });
  }, [salesReps, localLeads]);

  // Source files list
  const availableSourceFiles = useMemo(() => {
    return Array.from(new Set(localLeads.map(l => l.source_file).filter(Boolean))).sort();
  }, [localLeads]);

  // Cities dynamically filtered according to selected fileFilter
  const availableCities = useMemo(() => {
    const leadsInScope = fileFilter 
      ? localLeads.filter(l => l.source_file === fileFilter) 
      : localLeads;
    
    const citySet = new Set<string>();
    leadsInScope.forEach(l => {
      if (l.city && typeof l.city === "string") {
        const trimmed = l.city.trim();
        if (trimmed && trimmed !== "·" && trimmed !== "-" && !trimmed.includes("@")) {
          citySet.add(trimmed);
        }
      }
    });

    return Array.from(citySet).sort((a, b) => a.localeCompare(b));
  }, [localLeads, fileFilter]);

  // If the active cityFilter doesn't exist in the current file scope, reset it
  React.useEffect(() => {
    if (cityFilter && !availableCities.includes(cityFilter)) {
      setCityFilter("");
    }
  }, [availableCities, cityFilter, setCityFilter]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return localLeads.filter(l => {
      if (fileFilter && l.source_file !== fileFilter) return false;
      if (cityFilter && (l.city || "").trim().toLowerCase() !== cityFilter.trim().toLowerCase()) return false;
      if (selectedRepFilter !== "all") {
        const rep = salesReps.find(r => r.id === selectedRepFilter || r.email.toLowerCase() === selectedRepFilter.toLowerCase());
        if (rep) {
          if (!isLeadAssignedToRep(l.assigned_to, rep)) return false;
        } else if (l.assigned_to !== selectedRepFilter) {
          return false;
        }
      }
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (l.name || "").toLowerCase().includes(q) ||
          (l.phone || "").includes(q) ||
          (l.city || "").toLowerCase().includes(q) ||
          (l.notes || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [localLeads, fileFilter, cityFilter, selectedRepFilter, salesReps, statusFilter, searchQuery]);

  // Update status handler (updates local state & Supabase & localStorage)
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    setStatusUpdatingId(leadId);

    // Update local state immediately
    setLocalLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from("crm_leads").update({ status: newStatus }).eq("id", leadId);
      logAuditEvent({
        action: `Lead Status Updated -> ${newStatus}`,
        resource: `crm_lead:${leadId}`,
        severity: "low"
      });
      if (onRefreshLeads) onRefreshLeads();
    } catch (err) {
      console.warn("Could not sync status to database:", err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Reassign single lead
  const handleReassignLead = async (leadId: string, repId: string) => {
    setLocalLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, assigned_to: repId || null } : l);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from("crm_leads").update({ assigned_to: repId || null }).eq("id", leadId);
      const rep = salesReps.find(r => r.id === repId);
      logAuditEvent({
        action: `Lead Reassigned -> ${rep?.full_name || 'Unassigned'}`,
        resource: `crm_lead:${leadId}`,
        severity: "low"
      });
      if (onRefreshLeads) onRefreshLeads();
    } catch (e) {
      console.warn("Could not sync assignment to db:", e);
    }
  };

  // Save quick note
  const handleSaveNote = async (leadId: string) => {
    if (!quickNote.trim()) return;
    setLocalLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, notes: quickNote.trim() } : l);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from("crm_leads").update({ notes: quickNote.trim() }).eq("id", leadId);
      if (onRefreshLeads) onRefreshLeads();
    } catch (e) { }
    if (activeLeadModal && activeLeadModal.id === leadId) {
      setActiveLeadModal({ ...activeLeadModal, notes: quickNote.trim() });
    }
    setQuickNote("");
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-[#fbbf24]/80 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 06
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Sales CRM & Rep Call Delivery Operations
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Live tracking for every sales rep: total calls assigned, calls completed, follow-ups, converted deliveries, and unanswered calls.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRemoveDuplicates}
            disabled={uploadingCsv}
            className={`flex items-center gap-2 bg-[#f87171]/10 hover:bg-[#f87171]/20 border border-[#f87171]/30 text-[#f87171] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded ${uploadingCsv ? 'opacity-50 pointer-events-none' : ''}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <Trash2 size={14} /> Remove Duplicates
          </button>
          <label className={`flex items-center gap-2 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded ${uploadingCsv ? 'opacity-50 pointer-events-none' : ''}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {uploadingCsv ? <RefreshCw size={14} className="animate-spin" /> : <FileUp size={14} />}
            {uploadingCsv ? 'Uploading...' : 'Upload CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={uploadingCsv} />
          </label>
        </div>
      </div>

      {/* TOP CALL DELIVERY & STATUS KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="border border-white/10 bg-white/[0.02] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Calls Assigned</span>
            <Phone size={14} className="text-white/40" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{performanceStats.assigned}</p>
          <p className="text-[10px] text-white/40 mt-1">out of {performanceStats.total} total leads</p>
        </div>

        <div className="border border-blue-500/20 bg-blue-500/[0.03] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Calls Completed</span>
            <CheckCircle2 size={14} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 font-mono">{performanceStats.callsDone}</p>
          <p className="text-[10px] text-white/40 mt-1">{performanceStats.pendingCalls} pending calls</p>
        </div>

        <div className="border border-cyan-500/20 bg-cyan-500/[0.03] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Follow-ups</span>
            <Clock size={14} className="text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-300 font-mono">{performanceStats.followups}</p>
          <p className="text-[10px] text-white/40 mt-1">Scheduled callbacks</p>
        </div>

        <div className="border border-emerald-500/20 bg-emerald-500/[0.03] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Converted / Won</span>
            <Award size={14} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{performanceStats.converted}</p>
          <p className="text-[10px] text-emerald-400/60 mt-1 font-mono">{performanceStats.conversionRate}% conv. rate</p>
        </div>

        <div className="border border-amber-500/20 bg-amber-500/[0.03] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Not Answered (RNR)</span>
            <AlertCircle size={14} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-mono">{performanceStats.notAnswered}</p>
          <p className="text-[10px] text-white/40 mt-1">Need 2nd attempt</p>
        </div>

        <div className="border border-red-500/20 bg-red-500/[0.03] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Not Converted</span>
            <XCircle size={14} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 font-mono">{performanceStats.notConverted}</p>
          <p className="text-[10px] text-white/40 mt-1">Budget / out of criteria</p>
        </div>
      </div>

      {/* SALES REP PRODUCTIVITY LEADERBOARD TABLE */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-[#fbbf24]" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Sales Rep Performance & Call Delivery Leaderboard
            </h3>
          </div>
          <span className="text-[10px] text-white/40 font-mono">
            Click "Filter Rep" to inspect individual call pipelines
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="p-3.5 pl-5">Sales Representative</th>
                <th className="p-3.5 text-center">Assigned Calls</th>
                <th className="p-3.5 text-center">Calls Done</th>
                <th className="p-3.5 text-center">Pending</th>
                <th className="p-3.5 text-center text-cyan-400">Follow-up</th>
                <th className="p-3.5 text-center text-emerald-400">Converted</th>
                <th className="p-3.5 text-center text-amber-400">Not Answered</th>
                <th className="p-3.5 text-center">Conv. Rate</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {repPerformance.map(({ rep, assignedCount, callsDoneCount, pendingCount, followUpCount, convertedCount, notAnsweredCount, convRate }) => {
                const isSelected = selectedRepFilter === rep.id;
                return (
                  <tr key={rep.id} className={`transition-colors ${isSelected ? 'bg-[#fbbf24]/10' : 'hover:bg-white/[0.02]'}`}>
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                          {rep.full_name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{rep.full_name}</p>
                          <p className="text-[10px] text-white/40">{rep.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-white text-sm">{assignedCount}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-blue-400">{callsDoneCount}</td>
                    <td className="p-3.5 text-center font-mono text-white/40">{pendingCount}</td>
                    <td className="p-3.5 text-center font-mono text-cyan-300 font-bold">{followUpCount}</td>
                    <td className="p-3.5 text-center font-mono text-emerald-400 font-bold">{convertedCount}</td>
                    <td className="p-3.5 text-center font-mono text-amber-300 font-bold">{notAnsweredCount}</td>
                    <td className="p-3.5 text-center">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 font-semibold text-white">
                        {convRate}%
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={() => setSelectedRepFilter(isSelected ? "all" : rep.id)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${isSelected
                          ? 'bg-[#fbbf24] text-black'
                          : 'border border-white/15 text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {isSelected ? "Showing Rep" : "Filter Rep"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {repPerformance.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-white/40 text-xs">
                    No sales representatives configured yet. Assign team members the "sales" role in Users & Roles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FILTER BAR FOR LEADS TABLE */}
      <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name, phone, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 outline-none w-56 focus:border-white/30"
            />
          </div>

          {/* Rep filter */}
          <select
            value={selectedRepFilter}
            onChange={(e) => setSelectedRepFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#111]">All Sales Reps</option>
            {salesReps.map(r => (
              <option key={r.id} value={r.id} className="bg-[#111]">{r.full_name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#111]">All Call Outcomes</option>
            <option value="New" className="bg-[#111]">New / Pending</option>
            <option value="Follow-up" className="bg-[#111]">Follow-up</option>
            <option value="Not Answered" className="bg-[#111]">Not Answered</option>
            <option value="Converted" className="bg-[#111]">Converted / Won</option>
            <option value="Not Converted" className="bg-[#111]">Not Converted</option>
          </select>

          {/* Source file filter */}
          {availableSourceFiles.length > 0 && (
            <select
              value={fileFilter}
              onChange={(e) => {
                setFileFilter(e.target.value);
                setCityFilter("");
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none max-w-[200px] truncate cursor-pointer"
            >
              <option value="" className="bg-[#111]">All Source Files</option>
              {availableSourceFiles.map(f => (
                <option key={f} value={f} className="bg-[#111]">{f}</option>
              ))}
            </select>
          )}

          {/* City filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer"
          >
            <option value="" className="bg-[#111]">
              {fileFilter ? `All Cities in File (${availableCities.length})` : "All Cities"}
            </option>
            {availableCities.map(c => (
              <option key={c} value={c} className="bg-[#111]">{c}</option>
            ))}
          </select>

          {(selectedRepFilter !== "all" || statusFilter !== "all" || cityFilter || fileFilter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRepFilter("all");
                setStatusFilter("all");
                setCityFilter("");
                setFileFilter("");
                setSearchQuery("");
              }}
              className="text-[10px] text-white/50 hover:text-white underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          {fileFilter && (
            <button
              onClick={handleDeleteFileLeads}
              className="text-[11px] text-red-400 hover:text-red-300 border border-red-500/20 px-2.5 py-1.5 rounded hover:bg-red-500/10 transition-colors"
            >
              Delete File Leads
            </button>
          )}

          {salesReps.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                value={bulkAssignRep}
                onChange={(e) => setBulkAssignRep(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none"
              >
                <option value="" className="bg-[#111]">-- Bulk Assign Rep --</option>
                {salesReps.map(r => (
                  <option key={r.id} value={r.id} className="bg-[#111]">{r.full_name}</option>
                ))}
              </select>
              <button
                onClick={handleBulkAssign}
                disabled={!bulkAssignRep}
                className="px-3 py-1.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/30 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Assign
              </button>
              <button
                onClick={handleBulkUnassign}
                className="px-3 py-1.5 rounded bg-white/5 text-white/60 border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
              >
                Unassign
              </button>
            </div>
          )}

          <span className="text-xs text-white/40 ml-2 font-mono">
            Showing <strong className="text-white">{filteredLeads.length}</strong> of {localLeads.length}
          </span>
        </div>
      </div>

      {/* DETAILED LEADS & CALL OUTCOMES TABLE */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="p-3.5 pl-5">Lead / Contact</th>
                <th className="p-3.5">Assigned Sales Rep</th>
                <th className="p-3.5">Call Outcome / Status</th>
                <th className="p-3.5">Latest Call Notes & Remarks</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredLeads.slice(0, 100).map((l) => {
                const assignedRep = salesReps.find(r => isLeadAssignedToRep(l.assigned_to, r));
                return (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-5">
                      <p className="font-semibold text-white">{l.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/40">
                        {l.phone && <span className="font-mono text-white/60">{l.phone}</span>}
                        {l.city && <span>· {l.city}</span>}
                        {l.source_file && <span className="text-white/30 truncate max-w-[140px]">· {l.source_file}</span>}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={assignedRep ? assignedRep.id : (l.assigned_to || "")}
                        onChange={(e) => handleReassignLead(l.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="" className="bg-[#111]">-- Unassigned --</option>
                        {salesReps.map(r => (
                          <option key={r.id} value={r.id} className="bg-[#111]">{r.full_name}</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={l.status || "New"}
                        disabled={statusUpdatingId === l.id}
                        onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                        className={`border rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors ${l.status === 'Converted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                          l.status === 'Follow-up' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' :
                            l.status === 'Not Answered' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                              l.status === 'Not Converted' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                'bg-white/5 border-white/10 text-white/60'
                          }`}
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        <option value="New" className="bg-[#111] text-white">New / Untouched</option>
                        <option value="Follow-up" className="bg-[#111] text-cyan-300">Follow-up</option>
                        <option value="Not Answered" className="bg-[#111] text-amber-300">Not Answered (RNR)</option>
                        <option value="Converted" className="bg-[#111] text-emerald-400">Converted (Won)</option>
                        <option value="Not Converted" className="bg-[#111] text-red-400">Not Converted</option>
                      </select>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      {l.notes ? (
                        <p className="text-xs text-white/70 line-clamp-2 italic font-light">"{l.notes}"</p>
                      ) : (
                        <span className="text-[10px] text-white/30">No remarks logged yet</span>
                      )}
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={() => {
                          setActiveLeadModal(l);
                          setQuickNote(l.notes || "");
                        }}
                        className="px-2.5 py-1 rounded border border-white/10 hover:border-white/30 text-[10px] uppercase font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 text-xs">
                    {localLeads.length === 0
                      ? "No CRM leads in database. Upload a CSV file using the 'Upload CSV' button above to populate the calling pipeline."
                      : "No leads match the selected filter criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD INSPECT & LOG NOTE MODAL */}
      {activeLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/15 rounded-2xl bg-[#0F0F0F] max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-white/40 font-mono uppercase">Lead ID: {activeLeadModal.id}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeLeadModal.name}</h3>
                <p className="text-xs text-white/50">{activeLeadModal.phone || "No phone"} · {activeLeadModal.city || "No city"}</p>
              </div>
              <button onClick={() => setActiveLeadModal(null)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Current Status</span>
                <span className="font-bold text-white uppercase">{activeLeadModal.status || "New"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Assigned Sales Rep</span>
                <span className="text-white">
                  {salesReps.find(r => r.id === activeLeadModal.assigned_to)?.full_name || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Source File</span>
                <span className="text-white/70 font-mono text-[11px]">{activeLeadModal.source_file || "Manual Input"}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-white/50 text-[10px] uppercase font-bold">Log Call Outcome & Remarks</label>
              <textarea
                rows={3}
                placeholder="Log customer response, site visit booking, or reason for not answering..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white/30 resize-none text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateLeadStatus(activeLeadModal.id, "Follow-up")}
                  className="px-2.5 py-1 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                >
                  Mark Follow-up
                </button>
                <button
                  onClick={() => handleUpdateLeadStatus(activeLeadModal.id, "Converted")}
                  className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                >
                  Mark Converted
                </button>
                <button
                  onClick={() => handleUpdateLeadStatus(activeLeadModal.id, "Not Answered")}
                  className="px-2.5 py-1 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                >
                  Mark RNR
                </button>
              </div>

              <button
                onClick={() => {
                  handleSaveNote(activeLeadModal.id);
                  setActiveLeadModal(null);
                }}
                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-white/90 cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
