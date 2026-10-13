import { Plus, Download, Filter, MoreHorizontal, ArrowRight, User } from "lucide-react";

// Helper to extract a rough numeric value from budget strings (e.g. "50k", "1L")
const extractValue = (budgetStr: string | null | undefined): number => {
  if (!budgetStr) return 0; // Return 0 for missing data so it doesn't inflate pipeline
  const lower = budgetStr.toLowerCase();
  let val = parseInt(budgetStr.replace(/[^0-9]/g, '')) || 0;
  if (lower.includes('l') || lower.includes('lakh')) val *= 100000;
  else if (lower.includes('k')) val *= 1000;
  if (val < 1000 && val > 0) val *= 100000; 
  return val;
};

export function PipelineTab({ leads, onLeadClick, onAddOpportunity, onUpdateStatus }: { leads: any[], onLeadClick: (id: string) => void, onAddOpportunity?: () => void, onUpdateStatus?: (id: string, newStatus: string) => void }) {
  const activeLeads = leads.filter(l => l.status === "New" || l.status === "Follow-up");
  const totalPipeline = activeLeads.reduce((sum, l) => sum + extractValue(l.budget_constraints), 0);
  const weighted = activeLeads.reduce((sum, l) => {
    const val = extractValue(l.budget_constraints);
    return sum + (l.status === 'Follow-up' ? val * 0.4 : val * 0.1);
  }, 0);
  const avgDealSize = activeLeads.length > 0 ? totalPipeline / activeLeads.length : 0;

  const columns = [
    { id: "New", title: "Qualified", probability: "10%" },
    { id: "Follow-up", title: "Discovery & Proposal", probability: "40%" },
    { id: "Converted", title: "Converted (Won)", probability: "100%" },
    { id: "Not Converted", title: "Lost", probability: "0%" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Move the right deals forward.
          </h1>
          <p className="text-xs text-white/50">{activeLeads.length} open opportunities. One shared view of value, momentum and the next best action.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-transparent border border-white/20 text-white rounded hover:bg-white/5 transition-colors">
              <Download size={14} /> Export pipeline
            </button>
            <button onClick={() => onAddOpportunity?.()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-white/90 transition-colors">
              <Plus size={14} /> Add opportunity
            </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border-r border-white/10">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Open pipeline</p>
          <p className="text-2xl font-semibold text-white">₹{(totalPipeline/100000).toFixed(1)}L</p>
          <p className="text-[10px] text-white/40 mt-1">{activeLeads.length} open opportunities</p>
        </div>
        <div className="p-4 border-r border-white/10">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Weighted forecast</p>
          <p className="text-2xl font-semibold text-white">₹{(weighted/100000).toFixed(1)}L</p>
          <p className="text-[10px] text-white/40 mt-1">Based on stage probability</p>
        </div>
        <div className="p-4 border-r border-white/10">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Average deal size</p>
          <p className="text-2xl font-semibold text-white">₹{(avgDealSize/100000).toFixed(1)}L</p>
          <p className="text-[10px] text-white/40 mt-1">For active pipeline</p>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Average sales cycle</p>
          <p className="text-2xl font-semibold text-white">21 days</p>
          <p className="text-[10px] text-white/40 mt-1">3 days vs last month</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex gap-6 text-xs font-medium">
              <span className="text-white border-b-2 border-white pb-4 -mb-[17px]">Smart view</span>
              <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">List view</span>
              <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">Converted ({leads.filter(l => l.status === "Converted").length})</span>
              <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">Lost ({leads.filter(l => l.status === "Not Converted").length})</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1 cursor-pointer hover:text-white"><Filter size={12}/> Filter</span>
          </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-8">
        <div className="flex gap-4 min-w-max">
          {columns.map(col => {
            const stageLeads = leads.filter(l => l.status === col.id);
            const stageValue = stageLeads.reduce((sum, l) => sum + extractValue(l.budget_constraints), 0);
            return (
              <div key={col.id} className="w-72 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{col.title}</span>
                  <span className="text-[10px] text-white/40">{stageLeads.length} opps</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-white">₹{(stageValue/100000).toFixed(1)}L</span>
                  <span className="text-[10px] text-white/40">{col.probability} probability</span>
                </div>
                
                <div 
                  className="space-y-3 flex-1 rounded-lg transition-colors p-1 -mx-1"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("bg-white/[0.05]"); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove("bg-white/[0.05]"); }}
                  onDrop={(e) => { 
                    e.preventDefault(); 
                    e.currentTarget.classList.remove("bg-white/[0.05]"); 
                    const leadId = e.dataTransfer.getData("leadId"); 
                    if (leadId && onUpdateStatus) onUpdateStatus(leadId, col.id); 
                  }}
                >
                  {stageLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      onClick={() => onLeadClick(lead.id)} 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("leadId", lead.id);
                        e.currentTarget.classList.add("opacity-50");
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove("opacity-50");
                      }}
                      className="p-4 border border-white/10 rounded-lg bg-[#0a0a0a] hover:bg-white/[0.04] cursor-grab active:cursor-grabbing group relative transition-colors shadow-sm"
                    >
                      <p className="text-sm font-medium text-white truncate pr-6">{lead.name || "Unknown"}</p>
                      <p className="text-[10px] text-white/50 truncate mb-3 flex items-center gap-1"><User size={10} className="text-white/30" /> {lead.firm_type || "No company"}</p>
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span className="text-white">₹{(extractValue(lead.budget_constraints)/1000).toFixed(0)}k</span>
                        <span>{new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <button className="absolute top-4 right-4 text-white/30 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity">
                          <MoreHorizontal size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => onAddOpportunity?.()} className="w-full flex items-center justify-center gap-2 py-3 text-xs text-white/30 hover:text-white/60 border border-transparent hover:border-white/10 rounded-lg border-dashed transition-all mt-2">
                    <Plus size={12} /> Add opportunity
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
