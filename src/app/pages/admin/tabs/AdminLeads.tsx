import React from "react";

export function AdminLeads({ leads }: { leads: any[] }) {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Operations / 05</p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Inbound Leads</h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>A dedicated inbox for inbound interest via contact forms.</p>
        </div>
      </div>

      <div className="border border-white/8 rounded-lg overflow-hidden bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03] text-white/40 font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <th className="p-4">Date</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Interest</th>
                <th className="p-4 text-right">Budget</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 align-top">
                    <p className="text-white/60 text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-white/90 text-sm font-semibold">{l.name}</p>
                    <p className="text-white/60 text-[10px] mt-1">{l.email}</p>
                    {l.phone && <p className="text-white/40 text-[10px] mt-0.5">{l.phone}</p>}
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-white/90 text-sm">{l.service_interest || "—"}</p>
                    {l.message && (
                      <p className="text-white/50 text-[10px] mt-2 max-w-sm">"{l.message}"</p>
                    )}
                  </td>
                  <td className="p-4 text-right align-top">
                    <span className="text-white/90 font-semibold px-2 py-1 rounded bg-white/5 text-[10px] uppercase tracking-widest">
                      {l.budget || "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/30 text-sm">
                    No leads have been submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
