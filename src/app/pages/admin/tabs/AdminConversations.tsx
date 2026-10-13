import React, { useState } from "react";
import { 
  MessageSquare, Search, Filter, Phone, User, CheckCircle, 
  Clock, ArrowRight, Shield, Bot, Send, RefreshCw, AlertTriangle
} from "lucide-react";

interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  workspaceName: string;
  channel: "whatsapp" | "web" | "voice";
  status: "ai_active" | "human_escalated" | "closed";
  sentiment: "positive" | "inquiring" | "urgent" | "neutral";
  lastMessage: string;
  lastTimestamp: string;
  messagesCount: number;
  messages: Array<{
    sender: "bot" | "user" | "agent";
    text: string;
    timestamp: string;
  }>;
}

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98201 44521",
    workspaceName: "Meridian Realty",
    channel: "whatsapp",
    status: "human_escalated",
    sentiment: "urgent",
    lastMessage: "I want to visit the 3 BHK penthouse tomorrow at 4 PM. Can the owner be present?",
    lastTimestamp: "3 mins ago",
    messagesCount: 8,
    messages: [
      { sender: "user", text: "Hi, saw your listing for Meridian Skyline Phase 2.", timestamp: "17:15" },
      { sender: "bot", text: "Hello Vikram! Welcome to Meridian Realty. Are you interested in the 2 BHK or 3 BHK layout?", timestamp: "17:15" },
      { sender: "user", text: "3 BHK on higher floor with sea view.", timestamp: "17:16" },
      { sender: "bot", text: "Great choice! We have Unit 2402 and 2701 available starting from ₹3.2 Cr. Would you like a site inspection brochure?", timestamp: "17:16" },
      { sender: "user", text: "I want to visit the 3 BHK penthouse tomorrow at 4 PM. Can the owner be present?", timestamp: "17:21" },
      { sender: "bot", text: "I am looping in our Senior Portfolio Advisor, Shaurya, to confirm the owner availability for 4 PM tomorrow.", timestamp: "17:21" }
    ]
  },
  {
    id: "conv-2",
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 98190 23411",
    workspaceName: "Skyline Estates",
    channel: "whatsapp",
    status: "ai_active",
    sentiment: "positive",
    lastMessage: "Brochure received, thank you! Checking floor plans now.",
    lastTimestamp: "12 mins ago",
    messagesCount: 6,
    messages: [
      { sender: "user", text: "Need details on pre-launch discounts.", timestamp: "16:45" },
      { sender: "bot", text: "Pre-launch discounts offer up to 4% waiver on stamp duty for bookings before Sunday.", timestamp: "16:45" },
      { sender: "user", text: "Please send PDF brochure.", timestamp: "16:46" },
      { sender: "bot", text: "PDF Brochure for Skyline Crown has been sent to your WhatsApp. Let me know if you need loan pre-eligibility check.", timestamp: "16:47" },
      { sender: "user", text: "Brochure received, thank you! Checking floor plans now.", timestamp: "16:50" }
    ]
  },
  {
    id: "conv-3",
    customerName: "Rajesh Kulkarni",
    customerPhone: "+91 97690 99823",
    workspaceName: "Northline Builders",
    channel: "web",
    status: "ai_active",
    sentiment: "inquiring",
    lastMessage: "What are the possession timelines for Tower C?",
    lastTimestamp: "24 mins ago",
    messagesCount: 4,
    messages: [
      { sender: "user", text: "Possession date?", timestamp: "16:32" },
      { sender: "bot", text: "Tower C is slated for RERA possession in March 2027, with sample flats ready for walkthrough.", timestamp: "16:33" },
      { sender: "user", text: "What are the possession timelines for Tower C?", timestamp: "16:34" }
    ]
  },
  {
    id: "conv-4",
    customerName: "Sunil Mehta",
    customerPhone: "+91 99200 11200",
    workspaceName: "Zenith Commercial Hub",
    channel: "whatsapp",
    status: "closed",
    sentiment: "positive",
    lastMessage: "Site visit booked for Saturday 11:30 AM with sales manager.",
    lastTimestamp: "1 hour ago",
    messagesCount: 10,
    messages: [
      { sender: "user", text: "Looking for 2,000 sq ft office space.", timestamp: "15:10" },
      { sender: "bot", text: "We have Grade-A commercial floor plates available on 8th floor. Are you looking to buy or lease?", timestamp: "15:11" },
      { sender: "user", text: "Lease for 5 years.", timestamp: "15:12" },
      { sender: "bot", text: "Great! Lease rentals are ₹140/sq.ft. Scheduled walkthrough for Saturday 11:30 AM.", timestamp: "15:14" },
      { sender: "user", text: "Site visit booked for Saturday 11:30 AM with sales manager.", timestamp: "15:15" }
    ]
  }
];

