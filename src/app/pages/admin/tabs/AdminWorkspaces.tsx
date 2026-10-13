import React from "react";
import { Search, Download, AlertCircle, CheckCircle } from "lucide-react";

export function AdminWorkspaces() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Operations / 03</p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Every client. A controlled workspace.</h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>Oversee tenant onboarding, data associations, service limits and WhatsApp connectivity.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors">
            + Onboard client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Total workspaces</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>24</p>
          <p className="text-xs text-white/40">Illustrative platform registry</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Active / onboarding</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>21 / 2</p>
          <p className="text-xs text-white/40">1 suspended workspace</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Connection health</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>22 / 24</p>
          <p className="text-xs text-white/40">1 degraded · 1 not connected</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Paid / trial plans</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>20 / 4</p>
          <p className="text-xs text-white/40">₹12,000 / paid workspace / month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Client workspace registry</h3>
              <span className="text-xs text-white/40">6 of 24 demo tenants</span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Search workspaces Company, owner or sheet..." className="w-full bg-white/5 border border-white/10 rounded px-9 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors" />
              </div>
              <select className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none">
                <option>All statuses</option>
              </select>
              <select className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none">
                <option>All plans</option>
              </select>
            </div>

            <table className="w-full text-xs text-left border-t border-white/10">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-3 font-medium">COMPANY / OWNER</th>
                  <th className="py-3 font-medium">STATE</th>
                  <th className="py-3 font-medium">PLAN</th>
                  <th className="py-3 font-medium">WHATSAPP</th>
                  <th className="py-3 font-medium text-right">SHEET / ACTION</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5 bg-white/5">
                  <td className="py-3">Meridian Realty / Meera Shah</td>
                  <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase">Active</span></td>
                  <td className="py-3">Professional</td>
                  <td className="py-3 text-red-400 flex items-center gap-1"><AlertCircle size={10} /> Degraded</td>
                  <td className="py-3 text-right"><button className="px-2 py-1 bg-white/10 rounded text-[10px] text-white transition-colors">View detail →</button></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Northline Builders / Dev Shah</td>
                  <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase">Active</span></td>
                  <td className="py-3">Professional</td>
                  <td className="py-3 text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Healthy</td>
                  <td className="py-3 text-right">Linked / Manage</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Urban Nest / Priya Nair</td>
                  <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase">Active</span></td>
                  <td className="py-3">Professional</td>
                  <td className="py-3 text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Healthy</td>
                  <td className="py-3 text-right">Linked / Manage</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Aster Properties / Kunal Jain</td>
                  <td className="py-3"><span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] uppercase">Onboarding</span></td>
                  <td className="py-3">Trial</td>
                  <td className="py-3 text-white/40">Not connected</td>
                  <td className="py-3 text-right">Pending / Manage</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Horizon Estates / Aditi Rao</td>
                  <td className="py-3"><span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] uppercase">Onboarding</span></td>
                  <td className="py-3">Trial</td>
                  <td className="py-3 text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Healthy</td>
                  <td className="py-3 text-right">Linked / Manage</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Cedar Realty / Nikhil Mehta</td>
                  <td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] uppercase">Suspended</span></td>
                  <td className="py-3">Trial</td>
                  <td className="py-3 text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Healthy</td>
                  <td className="py-3 text-right">Paused / Manage</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <span className="text-[10px] text-white/40">Demo registry · 21 active · 2 onboarding · 1 suspended = 24</span>
              <div className="flex gap-2">
                <button className="text-white/40 hover:text-white">←</button>
                <span className="text-[10px] text-white">1</span>
                <button className="text-white/40 hover:text-white">→</button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Source client associations</h3>
              <span className="text-[10px] text-white/40">Existing accounts retained</span>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 font-medium">CLIENT ACCOUNT</th>
                  <th className="py-2 font-medium">COMPANY</th>
                  <th className="py-2 font-medium">GOOGLE SHEET</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5">
                  <td className="py-3">Kavya Shah · kalpvruksh.email.ai@gmail.com</td>
                  <td className="py-3 text-white/30">—</td>
                  <td className="py-3 text-white/40">Linked · visible URL is cropped</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Shaurya · shauryapratap80033@gmail.com</td>
                  <td className="py-3 text-white/30">—</td>
                  <td className="py-3 text-white/40">Linked · visible URL is cropped</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-white/40 mt-4 mb-4">These source accounts are not automatically associated with the illustrative tenant registry above.</p>
            <button className="px-4 py-2 border border-white/10 rounded text-xs text-white hover:bg-white/5 transition-colors">Review company & sheet mapping</button>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Onboarding checklist</h3>
              <span className="text-[10px] text-white/40">Aster Properties / demo</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white font-medium">01 Workspace & client owner</p>
                  <p className="text-[10px] text-white/40">Client invitation accepted, isolation provisioned</p>
                </div>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded">✓ Complete</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white font-medium">02 Company & Google Sheet</p>
                  <p className="text-[10px] text-white/40">Choose company, validate sheet access and map columns</p>
                </div>
                <span className="text-[10px] bg-white/5 text-white/40 px-2 py-1 rounded">⧗ Pending</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white font-medium">03 WhatsApp & consent</p>
                  <p className="text-[10px] text-white/40">Connect number and approve opt-in language</p>
                </div>
                <span className="text-[10px] bg-white/5 text-white/40 px-2 py-1 rounded">⧗ Pending</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white font-medium">04 Agent & launch approval</p>
                  <p className="text-[10px] text-white/40">Knowledge sync, test conversation and owner sign-off</p>
                </div>
                <span className="text-[10px] border border-white/10 text-white/40 px-2 py-1 rounded">○ Not started</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 border-l border-white/10 pl-10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white">Meridian Realty</h3>
              <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">Selected / demo</span>
            </div>
            
            <div className="flex gap-2 mb-6">
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] uppercase font-bold">● Active</span>
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-[10px] uppercase font-bold">! Webhook degraded</span>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded p-4 text-xs">
                <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">Client owner</p>
                <p className="text-white">Meera Shah · Workspace administrator</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded p-4 text-xs flex justify-between items-center">
                <div>
                  <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">Company & sheet association</p>
                  <p className="text-white">Meridian Realty / Property inventory</p>
                </div>
                <button className="text-white/60 hover:text-white">Manage</button>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded p-4 text-xs flex justify-between items-center">
                <div>
                  <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">Subscription</p>
                  <p className="text-white">Professional - ₹12,000 / month</p>
                </div>
                <button className="text-white/60 hover:text-white">Change</button>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-white/60 mb-2">
                  <span>Monthly message allowance</span>
                  <span>2,400 / 3,000 · 80%</span>
                </div>
                <div className="h-1 bg-white/10 rounded overflow-hidden mb-4">
                  <div className="h-full bg-white" style={{ width: '80%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-white/60 mb-2">
                  <span>Seats</span>
                  <span>4 / 5 in use</span>
                </div>
                <div className="h-1 bg-white/10 rounded overflow-hidden">
                  <div className="h-full bg-white" style={{ width: '80%' }} />
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded p-4 text-xs">
                <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">WhatsApp number</p>
                <p className="text-white">+91 •••••• 4210 · Meta connected</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded p-4 text-xs">
                <p className="text-white/40 mb-1 text-[10px] uppercase tracking-widest font-bold">AI agent</p>
                <p className="text-white">Real-estate assistant - v2.4 / enabled</p>
              </div>
              
              <p className="text-[10px] text-white/40 mt-4 leading-relaxed">
                Last sheet sync: 10 Oct, 10:42 IST. Webhook delivery delayed; AI replies continue.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded">Open workspace</button>
                <button className="px-4 py-2 border border-white/10 rounded text-xs text-white hover:bg-white/5">View health</button>
              </div>
              <button className="px-4 py-2 border border-white/10 rounded text-xs text-white/60 w-full text-center hover:bg-white/5">Suspend workspace...</button>
            </div>
            
            <div className="mt-12">
              <h3 className="text-sm font-semibold text-white mb-4">Tenant access boundaries</h3>
              <p className="text-[10px] text-white/40 mb-4">Separate data, credentials and billing for every company.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10 text-xs">
                  <div>
                    <p className="text-white">Support access</p>
                    <p className="text-white/40 text-[10px]">Purpose required · 30-minute audited session</p>
                  </div>
                  <span className="bg-white/5 text-white/60 px-2 py-1 rounded text-[10px]">Restricted</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10 text-xs">
                  <div>
                    <p className="text-white">Data exports</p>
                    <p className="text-white/40 text-[10px]">Owner approval; downloads expire after 24h</p>
                  </div>
                  <span className="bg-white/5 text-white/60 px-2 py-1 rounded text-[10px]">Approval</span>
                </div>
                <button className="px-3 py-1.5 border border-white/10 rounded text-[10px] text-white/60 hover:text-white">View tenant audit →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
