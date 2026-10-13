import React from "react";
import { UserRole, Profile } from "@/lib/supabase";
import { Search, Download, Trash2, Edit2 } from "lucide-react";

export function AdminUsersRoles({ users, onRoleChange, onRemove }: {
  users: Profile[];
  onRoleChange: (id: string, role: UserRole) => void;
  onRemove: (id: string) => void;
}) {
  const salesCount = users.filter(u => u.role === "sales").length;
  const clientCount = users.filter(u => u.role === "client").length;
  const adminCount = users.filter(u => u.role === "admin").length;

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Operations / 02</p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>People, access and accountability.</h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>Manage the existing accounts, invite teammates and keep platform permissions explicit.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded text-xs text-white/80 hover:bg-white/5 transition-colors">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-white/90 transition-colors">
            + Invite user
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Source accounts</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{users.length}</p>
          <p className="text-xs text-white/40">{salesCount} Sales · {clientCount} Client · {adminCount} Admin</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Pending invitations</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>2</p>
          <p className="text-xs text-white/40">Resend invitations · Expire in 7 days</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Role definitions</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>3</p>
          <p className="text-xs text-white/40">Admin / Sales / Client</p>
        </div>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>MFA safeguards</p>
          <p className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>MFA</p>
          <p className="text-xs text-white/40">Required in the proposed access policy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Users & role management</h3>
              <span className="text-xs text-white/40">{users.length} source records</span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Name or email..." className="w-full bg-white/5 border border-white/10 rounded px-9 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors" />
              </div>
              <select className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none">
                <option>All roles</option>
              </select>
              <select className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none">
                <option>All statuses</option>
              </select>
            </div>

            <table className="w-full text-xs text-left border-t border-white/10">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-3 font-medium w-1/3">USER</th>
                  <th className="py-3 font-medium">COMPANY & SHEET</th>
                  <th className="py-3 font-medium">ROLE</th>
                  <th className="py-3 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="py-3">
                      <p className="text-white">{u.full_name || "—"}</p>
                      <p className="text-white/40 text-[10px]">{u.email}</p>
                    </td>
                    <td className="py-3">
                      {u.role === "client" ? (
                        <div className="text-white/60 text-[10px]">
                          <p>{u.company_name || "—"}</p>
                          <p className="truncate w-32">{u.google_sheet_url || "No sheet"}</p>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="py-3">
                      <select 
                        value={u.role}
                        onChange={(e) => onRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs text-white outline-none appearance-none capitalize"
                      >
                        <option value="admin">Admin</option>
                        <option value="sales">Sales</option>
                        <option value="client">Client</option>
                        <option value="developer">Developer</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-2 py-1 border border-white/10 rounded text-[10px] text-white/60 hover:text-white transition-colors">Edit</button>
                        <button onClick={() => onRemove(u.id)} className="px-2 py-1 border border-white/10 rounded text-[10px] text-red-400 hover:bg-red-500/10 transition-colors">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Pending invitations</h3>
              <span className="text-xs text-white/40">Illustrative demo records</span>
            </div>
            <table className="w-full text-xs text-left border-t border-white/10">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-3 font-medium">EMAIL</th>
                  <th className="py-3 font-medium">ROLE / SCOPE</th>
                  <th className="py-3 font-medium">INVITED</th>
                  <th className="py-3 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5">
                  <td className="py-3">ops@example.com</td>
                  <td className="py-3">Admin · Platform</td>
                  <td className="py-3 text-white/40">10 Oct</td>
                  <td className="py-3 text-right"><button className="text-white hover:underline text-[10px]">Resend</button></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">new@example.com</td>
                  <td className="py-3">Sales · CRM only</td>
                  <td className="py-3 text-white/40">12 Oct</td>
                  <td className="py-3 text-right"><button className="text-white hover:underline text-[10px]">Resend</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8 border-l border-white/10 pl-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Role & permission management</h3>
              <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Admin access</span>
            </div>
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 bg-white text-black text-xs font-bold rounded">Admin</button>
              <button className="px-3 py-1 border border-white/10 text-white/60 text-xs rounded hover:text-white transition-colors">Sales</button>
              <button className="px-3 py-1 border border-white/10 text-white/60 text-xs rounded hover:text-white transition-colors">Client</button>
            </div>
            
            <div className="border border-white/10 rounded p-4 mb-4 text-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/40">Permissions</span>
                <button className="text-white hover:underline">Edit</button>
              </div>
              <p className="text-white font-medium mb-1">Global admin / All tenants</p>
              <p className="text-white/40">Full read and write access across platform.</p>
            </div>
            
            <table className="w-full text-[10px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 font-medium">CAPABILITY</th>
                  <th className="py-2 font-medium text-center">ADMIN</th>
                  <th className="py-2 font-medium text-center">SALES</th>
                  <th className="py-2 font-medium text-center">CLIENT</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5">
                  <td className="py-2">Users & role editing</td>
                  <td className="py-2 text-center text-white">✓</td>
                  <td className="py-2 text-center text-white/30">—</td>
                  <td className="py-2 text-center text-white/30">—</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2">Workspace configuration</td>
                  <td className="py-2 text-center text-white">✓</td>
                  <td className="py-2 text-center text-white/30">—</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2">CRM imports / distribution</td>
                  <td className="py-2 text-center text-white">✓</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                  <td className="py-2 text-center text-white/30">—</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2">Conversations & leads</td>
                  <td className="py-2 text-center text-white/60">Audit</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2">Billing & plan limits</td>
                  <td className="py-2 text-center text-white">✓</td>
                  <td className="py-2 text-center text-white/30">—</td>
                  <td className="py-2 text-center text-white/60">Own</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-[10px] text-white/30 mt-4 leading-relaxed">
              "Own" is limited to assigned records or the user's tenant. Admin Account deletion requires a restricted purpose.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="px-4 py-2 border border-white/10 rounded text-xs text-white hover:bg-white/5 transition-colors">Save permissions</button>
              <button className="px-4 py-2 text-xs text-white/40 hover:text-white transition-colors">View access change history</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
