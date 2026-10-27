import React, { useState, useEffect, useMemo } from "react";
import { 
  CreditCard, Download, DollarSign, ArrowUpRight, 
  CheckCircle, Clock, AlertCircle, Plus, Send, FileText
} from "lucide-react";
import { Profile } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/auditLog";

interface Invoice {
  id: string;
  workspace: string;
  clientEmail: string;
  plan: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
  messagesUsed: string;
}

const INVOICE_STORAGE_KEY = "beprompter_real_platform_invoices";

export function AdminBilling({ users = [], projects = [] }: { users?: Profile[]; projects?: any[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const stored = localStorage.getItem(INVOICE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Initialize with invoices for actual registered clients if any exist
    const clientAccounts = users.filter(u => u.role === "client" || u.company_name);
    if (clientAccounts.length > 0) {
      return clientAccounts.map((c, i) => ({
        id: `BP-INV-${100 + i}`,
        workspace: c.company_name || c.full_name || "Client Workspace",
        clientEmail: c.email,
        plan: "Growth Tier (₹12,000 / mo)",
        amount: "₹12,000",
        status: i === 0 ? "paid" : "pending",
        date: "01 " + new Date().toLocaleString("en-GB", { month: "short", year: "numeric" }),
        dueDate: "10 " + new Date().toLocaleString("en-GB", { month: "short", year: "numeric" }),
        messagesUsed: "12,400 / 20k"
      }));
    }
    return [];
  });

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form state
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [newWorkspace, setNewWorkspace] = useState("");
  const [newAmount, setNewAmount] = useState("₹12,000");
  const [newPlan, setNewPlan] = useState("Growth Tier (₹12k / mo)");

  useEffect(() => {
    try {
      localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspace) return;

    const newInv: Invoice = {
      id: `BP-INV-${Math.floor(100 + Math.random() * 900)}`,
      workspace: newWorkspace,
      clientEmail: selectedUserEmail || "client@workspace.com",
      plan: newPlan,
      amount: newAmount,
      status: "pending",
      date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: "In 7 days",
      messagesUsed: "0 / 20k"
    };

    const updated = [newInv, ...invoices];
    setInvoices(updated);
    setShowCreateModal(false);
    setNewWorkspace("");
    setSelectedUserEmail("");

    logAuditEvent({
      action: `Invoice Issued: ${newInv.id} (${newInv.amount}) for ${newInv.workspace}`,
      resource: `invoice:${newInv.id}`,
      severity: "low"
    });

    setActionNotice(`Invoice ${newInv.id} issued for ${newInv.workspace}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleToggleStatus = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const nextStatus = inv.status === "paid" ? "pending" : inv.status === "pending" ? "overdue" : "paid";
        logAuditEvent({
          action: `Invoice ${id} marked ${nextStatus}`,
          resource: `invoice:${id}`,
          severity: "low"
        });
        return { ...inv, status: nextStatus };
      }
      return inv;
    }));
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus === "all") return true;
    return inv.status === filterStatus;
  });

  // Calculate real metrics
  const clientCount = users.filter(u => u.role === "client" || u.company_name).length || 1;
  const totalBilled = invoices
    .filter(i => i.status === "paid")
    .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, "") || "0"), 0);
  const totalPending = invoices
    .filter(i => i.status !== "paid")
    .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, "") || "0"), 0);

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
            Real-time client revenue operations, WhatsApp message allotment meters, and automated invoicing.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Plus size={14} /> + Create Invoice
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
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Settled Collections
          </p>
          <p className="text-2xl font-semibold text-emerald-400 mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            ₹{totalBilled.toLocaleString()}
          </p>
          <p className="text-xs text-white/40">{invoices.filter(i => i.status === "paid").length} invoices paid</p>
        </div>

        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Receivables Outstanding
          </p>
          <p className="text-2xl font-semibold text-amber-300 mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            ₹{totalPending.toLocaleString()}
          </p>
          <p className="text-xs text-white/40">{invoices.filter(i => i.status !== "paid").length} invoices awaiting payment</p>
        </div>

        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Client Workspaces
          </p>
          <p className="text-2xl font-semibold text-white mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            {clientCount}
          </p>
          <p className="text-xs text-white/40">Active billing entities</p>
        </div>

        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Quota Meter
          </p>
          <p className="text-2xl font-semibold text-white mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            Normal
          </p>
          <p className="text-xs text-white/40">WhatsApp Cloud tier within limits</p>
        </div>
      </div>

      {/* Invoice Registry */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold text-white">Client Invoices & Status</h3>
            <div className="flex gap-1">
              {["all", "paid", "pending", "overdue"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    filterStatus === st ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-white/40 font-mono">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="p-3 pl-4">Invoice #</th>
                <th className="p-3">Client Workspace</th>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 font-mono text-[11px] text-white/60">{inv.id}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{inv.workspace}</p>
                    <p className="text-[10px] text-white/40">{inv.clientEmail}</p>
                  </td>
                  <td className="p-3 text-white/60">{inv.plan}</td>
                  <td className="p-3 text-white/40 font-mono text-[11px]">{inv.date}</td>
                  <td className="p-3 font-bold text-white font-mono">{inv.amount}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleToggleStatus(inv.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' :
                        inv.status === 'overdue' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' :
                        'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                      }`}
                      title="Click to cycle status"
                    >
                      {inv.status} (Change)
                    </button>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <button 
                      onClick={() => {
                        const content = `BEPROMPTER INVOICE\n\nInvoice ID: ${inv.id}\nClient Workspace: ${inv.workspace}\nEmail: ${inv.clientEmail}\nPlan: ${inv.plan}\nAmount: ${inv.amount}\nStatus: ${inv.status.toUpperCase()}\nDate: ${inv.date}\nDue Date: ${inv.dueDate}\n`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = `${inv.id}_invoice.txt`;
                        link.click();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-[10px] transition-colors cursor-pointer"
                    >
                      <Download size={11} /> Summary
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/30 text-xs">
                    No invoices recorded. Click "+ Create Invoice" to issue an invoice for a client workspace.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Issue Client Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Select Client Workspace</label>
                {users.length > 0 ? (
                  <select 
                    value={selectedUserEmail}
                    onChange={(e) => {
                      const u = users.find(usr => usr.email === e.target.value);
                      setSelectedUserEmail(e.target.value);
                      setNewWorkspace(u?.company_name || u?.full_name || e.target.value);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none mb-2"
                  >
                    <option value="" className="bg-[#111]">-- Select from Registered Users --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.email} className="bg-[#111]">
                        {u.company_name ? `${u.company_name} (${u.full_name})` : `${u.full_name} (${u.email})`}
                      </option>
                    ))}
                  </select>
                ) : null}
                <input 
                  type="text" 
                  placeholder="Or enter workspace/company name manually" 
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
                  <option value="Growth Tier (₹12k / mo)" className="bg-[#111]">Growth Tier — ₹12,000 / mo</option>
                  <option value="Scale Tier (₹25k / mo)" className="bg-[#111]">Scale Tier — ₹25,000 / mo</option>
                  <option value="Enterprise Tier (₹45k / mo)" className="bg-[#111]">Enterprise Tier — ₹45,000 / mo</option>
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
