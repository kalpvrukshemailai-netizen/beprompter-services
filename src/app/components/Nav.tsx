import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { ChevronDown, ChevronLeft, User, Bot, Mic, Workflow, MessageSquare, Globe, Home, Heart, UtensilsCrossed, Factory, GraduationCap, Landmark, Scale, ShoppingBag, Megaphone, TrendingUp, Headphones, BookOpen, FileText, Mail, Users, Handshake, Database, Monitor } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { resolveUserRole, isAdminEmail } from "@/lib/supabase";

import beLogo from "@/imports/BE-logo.jpeg";

/* ══════════════════════════════════════════════════════════
   NAV CONFIGURATION — Automaly-style sections & sub-items
   ══════════════════════════════════════════════════════════ */

interface SubItem {
  label: string;
  page: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavSection {
  label: string;
  page: string;               // default click target
  highlight?: boolean;         // visually accent this item (e.g. Trust)
  sub?: SubItem[];
  mega?: {                    // two-column mega-menu (Use Cases)
    columns: {
      heading: string;
      items: SubItem[];
    }[];
    footerLabel?: string;
    footerPage?: string;
  };
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Services",
    page: "services",
    sub: [
      { label: "AI WhatsApp Bot",      page: "services:0", icon: MessageSquare },
      { label: "WhatsApp-to-CRM Engine", page: "services:1", icon: Database },
      { label: "Smart Landing Pages",  page: "services:2", icon: Monitor },
      { label: "Internal Brain AI",    page: "services:3", icon: Bot },
    ],
  },
  {
    label: "Use Cases",
    page: "industries",
    mega: {
      columns: [
        {
          heading: "By Industry",
          items: [
            { label: "Real Estate",    page: "real-estate",  icon: Home },
            { label: "Healthcare",     page: "industries:healthcare",   icon: Heart },
            { label: "Restaurants",    page: "industries:restaurants",   icon: UtensilsCrossed },
            { label: "Manufacturing",  page: "industries:manufacturing",   icon: Factory },
            { label: "Education",      page: "industries:education",   icon: GraduationCap },
            { label: "Legal",          page: "industries:legal",   icon: Scale },
          ],
        },
        {
          heading: "By Function",
          items: [
            { label: "Sales & Marketing",  page: "industries:agencies", icon: TrendingUp },
            { label: "Operations",         page: "industries:manufacturing", icon: Workflow },
            { label: "Customer Support",   page: "services:0", icon: Headphones },
          ],
        },
      ],
      footerLabel: "View all use cases",
      footerPage: "industries",
    },
  },
  {
    label: "Trust",
    page: "trust",
    highlight: true,
  },
  {
    label: "Pricing",
    page: "pricing",
  },
  {
    label: "Resources",
    page: "insights",
    sub: [
      { label: "Blog / Insights",   page: "insights",     icon: BookOpen },
      { label: "Case Studies",      page: "case-studies",  icon: FileText },
      { label: "Contact",           page: "contact",       icon: Mail },
    ],
  },
  {
    label: "Company",
    page: "about",
    sub: [
      { label: "About Us",   page: "about",           icon: Users },
      { label: "Partners",   page: "agency-partners",  icon: Handshake },
    ],
  },
];

/* Flatten all navigable sub-items for mobile */
const ALL_MOBILE_ITEMS: { label: string; page: string }[] = [];
NAV_SECTIONS.forEach((s) => {
  if (s.mega) {
    s.mega.columns.forEach((col) => col.items.forEach((it) => ALL_MOBILE_ITEMS.push(it)));
  } else if (s.sub) {
    s.sub.forEach((it) => ALL_MOBILE_ITEMS.push(it));
  }
});

const VISIBLE = 7;

