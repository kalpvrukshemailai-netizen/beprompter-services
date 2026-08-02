import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { ChevronDown, ChevronLeft, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import beLogo from "@/imports/BE-logo.jpeg";

const SERVICE_SUB = [
  { label: "AI Agents",         idx: 0 },
  { label: "AI Voice Agents",   idx: 1 },
  { label: "Workflow Auto",     idx: 2 },
  { label: "AI Integration",    idx: 3 },
  { label: "WhatsApp & CRM",    idx: 4 },
  { label: "Website Dev",       idx: 5 },
  { label: "Mobile Apps",       idx: 6 },
  { label: "Business Software", idx: 7 },
  { label: "E-Commerce",        idx: 8 },
  { label: "Digital Marketing", idx: 9 },
  { label: "AI Video & UGC",    idx: 10 },
];

const NAV_ITEMS = [
  {
    label: "Services", page: "services",
    sub: SERVICE_SUB.map((s) => `${s.label}|services:${s.idx}`),
  },
  {
    label: "Work", page: "casestudies",
    sub: ["Case Studies|casestudies", "Industries|industries"],
  },
  { label: "Agency Partners", page: "partner" },
  {
    label: "Company", page: "about",
    sub: ["About|about", "Insights|insights"],
  },
];

const VISIBLE = 7;

/* ─── Regular arc item (main nav) ─── */
function ArcItem({ item, i, isActive, vp, onGo, onOpenSub }: {
  item: { label: string; page: string; sub?: string[]; x: number; y: number };
  i: number; isActive: boolean;
  vp: { w: number; h: number };
  onGo: (page: string) => void;
  onOpenSub?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "absolute", left: item.x, top: item.y, transform: "translate(-50%, -50%)" }}>
      <motion.button
        onClick={() => item.sub && onOpenSub ? onOpenSub() : onGo(item.page)}
        className="flex flex-col items-center"
        initial={{ x: Math.max(60, vp.w - item.x + 20), opacity: 0, scale: 0.5 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: Math.max(60, vp.w - item.x + 20), opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.4 }} whileTap={{ scale: 0.88 }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      >
        <motion.div className="rounded-full border mb-2"
          animate={{ width: isActive || hovered ? 16 : 10, height: isActive || hovered ? 16 : 10, backgroundColor: isActive ? "#fff" : hovered ? "#60c8ff" : "rgba(0,0,0,0)", borderColor: isActive ? "#fff" : hovered ? "#60c8ff" : "rgba(255,255,255,0.45)", boxShadow: hovered ? "0 0 14px 5px rgba(60,180,255,0.65)" : "none" }}
          transition={{ duration: 0.2 }}
        />
        <motion.span animate={{ color: hovered ? "rgba(140,220,255,0.95)" : "rgba(255,255,255,0.25)" }} transition={{ duration: 0.2 }}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 3 }}>
          {String(i + 1).padStart(2, "0")}
        </motion.span>
        <motion.span animate={{ color: isActive ? "#fff" : hovered ? "#a8e4ff" : "rgba(255,255,255,0.55)" }} transition={{ duration: 0.2 }}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(0.95rem, 4.2vw, 1.3rem)", letterSpacing: "0.07em", textTransform: "uppercase", maxWidth: 104, textAlign: "center", lineHeight: 1.15, textShadow: hovered ? "0 0 22px rgba(60,180,255,0.90), 0 0 8px rgba(120,220,255,0.60)" : "none" }}>
          {item.label}
          {item.sub && <ChevronDown size={12} style={{ display: "inline", marginLeft: 4, opacity: 0.6 }} />}
        </motion.span>
      </motion.button>
    </div>
  );
}

