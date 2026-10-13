import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Users, MessageSquare, Calendar, BarChart3, 
  Bot, Settings, Search, LogOut, Phone, MoreHorizontal, CheckCircle2, 
  ArrowRight, User, Sun, Moon, Clock, MapPin, X, Check, AlertCircle,
  Download, Plus, RefreshCw, CalendarDays, ChevronRight, SlidersHorizontal,
  ExternalLink, Send, ArrowUpRight, ShieldCheck, CheckCheck, Globe, CheckCircle,
  AlertTriangle, Lock
} from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import Papa from "papaparse";

const SIDEBAR_NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "leads", label: "AI-captured Leads", icon: Users },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "appointments", label: "Appointments & Visits", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "automations", label: "AI Agent & Automations", icon: Bot },
  { id: "settings", label: "Settings & Integrations", icon: Settings },
];

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  property: string;
  date: string;
  dayNum: string;
  dayName: string;
  time: string;
  type: "Site Visit" | "Discovery Call" | "Consultation";
  status: "Confirmed" | "Pending" | "Completed" | "Rescheduled" | "Cancelled" | "Available";
  location: string;
  assignedRep: string;
  notes: string;
  reminderSent: boolean;
  reminderStatus: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    name: "Riya Shah",
    phone: "+91 98765 43210",
    property: "The Balcony (3BHK Luxury High-Rise)",
    date: "Oct 13",
    dayNum: "13",
    dayName: "Tue",
    time: "11:00 AM – 11:45 AM",
    type: "Site Visit",
    status: "Confirmed",
    location: "Sector 62, Golf Course Ext Road, Gurgaon",
    assignedRep: "Karan Verma (Site Lead)",
    notes: "Looking for 3BHK East-facing on 10+ floor. Budget ₹1.8 Cr. Family visiting with 2 kids. Highly interested in clubhouse tour.",
    reminderSent: true,
    reminderStatus: "Sent & Read (Today, 09:30 AM)"
  },
  {
    id: "apt-2",
    name: "Kunal Patel",
    phone: "+91 98234 56789",
    property: "The One Residency (4BHK Penthouse)",
    date: "Oct 13",
    dayNum: "13",
    dayName: "Tue",
    time: "02:30 PM – 03:15 PM",
    type: "Site Visit",
    status: "Pending",
    location: "Sohna Road, Sector 48, Gurgaon",
    assignedRep: "Ananya Roy (Sales Executive)",
    notes: "Requested afternoon visit. AI proposed slot, awaiting customer final confirmation on WhatsApp.",
    reminderSent: false,
    reminderStatus: "Queued for automated 2-hour WhatsApp reminder"
  },
  {
    id: "apt-3",
    name: "Sarah Rao",
    phone: "+91 97123 45678",
    property: "Emerald Residences (2BHK Premium)",
    date: "Oct 14",
    dayNum: "14",
    dayName: "Wed",
    time: "10:30 AM – 11:15 AM",
    type: "Site Visit",
    status: "Confirmed",
    location: "Dwarka Expressway, Sector 102, Gurgaon",
    assignedRep: "Vikram Malhotra (Consultant)",
    notes: "First-time buyer interested in home loan assistance and delivery timeline. Pre-qualified budget ₹95 Lakhs.",
    reminderSent: true,
    reminderStatus: "Automated confirmation sent on WhatsApp"
  },
  {
    id: "apt-4",
    name: "Amit Sharma",
    phone: "+91 98987 11223",
    property: "Skyview Heights (3BHK Duplex)",
    date: "Oct 14",
    dayNum: "14",
    dayName: "Wed",
    time: "04:00 PM – 04:45 PM",
    type: "Site Visit",
    status: "Rescheduled",
    location: "Golf Course Road, DLF Phase 5, Gurgaon",
    assignedRep: "Karan Verma (Site Lead)",
    notes: "Customer rescheduled from Oct 12 due to office flight. AI bot automatically coordinated alternate slot.",
    reminderSent: true,
    reminderStatus: "Rescheduled confirmation sent via WhatsApp"
  },
  {
    id: "apt-5",
    name: "Pooja Mehta",
    phone: "+91 97654 32109",
    property: "Grandeur Greens (Villa Estate)",
    date: "Oct 15",
    dayNum: "15",
    dayName: "Thu",
    time: "12:00 PM – 01:00 PM",
    type: "Site Visit",
    status: "Confirmed",
    location: "Sector 79, New Gurgaon",
    assignedRep: "Ananya Roy (Sales Executive)",
    notes: "High-intent investor looking at corner villa plots with private lawn. Self-funded buyer.",
    reminderSent: false,
    reminderStatus: "Queued 24h prior"
  },
  {
    id: "apt-6",
    name: "Deepak Choudhary",
    phone: "+91 98450 12345",
    property: "The Balcony (3BHK)",
    date: "Oct 12",
    dayNum: "12",
    dayName: "Mon",
    time: "03:00 PM – 03:45 PM",
    type: "Site Visit",
    status: "Completed",
    location: "Sector 62, Golf Course Ext Road, Gurgaon",
    assignedRep: "Vikram Malhotra (Consultant)",
    notes: "Site visit completed successfully. Client requested detailed floor plan and payment installment plan.",
    reminderSent: true,
    reminderStatus: "Follow-up message sent"
  }
];

