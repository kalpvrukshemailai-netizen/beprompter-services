import { Plus, Phone, Mail, MessageSquare, Check, Clock, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

export function ActivityTab({ leads, onLeadClick, onAddOpportunity }: { leads: any[], onLeadClick?: (id: string) => void, onAddOpportunity?: () => void }) {
  const followUps = leads.filter(l => l.status === "Follow-up");
  const overdueFollowUps = followUps.slice(0, 3);
  const todaysAgenda = followUps.slice(3, 9);
  const contactedCount = leads.filter(l => l.status !== "New").length;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Make every conversation count.
          </h1>
          <p className="text-xs text-white/50">Your calls, commitments and follow-ups, organized into a focused day of selling.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-transparent border border-white/20 text-white rounded hover:bg-white/5 transition-colors">
              <Clock size={14} /> Log activity
            </button>
            <button onClick={() => onAddOpportunity?.()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-white/90 transition-colors">
              <Plus size={14} /> Schedule follow-up
            </button>
        </div>
      </div>

      {/* 4 Top Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest font-medium">Calls to make today</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">{todaysAgenda.length}</span>
            <span className="text-[10px] text-white/50">{Math.floor(todaysAgenda.length / 2)} emails · {Math.ceil(todaysAgenda.length / 2)} other</span>
          </div>
        </div>
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest font-medium">Overdue</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">{overdueFollowUps.length}</span>
            <span className="text-[10px] text-[#f87171]">Priority action required</span>
          </div>
        </div>
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest font-medium">Completed this week</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">{contactedCount}</span>
            <span className="text-[10px] text-[#34d399]">{Math.min(100, Math.floor((contactedCount / 80) * 100))}% of your 80-total weekly goal</span>
          </div>
        </div>
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest font-medium">Calls connected</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">{Math.floor(contactedCount * 0.4)} / {contactedCount}</span>
            <span className="text-[10px] text-white/50">Est. connection rate</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex gap-6 text-xs font-medium">
            <span className="text-white border-b-2 border-white pb-4 -mb-[17px]">Today ({todaysAgenda.length})</span>
            <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">Overdue ({overdueFollowUps.length})</span>
            <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">Upcoming ({followUps.length - overdueFollowUps.length - todaysAgenda.length})</span>
            <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">Completed</span>
        </div>
        <div className="flex gap-4">
            <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">All channels <ChevronDown size={12}/></button>
            <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">My tasks <ChevronDown size={12}/></button>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="border border-white/10 rounded-lg bg-white/[0.02] overflow-hidden">
            <div className="bg-[#f87171]/10 px-5 py-3 border-b border-[#f87171]/20 flex justify-between items-center">
              <h3 className="text-sm font-medium text-[#f87171]">Resolve overdue follow-ups</h3>
              <span className="text-[10px] text-[#f87171]/60 uppercase tracking-widest">{overdueFollowUps.length} tasks</span>
            </div>
            <div className="divide-y divide-white/5">
                {overdueFollowUps.length === 0 ? (
                  <p className="p-5 text-xs text-white/40 italic">No overdue tasks.</p>
                ) : overdueFollowUps.map(lead => (
                  <div key={lead.id} onClick={() => onLeadClick?.(lead.id)} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                        <div className="mt-1"><Phone size={14} className="text-white/40"/></div>
                        <div>
                            <p className="text-sm text-white font-medium mb-1">{lead.name}</p>
                            <p className="text-xs text-white/40 mb-1">Follow-up on proposal · 2 days ago</p>
                        </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 text-[10px] bg-white/5 text-white/60 hover:text-white rounded">Reschedule</button>
                        <button className="px-3 py-1.5 text-[10px] bg-white/10 text-white rounded">Complete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="border border-white/10 rounded-lg bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-sm font-medium text-white/80">Today's agenda</h3>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">{todaysAgenda.length} tasks</span>
            </div>
            <div className="divide-y divide-white/5">
                {todaysAgenda.length === 0 ? (
                  <p className="p-5 text-xs text-white/40 italic">No agenda items for today.</p>
                ) : todaysAgenda.map((lead, i) => (
                  <div key={lead.id} onClick={() => onLeadClick?.(lead.id)} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-white/30 w-8">{i === 0 ? "09:30" : i === 1 ? "11:00" : i === 2 ? "13:00" : "14:30"}</span>
                            {i % 3 === 0 ? <Phone size={14} className="text-white/40"/> : i % 3 === 1 ? <Mail size={14} className="text-white/40"/> : <MessageSquare size={14} className="text-white/40"/>}
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium mb-1">{lead.name}</p>
                            <p className="text-xs text-white/40">Confirm details before sending</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-[10px] bg-white/10 text-white font-medium uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity">Open</button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 space-y-6">
          <div className="border border-[#34d399]/20 rounded-lg bg-[#34d399]/5 p-5">
            <div className="flex justify-between items-center mb-4 text-[#34d399]">
              <h3 className="text-sm font-bold uppercase tracking-widest">Upcoming call</h3>
              <span className="text-xs">ASAP</span>
            </div>
            {todaysAgenda.length > 0 ? (
              <div className="bg-black/40 rounded p-4 border border-[#34d399]/10 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => onLeadClick?.(todaysAgenda[0].id)}>
                  <span className="px-2 py-0.5 rounded bg-[#34d399]/20 text-[#34d399] text-[10px] uppercase tracking-widest font-bold mb-2 inline-block">Discovery - Zoom</span>
                  <p className="text-lg text-white font-medium mb-1">{todaysAgenda[0].name}</p>
                  <p className="text-xs text-white/50 mb-4">{todaysAgenda[0].firm_type || "No company"} • New Request</p>
                  
                  <p className="text-[10px] uppercase text-white/40 font-bold tracking-widest mb-2">Your Goal:</p>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">Understand how leads are captured and followed up. Confirm the decision maker, timeline and success metric.</p>
                  
                  <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-white text-black text-xs font-medium rounded flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                          <Phone size={12}/> Start call
                      </button>
                      <button className="flex-1 py-2 bg-white/10 text-white hover:bg-white/20 text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors">
                          Discovery script
                      </button>
                  </div>
              </div>
            ) : (
              <div className="bg-black/40 rounded p-4 border border-[#34d399]/10">
                <p className="text-sm text-white/50 italic text-center py-4">No upcoming calls for today.</p>
              </div>
            )}
          </div>

          <div className="border border-white/10 rounded-lg bg-white/[0.02] p-5">
            <h3 className="text-sm font-medium text-white/80 mb-6">Weekly activity</h3>
            <div className="h-32 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Mon", calls: Math.floor(contactedCount*0.2), emails: Math.floor(contactedCount*0.1) },
                  { name: "Tue", calls: Math.floor(contactedCount*0.3), emails: Math.floor(contactedCount*0.2) },
                  { name: "Wed", calls: Math.floor(contactedCount*0.1), emails: Math.floor(contactedCount*0.15) },
                  { name: "Thu", calls: Math.floor(contactedCount*0.25), emails: Math.floor(contactedCount*0.1) },
                  { name: "Fri", calls: Math.floor(contactedCount*0.15), emails: Math.floor(contactedCount*0.05) },
                ]}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} itemStyle={{ color: "#fff" }} />
                  <Bar dataKey="calls" stackId="a" fill="#ffffff" />
                  <Bar dataKey="emails" stackId="a" fill="rgba(255,255,255,0.2)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-white/40 text-center">{contactedCount} outreaches completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
