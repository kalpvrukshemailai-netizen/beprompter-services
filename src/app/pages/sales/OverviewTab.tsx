import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, Clock, Target, CheckCircle, Download, Phone, MessageSquare } from "lucide-react";

// Helper to extract a rough numeric value from budget strings (e.g. "50k", "1L")
const extractValue = (budgetStr: string | null | undefined): number => {
  if (!budgetStr) return 0; // Default estimate
  const lower = budgetStr.toLowerCase();
  let val = parseInt(budgetStr.replace(/[^0-9]/g, '')) || 0;
  if (lower.includes('l') || lower.includes('lakh')) val *= 100000;
  else if (lower.includes('k')) val *= 1000;
  // If the extracted value is suspiciously small like '5' for 5L, correct it
  if (val < 1000 && val > 0) val *= 100000; 
  return val;
};

export function OverviewTab({ leads, globalLeads, onLeadClick }: { leads: any[], globalLeads: any[], onLeadClick?: (id: string) => void }) {
  const convertedLeads = leads.filter(l => l.status === "Converted");
  const activeLeads = leads.filter(l => l.status === "New" || l.status === "Follow-up");
  const followUpLeads = leads.filter(l => l.status === "Follow-up");
  
  const revenue = convertedLeads.reduce((sum, l) => sum + extractValue(l.budget_constraints), 0);
  const activePipeline = activeLeads.reduce((sum, l) => sum + extractValue(l.budget_constraints), 0);
  
  // Calculate revenue performance for the last 6 days
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i));
    const dateStr = d.toISOString().split('T')[0];
    
    // Revenue added to pipeline on this date
    const dayLeads = leads.filter(l => l.created_at && l.created_at.startsWith(dateStr));
    const dayPipeline = dayLeads.reduce((sum, l) => sum + extractValue(l.budget_constraints), 0);
    
    return {
      name: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      val1: dayPipeline / 100000, // in Lakhs
    };
  });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          A clearer view. A stronger close.
        </h1>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-white/90 transition-colors">
          <Download size={14} /> Export report
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-white/50 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Revenue closed</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">₹{(revenue/100000).toFixed(1)}L</span>
            <span className="flex items-center text-[10px] text-white/50"><ArrowUpRight size={12} className="mr-0.5 text-[#34d399]"/> +12.5%</span>
          </div>
        </div>
        {/* Card 2 */}
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-white/50 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Active pipeline</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">₹{(activePipeline/100000).toFixed(1)}L</span>
            <span className="text-[10px] text-white/50">{activeLeads.length} opps</span>
          </div>
        </div>
        {/* Card 3 */}
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-white/50 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Win-to-loss rate</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">{leads.length ? ((convertedLeads.length / leads.length) * 100).toFixed(1) : 0}%</span>
            <span className="text-[10px] text-white/50">{leads.length} total leads</span>
          </div>
        </div>
        {/* Card 4 */}
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-white/50 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Follow-ups active</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-white">{followUpLeads.length}</span>
            <span className="text-[10px] text-white/50 flex flex-col items-end">
                <span>Total queued</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Line Chart */}
        <div className="col-span-2 p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-white/80">Pipeline growth (Last 6 Days)</h3>
            <p className="text-xs text-white/40">Values in Lakhs (₹)</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="val1" stroke="#ffffff" strokeWidth={2} dot={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion */}
        <div className="col-span-1 p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <h3 className="text-sm font-medium text-white/80 mb-6">Lead conversion</h3>
          <div className="space-y-6">
            <ConversionBar label="Raw" value={leads.length} max={leads.length || 1} />
            <ConversionBar label="Contacted" value={leads.length - leads.filter(l => l.status === "New").length} max={leads.length || 1} />
            <ConversionBar label="Qualified" value={followUpLeads.length + convertedLeads.length} max={leads.length || 1} />
            <ConversionBar label="Converted" value={convertedLeads.length} max={leads.length || 1} />
          </div>
        </div>
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <h3 className="text-sm font-medium text-white/80 mb-4 flex justify-between">
            Your next moves
            <span className="text-xs text-white/40 cursor-pointer hover:text-white">View all follow-ups &rarr;</span>
          </h3>
          <div className="space-y-2">
            {followUpLeads.length === 0 ? (
               <p className="text-xs text-white/40 italic">No follow-ups scheduled.</p>
            ) : (
               followUpLeads.slice(0, 3).map((lead, i) => (
                <div key={lead.id} onClick={() => onLeadClick?.(lead.id)} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-white/40">{i === 0 ? "ASAP" : "Later"}</span>
                        <div>
                            <p className="text-sm text-white max-w-[150px] truncate">{lead.name}</p>
                            <p className="text-[10px] text-white/40 max-w-[150px] truncate">{lead.objections || "Follow-up discussion"}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 bg-white/10 rounded text-[10px]">Pending</button>
                        <button className="px-2 py-1 bg-white/10 rounded text-[10px] uppercase font-medium hover:bg-white/20 transition-colors">Open</button>
                    </div>
                </div>
               ))
            )}
          </div>
        </div>
        
        <div className="p-5 border border-white/10 rounded-lg bg-white/[0.02]">
          <h3 className="text-sm font-medium text-white/80 mb-4 flex justify-between">
            Overall status distribution
            <span className="text-xs text-white/40">All time</span>
          </h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between text-xs">
                 <span className="text-white/60">New Leads</span>
                 <span className="text-white">{leads.filter(l => l.status === "New").length}</span>
             </div>
             <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-white rounded-full" style={{ width: `${(leads.filter(l => l.status === "New").length / (leads.length || 1)) * 100}%` }} /></div>
             
             <div className="flex items-center justify-between text-xs mt-4">
                 <span className="text-[#f87171]/80">Lost / Not Answered</span>
                 <span className="text-[#f87171]">{leads.filter(l => l.status === "Not Converted" || l.status === "Not Answered").length}</span>
             </div>
             <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-[#f87171]/80 rounded-full" style={{ width: `${(leads.filter(l => l.status === "Not Converted" || l.status === "Not Answered").length / (leads.length || 1)) * 100}%` }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionBar({ label, value, max }: { label: string, value: number, max: number }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 text-white/60">
        <span>{label}</span>
        <span className="text-white">{value} leads</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white/80 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
