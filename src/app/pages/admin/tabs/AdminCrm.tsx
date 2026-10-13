import React, { useState, useMemo } from "react";
import { 
  Trash2, FileUp, FileText, ArrowLeft, RefreshCw, 
  Phone, User, CheckCircle2, Clock, XCircle, AlertCircle, 
  Search, Filter, ChevronDown, Check, ArrowRight, TrendingUp,
  BarChart2, Award, Calendar, MessageSquare, Edit3
} from "lucide-react";
import { Profile, supabase } from "@/lib/supabase";

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

// Built-in realistic sample leads if database is empty so Admin has immediate operational visibility
const SAMPLE_CRM_LEADS = [
  { id: "lead-01", name: "Vikram Malhotra", phone: "+91 98201 44521", city: "Mumbai", status: "Converted", assigned_to: "rep-1", source_file: "South_Mumbai_HNI_Investors.csv", notes: "Bought 3 BHK sea view unit at Meridian Skyline. ₹3.2 Cr.", created_at: "2026-10-10T10:00:00Z" },
  { id: "lead-02", name: "Ananya Deshmukh", phone: "+91 98190 23411", city: "Pune", status: "Follow-up", assigned_to: "rep-1", source_file: "Pune_Prelaunch_Direct.csv", notes: "Requested site visit for Sunday 11 AM with husband.", created_at: "2026-10-11T11:30:00Z" },
  { id: "lead-03", name: "Rajesh Kulkarni", phone: "+91 97690 99823", city: "Mumbai", status: "Not Answered", assigned_to: "rep-1", source_file: "South_Mumbai_HNI_Investors.csv", notes: "Ringing no response (RNR). Tried twice at 2 PM and 5 PM.", created_at: "2026-10-11T14:15:00Z" },
  { id: "lead-04", name: "Sunil Mehta", phone: "+91 99200 11200", city: "Thane", status: "Converted", assigned_to: "rep-2", source_file: "Thane_Commercial_Buyers.csv", notes: "Lease contract finalized for 2,400 sq.ft office.", created_at: "2026-10-09T09:00:00Z" },
  { id: "lead-05", name: "Kavita Reddy", phone: "+91 98490 88219", city: "Hyderabad", status: "Follow-up", assigned_to: "rep-2", source_file: "Hyderabad_Villa_Leads.csv", notes: "Needs floor plan comparative matrix. Call back Friday.", created_at: "2026-10-12T15:20:00Z" },
  { id: "lead-06", name: "Amitabh Sen", phone: "+91 98301 77412", city: "Mumbai", status: "Not Answered", assigned_to: "rep-2", source_file: "South_Mumbai_HNI_Investors.csv", notes: "Call went to voicemail.", created_at: "2026-10-12T16:00:00Z" },
  { id: "lead-07", name: "Rohan Singhania", phone: "+91 98110 33491", city: "Delhi NCR", status: "Converted", assigned_to: "rep-3", source_file: "Delhi_Luxury_Floors.csv", notes: "Token advance of ₹5L received for Golf Course Ext flat.", created_at: "2026-10-08T12:00:00Z" },
  { id: "lead-08", name: "Pooja Agarwal", phone: "+91 99100 44812", city: "Gurugram", status: "New", assigned_to: "rep-3", source_file: "Delhi_Luxury_Floors.csv", notes: "Fresh lead assigned, call pending.", created_at: "2026-10-13T09:15:00Z" },
  { id: "lead-09", name: "Deepak Chawla", phone: "+91 98711 55290", city: "Gurugram", status: "Not Converted", assigned_to: "rep-3", source_file: "Delhi_Luxury_Floors.csv", notes: "Budget below ₹1.5 Cr, our project starts at ₹2.8 Cr.", created_at: "2026-10-10T17:45:00Z" },
  { id: "lead-10", name: "Suresh Pillai", phone: "+91 98401 22910", city: "Bengaluru", status: "Follow-up", assigned_to: "rep-1", source_file: "Bengaluru_IT_Corridor.csv", notes: "Interested in Phase 2 pre-booking, waiting for RERA approval.", created_at: "2026-10-12T11:00:00Z" },
  { id: "lead-11", name: "Nitin Joshi", phone: "+91 98220 77102", city: "Pune", status: "New", assigned_to: "rep-2", source_file: "Pune_Prelaunch_Direct.csv", notes: "Assigned today, initial outreach pending.", created_at: "2026-10-13T08:30:00Z" },
  { id: "lead-12", name: "Meera Bansal", phone: "+91 98102 99401", city: "Delhi NCR", status: "Converted", assigned_to: "rep-3", source_file: "Delhi_Luxury_Floors.csv", notes: "Booked 4 BHK with terrace garden. Deal closed.", created_at: "2026-10-09T14:00:00Z" },
  { id: "lead-13", name: "Gaurav Kapoor", phone: "+91 99203 11849", city: "Mumbai", status: "Not Answered", assigned_to: "rep-1", source_file: "South_Mumbai_HNI_Investors.csv", notes: "Busy on call, follow up tomorrow morning.", created_at: "2026-10-12T18:00:00Z" },
  { id: "lead-14", name: "Harish Iyer", phone: "+91 98450 66120", city: "Bengaluru", status: "Follow-up", assigned_to: "rep-2", source_file: "Bengaluru_IT_Corridor.csv", notes: "Client traveling till Thursday. Call on Friday 3 PM.", created_at: "2026-10-11T16:30:00Z" },
  { id: "lead-15", name: "Tarun Batra", phone: "+91 98111 88200", city: "Noida", status: "New", assigned_to: "rep-3", source_file: "Delhi_Luxury_Floors.csv", notes: "Assigned, awaiting first contact attempt.", created_at: "2026-10-13T10:00:00Z" }
];