/* ─── Regular arc item (main nav — mobile) ─── */
function ArcItem({ item, i, isActive, vp, onGo, onOpenSub }: {
  item: { label: string; page: string; hasSub?: boolean; highlight?: boolean; x: number; y: number };
  i: number; isActive: boolean;
  vp: { w: number; h: number };
  onGo: (page: string) => void;
  onOpenSub?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isHighlight = item.highlight;
  return (
    <div style={{ position: "absolute", left: item.x, top: item.y, transform: "translate(-50%, -50%)" }}>
      <motion.button
        onClick={() => item.hasSub && onOpenSub ? onOpenSub() : onGo(item.page)}
        className="flex flex-col items-center"
        initial={{ x: Math.max(60, vp.w - item.x + 20), opacity: 0, scale: 0.5 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: Math.max(60, vp.w - item.x + 20), opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.4 }} whileTap={{ scale: 0.88 }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      >
        <motion.div className="rounded-full border mb-2"
          animate={{
            width: isActive || hovered ? 16 : isHighlight ? 12 : 10,
            height: isActive || hovered ? 16 : isHighlight ? 12 : 10,
            backgroundColor: isActive ? "#fff" : hovered ? "#60c8ff" : isHighlight ? "rgba(96,200,255,0.3)" : "rgba(0,0,0,0)",
            borderColor: isActive ? "#fff" : hovered || isHighlight ? "#60c8ff" : "rgba(255,255,255,0.45)",
            boxShadow: hovered ? "0 0 14px 5px rgba(60,180,255,0.65)" : isHighlight ? "0 0 12px 3px rgba(96,200,255,0.35)" : "none",
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span animate={{ color: hovered ? "rgba(140,220,255,0.95)" : "rgba(255,255,255,0.25)" }} transition={{ duration: 0.2 }}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 3 }}>
          {String(i + 1).padStart(2, "0")}
        </motion.span>
        <motion.span
          animate={{ color: isActive ? "#fff" : isHighlight ? "#60c8ff" : hovered ? "#a8e4ff" : "rgba(255,255,255,0.55)" }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(0.95rem, 4.2vw, 1.3rem)", letterSpacing: "0.07em", textTransform: "uppercase", maxWidth: 104, textAlign: "center", lineHeight: 1.15,
            textShadow: hovered ? "0 0 22px rgba(60,180,255,0.90), 0 0 8px rgba(120,220,255,0.60)" : isHighlight ? "0 0 18px rgba(96,200,255,0.4)" : "none",
          }}>
          {item.label}
          {item.hasSub && <ChevronDown size={12} style={{ display: "inline", marginLeft: 4, opacity: 0.6 }} />}
        </motion.span>
      </motion.button>
    </div>
  );
}

/* ─── Single wheel item — tracks by label identity, slides to new arc position ─── */
function WheelItem({ x, y, label, page, slotIdx, renderCount, wheelDir, onGo }: {
  x: number; y: number; label: string; page: string; slotIdx: number;
  renderCount: number;
  wheelDir: 1 | -1;
  onGo: (page: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const opacity = renderCount <= 5 ? 1 
    : slotIdx === 0 || slotIdx === renderCount - 1 ? 0.4
    : slotIdx === 1 || slotIdx === renderCount - 2 ? 0.65 : 1;

  return (
    <motion.div
      style={{ position: "absolute", x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.6, left: x, top: y }}
      animate={{ opacity, scale: 1, left: x, top: y }}
      exit={{ opacity: 0, scale: 0.6, y: wheelDir === 1 ? "-120%" : "20%" }}
      transition={{
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
        left: { type: "spring", stiffness: 320, damping: 32 },
        top: { type: "spring", stiffness: 320, damping: 32 }
      }}
    >
      <motion.button
        onClick={() => onGo(page)}
        className="flex flex-col items-center"
        style={{ minWidth: 90 }}
        whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.88 }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      >
        <motion.div className="rounded-full border mb-2"
          animate={{ width: hovered ? 14 : 8, height: hovered ? 14 : 8, backgroundColor: hovered ? "#60c8ff" : "rgba(0,0,0,0)", borderColor: hovered ? "#60c8ff" : "rgba(255,255,255,0.35)", boxShadow: hovered ? "0 0 12px 4px rgba(60,180,255,0.60)" : "none" }}
          transition={{ duration: 0.18 }}
        />
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: "clamp(0.85rem, 3.8vw, 1.1rem)", letterSpacing: "0.07em",
          textTransform: "uppercase", textAlign: "center", lineHeight: 1.15,
          maxWidth: 96, display: "block",
          color: hovered ? "#a8e4ff" : "rgba(255,255,255,0.65)",
          textShadow: hovered ? "0 0 20px rgba(60,180,255,0.85), 0 0 6px rgba(120,220,255,0.55)" : "none",
        }}>
          {label}
        </span>
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Desktop dropdown panel (simple sub-items)
   ═══════════════════════════════════════════ */
function DropdownPanel({ items, currentPage, onGo }: {
  items: SubItem[];
  currentPage: string;
  onGo: (page: string) => void;
}) {
  return (
    <motion.div
      className="absolute top-full left-0 pt-1"
      style={{ minWidth: 220, zIndex: 60 }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className="border border-white/10 py-1.5" style={{ backgroundColor: "#0a0a0a", backdropFilter: "blur(20px)" }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => onGo(item.page)}
              className={`flex items-center gap-3 w-full text-left px-5 py-2.5 text-xs hover:text-white hover:bg-white/5 transition-colors font-bold tracking-wider uppercase ${currentPage === item.page ? "text-white" : "text-white/40"}`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {Icon && <Icon size={14} className="opacity-50" />}
              {item.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Desktop mega-menu (Use Cases — two columns)
   ═══════════════════════════════════════════ */
function MegaMenuPanel({ mega, currentPage, onGo }: {
  mega: NonNullable<NavSection["mega"]>;
  currentPage: string;
  onGo: (page: string) => void;
}) {
  return (
    <motion.div
      className="absolute top-full left-1/2 pt-1"
      style={{ minWidth: 480, zIndex: 60, transform: "translateX(-50%)" }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <div className="border border-white/10 p-6" style={{ backgroundColor: "#0a0a0a", backdropFilter: "blur(20px)" }}>
        <div className="flex gap-10">
          {mega.columns.map((col) => (
            <div key={col.heading} className="flex-1 min-w-[180px]">
              <span className="block text-[10px] font-black tracking-[0.22em] uppercase mb-3"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#60c8ff" }}>
                {col.heading}
              </span>
              <div className="flex flex-col gap-0.5">
                {col.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} onClick={() => onGo(item.page)}
                      className={`flex items-center gap-3 w-full text-left px-3 py-2 text-xs hover:text-white hover:bg-white/5 transition-colors font-bold tracking-wider uppercase rounded ${currentPage === item.page ? "text-white" : "text-white/40"}`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {Icon && <Icon size={14} className="opacity-50" />}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {mega.footerLabel && (
          <div className="mt-4 pt-3 border-t border-white/8">
            <button onClick={() => onGo(mega.footerPage ?? "industries")}
              className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/40 hover:text-white transition-colors px-3 py-1.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {mega.footerLabel}
              <span className="text-[10px]">→</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════
   Main Nav Component
   ═══════════════════════ */

interface NavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: SupabaseUser | null;
  userRole?: string | null;
}

export function Nav({ currentPage, onNavigate, user, userRole }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [wheelDir, setWheelDir] = useState<1 | -1>(1);
  const [vp, setVp] = useState({ w: 390, h: 844 });
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);

  const dragStartY = useRef<number | null>(null);
  const DRAG_THRESHOLD = 35;
  const menuHistoryRef = useRef(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Back-button / swipe-back integration
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      history.pushState({ bpMenu: true }, "");
      menuHistoryRef.current = true;

      const onPop = () => {
        menuHistoryRef.current = false;
        setMenuOpen(false);
        setSubOpen(false);
        setActiveMobileSection(null);
        setOffset(0);
      };
      window.addEventListener("popstate", onPop, { once: true });
      return () => {
        window.removeEventListener("popstate", onPop);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      if (menuHistoryRef.current) {
        menuHistoryRef.current = false;
        history.back();
      }
    }
  }, [menuOpen]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    if (!openDesktopDropdown) return;
    const close = () => setOpenDesktopDropdown(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openDesktopDropdown]);

  /* ── Get sub-items for the active mobile section ── */
  const activeSectionData = NAV_SECTIONS.find((s) => s.label === activeMobileSection);
  const mobileSubItems: { label: string; page: string }[] = [];
  if (activeSectionData?.mega) {
    activeSectionData.mega.columns.forEach((col) => col.items.forEach((it) => mobileSubItems.push(it)));
  } else if (activeSectionData?.sub) {
    activeSectionData.sub.forEach((it) => mobileSubItems.push(it));
  }
  const total = mobileSubItems.length;

  const go = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
    setSubOpen(false);
    setActiveMobileSection(null);
    setOffset(0);
    setOpenDesktopDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMobileSub = (sectionLabel: string) => {
    setActiveMobileSection(sectionLabel);
    setSubOpen(true);
    setOffset(0);
  };
  const closeSub = () => { setSubOpen(false); setActiveMobileSection(null); setOffset(0); };

  const rotate = (dir: 1 | -1) => {
    if (total === 0) return;
    setWheelDir(dir);
    setOffset((prev) => (prev + dir + total) % total);
  };

  /* ── Desktop dropdown handlers ── */
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDesktopDropdown(label);
  };
  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDesktopDropdown(null), 150);
  };

  /* ── Arc geometry for mobile ── */
  const cx = vp.w + 30;
  const cy = vp.h * 0.42;
  const radius = Math.min(vp.w * 0.68, 280);
  const START_ANGLE = 130;
  const END_ANGLE = 228;

  const renderCount = Math.min(VISIBLE, Math.max(1, total));
  const arcPositions = Array.from({ length: renderCount }, (_, i) => {
    const t = renderCount === 1 ? 0.5 : i / (renderCount - 1);
    const deg = START_ANGLE + (END_ANGLE - START_ANGLE) * t;
    const rad = (deg * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  });

  const mobileNavItems = NAV_SECTIONS.map((s, i) => {
    const t = i / (NAV_SECTIONS.length - 1);
    const deg = START_ANGLE + (END_ANGLE - START_ANGLE) * t;
    const rad = (deg * Math.PI) / 180;
    return { ...s, hasSub: !!(s.sub || s.mega), x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  });

  const scrollCooldown = useRef(false);
  const onWheel = (e: React.WheelEvent) => {
    if (!subOpen || scrollCooldown.current) return;
    rotate(e.deltaY > 0 ? 1 : -1);
    scrollCooldown.current = true;
    setTimeout(() => { scrollCooldown.current = false; }, 700);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    if (subOpen) dragStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!subOpen || dragStartY.current === null) return;
    const dy = dragStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) > DRAG_THRESHOLD) rotate(dy > 0 ? 1 : -1);
    dragStartY.current = null;
  };

  /* Helper: check if a section or its children is active */
  const isSectionActive = (section: NavSection): boolean => {
    if (currentPage === section.page) return true;
    if (currentPage === "pricing" && section.page === "pricing") return true;
    if (currentPage.startsWith("services") && section.page === "services") return true;
    if (currentPage.startsWith("industries") && section.page === "industries") return true;
    if (section.sub?.some((s) => currentPage === s.page || (currentPage.startsWith("services") && s.page.startsWith("services")))) return true;
    if (section.mega) {
      for (const col of section.mega.columns) {
        if (col.items.some((it) => currentPage === it.page || (currentPage.startsWith("industries") && it.page.startsWith("industries")))) return true;
      }
    }
    return false;
  };

  return (
    <>
      {/* ─── HEADER ─── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backgroundColor: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => go("home")} className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity">
            <img src={beLogo} alt="BePrompter" className="h-8 w-8 object-cover" style={{ borderRadius: 0 }} />
            <span className="text-white font-black tracking-widest text-xs uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.22em" }}>BePrompter</span>
          </button>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden lg:flex items-center">
            {NAV_SECTIONS.map((section) => {
              const active = isSectionActive(section);
              const hasDropdown = !!(section.sub || section.mega);
              const isOpen = openDesktopDropdown === section.label;

              return (
                <div key={section.label} className="relative"
                  onMouseEnter={() => hasDropdown && handleDropdownEnter(section.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasDropdown) {
                        setOpenDesktopDropdown(isOpen ? null : section.label);
                      } else {
                        go(section.page);
                      }
                    }}
                    className={`px-4 py-5 text-xs font-bold tracking-widest uppercase flex items-center gap-1 transition-colors border-b-2 ${
                      section.highlight
                        ? active
                          ? "border-[#60c8ff]"
                          : "border-transparent hover:border-[#60c8ff]/50"
                        : active
                          ? "text-white border-white"
                          : "text-white/40 hover:text-white border-transparent"
                    }`}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      ...(section.highlight ? {
                        color: active ? "#60c8ff" : undefined,
                        textShadow: "0 0 20px rgba(96,200,255,0.4)",
                        background: "linear-gradient(180deg, transparent 0%, rgba(96,200,255,0.04) 100%)",
                      } : {}),
                    }}
                  >
                    {section.label}
                    {hasDropdown && (
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "inline-flex" }}
                      >
                        <ChevronDown size={9} className="opacity-50" />
                      </motion.span>
                    )}
                  </button>

                  {/* Dropdown / Mega-menu */}
                  <AnimatePresence>
                    {isOpen && section.sub && (
                      <DropdownPanel items={section.sub} currentPage={currentPage} onGo={go} />
                    )}
                    {isOpen && section.mega && (
                      <MegaMenuPanel mega={section.mega} currentPage={currentPage} onGo={go} />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* ─── Desktop Right Actions ─── */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <motion.button
                onClick={() => {
                  const role = resolveUserRole(user.email, userRole, user.user_metadata?.role);
                  if (role === "admin" || isAdminEmail(user.email)) go("admin-dashboard");
                  else if (role === "developer") go("developer-dashboard");
                  else if (role === "sales") go("sales-dashboard");
                  else go("client-dashboard");
                }}
                className="flex items-center gap-2 border border-white/15 hover:border-white/40 px-3 py-2 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={10} className="text-white/60" />
                </div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Dashboard</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => go("auth")}
                className="text-white/40 hover:text-white text-xs font-black tracking-widest uppercase px-3 py-2.5 transition-colors border border-white/10 hover:border-white/30"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                Sign In
              </motion.button>
            )}
            <motion.button onClick={() => go("lets-talk")}
              className="bg-white text-black text-xs font-black tracking-widest uppercase px-5 py-2.5 hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>{"Let's Talk"}</motion.button>
          </div>

          {/* ─── Mobile Hamburger ─── */}
          <button className="lg:hidden relative z-[60] w-8 h-6 flex flex-col justify-between items-end"
            onClick={() => { setMenuOpen(!menuOpen); setSubOpen(false); setActiveMobileSection(null); setOffset(0); }} aria-label="Toggle menu">
            <motion.span className="block h-px bg-white w-full" animate={menuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
            <motion.span className="block h-px bg-white" style={{ width: "66%" }} animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.15 }} />
            <motion.span className="block h-px bg-white" style={{ width: "45%" }} animate={menuOpen ? { width: "100%", rotate: -45, y: -10 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
          </button>
        </div>
      </div>

      {/* ─── SCI-FI ARC MENU (Mobile) ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 overflow-hidden lg:hidden select-none"
            style={{ backgroundColor: "rgba(0,0,0,0.95)", backdropFilter: "blur(18px)", cursor: subOpen ? "ns-resize" : "default" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onWheel={onWheel}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          >
            {/* HUD rings */}
            {[0.38, 0.58, 0.80, 1.0].map((ratio, i) => {
              const r = radius * ratio;
              return (
                <motion.div key={i} className="absolute rounded-full border pointer-events-none"
                  style={{ width: r * 2, height: r * 2, left: cx - r, top: cy - r, borderColor: `rgba(255,255,255,${0.10 - i * 0.02})` }}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}

            {/* Radar sweep */}
            <motion.div className="absolute pointer-events-none origin-left"
              style={{ left: cx, top: cy, width: radius, height: 1.5, background: "linear-gradient(90deg, rgba(255,255,255,0.7), transparent)" }}
              initial={{ rotate: START_ANGLE, opacity: 1 }} animate={{ rotate: END_ANGLE, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Origin dot */}
            <motion.div className="absolute rounded-full bg-white pointer-events-none"
              style={{ left: cx - 5, top: cy - 5, width: 10, height: 10 }}
              animate={{ scale: [1, 2, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Spoke lines */}
            <svg className="absolute inset-0 pointer-events-none" width={vp.w} height={vp.h} style={{ overflow: "visible" }}>
              {(subOpen ? arcPositions : mobileNavItems).map((pos, i) => (
                <motion.line key={i} x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                  stroke="rgba(255,255,255,0.08)" strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.07 + 0.15 }}
                />
              ))}
            </svg>

            {/* ── MAIN NAV (5 sections) ── */}
            <AnimatePresence>
              {!subOpen && mobileNavItems.map((item, i) => (
                <ArcItem key={item.label} item={item} i={i}
                  isActive={isSectionActive(item)}
                  vp={vp} onGo={go}
                  onOpenSub={item.hasSub ? () => openMobileSub(item.label) : undefined}
                />
              ))}
            </AnimatePresence>

            {/* ── SUB WHEEL — items keyed by label so they slide between positions ── */}
            <AnimatePresence>
              {subOpen && total > 0 && arcPositions.map((pos, slotIdx) => {
                const item = mobileSubItems[(offset + slotIdx) % total];
                return (
                  <WheelItem
                    key={item.label}
                    slotIdx={slotIdx}
                    renderCount={renderCount}
                    x={pos.x} y={pos.y}
                    label={item.label}
                    page={item.page}
                    wheelDir={wheelDir}
                    onGo={go}
                  />
                );
              })}
            </AnimatePresence>

            {/* Wheel controls — shown in sub-menu */}
            <AnimatePresence>
              {subOpen && (
                <motion.div className="absolute" style={{ top: 76, left: 18, right: 18 }}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex items-center justify-between">
                    <button onClick={closeSub}
                      className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                      <ChevronLeft size={12} /> Menu
                    </button>
                    <span className="text-white/20 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em" }}>
                      {activeMobileSection}
                    </span>
                  </div>

                  {/* Scroll hint */}
                  <motion.p
                    className="text-white/15 text-[9px] tracking-widest uppercase mt-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    scroll or swipe to rotate
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTAs */}
            <div className="absolute flex flex-col items-center gap-3" style={{ bottom: 48, left: "50%", transform: "translateX(-50%)" }}>
              <motion.button onClick={() => go("lets-talk")}
                className="bg-white text-black text-xs font-black tracking-widest uppercase px-7 py-3"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>{"Let's Talk"}</motion.button>
              <motion.button onClick={() => {
                if (user) {
                  const role = resolveUserRole(user.email, userRole, user.user_metadata?.role);
                  if (role === "admin" || isAdminEmail(user.email)) go("admin-dashboard");
                  else if (role === "developer") go("developer-dashboard");
                  else if (role === "sales") go("sales-dashboard");
                  else go("client-dashboard");
                } else go("auth");
              }}
                className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.65 }}>
                {user ? "Dashboard" : "Sign In"}
              </motion.button>
            </div>

            <motion.p className="absolute text-white/10 text-[9px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", bottom: 20, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
              BePrompter Technology
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