/* ─── Single wheel item — tracks by label identity, slides to new arc position ─── */
function WheelItem({ x, y, label, page, slotIdx, wheelDir, onGo }: {
  x: number; y: number; label: string; page: string; slotIdx: number;
  wheelDir: 1 | -1;
  onGo: (page: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  // Edge slots slightly faded — depth illusion of a curved drum
  const opacity = slotIdx === 0 || slotIdx === VISIBLE - 1 ? 0.4
    : slotIdx === 1 || slotIdx === VISIBLE - 2 ? 0.65 : 1;

  return (
    <motion.div
      layoutId={`wheel-${label}`}
      style={{ position: "absolute", left: x, top: y, x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6, y: wheelDir === 1 ? "-120%" : "20%" }}
      transition={{
        layout: { type: "spring", stiffness: 320, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
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

interface NavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: SupabaseUser | null;
}

export function Nav({ currentPage, onNavigate, user }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  // offset = index of item shown at slot 0 (top of arc)
  const [offset, setOffset] = useState(0);
  // direction: +1 means wheel rotated forward (items exit upward), -1 means backward
  const [wheelDir, setWheelDir] = useState<1 | -1>(1);
  const [vp, setVp] = useState({ w: 390, h: 844 });

  // Live drag tracking
  const dragStartY = useRef<number | null>(null);
  const DRAG_THRESHOLD = 35; // px to count as a swipe

  // Track whether we pushed a history entry for the menu, so we can pop it correctly
  const menuHistoryRef = useRef(false);

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

  // ── Back-button / swipe-back integration ──────────────────────────────────
  // Push a history entry when the mobile menu opens so that the browser back
  // button (or iOS/Android swipe-back gesture) closes the menu instead of
  // navigating away from the site. The sub-menu (services wheel) intentionally
  // does NOT push its own entry — back always closes the whole menu; the
  // "← Menu" button is used to go from sub → main nav.
  useEffect(() => {
    if (menuOpen) {
      history.pushState({ bpMenu: true }, "");
      menuHistoryRef.current = true;

      const onPop = () => {
        menuHistoryRef.current = false;
        setMenuOpen(false);
        setSubOpen(false);
        setOffset(0);
      };
      window.addEventListener("popstate", onPop, { once: true });
      return () => window.removeEventListener("popstate", onPop);
    } else {
      // Menu was closed programmatically (nav item tapped, CTA tapped, etc.)
      // — pop the history entry we pushed so the back stack stays clean.
      if (menuHistoryRef.current) {
        menuHistoryRef.current = false;
        history.back();
      }
    }
  }, [menuOpen]);

  const servicesItem = NAV_ITEMS.find((it) => it.label === "Services");
  const allSubItems = (servicesItem?.sub ?? []).map((s) => {
    const [label, page] = s.split("|");
    return { label, page: page ?? "services" };
  });
  const total = allSubItems.length;

  const go = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
    setSubOpen(false);
    setOffset(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSub = () => { setSubOpen(true); setOffset(0); };
  const closeSub = () => { setSubOpen(false); setOffset(0); };

  // Rotate wheel by +1 or -1
  const rotate = (dir: 1 | -1) => {
    setWheelDir(dir);
    setOffset((prev) => (prev + dir + total) % total);
  };

  const cx = vp.w + 30;
  const cy = vp.h * 0.42;
  const radius = Math.min(vp.w * 0.68, 280);
  const START_ANGLE = 130;
  const END_ANGLE = 228;

  const arcPositions = Array.from({ length: VISIBLE }, (_, i) => {
    const t = i / (VISIBLE - 1);
    const deg = START_ANGLE + (END_ANGLE - START_ANGLE) * t;
    const rad = (deg * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  });

  const arcNavItems = NAV_ITEMS.map((item, i) => {
    const t = i / (NAV_ITEMS.length - 1);
    const deg = START_ANGLE + (END_ANGLE - START_ANGLE) * t;
    const rad = (deg * Math.PI) / 180;
    return { ...item, x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  });

  // Throttle scroll so one flick = one step
  const scrollCooldown = useRef(false);

  const onWheel = (e: React.WheelEvent) => {
    if (!subOpen || scrollCooldown.current) return;
    rotate(e.deltaY > 0 ? 1 : -1);
    scrollCooldown.current = true;
    setTimeout(() => { scrollCooldown.current = false; }, 400);
  };

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (subOpen) dragStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!subOpen || dragStartY.current === null) return;
    const dy = dragStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) > DRAG_THRESHOLD) rotate(dy > 0 ? 1 : -1);
    dragStartY.current = null;
  };

  return (
    <>
      {/* ─── HEADER ─── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backgroundColor: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <button onClick={() => go("home")} className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity">
            <img src={beLogo} alt="BePrompter" className="h-8 w-8 object-cover" style={{ borderRadius: 0 }} />
            <span className="text-white font-black tracking-widest text-xs uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.22em" }}>BePrompter</span>
          </button>

          <nav className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item) => {
              // Sub-items can be "Label|page" (for grouped pages) or plain "Label" (Services wheel)
              const subPages = item.sub?.map((s) => s.includes("|") ? s.split("|") as [string, string] : [s, item.page] as [string, string]);
              const isActive = currentPage === item.page || (subPages?.some(([, p]) => currentPage === p) ?? false);
              return (
                <div key={item.label} className="relative group">
                  <button onClick={() => go(item.page)}
                    className={`px-4 py-5 text-xs font-bold tracking-widest uppercase flex items-center gap-1 transition-colors border-b-2 ${isActive ? "text-white border-white" : "text-white/40 hover:text-white border-transparent"}`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {item.label}
                    {item.sub && <ChevronDown size={9} className="opacity-50" />}
                  </button>
                  {subPages && (
                    <div className="absolute top-full left-0 hidden group-hover:block" style={{ minWidth: 180 }}>
                      <div className="border border-white/10 py-1" style={{ backgroundColor: "#0a0a0a" }}>
                        {subPages.map(([label, page]) => (
                          <button key={label} onClick={() => go(page)}
                            className={`block w-full text-left px-5 py-2.5 text-xs hover:text-white hover:bg-white/5 transition-colors font-bold tracking-wider uppercase ${currentPage === page ? "text-white" : "text-white/40"}`}
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <motion.button
                onClick={() => {
                  // Determine dashboard from user metadata role
                  const role = user.user_metadata?.role;
                  go(role === "partner" ? "partner-dashboard" : "client-dashboard");
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
            <motion.button onClick={() => go("contact")}
              className="bg-white text-black text-xs font-black tracking-widest uppercase px-5 py-2.5 hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>{"Let's Talk"}</motion.button>
          </div>

          <button className="lg:hidden relative z-[60] w-8 h-6 flex flex-col justify-between items-end"
            onClick={() => { setMenuOpen(!menuOpen); setSubOpen(false); setOffset(0); }} aria-label="Toggle menu">
            <motion.span className="block h-px bg-white w-full" animate={menuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
            <motion.span className="block h-px bg-white" style={{ width: "66%" }} animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.15 }} />
            <motion.span className="block h-px bg-white" style={{ width: "45%" }} animate={menuOpen ? { width: "100%", rotate: -45, y: -10 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
          </button>
        </div>
      </div>

      {/* ─── SCI-FI ARC MENU ─── */}
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
              {(subOpen ? arcPositions : arcNavItems).map((pos, i) => (
                <motion.line key={i} x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                  stroke="rgba(255,255,255,0.08)" strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.07 + 0.15 }}
                />
              ))}
            </svg>

            {/* ── MAIN NAV ── */}
            <AnimatePresence>
              {!subOpen && arcNavItems.map((item, i) => (
                <ArcItem key={item.label} item={item} i={i}
                  isActive={currentPage === item.page}
                  vp={vp} onGo={go}
                  onOpenSub={item.label === "Services" ? openSub : undefined}
                />
              ))}
            </AnimatePresence>

            {/* ── SERVICES WHEEL — items keyed by label so they slide between positions ── */}
            <LayoutGroup>
              <AnimatePresence>
                {subOpen && arcPositions.map((pos, slotIdx) => {
                  const item = allSubItems[(offset + slotIdx) % total];
                  return (
                    <WheelItem
                      key={item.label}
                      slotIdx={slotIdx}
                      x={pos.x} y={pos.y}
                      label={item.label}
                      page={item.page}
                      wheelDir={wheelDir}
                      onGo={go}
                    />
                  );
                })}
              </AnimatePresence>
            </LayoutGroup>

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
                      Services
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
              <motion.button onClick={() => go("contact")}
                className="bg-white text-black text-xs font-black tracking-widest uppercase px-7 py-3"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>{"Let's Talk"}</motion.button>
              <motion.button onClick={() => go(user ? (user.user_metadata?.role === "partner" ? "partner-dashboard" : "client-dashboard") : "auth")}
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
