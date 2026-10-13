import React, { useState } from "react";
import { 
  Activity, Cpu, Zap, CheckCircle2, AlertTriangle, 
  RefreshCw, Terminal, ArrowUpRight, Gauge, ShieldAlert
} from "lucide-react";

interface ModelEndpoint {
  name: string;
  provider: string;
  status: "operational" | "degraded" | "maintenance";
  latency: number;
  uptime: string;
  tokenShare: string;
}

const ENDPOINTS: ModelEndpoint[] = [
  { name: "GPT-4o (Omni Lead Router)", provider: "OpenAI", status: "operational", latency: 420, uptime: "99.99%", tokenShare: "62%" },
  { name: "Claude 3.5 Sonnet (Nuance & Handoff)", provider: "Anthropic", status: "operational", latency: 510, uptime: "99.95%", tokenShare: "26%" },
  { name: "Whisper Voice-to-Text", provider: "OpenAI", status: "operational", latency: 280, uptime: "100.0%", tokenShare: "8%" },
  { name: "Meta WhatsApp Cloud Webhook", provider: "Meta Cloud", status: "operational", latency: 110, uptime: "99.99%", tokenShare: "4%" },
];

const LOGS = [
  { id: "ev-101", time: "18:22:04", service: "GPT-4o", event: "Structured tool call: schedule_site_visit", status: 200, latency: "412ms" },
  { id: "ev-102", time: "18:21:40", service: "WhatsApp Webhook", event: "Inbound message parsed: +919820144521", status: 200, latency: "94ms" },
  { id: "ev-103", time: "18:19:12", service: "Claude 3.5 Sonnet", event: "Sentiment classification: high-intent penthouse lead", status: 200, latency: "498ms" },
  { id: "ev-104", time: "18:15:30", service: "Supabase DB", event: "crm_leads insert batch (10 records)", status: 200, latency: "65ms" },
  { id: "ev-105", time: "18:11:02", service: "Whisper Engine", event: "Voice note transcribed (0:24s audio)", status: 200, latency: "310ms" },
  { id: "ev-106", time: "17:58:19", service: "Rate Limiter", event: "Token bucket throttle check: tenant meridian_realty", status: 200, latency: "2ms" },
];

export function AdminAiOps() {
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [fallbackEnabled, setFallbackEnabled] = useState(true);

  const runDiagnostics = () => {
    setRunningDiagnostics(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setRunningDiagnostics(false);
      setDiagnosticResult("All 4 AI microservices and webhook routers responded with <500ms p95 latency. Zero packet drops.");
    }, 1200);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 08
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            AI Operations & System Health
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Infrastructure latency, token burn rate, model fallback circuits, and live telemetry across WhatsApp bots.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={runDiagnostics}
            disabled={runningDiagnostics}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {runningDiagnostics ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
            {runningDiagnostics ? "Running Telemetry..." : "Run System Diagnostics"}
          </button>
        </div>
      </div>

      {diagnosticResult && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{diagnosticResult}</span>
          </div>
          <button onClick={() => setDiagnosticResult(null)} className="text-emerald-400/60 hover:text-emerald-300">✕</button>
        </div>
      )}

      {/* Top Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Overall System Uptime", value: "99.98%", sub: "30-day trailing SLA" },
          { label: "Fleet P95 Latency", value: "480ms", sub: "Global real-time streaming" },
          { label: "Daily Token Consumption", value: "1.42M", sub: "₹1,240 est. LLM API spend" },
          { label: "Webhook Success Rate", value: "100.0%", sub: "0 dropped lead events" }
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

      {/* Model Fleet Health Cards */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">LLM Core & Webhook Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENDPOINTS.map((ep, idx) => (
            <div key={idx} className="border border-white/10 rounded-xl p-5 bg-white/[0.02] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">{ep.provider}</span>
                  <h4 className="text-xs font-semibold text-white mt-0.5">{ep.name}</h4>
                </div>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Latency</span>
                  <span className="text-white font-mono">{ep.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Uptime</span>
                  <span className="text-white font-mono">{ep.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Token Volume</span>
                  <span className="text-white font-mono">{ep.tokenShare}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failover Circuit & Telemetry Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Failover Config */}
        <div className="lg:col-span-4 border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-6">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-white/70" />
            <h3 className="text-sm font-semibold text-white">Failover & Circuit Breakers</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-black/30">
              <div>
                <p className="text-white font-medium">Auto-Switch to Claude 3.5</p>
                <p className="text-[10px] text-white/40">If OpenAI returns 429 or over 2000ms latency</p>
              </div>
              <input 
                type="checkbox" 
                checked={fallbackEnabled} 
                onChange={(e) => setFallbackEnabled(e.target.checked)}
                className="accent-white w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-3 border border-white/10 rounded-lg bg-black/30 space-y-1.5">
              <p className="text-white font-medium">Max Output Tokens Cap</p>
              <p className="text-[10px] text-white/40">Limits responses to prevent token runaway</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/70">800 tokens</span>
                <span className="text-[10px] text-emerald-400 font-mono">Enforced</span>
              </div>
            </div>

            <div className="p-3 border border-white/10 rounded-lg bg-black/30 space-y-1.5">
              <p className="text-white font-medium">Retry Exponential Backoff</p>
              <p className="text-[10px] text-white/40">3 attempts with 200ms initial jitter</p>
              <span className="text-[10px] text-white/60 font-mono">Status: Active</span>
            </div>
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="lg:col-span-8 border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-white/50" />
              <h3 className="text-xs font-semibold text-white">Live System Event Log (Realtime Stream)</h3>
            </div>
            <span className="text-[10px] text-white/40 font-mono">Auto-refreshing · 5s poll</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/[0.01]">
                  <th className="p-3 pl-4">Timestamp</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Event Summary</th>
                  <th className="p-3 text-right">HTTP</th>
                  <th className="p-3 pr-4 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80 font-mono text-[11px]">
                {LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 pl-4 text-white/40">{log.time}</td>
                    <td className="p-3 text-white font-sans">{log.service}</td>
                    <td className="p-3 text-white/70">{log.event}</td>
                    <td className="p-3 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 pr-4 text-right text-white/50">{log.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
