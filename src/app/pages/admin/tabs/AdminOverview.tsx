import React from "react";
import { ArrowRight, Download, BarChart2 } from "lucide-react";

export function AdminOverview() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Operations / 01</p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>One platform. Every operation in view.</h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>Welcome back, Shaurya. Monitor client growth, AI outcomes and the decisions that need you.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors">
            + Create workspace
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <div className="px-3 py-1.5 border border-white/10 rounded text-xs text-white/60">01 - 09 Oct 2026</div>
        <div className="px-3 py-1.5 border border-white/10 rounded text-xs text-white/60 flex items-center gap-2">All Workspaces <ArrowRight size={10} className="rotate-90" /></div>
        <div className="px-3 py-1.5 text-xs text-white/40 flex items-center">Compare previous period</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Client Workspaces", value: "24", sub: "21 active · 2 onboarding · 1 suspended" },
          { label: "Conversations", value: "12,000", sub: "99.8% delivered by AI - 80% SL" },
          { label: "Human handovers", value: "2,400", sub: "18 awaiting response · 12 over SLA" },
          { label: "Monthly recurring revenue", value: "₹2.40L", sub: "2 past-due invoices · 0 at risk" }
        ].map((stat, i) => (
          <div key={i} className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.label}</p>
            <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.value}</p>
            <p className="text-xs text-white/40">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="bg-white/10 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Connection</span>
        <span className="text-white/60">1 degraded webhook · 56 open handovers · 1 overdue baseline. No platform-wide outage.</span>
        <div className="flex-1" />
        <button className="border border-white/10 px-3 py-1.5 rounded text-white/60 hover:text-white transition-colors">Open operations</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Conversation volume</h3>
            <span className="text-xs text-white/40">Daily, 01-09 Oct</span>
          </div>
          <div className="h-48 flex items-end gap-2 border-b border-l border-white/10 pb-2 pl-2">
            {[40, 60, 45, 70, 50, 80, 95, 60, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-white/20 hover:bg-white/40 transition-colors rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="text-[10px] text-white/40 text-center">Conversations · Illustrative demo trend</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Platform growth & outcomes</h3>
            <span className="text-xs text-white/40">Demo registry</span>
          </div>
          <div className="h-48 border-b border-l border-white/10 relative">
             {/* Fake line chart using SVG */}
             <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
               <polyline points="0,80 20,70 40,65 60,50 80,45 100,30" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             </svg>
          </div>
          <p className="text-[10px] text-white/40 text-center">Total workspaces · Illustrative demo trend</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Operator priorities</h3>
            <span className="text-xs text-white/40">Ordered by impact</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="py-2 font-medium">PRIORITY</th>
                <th className="py-2 font-medium">WORKSPACE / ISSUE</th>
                <th className="py-2 font-medium">TEAM</th>
                <th className="py-2 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              <tr className="border-b border-white/5">
                <td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] uppercase">Degraded</span></td>
                <td className="py-3">Meridian Realty — Webhook retry backlog</td>
                <td className="py-3">Ops on-call</td>
                <td className="py-3 text-right"><button className="text-white hover:underline">Inspect →</button></td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3"><span className="text-white/40">SLA</span></td>
                <td className="py-3">12 handovers waiting longer than 30 min</td>
                <td className="py-3">Sales leads</td>
                <td className="py-3 text-right"><button className="text-white hover:underline">Route →</button></td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3"><span className="text-white/40">Financial</span></td>
                <td className="py-3">Northline Builders — ₹12,000 outstanding</td>
                <td className="py-3">Billing admin</td>
                <td className="py-3 text-right"><button className="text-white hover:underline">Review →</button></td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-white/30 mt-4">Alert over-rides and acknowledgements are recorded in Security & Audit.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Billing & consumption</h3>
            <span className="text-xs text-white/40">Month-to-date</span>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/80">Message allocation</span>
                <span className="text-white/40">89,200 / 110,000 · 81%</span>
              </div>
              <div className="h-1 bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-white" style={{ width: '81%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/80">AI credit budget</span>
                <span className="text-white/40">110,000 / 120,000 · 92%</span>
              </div>
              <div className="h-1 bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-white" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Overdue · 4 invoices</span>
                <span className="text-white/90">₹44,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Outstanding · 1 invoice</span>
                <span className="text-white/90">₹12,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Billed · 18 invoices</span>
                <span className="text-white/90">₹1,60,000</span>
              </div>
            </div>
            <button className="text-xs text-white hover:underline flex items-center gap-1 mt-4">Open billing & usage →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
