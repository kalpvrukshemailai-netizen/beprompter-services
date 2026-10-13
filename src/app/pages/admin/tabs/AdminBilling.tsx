import React, { useState } from "react";
import { 
  CreditCard, Download, DollarSign, ArrowUpRight, 
  CheckCircle, Clock, AlertCircle, Plus, Send, FileText
} from "lucide-react";

interface Invoice {
  id: string;
  workspace: string;
  plan: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
  messagesUsed: string;
}

const INITIAL_INVOICES: Invoice[] = [
  { id: "BP-INV-109", workspace: "Meridian Realty", plan: "Scale (₹25k)", amount: "₹25,000", status: "paid", date: "01 Oct 2026", dueDate: "05 Oct 2026", messagesUsed: "42,100 / 50k" },
  { id: "BP-INV-108", workspace: "Skyline Estates", plan: "Growth (₹12k)", amount: "₹12,000", status: "paid", date: "01 Oct 2026", dueDate: "05 Oct 2026", messagesUsed: "18,400 / 20k" },
  { id: "BP-INV-107", workspace: "Northline Builders", plan: "Growth (₹12k)", amount: "₹12,000", status: "overdue", date: "28 Sep 2026", dueDate: "03 Oct 2026", messagesUsed: "14,800 / 20k" },
  { id: "BP-INV-106", workspace: "Zenith Commercial", plan: "Enterprise (₹45k)", amount: "₹45,000", status: "paid", date: "25 Sep 2026", dueDate: "30 Sep 2026", messagesUsed: "88,200 / 100k" },
  { id: "BP-INV-105", workspace: "Prestige Group Partner", plan: "Scale (₹25k)", amount: "₹25,000", status: "pending", date: "10 Oct 2026", dueDate: "15 Oct 2026", messagesUsed: "22,500 / 50k" },
  { id: "BP-INV-104", workspace: "Urban Habitat Realty", plan: "Growth (₹12k)", amount: "₹12,000", status: "paid", date: "15 Sep 2026", dueDate: "20 Sep 2026", messagesUsed: "19,200 / 20k" },
];

export function AdminBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form state
  const [newWorkspace, setNewWorkspace] = useState("");
  const [newAmount, setNewAmount] = useState("₹12,000");
  const [newPlan, setNewPlan] = useState("Growth (₹12k)");

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspace) return;

    const newInv: Invoice = {
      id: `BP-INV-${Math.floor(100 + Math.random() * 900)}`,
      workspace: newWorkspace,
      plan: newPlan,
      amount: newAmount,
      status: "pending",
      date: "Today",
      dueDate: "In 7 days",
      messagesUsed: "0 / 20k"
    };

    setInvoices([newInv, ...invoices]);
    setShowCreateModal(false);
    setNewWorkspace("");
    setActionNotice(`Invoice ${newInv.id} for ${newInv.workspace} created successfully.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus === "all") return true;
    return inv.status === filterStatus;
  });

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 09
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Billing, Subscriptions & Quota Usage
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Real-time multi-tenant revenue operations, WhatsApp message allotment meters, and automated invoicing.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors"
          >
            <Plus size={14} /> Create Invoice
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)}>✕</button>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Recurring Revenue", value: "₹2,88,000", sub: "24 active client workspaces" },
          { label: "Billed This Cycle", value: "₹2,16,000", sub: "18 invoices settled on time" },
          { label: "Pending & Overdue", value: "₹72,000", sub: "1 overdue · 3 pending payment" },
          { label: "Total WhatsApp Allotment", value: "82.4%", sub: "164,800 / 200,000 msgs" }
        ].map((s, idx) => (
          <div key={idx} className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {s.label}
            </p>
            <p className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              {s.value}
            </p>
            <p className="text-xs text-white/40">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Plan Breakdown & Quota Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02] space-y-4">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Tenant Tier Breakdown</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/60">Growth Tier (₹12k / mo)</span>
              <span className="font-semibold text-white">14 Workspaces</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/60">Scale Tier (₹25k / mo)</span>
              <span className="font-semibold text-white">6 Workspaces</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/60">Enterprise Tier (₹45k / mo)</span>
              <span className="font-semibold text-white">4 Workspaces</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 border border-white/10 rounded-xl p-5 bg-white/[0.02] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Platform-Wide Quota Consumption</h3>
            <span className="text-[10px] text-white/40">Renews on 01 Nov 2026</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-white/70">WhatsApp Cloud API Conversations</span>
                <span className="text-white/40">164,800 / 200,000 (82.4%)</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '82.4%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-white/70">LLM Inference Tokens (GPT-4o & Claude)</span>
                <span className="text-white/40">32.4M / 50M (64.8%)</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '64.8%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Registry */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold text-white">Invoices & Payment Status</h3>
            <div className="flex gap-1">
              {["all", "paid", "pending", "overdue"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterStatus === st ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-white/40 font-mono">Currency: INR (₹) · GST Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="p-3 pl-4">Invoice #</th>
                <th className="p-3">Client Workspace</th>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Message Usage</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 font-mono text-[11px] text-white/60">{inv.id}</td>
                  <td className="p-3 font-semibold text-white">{inv.workspace}</td>
                  <td className="p-3 text-white/60">{inv.plan}</td>
                  <td className="p-3 text-white/40 text-[11px] font-mono">{inv.messagesUsed}</td>
                  <td className="p-3 font-bold text-white font-mono">{inv.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      inv.status === 'overdue' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-300'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <button 
                      onClick={() => alert(`Downloading PDF for invoice ${inv.id}...`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-[10px] transition-colors"
                    >
                      <Download size={11} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Create Client Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Client Workspace</label>
                <input 
                  type="text" 
                  placeholder="e.g. Meridian Realty" 
                  value={newWorkspace}
                  onChange={(e) => setNewWorkspace(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Plan Tier</label>
                <select 
                  value={newPlan}
                  onChange={(e) => {
                    setNewPlan(e.target.value);
                    if (e.target.value.includes("12k")) setNewAmount("₹12,000");
                    else if (e.target.value.includes("25k")) setNewAmount("₹25,000");
                    else setNewAmount("₹45,000");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                >
                  <option value="Growth (₹12k)" className="bg-[#111]">Growth Tier — ₹12,000</option>
                  <option value="Scale (₹25k)" className="bg-[#111]">Scale Tier — ₹25,000</option>
                  <option value="Enterprise (₹45k)" className="bg-[#111]">Enterprise Tier — ₹45,000</option>
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Invoice Amount</label>
                <input 
                  type="text" 
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-white/90"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
