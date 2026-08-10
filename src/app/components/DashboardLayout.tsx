import React from "react";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";

interface DashboardLayoutProps {
  loading: boolean;
  title: React.ReactNode;
  titleAccent?: string;
  userName: string;
  roleName: string;
  userEmail: string;
  icon: React.ElementType;
  iconAccent?: string;
  onSignOut: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  loading,
  title,
  titleAccent = "white",
  userName,
  roleName,
  userEmail,
  icon: Icon,
  iconAccent = "white",
  onSignOut,
  children,
}: DashboardLayoutProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Top bar */}
      <div className="border-b border-white/8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p
              className="text-white/30 text-xs tracking-[0.25em] uppercase mb-0.5 flex items-center gap-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: titleAccent !== "white" ? titleAccent : undefined }}
            >
              {title}
            </p>
            <p className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Welcome back, {userName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                {roleName}
              </p>
              <p className="text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                {userEmail}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: iconAccent !== "white" ? `${iconAccent}1A` : "rgba(255,255,255,0.1)",
                borderColor: iconAccent !== "white" ? `${iconAccent}33` : "rgba(255,255,255,0.15)",
              }}
            >
              <Icon size={14} style={{ color: iconAccent !== "white" ? iconAccent : "rgba(255,255,255,0.6)" }} />
            </div>
            <motion.button
              onClick={onSignOut}
              className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={13} /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </div>
    </div>
  );
}
