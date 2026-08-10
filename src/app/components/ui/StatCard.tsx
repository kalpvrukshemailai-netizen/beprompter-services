import React from "react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: string;
}

export function StatCard({ icon: Icon, label, value, accent = "#60c8ff" }: StatCardProps) {
  return (
    <div className="border border-white/8 p-6 flex items-start gap-4" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-white font-black text-2xl leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
        <p className="text-white/40 text-xs uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</p>
      </div>
    </div>
  );
}
