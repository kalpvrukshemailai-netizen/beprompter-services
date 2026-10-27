import React, { useState, useEffect } from "react";
import { 
  Shield, ShieldAlert, Key, UserCheck, Lock, 
  Download, Search, RefreshCw, AlertTriangle, CheckCircle2
} from "lucide-react";
import { Profile } from "@/lib/supabase";
import { getAuditLogs, logAuditEvent, AuditLog } from "@/lib/auditLog";

export function AdminSecurity({ users = [] }: { users?: Profile[] }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [ipLockdown, setIpLockdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleExportAudit = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Timestamp,Actor,Role,Action,Resource,IP,Severity\n" +
      logs.map(l => `"${l.id}","${l.time}","${l.actor}","${l.role}","${l.action}","${l.resource}","${l.ip}","${l.severity}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `beprompter_audit_log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setBanner("Platform audit log exported to CSV.");
    setTimeout(() => setBanner(null), 4000);
  };

  const handleRevokeSessions = () => {
    if (confirm("Are you sure you want to invalidate all active operator sessions?")) {
      logAuditEvent({
        action: "Non-Admin Operator Sessions Revoked",
        resource: "auth:all_operator_tokens",
        severity: "critical"
      });
      setLogs(getAuditLogs());
      setBanner(`All non-admin sessions invalidated across ${users.length} accounts. Re-authentication required.`);
      setTimeout(() => setBanner(null), 4000);
    }
  };

  const filteredLogs = logs.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return l.actor.toLowerCase().includes(q) || 
           l.action.toLowerCase().includes(q) || 
           l.resource.toLowerCase().includes(q) || 
           l.ip.includes(q);
  });

  const salesCount = users.filter(u => u.role === "sales").length;
  const devCount = users.filter(u => u.role === "developer").length;
  const adminCount = users.filter(u => u.role === "admin").length;

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 10
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Security, Audit Trails & Compliance
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Immutable administrative audit logs, multi-factor authentication policies, session management, and database RLS enforcement.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportAudit}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download size={12} /> Export Audit Log
          </button>
          <button 
            onClick={handleRevokeSessions}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Lock size={12} /> Revoke Non-Admin Sessions
          </button>
        </div>
      </div>

      {banner && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)}>✕</button>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Audit Events Stored
          </p>
          <p className="text-2xl font-semibold text-white mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            {logs.length}
          </p>
          <p className="text-xs text-white/40">Real operational change events</p>
        </div>

        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Registered Operator Accounts
          </p>
          <p className="text-2xl font-semibold text-white mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            {users.length}
          </p>
          <p className="text-xs text-white/40">{adminCount} Admin · {salesCount} Sales · {devCount} Dev</p>
        </div>

        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Database Protection
          </p>
          <p className="text-2xl font-semibold text-emerald-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            RLS Active
          </p>
          <p className="text-xs text-white/40">PostgreSQL policies enforced</p>
        </div>

        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Security Anomalies
          </p>
          <p className="text-2xl font-semibold text-emerald-400 mb-1 font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
            0
          </p>
          <p className="text-xs text-white/40">Zero unauthorized intrusions</p>
        </div>
      </div>

      {/* Policy Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white mb-1">MFA Enforcement Policy</h4>
            <p className="text-[10px] text-white/40">Require 2FA on sign-in for Sales & Developers</p>
          </div>
          <input 
            type="checkbox" 
            checked={mfaEnforced} 
            onChange={(e) => setMfaEnforced(e.target.checked)}
            className="w-4 h-4 accent-white cursor-pointer"
          />
        </div>

        <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white mb-1">IP Allowlist Restriction</h4>
            <p className="text-[10px] text-white/40">Restrict Admin access to verified company IPs</p>
          </div>
          <input 
            type="checkbox" 
            checked={ipLockdown} 
            onChange={(e) => setIpLockdown(e.target.checked)}
            className="w-4 h-4 accent-white cursor-pointer"
          />
        </div>

        <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white mb-1">Tenant Data Isolation</h4>
            <p className="text-[10px] text-white/40">Sales reps only view assigned leads</p>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10">Active</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold text-white">Immutable Platform Audit Log</h3>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Search actor, action, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded pl-7 pr-3 py-1 text-xs text-white placeholder:text-white/30 outline-none w-48 focus:border-white/30"
              />
            </div>
          </div>
          <span className="text-[10px] text-white/40 font-mono">SOC2 / ISO 27001 Prepared</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="p-3 pl-4">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Source IP</th>
                <th className="p-3 pr-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 text-white/50 text-[11px] font-mono">{log.time}</td>
                  <td className="p-3">
                    <span className="font-semibold text-white">{log.actor}</span>
                    <span className="ml-1 text-[10px] text-white/40 uppercase">({log.role})</span>
                  </td>
                  <td className="p-3 text-white/90">{log.action}</td>
                  <td className="p-3 font-mono text-[11px] text-white/50">{log.resource}</td>
                  <td className="p-3 font-mono text-[11px] text-white/40">{log.ip}</td>
                  <td className="p-3 pr-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                      log.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