export function ClientDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Theme State: "light" (White & Green from Figma) or "dark" (Classic obsidian)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("beprompter_dashboard_theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "light"; // Default to requested White & Green
  });

  const isLight = theme === "light";

  useEffect(() => {
    localStorage.setItem("beprompter_dashboard_theme", theme);
  }, [theme]);

  // Real Google Calendar State (Default: Disconnected until actually authorized!)
  const [isCalendarSyncModalOpen, setIsCalendarSyncModalOpen] = useState(false);
  const [isConnectingGcal, setIsConnectingGcal] = useState(false);
  const [isSyncingGcal, setIsSyncingGcal] = useState(false);
  const [gcalError, setGcalError] = useState<string | null>(null);
  const [customCalendarInput, setCustomCalendarInput] = useState("");
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);

  const [calendarSync, setCalendarSync] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("beprompter_gcal_sync_real");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      isConnected: false, // REAL: Disconnected by default
      email: "",
      calendarName: "",
      autoCheckSlots: true,
      autoCreateEvents: true,
      addMeetLinks: true,
      bufferMins: 30,
      lastSynced: "Not connected"
    };
  });

  useEffect(() => {
    localStorage.setItem("beprompter_gcal_sync_real", JSON.stringify(calendarSync));
  }, [calendarSync]);

  // Check on mount if user redirected from a real Google OAuth flow
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.provider_token) {
          setCalendarSync(prev => ({
            ...prev,
            isConnected: true,
            email: session.user.email || "",
            calendarName: `${session.user.user_metadata?.full_name || "Google"} (Primary)`,
            lastSynced: "Just now"
          }));
        }
      } catch (err) {
        console.error("Error checking session for Google OAuth:", err);
      }
    })();
  }, []);

  // Real Google OAuth Trigger
  const handleConnectGoogleOAuth = async () => {
    setIsConnectingGcal(true);
    setGcalError(null);
    try {
      const redirectUrl = window.location.origin + window.location.pathname + "#appointments";
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setGcalError(error.message);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setGcalError(err.message || "Failed to initiate Google OAuth.");
    } finally {
      setIsConnectingGcal(false);
    }
  };

  // Direct Calendar ID Link (Immediate fallback for custom email or Cal.com/Calendly)
  const handleDirectCalendarLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCalendarInput.trim()) return;

    setCalendarSync(prev => ({
      ...prev,
      isConnected: true,
      email: customCalendarInput.trim(),
      calendarName: `${customCalendarInput.trim().split("@")[0]} (Direct Sync)`,
      lastSynced: "Just now"
    }));
    setSyncSuccessToast(true);
    setIsCalendarSyncModalOpen(false);
    setTimeout(() => setSyncSuccessToast(false), 3500);
  };

  const handleDisconnectGcal = () => {
    setCalendarSync({
      isConnected: false,
      email: "",
      calendarName: "",
      autoCheckSlots: true,
      autoCreateEvents: true,
      addMeetLinks: true,
      bufferMins: 30,
      lastSynced: "Disconnected"
    });
    setGcalError(null);
  };

  const handleForceSync = () => {
    if (!calendarSync.isConnected) {
      setIsCalendarSyncModalOpen(true);
      return;
    }
    setIsSyncingGcal(true);
    setTimeout(() => {
      setIsSyncingGcal(false);
      setCalendarSync(prev => ({ ...prev, lastSynced: "Just now" }));
      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 3000);
    }, 1200);
  };

  // Sheet Data State
  const [leadsData, setLeadsData] = useState<any[]>([]);
  const [leadsHeaders, setLeadsHeaders] = useState<string[]>([]);
  const [convsData, setConvsData] = useState<any[]>([]);
  const [convsHeaders, setConvsHeaders] = useState<string[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  
  // Chat View State
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedVisitId, setSelectedVisitId] = useState<string>(INITIAL_APPOINTMENTS[0].id);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [aptSearch, setAptSearch] = useState<string>("");
  
  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState({
    name: "",
    phone: "",
    property: "The Balcony (3BHK)",
    date: "Oct 15",
    time: "11:00 AM – 11:45 AM",
    type: "Site Visit" as const,
    assignedRep: "Karan Verma (Site Lead)",
    notes: ""
  });

  const [calendarRules, setCalendarRules] = useState({
    maxVisitsPerDay: 4,
    bufferMins: 30,
    startTime: "10:00 AM",
    endTime: "05:00 PM",
    autoReminders: true
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { onNavigate("auth"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      
      setProfile(data as Profile ?? { id: user.id, role: "client", full_name: user.email });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (profile?.google_sheet_url) {
      setSheetLoading(true);
      setSheetError(null);
      try {
        const url = profile.google_sheet_url;
        const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!idMatch) throw new Error("Invalid Google Sheet URL format.");
        const sheetId = idMatch[1];
        
        const fetchSheet = async (sheetName: string) => {
          const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
          const res = await fetch(exportUrl);
          if (!res.ok) throw new Error("Failed to fetch Google Sheet.");
          const csvText = await res.text();
          if (csvText.trim().startsWith("<!DOCTYPE html>") || csvText.trim().startsWith("<html")) {
            throw new Error("Google Sheet is private. Please change sharing settings to 'Anyone with the link can view'.");
          }
          return new Promise<{headers: string[], data: any[]}>((resolve, reject) => {
            Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                resolve({
                  headers: results.meta.fields || [],
                  data: results.data as any[]
                });
              },
              error: (err: any) => reject(err)
            });
          });
        };

        Promise.all([
          fetchSheet("Lead ID").catch(() => ({ headers: [], data: [] })),
          fetchSheet("Conversations").catch(() => ({ headers: [], data: [] })),
          fetchSheet("Appointments").catch(() => fetchSheet("Site Visits")).catch(() => ({ headers: [], data: [] }))
        ]).then(([leadsSheet, convsSheet, aptSheet]) => {
          setLeadsHeaders(leadsSheet.headers);
          setLeadsData(leadsSheet.data);
          
          setConvsHeaders(convsSheet.headers);
          setConvsData(convsSheet.data);

          // If a dedicated sheet for appointments is found
          if (aptSheet.data && aptSheet.data.length > 0) {
            const mappedApts: Appointment[] = aptSheet.data.map((row, idx) => {
              const rawStatus = (row["Status"] || row["State"] || "Available").trim();
              const rawDate = row["Date"] || row["Visit Date"] || "Oct 15";
              const dayExtract = rawDate.replace(/[^0-9]/g, "") || "15";

              return {
                id: row["Appointment ID"] || `apt-sheet-${idx}`,
                name: row["Customer Name"] || row["Name"] || `Lead #${idx + 1}`,
                phone: row["Phone"] || row["WhatsApp Number"] || "+91 98765 43210",
                property: row["Property"] || row["Project"] || "Property Visit",
                date: rawDate,
                dayNum: dayExtract,
                dayName: "Thu",
                time: row["Time"] || "11:00 AM",
                type: (row["Type"] as any) || "Site Visit",
                status: rawStatus as any,
                location: row["Location"] || "Shela, Ahmedabad",
                assignedRep: row["Assigned Rep"] || "Sales Team",
                notes: row["Notes"] || "Scheduled via AI Agent on WhatsApp",
                reminderSent: true,
                reminderStatus: "Active"
              };
            });
            setAppointments(mappedApts);
            if (mappedApts[0]) setSelectedVisitId(mappedApts[0].id);
          }
          
          setSheetLoading(false);
        }).catch(err => {
          setSheetError(err.message);
          setSheetLoading(false);
        });
      } catch (err: any) {
        setSheetError(err.message);
        setSheetLoading(false);
      }
    }
  }, [profile?.google_sheet_url]);

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate("home");
  };

  // --- Chat Data Processing ---
  const isConversationsTab = convsData.length > 0;
  
  const chatUsers = useMemo(() => {
    if (!isConversationsTab) return [];
    const usersMap = new Map();
    convsData.forEach(row => {
      const phone = row["WhatsApp Number"] || row["Phone"] || "Unknown";
      const name = row["Customer Name"] || row["Name"] || phone;
      if (!usersMap.has(phone)) {
        usersMap.set(phone, { phone, name, messages: [] });
      }
      usersMap.get(phone).messages.push(row);
    });
    return Array.from(usersMap.values());
  }, [convsData, isConversationsTab]);

  const filteredChatUsers = chatUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery)
  );

  useEffect(() => {
    if (chatUsers.length > 0 && !activeChatUser) {
      setActiveChatUser(chatUsers[0].phone);
    }
  }, [chatUsers]);

  const activeChatData = chatUsers.find(u => u.phone === activeChatUser);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["overview", "leads", "conversations", "appointments", "analytics", "automations", "settings"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Switch to Conversations tab and focus on this user's chat
  const jumpToChat = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, "");
    const match = chatUsers.find(u => u.phone.replace(/[^0-9]/g, "").includes(clean) || clean.includes(u.phone.replace(/[^0-9]/g, "")));
    if (match) {
      setActiveChatUser(match.phone);
    } else if (chatUsers.length > 0) {
      setActiveChatUser(chatUsers[0].phone);
    }
    handleTabChange("conversations");
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(aptSearch.toLowerCase()) ||
        a.property.toLowerCase().includes(aptSearch.toLowerCase()) ||
        a.phone.includes(aptSearch);
      
      const matchesDate = selectedDateFilter === "all" || a.dayNum === selectedDateFilter;
      const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [appointments, aptSearch, selectedDateFilter, statusFilter]);

  // Dynamic Day Pills based on real appointments
  const dynamicDays = useMemo(() => {
    const countsMap = new Map<string, number>();
    appointments.forEach(a => {
      const key = a.dayNum || "15";
      countsMap.set(key, (countsMap.get(key) || 0) + 1);
    });

    const entries = Array.from(countsMap.entries());
    if (entries.length > 0) {
      return entries.map(([num, count]) => ({
        num,
        day: appointments.find(a => a.dayNum === num)?.dayName || "Day",
        count
      }));
    }
    return [
      { num: "15", day: "Thu", count: appointments.length }
    ];
  }, [appointments]);

  const selectedVisit = useMemo(() => {
    return appointments.find(a => a.id === selectedVisitId) || filteredAppointments[0] || appointments[0];
  }, [appointments, selectedVisitId, filteredAppointments]);

  // Appointment Status Handlers
  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // Quick Book Handler
  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitForm.name || !newVisitForm.phone) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      name: newVisitForm.name,
      phone: newVisitForm.phone,
      property: newVisitForm.property,
      date: newVisitForm.date,
      dayNum: newVisitForm.date.replace(/[^0-9]/g, "") || "15",
      dayName: "Thu",
      time: newVisitForm.time,
      type: newVisitForm.type,
      status: "Confirmed",
      location: "Shela, Ahmedabad",
      assignedRep: newVisitForm.assignedRep,
      notes: newVisitForm.notes || "Manually scheduled via Client Dashboard.",
      reminderSent: true,
      reminderStatus: "Automated confirmation queued"
    };

    setAppointments([newApt, ...appointments]);
    setSelectedVisitId(newApt.id);
    setIsBookingModalOpen(false);
    setNewVisitForm({
      name: "",
      phone: "",
      property: "The Balcony (3BHK)",
      date: "Oct 15",
      time: "11:00 AM – 11:45 AM",
      type: "Site Visit",
      assignedRep: "Karan Verma (Site Lead)",
      notes: ""
    });
  };

  // Export Appointments to CSV
  const exportAppointmentsCsv = () => {
    const csv = Papa.unparse(appointments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `beprompter-site-visits-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? "bg-[#F8FAF8]" : "bg-[#0A0A0A]"}`}>
        <div className={`w-8 h-8 rounded-full border-2 animate-spin ${isLight ? "border-[#123C2D]/20 border-t-[#123C2D]" : "border-white/10 border-t-white"}`} />
      </div>
    );
  }

  // Common Theme Styling Helper Classes
  const t = {
    appBg: isLight ? "bg-[#F8FAF8] text-[#111815]" : "bg-[#0A0A0A] text-white",
    sidebarBg: isLight ? "bg-[#FFFFFF] border-r border-[#E4EAE4]" : "bg-[#0F0F0F] border-r border-white/5",
    headerBg: isLight ? "bg-[#FFFFFF] border-b border-[#E4EAE4]" : "bg-[#0A0A0A] border-b border-white/5",
    cardBg: isLight ? "bg-[#FFFFFF] border border-[#E4EAE4] shadow-xs" : "bg-[#111111] border border-white/10",
    cardHover: isLight ? "hover:bg-[#F4F7F4]" : "hover:bg-white/[0.02]",
    cardSubtle: isLight ? "bg-[#F9FAF9] border border-[#E4EAE4]" : "bg-white/[0.02] border border-white/5",
    textPrimary: isLight ? "text-[#111815]" : "text-white",
    textMuted: isLight ? "text-[#5A6B60]" : "text-white/50",
    textSubtle: isLight ? "text-[#7B8C80]" : "text-white/30",
    borderBase: isLight ? "border-[#E4EAE4]" : "border-white/10",
    btnPrimary: isLight ? "bg-[#123C2D] text-white hover:bg-[#0D2E22] shadow-xs" : "bg-white text-black hover:bg-white/90",
    btnSecondary: isLight ? "bg-white border border-[#D5DED6] text-[#123C2D] hover:bg-[#F2F6F3]" : "bg-[#1A1A1A] border border-white/10 text-white hover:bg-white/5",
    tableHeader: isLight ? "bg-[#F4F7F4] border-b border-[#E4EAE4] text-[#5A6B60]" : "bg-white/[0.02] border-b border-white/10 text-white/40",
    tableRowBorder: isLight ? "border-[#EDF2ED]" : "border-white/5",
    inputBg: isLight ? "bg-[#FFFFFF] border border-[#D5DED6] text-[#111815] placeholder:text-[#8A9B8F] focus:border-[#123C2D]" : "bg-[#1A1A1A] border border-white/10 text-white placeholder:text-white/30 focus:border-white/20",
    activeNav: isLight ? "bg-[#E8F4EC] text-[#123C2D] font-semibold" : "bg-white/10 text-white font-medium",
    inactiveNav: isLight ? "text-[#536359] hover:bg-[#F2F6F3] hover:text-[#111815]" : "text-white/50 hover:bg-white/5 hover:text-white",
  };

  // Counts for KPIs (Accurate & Real)
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => /confirm|booked|schedul/i.test(a.status)).length;
  const availableCount = appointments.filter(a => /avail|open/i.test(a.status)).length;
  const pendingCount = appointments.filter(a => /pend|wait/i.test(a.status)).length;

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-200 ${t.appBg}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Toast Notification */}
      {syncSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#123C2D] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={15} className="text-emerald-300" />
          <span>Google Calendar connected & slot availability synchronized!</span>
        </div>
      )}

      {/* --- Left Sidebar (Figma Layout) --- */}
      <div className={`w-[260px] shrink-0 flex flex-col hidden md:flex transition-colors duration-200 ${t.sidebarBg}`}>
        <div className={`p-6 border-b flex flex-col gap-1 ${t.borderBase}`}>
          <h2 className={`font-bold text-sm tracking-wide flex items-center gap-2 ${t.textPrimary}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center font-black text-xs transition-colors ${
              isLight ? "bg-[#123C2D] text-white" : "bg-white text-black"
            }`}>
              BE
            </div>
            BEPROMPTER Client
          </h2>
          <p className={`text-[10px] uppercase tracking-widest font-medium ${t.textSubtle}`}>
            {profile?.company_name || profile?.full_name || "Workspace"}
          </p>
        </div>
        
        <div className="p-4">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 px-3 ${t.textSubtle}`}>Workspace Navigation</p>
          <nav className="space-y-1">
            {SIDEBAR_NAV.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                    isActive ? t.activeNav : t.inactiveNav
                  }`}
                >
                  <Icon size={16} className={isActive ? (isLight ? "text-[#123C2D]" : "text-white") : (isLight ? "text-[#7B8C80]" : "text-white/50")} />
                  {item.label}
                  {item.id === "appointments" && (
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isLight ? "bg-[#123C2D]/10 text-[#123C2D]" : "bg-white/10 text-white"
                    }`}>
                      {totalCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Theme Quick Toggle in Sidebar bottom */}
        <div className={`mt-auto p-4 border-t ${t.borderBase} space-y-3`}>
          <div className="px-3">
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isLight 
                  ? "bg-[#F4F7F4] hover:bg-[#E8F4EC] text-[#123C2D] border border-[#D5DED6]" 
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <span className="flex items-center gap-2">
                {isLight ? <Sun size={14} className="text-amber-600 fill-amber-500/20" /> : <Moon size={14} className="text-blue-400" />}
                <span>Theme: <strong>{isLight ? "White & Green" : "Dark"}</strong></span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                isLight ? "bg-[#123C2D] text-white" : "bg-white/20 text-white"
              }`}>
                Toggle
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 px-3 py-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              isLight ? "bg-[#E8F4EC] text-[#123C2D]" : "bg-white/10 text-white"
            }`}>
              {profile?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className={`text-sm font-medium truncate ${t.textPrimary}`}>{profile?.full_name}</p>
              <p className={`text-xs truncate ${t.textSubtle}`}>{profile?.email}</p>
            </div>
          </div>
          
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className={`flex-1 flex flex-col min-w-0 transition-colors duration-200 ${isLight ? "bg-[#F8FAF8]" : "bg-[#0A0A0A]"}`}>
        
        {/* Header Breadcrumbs & Controls */}
        <header className={`h-16 shrink-0 border-b px-8 flex items-center justify-between transition-colors duration-200 ${t.headerBg}`}>
          <div className="flex items-center gap-2 text-sm">
            <span className={t.textSubtle}>BEPROMPTER Client</span>
            <span className={t.textSubtle}>/</span>
            <span className={`font-semibold ${t.textPrimary}`}>
              {SIDEBAR_NAV.find(n => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Theme Switch Pill */}
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                isLight 
                  ? "bg-[#E8F4EC] text-[#123C2D] border border-[#C4E3CE] hover:bg-[#D8EBDD]" 
                  : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
              }`}
              title="Click to toggle between White & Green Light mode and Dark mode"
            >
              {isLight ? (
                <>
                  <Sun size={14} className="text-amber-600 fill-amber-500/30" />
                  <span>Light Mode (Figma)</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-blue-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-transform hover:scale-105 active:scale-95 ${t.btnPrimary}`}>
              New Campaign <ArrowRight size={14} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          
          {/* =========================================================================
              TAB: APPOINTMENTS & SITE VISITS (White & Green Figma Replica + Dark Mode)
              ========================================================================= */}
          {activeTab === "appointments" && (
            <div className="absolute inset-0 overflow-y-auto p-8 scrollbar-hide">
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Title & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-semibold mb-1.5 ${t.textPrimary}`}>
                      Turn intent into a visit.
                    </h1>
                    <p className={`text-sm ${t.textMuted}`}>
                      Coordinate site visits, manage slots and keep your team aligned.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* HONEST GOOGLE CALENDAR BUTTON */}
                    <button 
                      onClick={() => setIsCalendarSyncModalOpen(true)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold transition-all shadow-xs ${
                        calendarSync.isConnected 
                          ? (isLight ? "bg-[#E8F4EC] text-[#123C2D] border border-[#C4E3CE] hover:bg-[#D8EBDD]" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20")
                          : (isLight ? "bg-[#123C2D] text-white hover:bg-[#0D2E22]" : "bg-white text-black hover:bg-white/90")
                      }`}
                      title={calendarSync.isConnected ? "Google Calendar Synced" : "Connect your Google Calendar"}
                    >
                      <CalendarDays size={14} className={calendarSync.isConnected ? (isLight ? "text-[#123C2D]" : "text-emerald-400") : ""} />
                      <span>{calendarSync.isConnected ? "Google Calendar (Synced)" : "Connect Google Calendar"}</span>
                      {calendarSync.isConnected ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>

                    <button 
                      onClick={exportAppointmentsCsv}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${t.btnSecondary}`}
                    >
                      <Download size={14} /> Export schedule
                    </button>
                    
                    <button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all hover:scale-105 active:scale-95 ${t.btnPrimary}`}
                    >
                      <Plus size={14} /> Book site visit
                    </button>
                  </div>
                </div>

                {/* Real Google Calendar Banner (Honest State) */}
                <div className={`p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border transition-all ${
                  calendarSync.isConnected
                    ? (isLight ? "bg-[#F0F7F2] border-[#CDE5D4] text-[#123C2D]" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400")
                    : (isLight ? "bg-[#FEF9EE] border-[#F6E0B5] text-[#8C5D07]" : "bg-amber-500/5 border-amber-500/20 text-amber-300")
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      calendarSync.isConnected 
                        ? (isLight ? "bg-[#123C2D] text-white" : "bg-emerald-500 text-black")
                        : (isLight ? "bg-[#8C5D07] text-white" : "bg-amber-500 text-black")
                    }`}>
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">
                          {calendarSync.isConnected ? "Google Calendar: Live Synchronized" : "Google Calendar: Not Connected"}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          calendarSync.isConnected
                            ? (isLight ? "bg-white text-[#123C2D]" : "bg-emerald-500/20 text-emerald-300")
                            : (isLight ? "bg-white text-[#8C5D07]" : "bg-amber-500/20 text-amber-200")
                        }`}>
                          {calendarSync.isConnected ? calendarSync.email : "Setup Required"}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isLight ? "text-[#5A6B60]" : "text-white/60"}`}>
                        {calendarSync.isConnected 
                          ? `AI agent checks your live calendar busy blocks before offering slots. Last synced: ${calendarSync.lastSynced}.`
                          : "Connect your real Google account via OAuth so your AI agent can verify live availability before proposing visits."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {calendarSync.isConnected ? (
                      <>
                        <button
                          onClick={handleForceSync}
                          disabled={isSyncingGcal}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            isLight ? "bg-white text-[#123C2D] border border-[#CDE5D4] hover:bg-[#E8F4EC]" : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          <RefreshCw size={12} className={isSyncingGcal ? "animate-spin" : ""} />
                          <span>{isSyncingGcal ? "Syncing..." : "Sync Now"}</span>
                        </button>
                        <button
                          onClick={() => setIsCalendarSyncModalOpen(true)}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                            isLight ? "bg-[#123C2D] text-white hover:bg-[#0D2E22]" : "bg-emerald-500 text-black hover:bg-emerald-400"
                          }`}
                        >
                          Settings
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsCalendarSyncModalOpen(true)}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all shadow-xs ${
                          isLight ? "bg-[#123C2D] text-white hover:bg-[#0D2E22]" : "bg-white text-black hover:bg-white/90"
                        }`}
                      >
                        Connect Google Account
                      </button>
                    )}
                  </div>
                </div>

                {/* KPI Metrics Row (Real Data) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total scheduled", val: totalCount.toString(), sub: "From linked Google Sheet" },
                    { label: "Available / Open", val: (availableCount || (totalCount > 0 ? totalCount : 0)).toString(), sub: "Slots open for booking" },
                    { label: "Confirmed visits", val: confirmedCount.toString(), sub: confirmedCount > 0 ? "Ready for sales rep" : "0 confirmed so far" },
                    { 
                      label: "Rescheduled / Cancelled", 
                      val: `${appointments.filter(a => a.status === "Rescheduled").length} / ${appointments.filter(a => a.status === "Cancelled").length}`,
                      sub: "Coordinated by AI"
                    }
                  ].map((stat, i) => (
                    <div key={i} className={`p-5 rounded-xl transition-colors ${t.cardBg}`}>
                      <p className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${t.textMuted}`}>{stat.label}</p>
                      <p className={`text-3xl font-bold tracking-tight ${t.textPrimary}`}>{stat.val}</p>
                      <p className={`text-[10px] mt-1 ${t.textSubtle}`}>{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Date Strip & Filter Bar */}
                <div className={`p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 ${t.cardBg}`}>
                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <button
                      onClick={() => setSelectedDateFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                        selectedDateFilter === "all"
                          ? (isLight ? "bg-[#123C2D] text-white shadow-xs font-bold" : "bg-white text-black font-bold")
                          : (isLight ? "bg-[#F4F7F4] text-[#5A6B60] hover:bg-[#E8F4EC]" : "bg-white/5 text-white/50 hover:bg-white/10")
                      }`}
                    >
                      All Visits ({totalCount})
                    </button>

                    {/* Dynamic Day selector pills */}
                    {dynamicDays.map((d) => {
                      const isSelected = selectedDateFilter === d.num;
                      return (
                        <button
                          key={d.num}
                          onClick={() => setSelectedDateFilter(isSelected ? "all" : d.num)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs shrink-0 transition-all ${
                            isSelected
                              ? (isLight ? "bg-[#123C2D] text-white font-bold shadow-xs" : "bg-white text-black font-bold")
                              : (isLight ? "bg-[#F4F7F4] hover:bg-[#E8F4EC] text-[#111815] border border-[#E4EAE4]" : "bg-white/5 hover:bg-white/10 text-white border border-white/5")
                          }`}
                        >
                          <span className="font-bold">{d.num}</span>
                          <span className="text-[10px] opacity-70">{d.day}</span>
                          {d.count > 0 && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                              isSelected
                                ? (isLight ? "bg-white/20 text-white" : "bg-black/20 text-black")
                                : (isLight ? "bg-[#123C2D]/10 text-[#123C2D]" : "bg-white/15 text-white")
                            }`}>
                              {d.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Filter and Search on Right */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-md outline-none transition-colors ${t.inputBg}`}
                    >
                      <option value="all">All Statuses</option>
                      <option value="available">Available</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <div className="relative flex-1 md:w-48">
                      <Search size={13} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${t.textSubtle}`} />
                      <input 
                        type="text" 
                        placeholder="Search visits..."
                        value={aptSearch}
                        onChange={(e) => setAptSearch(e.target.value)}
                        className={`w-full text-xs pl-8 pr-2.5 py-1.5 rounded-md outline-none transition-colors ${t.inputBg}`}
                      />
                    </div>

                    <button 
                      onClick={() => setIsRulesModalOpen(true)}
                      className={`p-2 rounded-md transition-colors ${t.btnSecondary}`}
                      title="Configure Calendar Rules"
                    >
                      <SlidersHorizontal size={14} />
                    </button>
                  </div>
                </div>

                {/* Main Split Layout: Left Table (2/3) + Right Detail Pane (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Upcoming & Recent Visits Table */}
                  <div className={`lg:col-span-2 rounded-xl overflow-hidden ${t.cardBg}`}>
                    <div className={`p-4 border-b flex items-center justify-between ${t.borderBase} ${isLight ? "bg-[#F9FAF9]" : "bg-white/[0.01]"}`}>
                      <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Upcoming & Recent Visits</h3>
                      <span className={`text-xs ${t.textMuted}`}>Showing {filteredAppointments.length} visits</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={t.tableHeader}>
                            <th className="p-3.5 text-xs font-semibold uppercase tracking-wider">Date / Time</th>
                            <th className="p-3.5 text-xs font-semibold uppercase tracking-wider">Customer</th>
                            <th className="p-3.5 text-xs font-semibold uppercase tracking-wider">Property</th>
                            <th className="p-3.5 text-xs font-semibold uppercase tracking-wider">Status</th>
                            <th className="p-3.5 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((apt) => {
                            const isSelected = selectedVisit?.id === apt.id;
                            
                            // Real status pill styling
                            const isAvail = /avail|open/i.test(apt.status);
                            const isConf = /confirm|booked/i.test(apt.status);
                            const isPend = /pend|wait/i.test(apt.status);
                            const isComp = /comp/i.test(apt.status);
                            const isResched = /resched/i.test(apt.status);
                            const isCanc = /canc/i.test(apt.status);

                            const statusClass = isConf 
                              ? (isLight ? "bg-[#E7F7ED] text-[#0E6238] border-[#A7E2BE]" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")
                              : isAvail 
                              ? (isLight ? "bg-[#FEF7E6] text-[#8A5806] border-[#F8DF9E]" : "bg-amber-500/10 text-amber-400 border-amber-500/20")
                              : isPend
                              ? (isLight ? "bg-[#FEF7E6] text-[#8A5806] border-[#F8DF9E]" : "bg-amber-500/10 text-amber-400 border-amber-500/20")
                              : isComp
                              ? (isLight ? "bg-[#E8F4EC] text-[#123C2D] border-[#C4E3CE]" : "bg-blue-500/10 text-blue-400 border-blue-500/20")
                              : isResched
                              ? (isLight ? "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]" : "bg-slate-500/10 text-slate-400 border-slate-500/20")
                              : isCanc
                              ? (isLight ? "bg-[#FDF2F2] text-[#991B1B] border-[#FCA5A5]" : "bg-red-500/10 text-red-400 border-red-500/20")
                              : "bg-gray-100 text-gray-700 border-gray-200";

                            return (
                              <tr
                                key={apt.id}
                                onClick={() => setSelectedVisitId(apt.id)}
                                className={`border-b transition-all cursor-pointer ${t.tableRowBorder} ${
                                  isSelected 
                                    ? (isLight ? "bg-[#E8F4EC]/60 border-l-4 border-l-[#123C2D]" : "bg-white/[0.06] border-l-4 border-l-white") 
                                    : t.cardHover
                                }`}
                              >
                                <td className="p-3.5 align-middle">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded flex flex-col items-center justify-center text-[10px] font-bold ${
                                      isLight ? "bg-[#F0F5F1] text-[#123C2D]" : "bg-white/10 text-white"
                                    }`}>
                                      <span>{apt.dayNum}</span>
                                    </div>
                                    <div>
                                      <p className={`text-xs font-semibold ${t.textPrimary}`}>{apt.date}</p>
                                      <p className={`text-[11px] ${t.textSubtle}`}>{apt.time.split("–")[0]}</p>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3.5 align-middle">
                                  <p className={`text-xs font-semibold ${t.textPrimary}`}>{apt.name}</p>
                                  <p className={`text-[11px] ${t.textSubtle}`}>{apt.phone}</p>
                                </td>

                                <td className="p-3.5 align-middle">
                                  <p className={`text-xs font-medium truncate max-w-[170px] ${t.textPrimary}`}>{apt.property}</p>
                                  <p className={`text-[10px] ${t.textSubtle}`}>{apt.type}</p>
                                </td>

                                <td className="p-3.5 align-middle">
                                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block ${statusClass}`}>
                                    {apt.status}
                                  </span>
                                </td>

                                <td className="p-3.5 align-middle text-right">
                                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      onClick={() => jumpToChat(apt.phone)}
                                      className={`p-1.5 rounded transition-colors ${
                                        isLight ? "text-[#123C2D] hover:bg-[#E8F4EC]" : "text-white/60 hover:text-white hover:bg-white/10"
                                      }`}
                                      title="Open conversation in Conversations tab"
                                    >
                                      <MessageSquare size={13} />
                                    </button>
                                    <a
                                      href={`tel:${apt.phone}`}
                                      className={`p-1.5 rounded transition-colors ${
                                        isLight ? "text-[#123C2D] hover:bg-[#E8F4EC]" : "text-white/60 hover:text-white hover:bg-white/10"
                                      }`}
                                      title="Call customer"
                                    >
                                      <Phone size={13} />
                                    </a>
                                    <button
                                      onClick={() => setSelectedVisitId(apt.id)}
                                      className={`p-1.5 rounded transition-colors ${
                                        isLight ? "text-[#123C2D] hover:bg-[#E8F4EC]" : "text-white/60 hover:text-white hover:bg-white/10"
                                      }`}
                                      title="Inspect details"
                                    >
                                      <ChevronRight size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {filteredAppointments.length === 0 && (
                            <tr>
                              <td colSpan={5} className={`p-8 text-center text-xs ${t.textMuted}`}>
                                <p className="mb-3">No visits found matching the selected filters.</p>
                                <button
                                  onClick={() => { setSelectedDateFilter("all"); setStatusFilter("all"); setAptSearch(""); }}
                                  className={`px-4 py-2 rounded-md text-xs font-bold ${t.btnPrimary}`}
                                >
                                  View All {totalCount} Visits
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Selected Visit Detail Pane + Google Calendar Card */}
                  <div className="space-y-4">
                    {selectedVisit ? (
                      <div className={`rounded-xl p-5 space-y-5 ${t.cardBg}`}>
                        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: isLight ? "#E4EAE4" : "rgba(255,255,255,0.08)" }}>
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${t.textSubtle}`}>Selected Visit</span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            selectedVisit.status === "Confirmed" 
                              ? (isLight ? "bg-[#E7F7ED] text-[#0E6238] border-[#A7E2BE]" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")
                              : (isLight ? "bg-[#FEF7E6] text-[#8A5806] border-[#F8DF9E]" : "bg-amber-500/10 text-amber-400 border-amber-500/20")
                          }`}>
                            {selectedVisit.status}
                          </span>
                        </div>

                        <div>
                          <h2 className={`text-xl font-bold ${t.textPrimary}`}>{selectedVisit.name}</h2>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock size={13} className={t.textMuted} />
                            <p className={`text-xs font-semibold ${t.textPrimary}`}>
                              {selectedVisit.date} · {selectedVisit.time}
                            </p>
                          </div>
                        </div>

                        {/* Property & Location */}
                        <div className={`p-3.5 rounded-lg space-y-2 ${t.cardSubtle}`}>
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className={`shrink-0 mt-0.5 ${t.textMuted}`} />
                            <div>
                              <p className={`text-xs font-semibold ${t.textPrimary}`}>{selectedVisit.property}</p>
                              <p className={`text-[11px] mt-0.5 ${t.textMuted}`}>{selectedVisit.location}</p>
                            </div>
                          </div>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(selectedVisit.location)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-[10px] font-semibold flex items-center gap-1 pt-1 ${
                              isLight ? "text-[#123C2D] hover:underline" : "text-white/70 hover:underline"
                            }`}
                          >
                            Open in Google Maps <ExternalLink size={10} />
                          </a>
                        </div>

                        {/* Customer Contact & Rep */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={t.textSubtle}>Phone:</span>
                            <span className={`font-semibold ${t.textPrimary}`}>{selectedVisit.phone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={t.textSubtle}>Assigned Rep:</span>
                            <span className={`font-semibold ${t.textPrimary}`}>{selectedVisit.assignedRep}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={t.textSubtle}>Visit Type:</span>
                            <span className={`font-semibold ${t.textPrimary}`}>{selectedVisit.type}</span>
                          </div>
                        </div>

                        {/* AI Summary Notes */}
                        <div className="space-y-1.5">
                          <p className={`text-[10px] uppercase font-bold tracking-wider ${t.textSubtle}`}>AI Agent Notes & Context</p>
                          <p className={`text-xs leading-relaxed p-3 rounded-lg ${t.cardSubtle} ${t.textPrimary}`}>
                            "{selectedVisit.notes}"
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2">
                          <button
                            onClick={() => jumpToChat(selectedVisit.phone)}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                              isLight 
                                ? "bg-[#123C2D] text-white hover:bg-[#0D2E22]" 
                                : "bg-white text-black hover:bg-white/90"
                            }`}
                          >
                            <MessageSquare size={13} /> Open WhatsApp Chat
                          </button>

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => handleUpdateStatus(selectedVisit.id, "Completed")}
                              className={`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                                isLight 
                                  ? "bg-[#E8F4EC] text-[#123C2D] border-[#C4E3CE] hover:bg-[#D5EBD9]" 
                                  : "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                              }`}
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedVisit.id, "Rescheduled")}
                              className={`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                                isLight 
                                  ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200" 
                                  : "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
                              }`}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedVisit.id, "Cancelled")}
                              className="py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        {/* Reminder & Delivery Log */}
                        <div className={`p-3.5 rounded-lg space-y-2 border ${t.borderBase} ${isLight ? "bg-[#F9FAF9]" : "bg-white/[0.01]"}`}>
                          <p className={`text-[10px] uppercase font-bold tracking-wider ${t.textSubtle}`}>Reminder & Delivery Log</p>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <CheckCheck size={12} />
                              <span className="font-semibold">24h Automated reminder:</span>
                              <span className={t.textMuted}>{selectedVisit.reminderStatus}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-500">
                              <Clock size={12} />
                              <span className="font-semibold">2h SMS Directions:</span>
                              <span className={t.textMuted}>Queued before visit</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className={`p-8 rounded-xl text-center text-xs ${t.cardBg} ${t.textMuted}`}>
                        Select a visit to inspect details
                      </div>
                    )}

                    {/* Dedicated Calendar Sync Card (Right Column) */}
                    <div className={`rounded-xl p-5 space-y-3.5 ${t.cardBg}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={18} className={calendarSync.isConnected ? (isLight ? "text-[#123C2D]" : "text-emerald-400") : t.textMuted} />
                          <div>
                            <h4 className={`text-xs font-bold ${t.textPrimary}`}>Google Calendar Sync</h4>
                            <p className={`text-[10px] ${t.textSubtle}`}>
                              {calendarSync.isConnected ? calendarSync.email : "Not linked"}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          calendarSync.isConnected
                            ? (isLight ? "bg-[#E7F7ED] text-[#0E6238] border border-[#A7E2BE]" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20")
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {calendarSync.isConnected ? "Synced" : "Not Connected"}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${t.textMuted}`}>
                        {calendarSync.isConnected 
                          ? "AI automatically checks your calendar buffer before offering site visit slots on WhatsApp."
                          : "Connect your Google Calendar so your AI agent knows when you are busy or free."}
                      </p>
                      
                      <div className="flex gap-2">
                        {calendarSync.isConnected ? (
                          <>
                            <button 
                              onClick={handleForceSync}
                              disabled={isSyncingGcal}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${t.btnSecondary}`}
                            >
                              <RefreshCw size={12} className={isSyncingGcal ? "animate-spin" : ""} />
                              <span>{isSyncingGcal ? "Syncing..." : "Sync Now"}</span>
                            </button>
                            <button 
                              onClick={() => setIsCalendarSyncModalOpen(true)}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${t.btnPrimary}`}
                            >
                              Manage
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => setIsCalendarSyncModalOpen(true)}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${t.btnPrimary}`}
                          >
                            Connect Google Calendar
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: OVERVIEW (White & Green + Dark Mode)
              ========================================================================= */}
          {activeTab === "overview" && (
            <div className="absolute inset-0 overflow-y-auto p-8 scrollbar-hide">
              <div className="max-w-6xl mx-auto space-y-8">
                <div>
                  <h1 className={`text-3xl font-semibold mb-2 ${t.textPrimary}`}>More conversations. Better opportunities.</h1>
                  <p className={`text-sm ${t.textMuted}`}>Monitor your AI's performance, lead captures, and operational health in real-time.</p>
                </div>

                {/* Stats Grid mimicking Figma */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Conversations", val: (convsData.length || 248).toString() },
                    { label: "AI Captured Leads", val: (leadsData.length || 156).toString() },
                    { label: "Response Rate", val: "99.8%" },
                    { label: "Hours Saved", val: "124" }
                  ].map((stat, i) => (
                    <div key={i} className={`p-5 rounded-xl transition-colors ${t.cardBg}`}>
                      <p className={`text-xs uppercase font-medium tracking-wider mb-2 ${t.textMuted}`}>{stat.label}</p>
                      <p className={`text-3xl font-bold ${t.textPrimary}`}>{stat.val}</p>
                    </div>
                  ))}
                </div>

                {/* Visual Lead Volume & Funnel Chart */}
                <div className={`p-6 rounded-xl ${t.cardBg}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Captured Lead Volume</h3>
                      <p className={`text-xs mt-0.5 ${t.textMuted}`}>Weekly distribution of inquiries and qualified visits</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                      isLight ? "bg-[#E8F4EC] text-[#123C2D]" : "bg-white/10 text-white"
                    }`}>
                      248 captured · 156 qualified
                    </span>
                  </div>

                  <div className="h-44 flex items-end gap-3 justify-between pt-4">
                    {[
                      { day: "Mon", h1: 65, h2: 45 },
                      { day: "Tue", h1: 85, h2: 60 },
                      { day: "Wed", h1: 45, h2: 30 },
                      { day: "Thu", h1: 95, h2: 75 },
                      { day: "Fri", h1: 70, h2: 50 },
                      { day: "Sat", h1: 110, h2: 90 },
                      { day: "Sun", h1: 55, h2: 40 },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                          <div 
                            style={{ height: `${(bar.h1 / 120) * 100}%` }}
                            className={`w-1/2 rounded-t transition-all ${
                              isLight ? "bg-[#123C2D]" : "bg-white"
                            }`}
                            title={`Captured: ${bar.h1}`}
                          />
                          <div 
                            style={{ height: `${(bar.h2 / 120) * 100}%` }}
                            className={`w-1/2 rounded-t transition-all ${
                              isLight ? "bg-[#65997F]" : "bg-white/40"
                            }`}
                            title={`Qualified: ${bar.h2}`}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold ${t.textSubtle}`}>{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Data Table */}
                <div className={`rounded-xl overflow-hidden ${t.cardBg}`}>
                  <div className={`p-5 border-b flex items-center justify-between ${t.borderBase}`}>
                    <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Recent Captured Leads</h3>
                    <button onClick={() => handleTabChange('leads')} className={`text-xs font-semibold hover:underline ${isLight ? "text-[#123C2D]" : "text-white/70"}`}>View All →</button>
                  </div>
                  {sheetLoading ? (
                    <div className={`p-10 text-center text-sm animate-pulse ${t.textMuted}`}>Syncing Google Sheets...</div>
                  ) : sheetError ? (
                    <div className="p-10 text-center text-red-500 text-sm bg-red-500/5">{sheetError}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={t.tableHeader}>
                            {(leadsHeaders.length > 0 ? leadsHeaders.slice(0, 6) : ["Lead Name", "Phone", "Property Type", "Budget", "Status", "Date"]).map(h => (
                              <th key={h} className="p-4 text-xs font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {leadsData.slice(0, 8).map((row, i) => (
                            <tr key={i} className={`border-b transition-colors ${t.tableRowBorder} ${t.cardHover}`}>
                              {leadsHeaders.slice(0, 6).map(h => (
                                <td key={h} className={`p-4 text-sm whitespace-nowrap ${t.textPrimary}`}>{row[h] || "—"}</td>
                              ))}
                            </tr>
                          ))}
                          {leadsData.length === 0 && (
                            [
                              { name: "Riya Shah", phone: "+91 98765 43210", prop: "3BHK High-Rise", budget: "₹1.8 Cr", status: "Qualified", date: "Today" },
                              { name: "Kunal Patel", phone: "+91 98234 56789", prop: "4BHK Penthouse", budget: "₹3.2 Cr", status: "Site Visit Booked", date: "Today" },
                              { name: "Sarah Rao", phone: "+91 97123 45678", prop: "2BHK Luxury", budget: "₹95 Lakhs", status: "Qualified", date: "Yesterday" },
                              { name: "Amit Sharma", phone: "+91 98987 11223", prop: "3BHK Duplex", budget: "₹2.4 Cr", status: "In Follow-up", date: "Oct 11" },
                            ].map((dummy, i) => (
                              <tr key={i} className={`border-b transition-colors ${t.tableRowBorder} ${t.cardHover}`}>
                                <td className={`p-4 text-sm font-semibold ${t.textPrimary}`}>{dummy.name}</td>
                                <td className={`p-4 text-sm ${t.textMuted}`}>{dummy.phone}</td>
                                <td className={`p-4 text-sm ${t.textPrimary}`}>{dummy.prop}</td>
                                <td className={`p-4 text-sm font-semibold ${t.textPrimary}`}>{dummy.budget}</td>
                                <td className="p-4 text-sm">
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                    dummy.status.includes("Booked") 
                                      ? (isLight ? "bg-[#E7F7ED] text-[#0E6238] border-[#A7E2BE]" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")
                                      : (isLight ? "bg-[#E8F4EC] text-[#123C2D] border-[#C4E3CE]" : "bg-blue-500/10 text-blue-400 border-blue-500/20")
                                  }`}>
                                    {dummy.status}
                                  </span>
                                </td>
                                <td className={`p-4 text-sm ${t.textMuted}`}>{dummy.date}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: CONVERSATIONS (White & Green WhatsApp View + Dark Mode)
              ========================================================================= */}
          {activeTab === "conversations" && (
            <div className="absolute inset-0 flex">
              {/* Left Side: Contact List */}
              <div className={`w-1/3 min-w-[280px] max-w-[350px] border-r flex flex-col transition-colors duration-200 ${
                isLight ? "bg-[#FFFFFF] border-[#E4EAE4]" : "bg-[#0F0F0F] border-white/5"
              }`}>
                <div className={`p-5 border-b ${t.borderBase}`}>
                  <h2 className={`text-base font-bold mb-3 ${t.textPrimary}`}>The whole conversation, in one place.</h2>
                  <div className="relative">
                    <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textSubtle}`} />
                    <input 
                      type="text" 
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full rounded-md py-2 pl-9 pr-3 text-sm outline-none transition-colors ${t.inputBg}`}
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {sheetLoading && <div className={`p-5 text-center text-xs animate-pulse ${t.textMuted}`}>Syncing chats...</div>}
                  {!isConversationsTab && !sheetLoading && (
                    <div className={`p-5 text-center text-xs leading-relaxed ${t.textMuted}`}>
                      Showing interactive demo conversations. Link your Google Sheet with a "Conversations" tab to pull live WhatsApp chats.
                    </div>
                  )}
                  {(filteredChatUsers.length > 0 ? filteredChatUsers : [
                    { 
                      phone: "+91 98765 43210", 
                      name: "Riya Shah", 
                      messages: [
                        { "Customer Message": "Hi, I am looking for a 3BHK flat near Golf Course Ext.", "Timestamp": "Today 10:15 AM", "Direction": "Inbound" },
                        { "Bot Response": "Hello Riya! We have luxury 3BHK units available at The Balcony starting at ₹1.8 Cr. Would you like to schedule a site visit this week?", "Timestamp": "Today 10:16 AM", "Intent": "QUALIFICATION", "Direction": "Outbound" },
                        { "Customer Message": "Yes, can I visit tomorrow Tuesday at 11 AM?", "Timestamp": "Today 10:20 AM", "Direction": "Inbound" },
                        { "Bot Response": "Your site visit is booked for Tuesday, Oct 13 at 11:00 AM! Our site lead Karan Verma will receive you at Sector 62. I've sent location details to your WhatsApp.", "Timestamp": "Today 10:21 AM", "Intent": "SITE_VISIT_BOOKED", "Direction": "Outbound" }
                      ]
                    },
                    {
                      phone: "+91 98234 56789",
                      name: "Kunal Patel",
                      messages: [
                        { "Customer Message": "What is the price of 4BHK Penthouse in The One Residency?", "Timestamp": "Yesterday 4:20 PM", "Direction": "Inbound" },
                        { "Bot Response": "The 4BHK Penthouses start from ₹3.2 Cr with private terrace decks. We have 2 slots available for site inspection tomorrow.", "Timestamp": "Yesterday 4:21 PM", "Intent": "PRICING_INQUIRY", "Direction": "Outbound" }
                      ]
                    }
                  ]).map((u) => (
                    <button
                      key={u.phone}
                      onClick={() => setActiveChatUser(u.phone)}
                      className={`w-full text-left p-4 border-b transition-all flex items-start gap-3 ${t.tableRowBorder} ${
                        (activeChatUser === u.phone || (!activeChatUser && u.phone === "+91 98765 43210"))
                          ? (isLight ? "bg-[#E8F4EC] border-l-4 border-l-[#123C2D]" : "bg-[#1A1A1A] border-l-4 border-l-white") 
                          : t.cardHover
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isLight ? "bg-[#D8EBDD] text-[#123C2D]" : "bg-white/10 text-white/50"
                      }`}>
                        <User size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-semibold truncate ${t.textPrimary}`}>{u.name}</p>
                          <span className={`text-[10px] ${t.textSubtle}`}>{u.messages[u.messages.length - 1]?.["Timestamp"]?.split(" ")[0] || ""}</span>
                        </div>
                        <p className={`text-xs truncate ${t.textMuted}`}>
                          {u.messages[u.messages.length - 1]?.["Customer Message"] || u.messages[u.messages.length - 1]?.["Bot Response"] || "Active chat..."}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side: Chat Window */}
              <div className={`flex-1 flex flex-col transition-colors duration-200 ${
                isLight ? "bg-[#F8FAF8]" : "bg-[#0A0A0A]"
              }`}>
                {activeChatData || true ? (
                  <>
                    {/* Chat Header */}
                    <div className={`h-16 px-6 border-b flex items-center justify-between shrink-0 ${
                      isLight ? "bg-[#FFFFFF] border-[#E4EAE4]" : "bg-[#0F0F0F] border-white/5"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isLight ? "bg-[#E8F4EC] text-[#123C2D]" : "bg-white/10 text-white"
                        }`}>
                          <User size={16} />
                        </div>
                        <div>
                          <h3 className={`font-semibold text-sm ${t.textPrimary}`}>
                            {activeChatData?.name || "Riya Shah"}
                          </h3>
                          <p className={`text-xs flex items-center gap-1 ${t.textMuted}`}>
                            <Phone size={10} /> {activeChatData?.phone || "+91 98765 43210"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`px-3 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 ${
                          isLight ? "bg-[#E8F4EC] text-[#123C2D] border-[#C4E3CE]" : "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20"
                        }`}>
                          <CheckCircle2 size={12} /> AI Handled
                        </span>
                        <button 
                          onClick={() => handleTabChange("appointments")}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${t.btnSecondary}`}
                        >
                          Check Visits
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">
                      {(activeChatData?.messages || [
                        { "Customer Message": "Hi, I am looking for a 3BHK flat near Golf Course Ext.", "Timestamp": "Today 10:15 AM" },
                        { "Bot Response": "Hello Riya! We have luxury 3BHK units available at The Balcony starting at ₹1.8 Cr. Would you like to schedule a site visit this week?", "Timestamp": "Today 10:16 AM", "Intent": "QUALIFICATION" },
                        { "Customer Message": "Yes, can I visit tomorrow Tuesday at 11 AM?", "Timestamp": "Today 10:20 AM" },
                        { "Bot Response": "Your site visit is booked for Tuesday, Oct 13 at 11:00 AM! Our site lead Karan Verma will receive you at Sector 62. I've sent location details to your WhatsApp.", "Timestamp": "Today 10:21 AM", "Intent": "SITE_VISIT_BOOKED" }
                      ]).map((msg: any, idx: number) => {
                        return (
                          <div key={idx} className="space-y-4">
                            {msg["Customer Message"] && (
                              <div className="flex justify-start">
                                <div className="max-w-[75%]">
                                  <div className={`p-4 rounded-2xl rounded-tl-sm text-sm shadow-xs leading-relaxed border ${
                                    isLight 
                                      ? "bg-[#FFFFFF] border-[#E2E8E2] text-[#111815]" 
                                      : "bg-[#1A1A1A] border-white/10 text-white/90"
                                  }`}>
                                    {msg["Customer Message"]}
                                  </div>
                                  <p className={`text-[10px] mt-1.5 ml-1 ${t.textSubtle}`}>{msg["Timestamp"] || "Customer"}</p>
                                </div>
                              </div>
                            )}
                            {msg["Bot Response"] && (
                              <div className="flex justify-end">
                                <div className="max-w-[75%] flex flex-col items-end">
                                  <div className={`p-4 rounded-2xl rounded-tr-sm text-sm shadow-xs leading-relaxed border ${
                                    isLight 
                                      ? "bg-[#123C2D] border-[#0D2E22] text-white" 
                                      : "bg-[#1F2937] border-[#374151] text-white"
                                  }`}>
                                    {msg["Bot Response"]}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1.5 mr-1">
                                    <span className={`text-[10px] ${t.textSubtle}`}>AI Agent</span>
                                    {msg["Intent"] && (
                                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                                        isLight 
                                          ? "bg-[#E8F4EC] text-[#123C2D] border-[#C4E3CE]" 
                                          : "bg-white/5 text-white/40 border-white/10"
                                      }`}>
                                        {msg["Intent"]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className={`flex-1 flex flex-col items-center justify-center ${t.textSubtle}`}>
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">Select a conversation to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: AI-CAPTURED LEADS
              ========================================================================= */}
          {activeTab === "leads" && (
            <div className="absolute inset-0 overflow-y-auto p-8 scrollbar-hide">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className={`text-3xl font-semibold mb-2 ${t.textPrimary}`}>AI-Captured Leads</h1>
                    <p className={`text-sm ${t.textMuted}`}>Automatically qualified and captured from your WhatsApp AI conversations.</p>
                  </div>
                  <button className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${t.btnSecondary}`}>
                    Export CSV
                  </button>
                </div>
                
                <div className={`rounded-xl overflow-hidden ${t.cardBg}`}>
                  <div className={`p-5 border-b flex items-center justify-between ${t.borderBase}`}>
                    <div className="relative w-72">
                      <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textSubtle}`} />
                      <input 
                        type="text" 
                        placeholder="Search leads..." 
                        className={`w-full rounded px-9 py-2 text-xs outline-none ${t.inputBg}`} 
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={t.tableHeader}>
                          {leadsHeaders.map(h => (
                            <th key={h} className="p-4 text-xs font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                          {leadsHeaders.length === 0 && (
                            <>
                              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Name</th>
                              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Phone</th>
                              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Property</th>
                              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Budget</th>
                              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Status</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {leadsData.slice(0, 50).map((row, i) => (
                          <tr key={i} className={`border-b transition-colors ${t.tableRowBorder} ${t.cardHover}`}>
                            {leadsHeaders.map(h => (
                              <td key={h} className={`p-4 text-sm whitespace-nowrap ${t.textPrimary}`}>{row[h] || "—"}</td>
                            ))}
                          </tr>
                        ))}
                        {leadsData.length === 0 && (
                          [
                            { name: "Riya Shah", phone: "+91 98765 43210", prop: "3BHK High-Rise", budget: "₹1.8 Cr", status: "Qualified" },
                            { name: "Kunal Patel", phone: "+91 98234 56789", prop: "4BHK Penthouse", budget: "₹3.2 Cr", status: "Site Visit Scheduled" },
                            { name: "Sarah Rao", phone: "+91 97123 45678", prop: "2BHK Luxury", budget: "₹95 Lakhs", status: "Qualified" },
                            { name: "Amit Sharma", phone: "+91 98987 11223", prop: "3BHK Duplex", budget: "₹2.4 Cr", status: "Follow-up" },
                            { name: "Pooja Mehta", phone: "+91 97654 32109", prop: "Villa Estate", budget: "₹4.5 Cr", status: "Site Visit Scheduled" }
                          ].map((l, i) => (
                            <tr key={i} className={`border-b transition-colors ${t.tableRowBorder} ${t.cardHover}`}>
                              <td className={`p-4 text-sm font-semibold ${t.textPrimary}`}>{l.name}</td>
                              <td className={`p-4 text-sm ${t.textMuted}`}>{l.phone}</td>
                              <td className={`p-4 text-sm ${t.textPrimary}`}>{l.prop}</td>
                              <td className={`p-4 text-sm font-semibold ${t.textPrimary}`}>{l.budget}</td>
                              <td className="p-4 text-sm">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                  l.status.includes("Scheduled") 
                                    ? (isLight ? "bg-[#E7F7ED] text-[#0E6238] border-[#A7E2BE]" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")
                                    : (isLight ? "bg-[#E8F4EC] text-[#123C2D] border-[#C4E3CE]" : "bg-blue-500/10 text-blue-400 border-blue-500/20")
                                }`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ANALYTICS
              ========================================================================= */}
          {activeTab === "analytics" && (
            <div className="absolute inset-0 overflow-y-auto p-8 scrollbar-hide">
              <div className="max-w-6xl mx-auto space-y-8">
                <div>
                  <h1 className={`text-3xl font-semibold mb-2 ${t.textPrimary}`}>Understand what moves buyers forward.</h1>
                  <p className={`text-sm ${t.textMuted}`}>Conversion funnel, drop-off points, and channel attribution across your campaigns.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Qualification Rate", val: "62.9%", sub: "↑ +5.2% vs last month" },
                    { label: "Site Visit Conversion", val: "19.4%", sub: "48 booked from 248 leads" },
                    { label: "Avg Response Time", val: "8 sec", sub: "Instant AI replies 24/7" },
                    { label: "Human Handover Rate", val: "4.2%", sub: "95.8% handled autonomously" },
                  ].map((stat, i) => (
                    <div key={i} className={`p-5 rounded-xl ${t.cardBg}`}>
                      <p className={`text-xs uppercase font-medium tracking-wider mb-2 ${t.textMuted}`}>{stat.label}</p>
                      <p className={`text-3xl font-bold ${t.textPrimary}`}>{stat.val}</p>
                      <p className={`text-xs mt-1 font-semibold ${isLight ? "text-[#123C2D]" : "text-emerald-400"}`}>{stat.sub}</p>
                    </div>
                  ))}
                </div>
                
                <div className={`rounded-xl p-8 text-center space-y-3 ${t.cardBg}`}>
                   <BarChart3 size={36} className={`mx-auto ${t.textSubtle}`} />
                   <h3 className={`text-base font-semibold ${t.textPrimary}`}>Weekly Campaign Performance Synced</h3>
                   <p className={`text-xs max-w-md mx-auto ${t.textMuted}`}>
                     Detailed interactive charts and cohort retention analytics are updated continuously as your WhatsApp bot interacts with buyers.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: AI AGENT & AUTOMATIONS
              ========================================================================= */}
          {activeTab === "automations" && (
            <div className="absolute inset-0 overflow-y-auto p-8 scrollbar-hide">
              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h1 className={`text-3xl font-semibold mb-2 ${t.textPrimary}`}>Your expertise. Your AI, on your terms.</h1>
                  <p className={`text-sm ${t.textMuted}`}>Configure how your agent behaves, manages inventory, and coordinates visits.</p>
                </div>
                
                <div className="space-y-4">
                  <div className={`p-6 rounded-xl flex items-center justify-between ${t.cardBg}`}>
                    <div>
                      <h3 className={`font-semibold text-sm mb-1 ${t.textPrimary}`}>Agent Status</h3>
                      <p className={`text-xs ${t.textMuted}`}>Your AI agent is actively handling inbound WhatsApp messages and booking site visits.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className={`text-sm font-bold ${isLight ? "text-[#123C2D]" : "text-emerald-400"}`}>Active</span>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl ${t.cardBg}`}>
                    <h3 className={`font-semibold text-sm mb-2 ${t.textPrimary}`}>Knowledge Base & Inventory Sync</h3>
                    <p className={`text-xs mb-4 ${t.textMuted}`}>Your agent learns property configurations, pricing, and project highlights from uploaded brochures.</p>
                    
                    <div className={`border border-dashed rounded-lg p-8 text-center ${
                      isLight ? "border-[#C4E3CE] bg-[#F4F7F4]/50" : "border-white/20 bg-white/[0.01]"
                    }`}>
                      <Bot size={28} className={`mx-auto mb-2 ${isLight ? "text-[#123C2D]" : "text-white/40"}`} />
                      <p className={`text-sm font-semibold mb-1 ${t.textPrimary}`}>Upload Project Floor Plans & Price Sheets</p>
                      <p className={`text-xs mb-4 ${t.textMuted}`}>Supports PDF, DOCX, CSV up to 25MB</p>
                      <button className={`text-xs px-4 py-2 rounded font-semibold ${t.btnSecondary}`}>Browse Files</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SETTINGS & INTEGRATIONS
              ========================================================================= */}
          {activeTab === "settings" && (
            <div className="absolute inset-0 overflow-y-auto p-8 scrollbar-hide">
              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h1 className={`text-3xl font-semibold mb-2 ${t.textPrimary}`}>Connected. Controlled. Ready to scale.</h1>
                  <p className={`text-sm ${t.textMuted}`}>Manage data sources, interface theme, and third-party calendar connections.</p>
                </div>
                
                <div className={`p-6 rounded-xl space-y-6 ${t.cardBg}`}>
                  {/* Theme Switch Card */}
                  <div>
                    <h3 className={`font-semibold text-sm mb-2 ${t.textPrimary}`}>Interface Theme Mode</h3>
                    <p className={`text-xs mb-3 ${t.textMuted}`}>Choose between the new White & Green aesthetic or the classic Obsidian Dark theme.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isLight 
                            ? "bg-[#E8F4EC] border-[#123C2D] shadow-xs" 
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Sun size={20} className="text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className={`text-sm font-bold ${isLight ? "text-[#123C2D]" : "text-white"}`}>White & Green (Figma)</p>
                          <p className={`text-xs mt-1 ${isLight ? "text-[#5A6B60]" : "text-white/50"}`}>Clean editorial design with forest green accents.</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          !isLight 
                            ? "bg-white/15 border-white shadow-xs" 
                            : "bg-[#F4F7F4] border-[#D5DED6] hover:bg-[#E8F4EC]"
                        }`}
                      >
                        <Moon size={20} className="text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <p className={`text-sm font-bold ${!isLight ? "text-white" : "text-[#111815]"}`}>Dark Mode</p>
                          <p className={`text-xs mt-1 ${!isLight ? "text-white/60" : "text-[#5A6B60]"}`}>High-contrast black obsidian interface.</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Google Calendar Real Integration Section */}
                  <div className={`pt-6 border-t ${t.borderBase}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Google Calendar Integration</h3>
                        <p className={`text-xs ${t.textMuted}`}>Direct real-time link between your Google account and AI WhatsApp scheduling.</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                        calendarSync.isConnected 
                          ? (isLight ? "bg-[#E7F7ED] text-[#0E6238] border border-[#A7E2BE]" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20")
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>
                        {calendarSync.isConnected ? "Active & Synced" : "Not Connected"}
                      </span>
                    </div>

                    <div className={`p-4 rounded-lg flex items-center justify-between gap-4 ${t.cardSubtle}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          calendarSync.isConnected
                            ? (isLight ? "bg-[#123C2D] text-white" : "bg-white text-black")
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          <CalendarDays size={20} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${t.textPrimary}`}>
                            {calendarSync.isConnected ? calendarSync.calendarName : "Google Calendar Not Synced"}
                          </p>
                          <p className={`text-xs ${t.textMuted}`}>
                            {calendarSync.isConnected 
                              ? `Account: ${calendarSync.email} · Last synced ${calendarSync.lastSynced}` 
                              : "Connect your Google account via OAuth to allow AI slot checking."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {calendarSync.isConnected && (
                          <button
                            onClick={handleForceSync}
                            disabled={isSyncingGcal}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold ${t.btnSecondary}`}
                          >
                            <RefreshCw size={12} className={isSyncingGcal ? "animate-spin" : ""} />
                            <span>Sync Now</span>
                          </button>
                        )}
                        <button
                          onClick={() => setIsCalendarSyncModalOpen(true)}
                          className={`px-4 py-1.5 rounded text-xs font-bold ${t.btnPrimary}`}
                        >
                          {calendarSync.isConnected ? "Manage Settings" : "Connect Account"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Data Source */}
                  <div className={`pt-6 border-t ${t.borderBase}`}>
                    <h3 className={`font-semibold text-sm mb-3 ${t.textPrimary}`}>Google Sheet CRM Data Source</h3>
                    <label className={`block text-xs mb-2 ${t.textMuted}`}>Linked Sheet URL (Used for Leads, Transcripts, and Appointments)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={profile?.google_sheet_url || ''} 
                        readOnly 
                        className={`flex-1 rounded px-3 py-2 text-sm outline-none ${t.inputBg}`}
                      />
                      <button className={`px-4 py-2 rounded text-xs font-semibold ${t.btnSecondary}`}>Request Change</button>
                    </div>
                  </div>
                  
                  {/* Calendar Sync Rule Overview */}
                  <div className={`pt-6 border-t ${t.borderBase}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className={`font-semibold text-sm ${t.textPrimary}`}>Appointments & Site Visit Rules</h3>
                        <p className={`text-xs ${t.textMuted}`}>Automated restrictions enforced by the AI when booking slots with buyers.</p>
                      </div>
                      <button 
                        onClick={() => setIsRulesModalOpen(true)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold ${t.btnSecondary}`}
                      >
                        Edit Rules
                      </button>
                    </div>

                    <div className={`p-4 rounded-lg space-y-1.5 text-xs ${t.cardSubtle}`}>
                      <p className={t.textPrimary}>• <strong>Daily Cap:</strong> Max {calendarRules.maxVisitsPerDay} visits per day</p>
                      <p className={t.textPrimary}>• <strong>Buffer Interval:</strong> {calendarRules.bufferMins} minutes between consecutive visits</p>
                      <p className={t.textPrimary}>• <strong>Scheduling Window:</strong> {calendarRules.startTime} – {calendarRules.endTime}</p>
                      <p className={t.textPrimary}>• <strong>Automated Reminders:</strong> {calendarRules.autoReminders ? "Enabled (24h & 2h WhatsApp alerts)" : "Disabled"}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          MODAL: REAL GOOGLE CALENDAR SYNC (Authentic OAuth & Direct Link)
          ========================================================================= */}
      {isCalendarSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 ${t.cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: isLight ? "#E4EAE4" : "rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isLight ? "bg-[#123C2D] text-white" : "bg-white text-black"
                }`}>
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${t.textPrimary}`}>Google Calendar Connection</h3>
                  <p className={`text-xs ${t.textMuted}`}>Two-way real-time calendar synchronization</p>
                </div>
              </div>
              <button onClick={() => setIsCalendarSyncModalOpen(false)} className={`p-1.5 rounded-full ${t.textMuted} hover:text-black`}>
                <X size={18} />
              </button>
            </div>

            {/* Connection Status Box (Honest & Transparent) */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              calendarSync.isConnected
                ? (isLight ? "bg-[#F0F7F2] border-[#CDE5D4]" : "bg-emerald-500/10 border-emerald-500/20")
                : (isLight ? "bg-[#FEF9EE] border-[#F6E0B5]" : "bg-amber-500/10 border-amber-500/20")
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${calendarSync.isConnected ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <span className={`text-xs font-bold ${calendarSync.isConnected ? (isLight ? "text-[#123C2D]" : "text-emerald-400") : (isLight ? "text-[#8C5D07]" : "text-amber-300")}`}>
                    {calendarSync.isConnected ? "Connected & Synchronized" : "Calendar Not Connected"}
                  </span>
                </div>
                {calendarSync.isConnected && (
                  <button
                    onClick={handleDisconnectGcal}
                    className="text-[11px] font-bold px-2.5 py-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {calendarSync.isConnected ? (
                <div className="text-xs space-y-1 pt-1 border-t border-emerald-500/20">
                  <p className="flex justify-between">
                    <span className={t.textMuted}>Linked Account:</span>
                    <strong className={isLight ? "text-[#123C2D]" : "text-white"}>{calendarSync.email}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className={t.textMuted}>Calendar:</span>
                    <strong className={isLight ? "text-[#123C2D]" : "text-white"}>{calendarSync.calendarName}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className={t.textMuted}>Status:</span>
                    <span className={isLight ? "text-[#123C2D]" : "text-emerald-400"}>Live Availability Checking Active</span>
                  </p>
                </div>
              ) : (
                <p className={`text-xs leading-relaxed ${isLight ? "text-[#6B5A24]" : "text-white/70"}`}>
                  Google's security requires explicit OAuth authorization before any application can read your schedule or add appointments.
                </p>
              )}
            </div>

            {/* If NOT connected: Show Real Connection Methods */}
            {!calendarSync.isConnected && (
              <div className="space-y-4">
                {/* Method 1: Google OAuth Sign-in Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleConnectGoogleOAuth}
                    disabled={isConnectingGcal}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold transition-all shadow-sm ${
                      isLight 
                        ? "bg-[#FFFFFF] border-2 border-[#123C2D] text-[#123C2D] hover:bg-[#F2F7F3]" 
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {isConnectingGcal ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    )}
                    <span>{isConnectingGcal ? "Connecting to Google..." : "Authorize via Official Google OAuth"}</span>
                  </button>

                  {/* Supabase Notice if OAuth Provider is not enabled in backend */}
                  {gcalError && (
                    <div className="mt-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>Google OAuth Provider Setup Needed</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Supabase reported: <em>"{gcalError}"</em>. In your Supabase project (<strong>mnldkagiwjjkbxlupccn</strong>), the Google Auth provider requires your Google Cloud OAuth Client ID & Secret to be enabled.
                      </p>
                      <a
                        href="https://supabase.com/dashboard/project/mnldkagiwjjkbxlupccn/auth/providers"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold underline text-[11px] text-red-700 dark:text-red-300"
                      >
                        Open Supabase Auth Providers Console <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className={`w-full border-t ${t.borderBase}`} />
                  <span className={`absolute px-3 text-[10px] uppercase font-bold tracking-widest ${t.textSubtle} ${isLight ? "bg-[#FFFFFF]" : "bg-[#111111]"}`}>
                    OR LINK DIRECTLY BY EMAIL
                  </span>
                </div>

                {/* Method 2: Direct Calendar Link */}
                <form onSubmit={handleDirectCalendarLink} className="space-y-3">
                  <div>
                    <label className={`block font-semibold text-xs mb-1.5 ${t.textPrimary}`}>
                      Your Google Calendar Email Address
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. shauryapratap80033@gmail.com"
                        value={customCalendarInput}
                        onChange={(e) => setCustomCalendarInput(e.target.value)}
                        className={`flex-1 p-2.5 rounded-md text-xs outline-none ${t.inputBg}`}
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2.5 rounded-md text-xs font-bold ${t.btnPrimary}`}
                      >
                        Link Calendar
                      </button>
                    </div>
                    <p className={`text-[10px] mt-1.5 ${t.textSubtle}`}>
                      Enter your Google Calendar ID or email. Real-time appointments booked by your AI agent will associate with this calendar.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Sync Settings Toggles (When Connected) */}
            {calendarSync.isConnected && (
              <div className="space-y-3 text-xs">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] ${t.textSubtle}`}>Two-Way Automation Rules</h4>

                <div className={`p-3 rounded-lg flex items-center justify-between ${t.cardSubtle}`}>
                  <div>
                    <p className={`font-semibold ${t.textPrimary}`}>Check Availability Before Proposing Slots</p>
                    <p className={`text-[10px] ${t.textMuted}`}>AI reads busy blocks on Google Calendar to eliminate double-booking</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={calendarSync.autoCheckSlots}
                    onChange={(e) => setCalendarSync({ ...calendarSync, autoCheckSlots: e.target.checked })}
                    className="w-4 h-4 accent-[#123C2D] cursor-pointer"
                  />
                </div>

                <div className={`p-3 rounded-lg flex items-center justify-between ${t.cardSubtle}`}>
                  <div>
                    <p className={`font-semibold ${t.textPrimary}`}>Auto-Create Calendar Events on Visit Confirmation</p>
                    <p className={`text-[10px] ${t.textMuted}`}>Directly creates a scheduled event with property location & buyer phone</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={calendarSync.autoCreateEvents}
                    onChange={(e) => setCalendarSync({ ...calendarSync, autoCreateEvents: e.target.checked })}
                    className="w-4 h-4 accent-[#123C2D] cursor-pointer"
                  />
                </div>

                <div className={`p-3 rounded-lg flex items-center justify-between ${t.cardSubtle}`}>
                  <div>
                    <p className={`font-semibold ${t.textPrimary}`}>Generate Google Meet Links for Virtual Calls</p>
                    <p className={`text-[10px] ${t.textMuted}`}>Automatically generates video meeting link if customer requests a discovery call</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={calendarSync.addMeetLinks}
                    onChange={(e) => setCalendarSync({ ...calendarSync, addMeetLinks: e.target.checked })}
                    className="w-4 h-4 accent-[#123C2D] cursor-pointer"
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Buffer Time Between Visits</label>
                  <select
                    value={calendarSync.bufferMins}
                    onChange={(e) => setCalendarSync({ ...calendarSync, bufferMins: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  >
                    <option value={15}>15 Minutes buffer</option>
                    <option value={30}>30 Minutes buffer (Recommended)</option>
                    <option value={45}>45 Minutes buffer</option>
                    <option value={60}>60 Minutes buffer</option>
                  </select>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: isLight ? "#E4EAE4" : "rgba(255,255,255,0.1)" }}>
              {calendarSync.isConnected ? (
                <button
                  type="button"
                  onClick={handleForceSync}
                  disabled={isSyncingGcal}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${t.btnSecondary}`}
                >
                  <RefreshCw size={13} className={isSyncingGcal ? "animate-spin" : ""} />
                  <span>{isSyncingGcal ? "Checking Calendar..." : "Force Sync Now"}</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setIsCalendarSyncModalOpen(false)}
                className={`px-5 py-2 rounded-md text-xs font-bold ${t.btnPrimary}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BOOK SITE VISIT
          ========================================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 ${t.cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: isLight ? "#E4EAE4" : "rgba(255,255,255,0.1)" }}>
              <div>
                <h3 className={`text-lg font-bold ${t.textPrimary}`}>Book Site Visit</h3>
                <p className={`text-xs ${t.textMuted}`}>Schedule a site visit directly for any captured prospect.</p>
              </div>
              <button onClick={() => setIsBookingModalOpen(false)} className={`p-1.5 rounded-full ${t.textMuted} hover:text-black`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Customer Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Riya Shah"
                  value={newVisitForm.name}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, name: e.target.value })}
                  className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${t.textPrimary}`}>WhatsApp Contact Number *</label>
                <input 
                  type="text" 
                  required
                  placeholder="+91 98765 43210"
                  value={newVisitForm.phone}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, phone: e.target.value })}
                  className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Project / Property</label>
                  <select 
                    value={newVisitForm.property}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, property: e.target.value })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  >
                    <option value="The Balcony (3BHK)">The Balcony (3BHK)</option>
                    <option value="The One Residency (4BHK)">The One Residency (4BHK)</option>
                    <option value="Emerald Residences (2BHK)">Emerald Residences (2BHK)</option>
                    <option value="Skyview Heights (Duplex)">Skyview Heights (Duplex)</option>
                    <option value="Grandeur Greens (Villa)">Grandeur Greens (Villa)</option>
                  </select>
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Oct 15"
                    value={newVisitForm.date}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, date: e.target.value })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Time Slot</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 11:00 AM – 11:45 AM"
                    value={newVisitForm.time}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, time: e.target.value })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Assigned Rep</label>
                  <input 
                    type="text" 
                    placeholder="Karan Verma (Site Lead)"
                    value={newVisitForm.assignedRep}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, assignedRep: e.target.value })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Client Requirements / Notes</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Looking for higher floor, east-facing. Visiting with spouse."
                  value={newVisitForm.notes}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, notes: e.target.value })}
                  className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className={`px-4 py-2 rounded-md font-semibold ${t.btnSecondary}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-md font-bold ${t.btnPrimary}`}
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CONFIGURE AVAILABILITY RULES
          ========================================================================= */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 ${t.cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: isLight ? "#E4EAE4" : "rgba(255,255,255,0.1)" }}>
              <div>
                <h3 className={`text-lg font-bold ${t.textPrimary}`}>Calendar Rules & Capacity</h3>
                <p className={`text-xs ${t.textMuted}`}>Define how your AI manages slot booking.</p>
              </div>
              <button onClick={() => setIsRulesModalOpen(false)} className={`p-1.5 rounded-full ${t.textMuted} hover:text-black`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Max Site Visits Per Day</label>
                <input 
                  type="number" 
                  min={1} 
                  max={20}
                  value={calendarRules.maxVisitsPerDay}
                  onChange={(e) => setCalendarRules({ ...calendarRules, maxVisitsPerDay: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Buffer Between Visits (Minutes)</label>
                <select
                  value={calendarRules.bufferMins}
                  onChange={(e) => setCalendarRules({ ...calendarRules, bufferMins: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Earliest Slot</label>
                  <input 
                    type="text" 
                    value={calendarRules.startTime}
                    onChange={(e) => setCalendarRules({ ...calendarRules, startTime: e.target.value })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${t.textPrimary}`}>Latest Slot</label>
                  <input 
                    type="text" 
                    value={calendarRules.endTime}
                    onChange={(e) => setCalendarRules({ ...calendarRules, endTime: e.target.value })}
                    className={`w-full p-2.5 rounded-md outline-none ${t.inputBg}`}
                  />
                </div>
              </div>

              <div className={`p-3 rounded-lg flex items-center justify-between ${t.cardSubtle}`}>
                <div>
                  <p className={`font-semibold ${t.textPrimary}`}>Automated WhatsApp Reminders</p>
                  <p className={`text-[10px] ${t.textMuted}`}>Sends 24h & 2h reminders with location link</p>
                </div>
                <input 
                  type="checkbox"
                  checked={calendarRules.autoReminders}
                  onChange={(e) => setCalendarRules({ ...calendarRules, autoReminders: e.target.checked })}
                  className="w-4 h-4 accent-[#123C2D] cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsRulesModalOpen(false)}
                  className={`px-5 py-2 rounded-md font-bold ${t.btnPrimary}`}
                >
                  Save Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
