import React, { useState, useMemo } from "react";
import { Search, Download, Mail, Phone, Calendar, ArrowRight, UserPlus, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/auditLog";

export function AdminLeads({ leads, onRefreshLeads }: { leads: any[]; onRefreshLeads?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [transferringId, setTransferringId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (interestFilter !== "all" && l.service_interest !== interestFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (l.name || "").toLowerCase().includes(q) ||
               (l.email || "").toLowerCase().includes(q) ||
               (l.phone || "").includes(q) ||
               (l.service_interest || "").toLowerCase().includes(q) ||
               (l.message || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [leads, interestFilter, searchQuery]);

  const uniqueInterests = useMemo(() => {
    return Array.from(new Set(leads.map(l => l.service_interest).filter(Boolean)));
  }, [leads]);

  const handlePushToCrm = async (lead: any) => {
    setTransferringId(lead.id);
    try {
      const crmEntry = {
        name: lead.name || "Inbound Contact",
        phone: lead.phone || null,
        city: null,
        source_file: "Website Contact Form",
        status: "New",
        notes: `Inbound inquiry: ${lead.service_interest || 'General'}. Message: "${lead.message || ''}". Budget: ${lead.budget || 'Not specified'}. Email: ${lead.email}`,
        dynamic_data: {
          email: lead.email,
          service_interest: lead.service_interest,
          budget: lead.budget
        }
      };

      const { error } = await supabase.from("crm_leads").insert([crmEntry]);
      if (error) {
        console.warn("Could not insert to CRM leads:", error.message);
      }

      logAuditEvent({
        action: `Inbound Lead Pushed to CRM: ${lead.name}`,
        resource: `leads:${lead.id}`,
        severity: "low"
      });

      setNotice(`Lead "${lead.name}" added to Sales CRM calling pool.`);
      if (onRefreshLeads) onRefreshLeads();
    } catch (err: any) {
      alert("Error pushing to CRM: " + err.message);
    } finally {
      setTransferringId(null);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Name,Email,Phone,Interest,Budget,Message\n" +
      leads.map(l => `"${l.created_at}","${l.name || ''}","${l.email || ''}","${l.phone || ''}","${l.service_interest || ''}","${l.budget || ''}","${(l.message || '').replace(/"/g, '""')}"`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `beprompter_inbound_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 05
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Inbound Leads & Website Inquiries
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Dedicated live inbox for inbound form submissions, service consultations, and budget inquiries.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCsv}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input 
              type="text" 
              placeholder="Search contact, email, phone, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 outline-none w-64 focus:border-white/30"
            />
          </div>

          {uniqueInterests.length > 0 && (
            <select 
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
            >
              <option value="all" className="bg-[#111]">All Service Interests</option>
              {uniqueInterests.map(int => (
                <option key={int} value={int} className="bg-[#111]">{int}</option>
              ))}
            </select>
          )}

          {(searchQuery || interestFilter !== "all") && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setInterestFilter("all");
              }}
              className="text-[10px] text-white/50 hover:text-white underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <span className="text-xs text-white/40">
          Showing <strong className="text-white">{filteredLeads.length}</strong> of {leads.length} inquiries
        </span>
      </div>

      {/* Inbound Leads Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-white/40 font-bold uppercase tracking-widest text-[10px]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Service Interest & Message</th>
                <th className="p-4">Budget Range</th>
                <th className="p-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 align-top">
                    <p className="text-white/60 text-xs font-mono whitespace-nowrap">
                      {new Date(l.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-white/30 text-[10px] font-mono mt-0.5">
                      {new Date(l.created_at).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-white font-semibold text-sm">{l.name}</p>
                    <p className="text-white/60 text-[11px] mt-0.5">{l.email}</p>
                    {l.phone && <p className="text-white/40 font-mono text-[10px] mt-0.5">{l.phone}</p>}
                  </td>
                  <td className="p-4 align-top max-w-md">
                    <p className="text-white font-medium text-xs">{l.service_interest || "General Consultation"}</p>
                    {l.message && (
                      <p className="text-white/60 text-[11px] mt-1.5 italic font-light leading-relaxed">
                        "{l.message}"
                      </p>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <span className="text-white/90 font-semibold px-2 py-1 rounded bg-white/5 text-[10px] uppercase tracking-widest font-mono">
                      {l.budget || "Not Specified"}
                    </span>
                  </td>
                  <td className="p-4 text-right align-top">
                    <button
                      onClick={() => handlePushToCrm(l)}
                      disabled={transferringId === l.id}
                      className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <UserPlus size={11} /> {transferringId === l.id ? "Adding..." : "Add to CRM"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 text-xs">
                    No inbound contact submissions recorded yet. All new inquiries submitted through the website's contact form will appear here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
