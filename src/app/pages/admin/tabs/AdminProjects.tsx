import React from "react";
import { Download, ShieldAlert } from "lucide-react";
import { Profile } from "@/lib/supabase";

export function AdminProjects({ projects, projectMembers, users, onToggleAssignment, updatingId }: {
  projects: any[];
  projectMembers: any[];
  users: Profile[];
  onToggleAssignment: (projectId: string, userId: string) => void;
  updatingId: string | null;
}) {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Platform Operations / 04</p>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Projects & Team Assignment</h1>
          <p className="text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>Assign developers and sales representatives to client projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => {
          const client = Array.isArray(p.client) ? p.client[0] : p.client;
          const assignedIds = projectMembers.filter(m => m.project_id === p.id).map(m => m.user_id);
          const teamMembers = users.filter(u => u.role === "developer" || u.role === "sales");
          
          return (
            <div key={p.id} className="border border-white/8 rounded-lg p-6 bg-white/[0.02]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.title}</h3>
                  <p className="text-white/50 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Client: {client?.full_name ?? "Unknown"}</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-white/10 text-white/70">
                  {p.status.replace("_", " ")}
                </span>
              </div>
              
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 mt-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Assign Team Members
              </p>
              <div className="space-y-2">
                {teamMembers.length === 0 ? (
                  <p className="text-white/30 text-xs italic">No developers or sales team available.</p>
                ) : (
                  teamMembers.map(tm => {
                    const isAssigned = assignedIds.includes(tm.id);
                    return (
                      <label key={tm.id} className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${isAssigned ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                        <input 
                          type="checkbox" 
                          checked={isAssigned} 
                          onChange={() => onToggleAssignment(p.id, tm.id)}
                          disabled={updatingId === `assign-${p.id}`}
                          className="accent-blue-500"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{tm.full_name}</p>
                          <p className="text-white/40 text-xs capitalize" style={{ fontFamily: "'Inter', sans-serif" }}>{tm.role}</p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-full border border-white/8 rounded-lg p-8 text-center text-white/30 text-sm bg-white/[0.02]">
            No projects exist yet.
          </div>
        )}
      </div>
    </div>
  );
}