export function AdminConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>("conv-1");
  const [filterWorkspace, setFilterWorkspace] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  const selectedConv = conversations.find(c => c.id === selectedId) || conversations[0];

  const filteredConversations = conversations.filter(c => {
    if (filterWorkspace !== "all" && c.workspaceName !== filterWorkspace) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.customerName.toLowerCase().includes(q) || 
             c.customerPhone.includes(q) || 
             c.workspaceName.toLowerCase().includes(q) ||
             c.lastMessage.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv) return;
    
    const newMsg = {
      sender: "agent" as const,
      text: replyText.trim(),
      timestamp: "Just now"
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConv.id) {
        return {
          ...c,
          status: "human_escalated",
          lastMessage: replyText.trim(),
          lastTimestamp: "Just now",
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
    setReplyText("");
  };

  const handleToggleHandoff = (convId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        const nextStatus = c.status === "human_escalated" ? "ai_active" : "human_escalated";
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Platform Operations / 07
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Conversation Oversight & Live Handoff
          </h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            Real-time multi-tenant transcript stream. Inspect AI outputs, intervene on high-value leads, and control live human handovers.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setConversations(DEMO_CONVERSATIONS)}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors"
          >
            <RefreshCw size={12} /> Refresh Stream
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Live Threads", value: "142", sub: "98.2% automated by AI" },
          { label: "Human Interventions", value: "18", sub: "12 high-intent penthouses" },
          { label: "Avg Resolution Time", value: "48s", sub: "2.1x faster than human SLA" },
          { label: "Customer Satisfaction", value: "98.4%", sub: "4.8/5.0 CSAT rating" }
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

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search phone, name, lead inquiry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 outline-none w-64 focus:border-white/30"
            />
          </div>

          <select 
            value={filterWorkspace}
            onChange={(e) => setFilterWorkspace(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
          >
            <option value="all" className="bg-[#111]">All Workspaces</option>
            <option value="Meridian Realty" className="bg-[#111]">Meridian Realty</option>
            <option value="Skyline Estates" className="bg-[#111]">Skyline Estates</option>
            <option value="Northline Builders" className="bg-[#111]">Northline Builders</option>
            <option value="Zenith Commercial Hub" className="bg-[#111]">Zenith Commercial Hub</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
          >
            <option value="all" className="bg-[#111]">All Statuses</option>
            <option value="ai_active" className="bg-[#111]">AI Autonomous</option>
            <option value="human_escalated" className="bg-[#111]">Human Escalated</option>
            <option value="closed" className="bg-[#111]">Closed / Won</option>
          </select>
        </div>

        <span className="text-xs text-white/40">
          Showing {filteredConversations.length} active threads
        </span>
      </div>

      {/* Main Split Layout: Left List + Right Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
        {/* Left: Conversations Thread List */}
        <div className="lg:col-span-5 border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-white/40 bg-white/[0.02]">
            Inbox Stream
          </div>
          <div className="divide-y divide-white/5 overflow-y-auto max-h-[580px]">
            {filteredConversations.map((c) => {
              const isSelected = c.id === selectedConv?.id;
              return (
                <div 
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white/10 border-l-2 border-white' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">{c.customerName}</span>
                    <span className="text-[10px] text-white/40">{c.lastTimestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-[10px]">
                    <span className="text-white/60 font-mono">{c.customerPhone}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50">{c.workspaceName}</span>
                  </div>
                  <p className="text-xs text-white/70 line-clamp-2 mb-2.5 font-light">
                    "{c.lastMessage}"
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      c.status === 'human_escalated' ? 'bg-amber-500/20 text-amber-300' :
                      c.status === 'ai_active' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {c.status === 'human_escalated' ? 'Needs Human' : c.status === 'ai_active' ? 'AI Rep Active' : 'Completed'}
                    </span>
                    <span className="text-white/40">{c.messagesCount} msgs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Transcript Inspector & Admin Control */}
        <div className="lg:col-span-7 border border-white/10 rounded-xl bg-white/[0.02] flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              {/* Transcript Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                    {selectedConv.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      {selectedConv.customerName}
                      <span className="text-[10px] text-white/50 font-mono font-normal">({selectedConv.customerPhone})</span>
                    </h3>
                    <p className="text-[10px] text-white/40">
                      Workspace: <strong className="text-white/70">{selectedConv.workspaceName}</strong> · WhatsApp Channel
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleHandoff(selectedConv.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                      selectedConv.status === 'human_escalated'
                        ? 'bg-amber-400 text-black hover:bg-amber-300'
                        : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {selectedConv.status === 'human_escalated' ? 'Hand back to AI' : 'Take over chat'}
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px] bg-black/20">
                {selectedConv.messages.map((m, idx) => {
                  const isUser = m.sender === "user";
                  const isAgent = m.sender === "agent";
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-white/40">
                        {isUser ? (
                          <span className="flex items-center gap-1"><User size={10} /> Lead</span>
                        ) : isAgent ? (
                          <span className="flex items-center gap-1 text-amber-300"><Shield size={10} /> Admin Operator</span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400"><Bot size={10} /> BePrompter AI</span>
                        )}
                        <span>·</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div className={`p-3.5 rounded-xl max-w-md text-xs leading-relaxed ${
                        isUser 
                          ? 'bg-white/10 text-white border border-white/10' 
                          : isAgent
                          ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30'
                          : 'bg-emerald-950/40 text-emerald-100 border border-emerald-500/20'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Form */}
              <form onSubmit={handleSendAdminReply} className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Send operator override message directly to customer's WhatsApp..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/30"
                />
                <button 
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 disabled:opacity-30 transition-all flex items-center gap-1.5"
                >
                  <Send size={12} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/30 text-xs">
              Select a conversation to inspect transcript.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
