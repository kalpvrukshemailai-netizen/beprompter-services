import React, { useMemo } from "react";
import { ArrowRight, Download, Users, Phone, Award, Clock, AlertCircle, Briefcase, Database, MessageSquare } from "lucide-react";
import { Profile, isLeadAssignedToRep } from "@/lib/supabase";

interface AdminOverviewProps {
  users?: Profile[];
  projects?: any[];
  leads?: any[];
  crmLeads?: any[];
  onNavigateTab?: (tab: string) => void;
}

export function AdminOverview({
  users = [],
  projects = [],
  leads = [],
  crmLeads = [],
  onNavigateTab
}: AdminOverviewProps) {
  // Real metrics calculation
  const totalLeads = crmLeads.length;
  const assignedLeads = crmLeads.filter(l => l.assigned_to).length;
  const callsDone = crmLeads.filter(l => l.status && l.status !== "New").length;
  const pendingCalls = crmLeads.filter(l => !l.status || l.status === "New").length;
  const followups = crmLeads.filter(l => l.status === "Follow-up").length;
  const converted = crmLeads.filter(l => l.status === "Converted").length;
  const notAnswered = crmLeads.filter(l => l.status === "Not Answered").length;
  const notConverted = crmLeads.filter(l => l.status === "Not Converted").length;
  const convRate = callsDone > 0 ? ((converted / callsDone) * 100).toFixed(1) : "0.0";

  const clientUsers = users.filter(u => u.role === "client");
  const salesUsers = users.filter(u => u.role === "sales");
  const devUsers = users.filter(u => u.role === "developer");
  const adminUsers = users.filter(u => u.role === "admin");

  const unassignedCount = totalLeads - assignedLeads;

  // Real operator priorities derived from actual data
  const realPriorities = useMemo(() => {
    const list = [];
    if (unassignedCount > 0) {
      list.push({
        badge: "Action Required",
        badgeColor: "bg-amber-500/20 text-amber-300",
        title: `${unassignedCount} unassigned leads in CRM pool`,
        team: "Sales Operations",
        tab: "crm",
        actionText: "Distribute →"
      });
    }
    if (followups > 0) {
      list.push({
        badge: "Scheduled",
        badgeColor: "bg-cyan-500/20 text-cyan-300",
        title: `${followups} scheduled callbacks & follow-ups due`,
        team: "Sales Reps",
        tab: "crm",
        actionText: "Review →"
      });
    }
    if (leads.length > 0) {
      list.push({
        badge: "Inbound",
        badgeColor: "bg-purple-500/20 text-purple-300",
        title: `${leads.length} website contact form inquiries received`,
        team: "Inbound Team",
        tab: "leads",
        actionText: "Inspect →"
      });
    }
    if (projects.length > 0) {
      list.push({
        badge: "Active",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        title: `${projects.length} client delivery projects in execution`,
        team: "Dev & Ops",
        tab: "projects",
        actionText: "Track →"
      });
    }
    if (list.length === 0) {
      list.push({
        badge: "Healthy",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        title: "All leads assigned and queues up to date",
        team: "Platform Ops",
        tab: "crm",
        actionText: "View CRM →"
      });
    }
    return list;
  }, [unassignedCount, followups, leads.length, projects.length]);

  const handleExportSummary = () => {
    const summary = [
      ["Metric", "Value"],
      ["Total CRM Leads", totalLeads],
      ["Assigned Calls", assignedLeads],
      ["Completed Calls", callsDone],
      ["Pending Calls", pendingCalls],
      ["Follow-ups", followups],
      ["Converted Leads", converted],
      ["Not Answered (RNR)", notAnswered],
      ["Not Converted", notConverted],
      ["Conversion Rate", `${convRate}%`],
      ["Total Team Members", users.length],
      ["Client Workspaces", clientUsers.length],
      ["Inbound Form Inquiries", leads.length],
      ["Active Projects", projects.length],
      ["Generated At", new Date().toISOString()]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + summary.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `beprompter_operational_summary_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusPercentages = useMemo(() => {
    if (totalLeads === 0) return { newPct: 0, fuPct: 0, rnrPct: 0, convPct: 0, notConvPct: 0 };
    return {
      newPct: Math.round((pendingCalls / totalLeads) * 100),
      fuPct: Math.round((followups / totalLeads) * 100),
      rnrPct: Math.round((notAnswered / totalLeads) * 100),
      convPct: Math.round((converted / totalLeads) * 100),
      notConvPct: Math.round((notConverted / totalLeads) * 100),
    };
  }, [totalLeads, pendingCalls, followups, notAnswered, converted, notConverted]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 01
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            One platform. Every operation in view.
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Live tracking across {crmLeads.length > 0 ? `${totalLeads.toLocaleString()} leads` : "platform leads"}, {users.length} team accounts, and active client delivery operations.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportSummary}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download size={12} /> Export Operational Report
          </button>
          <button 
            onClick={() => onNavigateTab && onNavigateTab("workspaces")}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors cursor-pointer"
          >
            + Client Workspaces
          </button>
        </div>
      </div>

      {/* Primary Real KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab && onNavigateTab("crm")}
          className="border border-white/10 bg-white/[0.02] rounded-xl p-5 hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer"
        >
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3 flex items-center justify-between" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span>CRM Pipeline Leads</span>
            <Database size={13} className="text-white/40" />
          </p>
          <p className="text-3xl font-bold text-white mb-1 font-mono">{totalLeads.toLocaleString()}</p>
          <p className="text-xs text-white/50">{assignedLeads} assigned · {unassignedCount} awaiting distribution</p>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab("crm")}
          className="border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl p-5 hover:border-emerald-500/40 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-3 flex items-center justify-between" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span>Calls Done & Deliveries</span>
            <Award size={13} className="text-emerald-400" />
          </p>
          <p className="text-3xl font-bold text-emerald-400 mb-1 font-mono">{callsDone}</p>
          <p className="text-xs text-emerald-400/70">{converted} won ({convRate}% conv rate)</p>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab("workspaces")}
          className="border border-white/10 bg-white/[0.02] rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3 flex items-center justify-between" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span>Client Workspaces</span>
            <Briefcase size={13} className="text-white/40" />
          </p>
          <p className="text-3xl font-bold text-white mb-1 font-mono">
            {clientUsers.length > 0 ? clientUsers.length : (projects.length > 0 ? projects.length : 1)}
          </p>
          <p className="text-xs text-white/50">
            {clientUsers.length} client accounts · {projects.length} active projects
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab("users")}
          className="border border-white/10 bg-white/[0.02] rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3 flex items-center justify-between" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span>Active Team & Reps</span>
            <Users size={13} className="text-white/40" />
          </p>
          <p className="text-3xl font-bold text-white mb-1 font-mono">{users.length}</p>
          <p className="text-xs text-white/50">
            {salesUsers.length} Sales · {devUsers.length} Devs · {adminUsers.length} Admin
          </p>
        </div>
      </div>

      {/* Real Live Status Notification Bar */}
      <div className="flex items-center gap-4 text-xs p-4 rounded-xl border border-white/10 bg-white/[0.02]">
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Sync Active
        </span>
        <span className="text-white/70">
          Database connected to Supabase · {totalLeads} CRM leads indexed · {followups} callbacks pending · {leads.length} inbound forms received.
        </span>
        <div className="flex-1" />
        <button 
          onClick={() => onNavigateTab && onNavigateTab("crm")}
          className="border border-white/10 px-3 py-1.5 rounded text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          Open Sales CRM →
        </button>
      </div>

      {/* Real CRM Distribution Breakdown & Pipeline Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Real Lead Pipeline & Call Breakdown
            </h3>
            <span className="text-[10px] text-white/40 font-mono">
              Total {totalLeads} leads
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/70">New / Pending Outreach</span>
                <span className="text-white font-mono">{pendingCalls} ({statusPercentages.newPct}%)</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/40 rounded-full" style={{ width: `${statusPercentages.newPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-cyan-300">Scheduled Follow-ups</span>
                <span className="text-cyan-300 font-mono">{followups} ({statusPercentages.fuPct}%)</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${statusPercentages.fuPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-300">Not Answered (RNR)</span>
                <span className="text-amber-300 font-mono">{notAnswered} ({statusPercentages.rnrPct}%)</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${statusPercentages.rnrPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-emerald-400 font-medium">Converted / Won Deals</span>
                <span className="text-emerald-400 font-mono font-bold">{converted} ({statusPercentages.convPct}%)</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${statusPercentages.convPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-red-400">Not Converted (Out of Budget)</span>
                <span className="text-red-400 font-mono">{notConverted} ({statusPercentages.notConvPct}%)</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${statusPercentages.notConvPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Real Sales Rep Team Activity Snapshot */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Sales Rep Capacity & Assignments
            </h3>
            <span className="text-[10px] text-white/40 font-mono">
              {salesUsers.length} Reps Registered
            </span>
          </div>

          <div className="space-y-3">
            {salesUsers.length > 0 ? (
              salesUsers.map(rep => {
                const repAssigned = crmLeads.filter(l => isLeadAssignedToRep(l.assigned_to, rep)).length;
                const repCallsDone = crmLeads.filter(l => isLeadAssignedToRep(l.assigned_to, rep) && l.status && l.status !== "New").length;
                const repConv = crmLeads.filter(l => isLeadAssignedToRep(l.assigned_to, rep) && l.status === "Converted").length;
                return (
                  <div key={rep.id} className="p-3 border border-white/5 rounded-lg bg-black/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-[11px]">
                        {rep.full_name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{rep.full_name}</p>
                        <p className="text-[10px] text-white/40">{rep.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-mono font-bold text-white text-xs">{repAssigned}</p>
                        <p className="text-[9px] text-white/40 uppercase">Assigned</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-blue-400 text-xs">{repCallsDone}</p>
                        <p className="text-[9px] text-white/40 uppercase">Done</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-emerald-400 text-xs">{repConv}</p>
                        <p className="text-[9px] text-white/40 uppercase">Won</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-white/40 text-xs">
                No users currently designated with the "sales" role. Head to Users & Roles to assign sales reps.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operator Priorities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Live Operator Priorities</h3>
            <span className="text-xs text-white/40">Real-time alerts</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="py-2 font-medium">STATUS</th>
                <th className="py-2 font-medium">OPPORTUNITY / TASK</th>
                <th className="py-2 font-medium">DEPARTMENT</th>
                <th className="py-2 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {realPriorities.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5">
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </td>
                  <td className="py-3 text-white font-medium">{item.title}</td>
                  <td className="py-3 text-white/60">{item.team}</td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => onNavigateTab && onNavigateTab(item.tab)}
                      className="text-white hover:underline cursor-pointer"
                    >
                      {item.actionText}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-white/30 mt-4">
            Audit logging actively monitors all operator updates and reassignments.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Platform Health & Quick Launch</h3>
            <span className="text-xs text-white/40">Operational shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => onNavigateTab && onNavigateTab("crm")}
              className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
            >
              <Database size={16} className="text-[#fbbf24] mb-2" />
              <p className="font-semibold text-white">Sales CRM Dashboard</p>
              <p className="text-[10px] text-white/40 mt-1">Manage leads, upload CSV, bulk assign</p>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab("users")}
              className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
            >
              <Users size={16} className="text-blue-400 mb-2" />
              <p className="font-semibold text-white">User Roles & Access</p>
              <p className="text-[10px] text-white/40 mt-1">Configure sales, client, & dev roles</p>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab("conversations")}
              className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
            >
              <MessageSquare size={16} className="text-emerald-400 mb-2" />
              <p className="font-semibold text-white">Live Conversations</p>
              <p className="text-[10px] text-white/40 mt-1">Transcript inspection & operator takeover</p>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab("projects")}
              className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
            >
              <Briefcase size={16} className="text-purple-400 mb-2" />
              <p className="font-semibold text-white">Client Projects</p>
              <p className="text-[10px] text-white/40 mt-1">Assign team members & track status</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
