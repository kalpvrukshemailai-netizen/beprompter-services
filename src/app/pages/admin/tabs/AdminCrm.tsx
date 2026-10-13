import React from "react";
import { Trash2, FileUp, FileText, ArrowLeft, RefreshCw } from "lucide-react";
import { Profile } from "@/lib/supabase";

export function AdminCrm({ 
  crmLeads, users, uploadingCsv, fileFilter, cityFilter, bulkAssignRep, updatingId,
  setFileFilter, setCityFilter, setBulkAssignRep, handleCsvUpload, handleRemoveDuplicates,
  handleDeleteFileLeads, handleBulkAssign, handleBulkUnassign
}: {
  crmLeads: any[]; users: Profile[]; uploadingCsv: boolean; fileFilter: string; cityFilter: string; bulkAssignRep: string; updatingId: string | null;
  setFileFilter: (v: string) => void; setCityFilter: (v: string) => void; setBulkAssignRep: (v: string) => void;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDuplicates: () => void; handleDeleteFileLeads: () => void;
  handleBulkAssign: () => void; handleBulkUnassign: () => void;
}) {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-[#fbbf24]/70 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Operations / 06</p>
          <h1 className="text-3xl font-medium tracking-tight text-[#fbbf24] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Sales CRM Distribution</h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>Clean imports. Balanced distribution. Manage CSV uploads and assignments.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRemoveDuplicates}
            disabled={uploadingCsv}
            className={`flex items-center gap-2 bg-[#f87171]/10 hover:bg-[#f87171]/20 border border-[#f87171]/30 text-[#f87171] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded ${uploadingCsv ? 'opacity-50 pointer-events-none' : ''}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <Trash2 size={14} /> Remove Duplicates
          </button>
          <label className={`flex items-center gap-2 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded ${uploadingCsv ? 'opacity-50 pointer-events-none' : ''}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {uploadingCsv ? <RefreshCw size={14} className="animate-spin" /> : <FileUp size={14} />}
            {uploadingCsv ? 'Uploading...' : 'Upload CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={uploadingCsv} />
          </label>
        </div>
      </div>

      {!fileFilter ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {Array.from(new Set(crmLeads.map(l => l.source_file).filter(Boolean))).sort().map(f => {
            const fileLeads = crmLeads.filter(l => l.source_file === f);
            const unassigned = fileLeads.filter(l => !l.assigned_to).length;
            return (
              <div key={f} className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-lg p-5 hover:bg-[#fbbf24]/10 transition-colors cursor-pointer" onClick={() => setFileFilter(f)}>
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={20} className="text-[#fbbf24]" />
                  <h3 className="text-white font-bold truncate flex-1 text-sm">{f}</h3>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Total Leads: <strong className="text-white">{fileLeads.length}</strong></span>
                  <span className={unassigned > 0 ? "text-[#fbbf24]" : "text-[#34d399]"}>{unassigned} unassigned</span>
                </div>
              </div>
            );
          })}
          {Array.from(new Set(crmLeads.map(l => l.source_file).filter(Boolean))).length === 0 && (
            <div className="col-span-full border border-dashed border-white/10 rounded p-10 text-center">
              <FileUp size={28} className="mx-auto mb-3 text-white/15" />
              <p className="text-white/30 text-sm font-semibold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No CSV files uploaded yet</p>
              <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Upload a CSV file to begin assigning leads.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <button onClick={() => { setFileFilter(""); setCityFilter(""); setBulkAssignRep(""); }} className="flex items-center gap-2 bg-black/50 hover:bg-black/80 border border-[#fbbf24]/30 text-white text-xs px-3 py-2 outline-none rounded transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={handleDeleteFileLeads} disabled={updatingId === 'delete-file'} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs px-3 py-2 outline-none rounded transition-colors">
                <Trash2 size={14} /> {updatingId === 'delete-file' ? 'Deleting...' : 'Delete File'}
              </button>
              
              <div className="flex flex-col">
                <label className="text-[#fbbf24]/70 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Filter by City</label>
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="bg-black/50 border border-[#fbbf24]/30 text-white text-xs px-3 py-2 outline-none rounded transition-colors min-w-[120px]">
                  <option value="">All Cities</option>
                  {Array.from(new Set(crmLeads.filter(l => !fileFilter || l.source_file === fileFilter).map(l => l.city).filter(c => c && !c.includes('@') && !/\d{4,}/.test(c)))).sort().map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-[#fbbf24]/70 text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Bulk Assign</label>
                <div className="flex items-center gap-2">
                  <select value={bulkAssignRep} onChange={(e) => setBulkAssignRep(e.target.value)} className="bg-black/50 border border-[#fbbf24]/30 text-white text-xs px-3 py-2 outline-none rounded transition-colors">
                    <option value="">-- Select Rep --</option>
                    {users.filter(u => u.role === "sales").map(rep => (
                      <option key={rep.id} value={rep.id}>{rep.full_name}</option>
                    ))}
                  </select>
                  <button onClick={handleBulkAssign} disabled={!bulkAssignRep || updatingId === 'bulk-assign'} className="bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 text-[#fbbf24] border border-[#fbbf24]/50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded disabled:opacity-50">
                    Assign
                  </button>
                  <button onClick={handleBulkUnassign} disabled={updatingId === 'bulk-unassign'} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded disabled:opacity-50">
                    Unassign
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right whitespace-nowrap">
              <p className="text-white/40 text-[10px]">
                Showing {(() => {
                  let f = crmLeads;
                  if (fileFilter) f = f.filter(l => l.source_file === fileFilter);
                  if (cityFilter) f = f.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
                  return f.length;
                })()} leads
              </p>
            </div>
          </div>

          <div className="border border-[#fbbf24]/20 rounded-lg overflow-hidden bg-[rgba(251,191,36,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  {(() => {
                    let filtered = crmLeads;
                    if (fileFilter) filtered = filtered.filter(l => l.source_file === fileFilter);
                    if (cityFilter) filtered = filtered.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
                    
                    const allKeys = new Set<string>();
                    for (const l of filtered.slice(0, 100)) {
                      if (l.dynamic_data) {
                        Object.keys(l.dynamic_data).forEach(k => {
                          if (k !== 'Row COLOUR LEGEND' && k !== '#' && k !== 'Raw Lead' && !k.toLowerCase().includes('email')) {
                            allKeys.add(k);
                          }
                        });
                      }
                    }
                    const dynamicKeys = Array.from(allKeys).slice(0, 5);

                    return (
                      <tr className="border-b border-[#fbbf24]/20 bg-[rgba(251,191,36,0.05)]">
                        <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest">Lead</th>
                        {dynamicKeys.map(k => (
                          <th key={k} className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest max-w-[150px] truncate" title={k}>{k}</th>
                        ))}
                        <th className="p-4 text-[#fbbf24]/70 text-[10px] font-bold uppercase tracking-widest text-right">Assignment</th>
                      </tr>
                    );
                  })()}
                </thead>
                <tbody className="text-white/80">
                  {(() => {
                    let filtered = crmLeads;
                    if (fileFilter) filtered = filtered.filter(l => l.source_file === fileFilter);
                    if (cityFilter) filtered = filtered.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
                    
                    const allKeys = new Set<string>();
                    for (const l of filtered.slice(0, 100)) {
                      if (l.dynamic_data) {
                        Object.keys(l.dynamic_data).forEach(k => {
                          if (k !== 'Row COLOUR LEGEND' && k !== '#' && k !== 'Raw Lead' && !k.toLowerCase().includes('email')) {
                            allKeys.add(k);
                          }
                        });
                      }
                    }
                    const dynamicKeys = Array.from(allKeys).slice(0, 5);

                    return filtered.slice(0, 100).map((l) => (
                      <tr key={l.id} className="border-b border-[#fbbf24]/10 hover:bg-[#fbbf24]/5 transition-colors">
                        <td className="p-4">
                          <p className="text-white font-medium">{l.name}</p>
                          {l.phone && <p className="text-white/40 text-[10px] mt-0.5">{l.phone}</p>}
                          {l.city && <p className="text-white/30 text-[10px]">{l.city}</p>}
                        </td>
                        {dynamicKeys.map(k => (
                          <td key={k} className="p-4 text-white/50 text-[10px] max-w-[150px] truncate" title={l.dynamic_data?.[k] || "—"}>
                            {l.dynamic_data?.[k] || "—"}
                          </td>
                        ))}
                        <td className="p-4 text-right">
                          {l.assigned_to ? (
                            <div className="inline-block text-left">
                              <span className="block text-[10px] text-green-400/80 mb-0.5">Assigned to:</span>
                              <span className="text-white/90 text-[10px] bg-white/10 px-2 py-1 rounded">
                                {users.find(u => u.id === l.assigned_to)?.full_name || l.assigned_to.substring(0, 8)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#fbbf24]/60 text-[10px] italic">Unassigned</span>
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
