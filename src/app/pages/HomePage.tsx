import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, MessageCircle, Settings, Users, Globe, Database, Smartphone, Zap, CheckCircle } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&h=900&fit=crop&auto=format&q=90";
const NEBULA_IMG  = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&h=900&fit=crop&auto=format&q=90";
const MARS_IMG    = "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&h=900&fit=crop&auto=format&q=90";
const JUPITER_IMG = "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=900&h=900&fit=crop&auto=format&q=90";

const SERVICES_CYCLE = [
  "PROPERTY LEAD GENERATION",
  "WHATSAPP AUTOMATION",
  "AI SALES AGENTS",
  "PROPERTY WEBSITES",
  "WORKFLOW AUTOMATION",
];

const CAPABILITIES = [
  { icon: MessageCircle, title: "WhatsApp Workflows", desc: "Automate responses and capture lead data instantly on WhatsApp." },
  { icon: Database,      title: "CRM Integration",    desc: "Connect your leads seamlessly to your sales CRM." },
  { icon: Users,         title: "Lead Qualification", desc: "AI-driven questions to identify budget, location, and intent." },
  { icon: Globe,         title: "Property Funnels",   desc: "High-converting landing pages tailored for property sales." },
  { icon: Zap,           title: "Workflow Automation",desc: "Eliminate manual data entry and connect your entire tech stack." },
  { icon: Settings,      title: "Custom APIs",        desc: "Bespoke integrations connecting legacy systems with modern tools." },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function scaleGlowAlpha(rgba: string, factor: number): string {
  const m = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (!m) return rgba;
  return `rgba(${m[1]},${m[2]},${m[3]},${Math.min(parseFloat(m[4]) * factor, 1).toFixed(2)})`;
}

function WarpDivider() {
  return (
    <>
      <style>{`@keyframes warpSlide{from{transform:translateX(-100%)}to{transform:translateX(200%)}}`}</style>
      <div style={{ position: "relative", height: "2px", background: "#000", overflow: "hidden", zIndex: 10 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          animation: "warpSlide 3.5s linear infinite",
        }} />
      </div>
    </>
  );
}

const STARS_BG = [
  "radial-gradient(1.5px 1.5px at 11% 17%, rgba(255,255,255,0.90) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 43% 5%,    rgba(255,255,255,0.80) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 67% 29%,   rgba(255,255,255,0.75) 0%, transparent 100%)",
  "radial-gradient(2px 2px at 84% 11%,   rgba(255,255,255,0.60) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 27% 55%,   rgba(255,255,255,0.70) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 55% 70%,   rgba(255,255,255,0.65) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 7%  76%,   rgba(255,255,255,0.55) 0%, transparent 100%)",
  "radial-gradient(2px 2px at 77% 50%,   rgba(255,255,255,0.45) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 49% 42%,   rgba(255,255,255,0.70) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 21% 34%,   rgba(255,255,255,0.50) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 92% 64%,   rgba(255,255,255,0.60) 0%, transparent 100%)",
  "radial-gradient(1.5px 1.5px at 34% 86%, rgba(255,255,255,0.40) 0%, transparent 100%)",
].join(",");

function PlanetBg({
  src, overlay = "rgba(0,0,0,0.25)", sectionRef, side = "right", glow = "rgba(255,255,255,0.50)",
}: {
  src: string; overlay?: string; sectionRef: React.RefObject<HTMLElement | null>;
  side?: "right" | "left"; glow?: string;
}) {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scale   = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.55, 0.75, 1], [0.04, 0.50, 1.12, 1.12, 0.50, 0.04]);
  const y       = useTransform(scrollYProgress, [0, 0.5, 1], [isMobile ? 200 : 380, 0, isMobile ? -200 : -380]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const rotate  = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const SIZE = isMobile ? "clamp(260px, 88vw, 380px)" : "clamp(320px, 65vw, 680px)";
  const posStyle: React.CSSProperties = side === "right"
    ? { right: isMobile ? "-4%" : "-6%", top: "50%", transform: "translateY(-50%)" }
    : { left: isMobile ? "-4%" : "-6%", top: "50%", transform: "translateY(-50%)" };

  const hazeAt  = side === "right" ? "78% 50%" : "22% 50%";
  const glowDim = scaleGlowAlpha(glow, 0.30);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div style={{ position: "absolute", inset: 0, background: "#000" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: STARS_BG }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 65% 55% at ${hazeAt}, ${glowDim} 0%, transparent 62%)`,
      }} />
      <div style={{ position: "absolute", width: SIZE, height: SIZE, ...posStyle }}>
        {!isMobile && (
          <motion.div style={{
            position: "absolute", inset: "-20%", borderRadius: "50%",
            background: `radial-gradient(circle, transparent 40%, ${scaleGlowAlpha(glow, 0.55)} 58%, transparent 76%)`,
            scale, y, opacity, transformOrigin: "center center",
          }} />
        )}
        <motion.div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
          scale, y, opacity, rotate: isMobile ? 0 : rotate, transformOrigin: "center center",
          boxShadow: `0 0 48px 14px ${glow}`, willChange: "transform, opacity",
        }}>
          <img src={src} alt="" aria-hidden className="w-full h-full object-cover" />
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle at 33% 33%, transparent 28%, rgba(0,0,0,0.40) 62%, rgba(0,0,0,0.80) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle at 25% 22%, rgba(255,255,255,0.14) 0%, transparent 50%)",
          }} />
        </motion.div>
      </div>
      <div className="absolute inset-0" style={{
        background: side === "right"
          ? `linear-gradient(to right, ${overlay} 0%, ${overlay} 42%, rgba(0,0,0,0.05) 100%)`
          : `linear-gradient(to left, ${overlay} 0%, ${overlay} 42%, rgba(0,0,0,0.05) 100%)`,
      }} />
    </div>
  );
}

function AnimReveal({ children, className = "", delay = 0, direction = "up" as "up" | "left" | "right" }: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 40 : 0, x: direction === "left" ? -40 : direction === "right" ? 40 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? "visible" : "hidden"} variants={variants}>
      {children}
    </motion.div>
  );
}

function SplitText({ text, className = "", stagger = 0.03, delay = 0 }: { text: string; className?: string; stagger?: number; delay?: number }) {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          initial={{ opacity: 0, y: 80, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

function PlanetLabel({ name }: { name: string }) {
  return (
    <motion.div
      className="absolute top-8 right-8 z-20 px-3 py-1.5 border border-white/15 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <span className="text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{name}</span>
    </motion.div>
  );
}

export function HomePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [serviceIdx, setServiceIdx] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const systemRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const capabilitiesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => setServiceIdx((i) => (i + 1) % SERVICES_CYCLE.length), 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[680px] flex flex-col justify-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <img src={HERO_IMG} alt="AI automation systems" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.96) 100%)" }} />
        </motion.div>

        <div className="absolute inset-0 z-[1] pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        <motion.div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full" style={{ opacity: heroOpacity }}>
          <div className="mb-4 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={serviceIdx}
                initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/50 text-xs tracking-[0.35em] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                — {SERVICES_CYCLE[serviceIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="overflow-hidden mb-6">
            <h1
              className="leading-[0.88] uppercase select-none"
              style={{
                filter: "brightness(2.5) contrast(1.2)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(3.5rem, 11vw, 9rem)",
                backgroundImage: `url('${HERO_IMG}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <SplitText text="AI SYSTEMS FOR" delay={0.1} stagger={0.04} />
              <br />
              <SplitText text="REAL ESTATE." delay={0.35} stagger={0.03} />
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.9 }}>
              <p className="text-white/40 text-sm mb-1 tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Capture more property enquiries. Respond faster. Qualify automatically. Book more site visits.</p>
              <p className="text-white/70 text-base max-w-md leading-relaxed mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                BePrompter builds AI-powered lead generation, WhatsApp automation, CRM workflows, sales agents and property websites for real-estate businesses.
              </p>
            </motion.div>
            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1.0 }}>
              <motion.button
                onClick={() => onNavigate("contact")}
                className="group flex items-center gap-3 bg-white text-black text-xs font-black tracking-widest uppercase px-8 py-4 hover:bg-white/90 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                GET A FREE AI WORKFLOW AUDIT <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => onNavigate("services")}
                className="flex items-center gap-3 border border-white/30 text-white text-xs font-black tracking-widest uppercase px-8 py-4 hover:border-white hover:bg-white/5 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                VIEW OUR SERVICES
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.div className="w-px bg-white/40" animate={{ height: [0, 48, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Scroll</span>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="bg-white overflow-hidden py-3 border-y border-white/10">
        <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee 28s linear infinite", willChange: "transform" }}>
          {[...SERVICES_CYCLE, ...SERVICES_CYCLE, ...SERVICES_CYCLE].map((s, i) => (
            <span key={i} className="text-black text-xs font-black tracking-[0.25em] uppercase shrink-0 flex items-center gap-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {s} <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
            </span>
          ))}
        </div>
      </div>

      <WarpDivider />

      {/* ── REAL ESTATE AI SYSTEM — Mars ── */}
      <section id="real-estate-ai-system" ref={systemRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center">
        <PlanetBg src={MARS_IMG} overlay="rgba(0,0,0,0.28)" sectionRef={systemRef} side="right" glow="rgba(210,80,30,0.55)" />
        <PlanetLabel name="System Architecture" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>The Real Estate AI Lead System</p>
            <h2 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              FROM FIRST ENQUIRY TO<br />BOOKED SITE VISIT.
            </h2>
            <p className="text-white/50 text-base max-w-2xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Bring your lead generation, WhatsApp, CRM, AI qualification and sales workflow together into one connected system. We build the architecture so your team can focus on closing deals.
            </p>
          </AnimReveal>

          <AnimReveal delay={0.2}>
            {/* Visual Workflow Diagram */}
            <div className="relative p-8 md:p-12 border border-white/10 overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                {[
                  { label: "AD / WEBSITE", sub: "New Enquiry" },
                  { label: "AI RESPONSE", sub: "Instant Reply" },
                  { label: "QUALIFICATION", sub: "Budget & Location" },
                  { label: "CRM", sub: "Sync Details" },
                  { label: "SALES TEAM", sub: "Site Visit" },
                ].map((step, idx, arr) => (
                  <div key={idx} className="flex flex-col md:flex-row items-center w-full md:w-auto">
                    <div className="text-center p-4 border border-white/20 bg-black w-48 md:w-auto flex-shrink-0">
                      <p className="text-white font-black uppercase text-sm mb-1 tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.label}</p>
                      <p className="text-white/50 text-[10px] tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>{step.sub}</p>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex items-center justify-center py-4 md:py-0 md:px-6">
                        <ArrowRight className="hidden md:block text-white/30" />
                        <div className="md:hidden w-px h-6 bg-white/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate("contact")}
              className="group mt-12 flex items-center gap-3 border border-white/20 hover:border-white text-white text-xs font-black tracking-widest uppercase px-8 py-4 transition-colors hover:bg-white hover:text-black"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              BUILD MY LEAD SYSTEM <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimReveal>
        </div>
      </section>

      <WarpDivider />

      {/* ── PROCESS — Jupiter ── */}
      <section id="how-it-works" ref={processRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center border-t border-white/8">
        <PlanetBg src={JUPITER_IMG} overlay="rgba(0,0,0,0.28)" sectionRef={processRef} side="left" glow="rgba(180,110,45,0.55)" />
        <PlanetLabel name="Implementation" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>How We Work</p>
            <h2 className="text-white leading-[0.92]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              DEPLOYED IN<br />FOUR STEPS.
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/10" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            {[
              { n: "01", title: "Discover", desc: "We understand your current lead and sales workflow, identifying bottlenecks." },
              { n: "02", title: "Design",   desc: "We identify exactly where automation and AI can remove repetitive work and speed up response times." },
              { n: "03", title: "Build",    desc: "We build and integrate the system around your existing tools (CRM, WhatsApp, Website)." },
              { n: "04", title: "Optimize", desc: "We monitor, improve and refine the workflow after deployment to maximize conversions." },
            ].map((p, i) => (
              <motion.div
                key={p.n}
                className="p-8 border-b md:border-b-0 border-r border-white/10 last:border-r-0 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-white/10 font-black leading-none mb-4 group-hover:text-white/20 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "3.5rem" }}>{p.n}</p>
                <h3 className="text-white font-black mb-2 text-xl" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WarpDivider />

      {/* ── CAPABILITIES — Stars Bg ── */}
      <section ref={capabilitiesRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center border-t border-white/8">
        <div className="absolute inset-0 z-0" style={{ background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: STARS_BG }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-14">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Technical Foundations</p>
            <h2 className="text-white leading-[0.92]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900 }}>
              BUILT FOR REAL-WORLD<br />SALES WORKFLOWS
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAPABILITIES.map((w, i) => {
              const Icon = w.icon;
              return (
                <AnimReveal key={w.title} delay={i * 0.08}>
                  <div className="border border-white/8 p-8 hover:border-white/20 transition-colors h-full flex flex-col" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                    <Icon size={24} className="text-white/30 mb-6" />
                    <h3 className="text-white font-black mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{w.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{w.desc}</p>
                  </div>
                </AnimReveal>
              );
            })}
          </div>
        </div>
      </section>

      <WarpDivider />

      {/* ── CTA / CUSTOM PRICING ── */}
      <section ref={ctaRef} className="relative overflow-hidden py-40 lg:py-56 min-h-[70vh] flex items-center">
        <PlanetBg src={NEBULA_IMG} overlay="rgba(0,0,0,0.30)" sectionRef={ctaRef} side="right" glow="rgba(35,100,220,0.55)" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2">
            <AnimReveal>
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Pricing</p>
              <h2
                className="text-white leading-[0.92] mb-6"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900 }}
              >
                CUSTOM BUILT FOR YOUR BUSINESS
              </h2>
              <p className="text-white/60 text-lg max-w-md leading-relaxed mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                Every real-estate sales workflow is different. We scope the system around your lead volume, tools, sales process and goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => onNavigate("contact")}
                  className="group inline-flex items-center justify-center gap-4 bg-white text-black text-sm font-black tracking-widest uppercase px-10 py-5 hover:bg-white/90 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                >
                  GET A CUSTOM QUOTE <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </div>
            </AnimReveal>
          </div>
          
          <div className="lg:w-1/2 w-full">
             <AnimReveal delay={0.2}>
               <div className="border border-white/20 p-10 lg:p-14 text-center backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                 <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Not sure where to start?</p>
                 <h3 className="text-white font-black mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "2rem", textTransform: "uppercase" }}>Free 15-Minute AI Workflow Audit</h3>
                 <p className="text-white/60 text-sm leading-relaxed mb-8 mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                   Show us how you currently handle property enquiries. We'll identify where AI and automation can improve the workflow and increase conversions.
                 </p>
                 <motion.button
                  onClick={() => onNavigate("contact")}
                  className="border border-white/40 hover:border-white text-white text-xs font-black tracking-widest uppercase px-8 py-4 transition-colors w-full"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                 >
                   CLAIM FREE AUDIT
                 </motion.button>
               </div>
             </AnimReveal>
          </div>
        </div>
      </section>

    </div>
  );
}