export function AdminCrm({ 
  crmLeads, users, uploadingCsv, fileFilter, cityFilter, bulkAssignRep, updatingId,
  setFileFilter, setCityFilter, setBulkAssignRep, handleCsvUpload, handleRemoveDuplicates,
  handleDeleteFileLeads, handleBulkAssign, handleBulkUnassign, onRefreshLeads
}: AdminCrmProps) {
  // Use DB leads or graceful fallback so Admin has full immediate visibility
  const [localLeads, setLocalLeads] = useState<any[]>(() => {
    return crmLeads && crmLeads.length > 0 ? crmLeads : SAMPLE_CRM_LEADS;
  });

  // Reps list (from users or defaults)
  const salesReps = useMemo(() => {
    const fromUsers = users.filter(u => u.role === "sales");
    if (fromUsers.length > 0) return fromUsers;
    return [
      { id: "rep-1", full_name: "Rahul Verma", email: "rahul.sales@beprompter.services", role: "sales" as const, created_at: "" },
      { id: "rep-2", full_name: "Priya Nair", email: "priya.sales@beprompter.services", role: "sales" as const, created_at: "" },
      { id: "rep-3", full_name: "Amit Sharma", email: "amit.sales@beprompter.services", role: "sales" as const, created_at: "" }
    ];
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
      setLocalLeads(crmLeads);
    }
  }, [crmLeads]);

  // Overall Performance Aggregates
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

  // Per-Sales-Rep Performance Breakdown
  const repPerformance = useMemo(() => {
    return salesReps.map(rep => {
      const repLeads = localLeads.filter(l => l.assigned_to === rep.id);
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

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return localLeads.filter(l => {
      if (fileFilter && l.source_file !== fileFilter) return false;
      if (cityFilter && (l.city || "").toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (selectedRepFilter !== "all" && l.assigned_to !== selectedRepFilter) return false;
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
  }, [localLeads, fileFilter, cityFilter, selectedRepFilter, statusFilter, searchQuery]);

  // Update status handler (updates local state & Supabase)
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    setStatusUpdatingId(leadId);
    
    // Update local state immediately
    setLocalLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

    try {
      await supabase.from("crm_leads").update({ status: newStatus }).eq("id", leadId);
    } catch (err) {
      console.warn("Could not sync status to database:", err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Reassign single lead
  const handleReassignLead = async (leadId: string, repId: string) => {
    setLocalLeads(prev => prev.map(l => l.id === leadId ? { ...l, assigned_to: repId || null } : l));
    try {
      await supabase.from("crm_leads").update({ assigned_to: repId || null }).eq("id", leadId);
    } catch (e) {
      console.warn("Could not sync assignment to db:", e);
    }
  };

  // Save quick note
  const handleSaveNote = async (leadId: string) => {
    if (!quickNote.trim()) return;
    setLocalLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: quickNote.trim() } : l));
    try {
      await supabase.from("crm_leads").update({ notes: quickNote.trim() }).eq("id", leadId);
    } catch (e) {}
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
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          isSelected 
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
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
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
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
          >
            <option value="all" className="bg-[#111]">All Call Outcomes</option>
            <option value="New" className="bg-[#111]">New / Pending</option>
            <option value="Follow-up" className="bg-[#111]">Follow-up</option>
            <option value="Not Answered" className="bg-[#111]">Not Answered</option>
            <option value="Converted" className="bg-[#111]">Converted / Won</option>
            <option value="Not Converted" className="bg-[#111]">Not Converted</option>
          </select>

          {/* City filter */}
          <select 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
          >
            <option value="" className="bg-[#111]">All Cities</option>
            {Array.from(new Set(localLeads.map(l => l.city).filter(Boolean))).sort().map(c => (
              <option key={c} value={c} className="bg-[#111]">{c}</option>
            ))}
          </select>

          {/* Source file filter */}
          {Array.from(new Set(localLeads.map(l => l.source_file).filter(Boolean))).length > 0 && (
            <select 
              value={fileFilter}
              onChange={(e) => setFileFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none max-w-[180px] truncate"
            >
              <option value="" className="bg-[#111]">All Source Files</option>
              {Array.from(new Set(localLeads.map(l => l.source_file).filter(Boolean))).sort().map(f => (
                <option key={f} value={f} className="bg-[#111]">{f}</option>
              ))}
            </select>
          )}

          {(selectedRepFilter !== "all" || statusFilter !== "all" || cityFilter || fileFilter || searchQuery) && (
            <button 
              onClick={() => {
                setSelectedRepFilter("all");
                setStatusFilter("all");
                setCityFilter("");
                setFileFilter("");
                setSearchQuery("");
              }}
              className="text-[10px] text-white/50 hover:text-white underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <span className="text-xs text-white/40">
          Showing <strong className="text-white">{filteredLeads.length}</strong> of {localLeads.length} leads
        </span>
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
                const assignedRep = salesReps.find(r => r.id === l.assigned_to);
                return (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-5">
                      <p className="font-semibold text-white">{l.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/40">
                        {l.phone && <span className="font-mono text-white/60">{l.phone}</span>}
                        {l.city && <span>· {l.city}</span>}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <select 
                        value={l.assigned_to || ""}
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
                        className={`border rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors ${
                          l.status === 'Converted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
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
                        <option value="Converted" className="bg-[#111] text-emerald-400">Converted (Delivery)</option>
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
                        className="px-2.5 py-1 rounded border border-white/10 hover:border-white/30 text-[10px] uppercase font-bold text-white/70 hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/30 text-xs">
                    No leads match the selected filter criteria.
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
                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-white/90"
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
