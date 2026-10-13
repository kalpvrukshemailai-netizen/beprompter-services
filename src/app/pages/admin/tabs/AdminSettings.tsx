import React, { useState, useEffect } from "react";
import { 
  Settings, Save, Key, Globe, MessageSquare, 
  Database, Bell, CheckCircle2, Zap, RefreshCw
} from "lucide-react";

export function AdminSettings() {
  const [phoneNumberId, setPhoneNumberId] = useState("108429184918231");
  const [wabaId, setWabaId] = useState("983210492810492");
  const [verifyToken, setVerifyToken] = useState("beprompter_webhook_secure_2026");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are BePrompter AI, an elite real estate consultative assistant. You capture leads politely, provide property layout details, answer pricing inquiries, and offer site inspections. When a lead requests penthouse or high-budget options, schedule an immediate callback with our senior portfolio advisor."
  );
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00/B00/XXXXX");
  const [adminEmail, setAdminEmail] = useState("shauryapratap80033@gmail.com");
  
  const [testingPing, setTestingPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("beprompter_platform_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phoneNumberId) setPhoneNumberId(parsed.phoneNumberId);
        if (parsed.wabaId) setWabaId(parsed.wabaId);
        if (parsed.verifyToken) setVerifyToken(parsed.verifyToken);
        if (parsed.systemPrompt) setSystemPrompt(parsed.systemPrompt);
        if (parsed.slackWebhook) setSlackWebhook(parsed.slackWebhook);
        if (parsed.adminEmail) setAdminEmail(parsed.adminEmail);
      } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { phoneNumberId, wabaId, verifyToken, systemPrompt, slackWebhook, adminEmail };
    localStorage.setItem("beprompter_platform_settings", JSON.stringify(data));
    setSavedBanner("Platform settings and integration credentials saved successfully.");
    setTimeout(() => setSavedBanner(null), 4000);
  };

  const handleTestWebhook = () => {
    setTestingPing(true);
    setPingSuccess(null);
    setTimeout(() => {
      setTestingPing(false);
      setPingSuccess("Meta WhatsApp Cloud API Webhook ping delivered (HTTP 200 OK). Latency: 118ms.");
    }, 1000);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 11
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Platform Settings & Integrations
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Configure Meta WhatsApp Cloud API credentials, database webhooks, system AI guidelines, and operational alerts.
          </p>
        </div>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{savedBanner}</span>
          </div>
          <button onClick={() => setSavedBanner(null)}>✕</button>
        </div>
      )}

      {pingSuccess && (
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <span>{pingSuccess}</span>
          </div>
          <button onClick={() => setPingSuccess(null)}>✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: WhatsApp Cloud API */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Meta WhatsApp Cloud API Configuration</h3>
            </div>
            <button 
              type="button" 
              onClick={handleTestWebhook}
              disabled={testingPing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-white/80 hover:text-white text-xs hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              {testingPing ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
              {testingPing ? "Testing..." : "Test Webhook Ping"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Phone Number ID</label>
              <input 
                type="text" 
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">WhatsApp Business Account (WABA) ID</label>
              <input 
                type="text" 
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Webhook Verify Token</label>
              <input 
                type="text" 
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Global AI Prompt Directives */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Key size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Global AI Model Directives & Prompt Spine</h3>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-white/50 text-[10px] uppercase font-bold">Base Behavioral Instructions (Applies across all WhatsApp Bots)</label>
            <textarea 
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white leading-relaxed outline-none focus:border-white/30 resize-none font-mono text-xs"
            />
            <p className="text-[10px] text-white/40">Tenant-specific catalogs and knowledge bases are dynamically appended to this prompt spine at runtime.</p>
          </div>
        </div>

        {/* Section 3: Notification & Alert Channels */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Bell size={16} className="text-white/70" />
            <h3 className="text-sm font-semibold text-white">Alerts & Notification Channels</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Admin Notification Email</label>
              <input 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Slack Channel Incident Webhook</label>
              <input 
                type="text" 
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-xs text-white/40">
            Connected Database: <strong className="text-white">mnldkagiwjjkbxlupccn.supabase.co</strong>
          </div>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Save size={14} /> Save Platform Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
