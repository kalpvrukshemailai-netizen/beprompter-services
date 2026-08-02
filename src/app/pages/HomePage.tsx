import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Bot, Mic, Zap, Settings2, MessageSquare, Database, Cpu, Plug, Monitor, Smartphone, Shield, TrendingUp, Users, Lock, type LucideIcon } from "lucide-react";


const HERO_IMG = "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&h=900&fit=crop&auto=format&q=90";

// Square crops for planet spheres
const MARS_IMG    = "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&h=900&fit=crop&auto=format&q=90";
const SATURN_IMG  = "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=900&h=900&fit=crop&auto=format&q=90";
const JUPITER_IMG = "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=900&h=900&fit=crop&auto=format&q=90";
const NEBULA_IMG  = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&h=900&fit=crop&auto=format&q=90";

const SERVICES_CYCLE = [
  "AI CHATBOTS",
  "AI VOICE AGENTS",
  "WORKFLOW AUTOMATION",
  "PROCESS AUTOMATION",
  "WHATSAPP AUTOMATION",
  "CRM AUTOMATION",
  "CUSTOM AI AGENTS",
  "AI TOOL INTEGRATION",
  "CUSTOM SOFTWARE",
  "WEB APPLICATIONS",
  "MOBILE APPLICATIONS",
];

const SERVICES_GRID: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Bot,          title: "AI Chatbots",           desc: "Intelligent chatbots trained on your data, running 24/7 to handle support and sales." },
  { icon: Mic,          title: "AI Voice Agents",        desc: "Conversational voice AI for inbound calls, bookings, and customer queries." },
  { icon: Zap,          title: "Workflow Automation",    desc: "End-to-end automation of repetitive tasks across your tools and systems." },
  { icon: Settings2,    title: "Process Automation",     desc: "Digitise and automate business processes to cut costs and remove manual errors." },
  { icon: MessageSquare,title: "WhatsApp Automation",    desc: "Automated WhatsApp flows for orders, support, reminders, and lead capture." },
  { icon: Database,     title: "CRM Automation",         desc: "Smart CRM pipelines with AI lead scoring, follow-ups, and deal tracking." },
  { icon: Cpu,          title: "Custom AI Agents",       desc: "Purpose-built AI agents that reason, plan, and execute multi-step workflows." },
  { icon: Plug,         title: "AI Tool Integration",    desc: "Connect OpenAI, Claude, Gemini, and n8n into your existing infrastructure." },
  { icon: Monitor,      title: "Custom Software",        desc: "Bespoke web and internal tools engineered for your specific operations." },
  { icon: Smartphone,   title: "Mobile Applications",   desc: "Cross-platform iOS and Android apps built with AI features built in." },
];

const WHY_US = [
  { icon: Cpu,      title: "AI-First Company",           desc: "We lead with AI — every engagement starts with automation and intelligence, not design templates." },
  { icon: TrendingUp,title: "Business-Focused Solutions", desc: "We measure success in business outcomes: time saved, costs reduced, revenue generated." },
  { icon: Settings2, title: "Custom-Built Systems",       desc: "No off-the-shelf tools. Every system is engineered from the ground up for your workflow." },
  { icon: Lock,      title: "Enterprise-Grade Security",  desc: "SOC 2 aligned practices, data encryption, and secure API handling on every project." },
  { icon: Users,     title: "Dedicated Support",          desc: "A dedicated technical team assigned to your account from kickoff through post-launch." },
  { icon: Shield,    title: "Scalable Architecture",      desc: "Systems designed to scale from hundreds to millions of interactions without rebuilding." },
];

const TECHNOLOGIES = [
  { name: "OpenAI",          cat: "AI" },
  { name: "Anthropic Claude", cat: "AI" },
  { name: "Google Gemini",   cat: "AI" },
  { name: "n8n",             cat: "Automation" },
  { name: "Supabase",        cat: "Database" },
  { name: "Firebase",        cat: "Database" },
  { name: "Node.js",         cat: "Backend" },
  { name: "React",           cat: "Frontend" },
  { name: "Next.js",         cat: "Frontend" },
  { name: "Python",          cat: "Backend" },
  { name: "Docker",          cat: "Infra" },
  { name: "Cloudflare",      cat: "Infra" },
  { name: "WhatsApp API",    cat: "Messaging" },
  { name: "Vector Databases",cat: "AI" },
];

/* Scales rgba opacity by a factor */
function scaleGlowAlpha(rgba: string, factor: number): string {
  const m = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (!m) return rgba;
  return `rgba(${m[1]},${m[2]},${m[3]},${Math.min(parseFloat(m[4]) * factor, 1).toFixed(2)})`;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
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
  const servicesRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);

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
                fontSize: "clamp(4.5rem, 13vw, 11rem)",
                backgroundImage: `url('${HERO_IMG}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <SplitText text="AI AGENTS" delay={0.1} stagger={0.04} />
              <br />
              <SplitText text="& AUTOMATION" delay={0.35} stagger={0.03} />
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.9 }}>
              <p className="text-white/40 text-sm mb-1 tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>BePrompter Technology</p>
              <p className="text-white/70 text-base max-w-md leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                We design and build AI agents, workflow automation, and custom software that reduce manual work, improve customer experience, and help businesses scale.
              </p>
            </motion.div>
            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1.0 }}>
              <motion.button
                onClick={() => onNavigate("contact")}
                className="group flex items-center gap-3 bg-white text-black text-xs font-black tracking-widest uppercase px-8 py-4 hover:bg-white/90 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                BOOK FREE AI STRATEGY CALL <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => onNavigate("casestudies")}
                className="flex items-center gap-3 border border-white/30 text-white text-xs font-black tracking-widest uppercase px-8 py-4 hover:border-white hover:bg-white/5 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                VIEW OUR WORK
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
          {[...SERVICES_CYCLE, ...SERVICES_CYCLE].map((s, i) => (
            <span key={i} className="text-black text-xs font-black tracking-[0.25em] uppercase shrink-0 flex items-center gap-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {s} <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── POSITIONING STRIP ── */}
      <section style={{ backgroundColor: "#0a0a0a" }} className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-white/40 text-xs tracking-[0.25em] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            An AI Engineering Partner that builds
          </p>
          <div className="flex flex-wrap gap-3">
            {["AI Agents", "Workflow Automation", "Custom AI Systems", "Business Software", "WhatsApp Bots", "Voice AI"].map((tag) => (
              <span key={tag} className="border border-white/15 text-white/60 text-xs px-4 py-2 font-semibold tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <WarpDivider />

      {/* ── SERVICES — Mars ── */}
      <section ref={servicesRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center">
        <PlanetBg src={MARS_IMG} overlay="rgba(0,0,0,0.28)" sectionRef={servicesRef} side="right" glow="rgba(210,80,30,0.55)" />
        <PlanetLabel name="Mars" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>What We Build</p>
            <h2 className="text-white leading-[0.92]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              AI SYSTEMS THAT<br />WORK WHILE YOU SLEEP
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            {SERVICES_GRID.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  className="relative overflow-hidden p-6 group cursor-pointer"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                  onClick={() => onNavigate("services")}
                >
                  <motion.div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-black" />
                  </motion.div>
                  <Icon size={16} className="text-white/30 group-hover:text-black mb-3 transition-colors" />
                  <h3 className="text-white group-hover:text-black font-black mb-2 leading-tight transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.95rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {s.title}
                  </h3>
                  <p className="text-white/40 group-hover:text-black/60 text-xs leading-relaxed transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <AnimReveal className="mt-10" delay={0.2}>
            <button
              onClick={() => onNavigate("services")}
              className="group flex items-center gap-3 border border-white/20 hover:border-white text-white text-xs font-black tracking-widest uppercase px-8 py-4 transition-colors hover:bg-white hover:text-black"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              VIEW ALL SERVICES <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimReveal>
        </div>
      </section>

      <WarpDivider />

      {/* ── CASE STUDIES PLACEHOLDER — Saturn ── */}
      <section ref={workRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center">
        <PlanetBg src={SATURN_IMG} overlay="rgba(0,0,0,0.26)" sectionRef={workRef} side="left" glow="rgba(200,165,70,0.55)" />
        <PlanetLabel name="Saturn" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-14">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Case Studies</p>
            <h2 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              REAL RESULTS.<br />COMING SOON.
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              We are actively deploying AI systems for our early clients. Case studies will be published once results are verified and clients have approved disclosure.
            </p>
            <p className="text-white/25 text-sm mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              We believe in publishing only genuine, verified results — no inflated numbers.
            </p>
          </AnimReveal>

          <AnimReveal delay={0.15}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              {["Healthcare", "Real Estate", "E-Commerce"].map((ind, i) => (
                <div key={ind} className="p-8" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
                  <div className="w-full h-28 rounded border border-white/8 mb-5 flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <span className="text-white/15 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Project Image</span>
                  </div>
                  <span className="text-white/25 text-xs font-bold tracking-widest uppercase block mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{ind}</span>
                  <div className="h-px w-full mb-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                  <div className="flex gap-3">
                    {["Time saved", "Cost reduced", "ROI"].map((l) => (
                      <div key={l} className="flex-1 text-center">
                        <p className="text-white/10 font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>—</p>
                        <p className="text-white/15 text-[10px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate("casestudies")}
              className="group mt-8 flex items-center gap-3 border border-white/20 hover:border-white text-white text-xs font-black tracking-widest uppercase px-8 py-4 transition-colors hover:bg-white hover:text-black"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              VIEW CASE STUDIES <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimReveal>
        </div>
      </section>

      <WarpDivider />

      {/* ── PROCESS — Jupiter ── */}
      <section ref={processRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center border-t border-white/8">
        <PlanetBg src={JUPITER_IMG} overlay="rgba(0,0,0,0.28)" sectionRef={processRef} side="right" glow="rgba(180,110,45,0.55)" />
        <PlanetLabel name="Jupiter" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>How We Work</p>
            <h2 className="text-white leading-[0.92]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              OUR PROVEN<br />PROCESS
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-white/10">
            {[
              { n: "01", title: "Discover",    desc: "Deep-dive into your business, workflows, and goals to identify the highest-value automation opportunities." },
              { n: "02", title: "Strategy",    desc: "We map out the AI architecture, tools, and integrations before writing a single line of code." },
              { n: "03", title: "Design",      desc: "User flows, interface designs, and system diagrams reviewed and approved before build begins." },
              { n: "04", title: "Development", desc: "Engineering the AI agents, automations, and software with precision and full test coverage." },
              { n: "05", title: "Deployment",  desc: "Staged rollout with performance monitoring, load testing, and client sign-off at every step." },
              { n: "06", title: "Support",     desc: "Ongoing monitoring, updates, and dedicated support to keep your systems running at full capacity." },
            ].map((p, i) => (
              <motion.div
                key={p.n}
                className="p-6 border-b md:border-b-0 border-r border-white/10 last:border-r-0 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-white/10 font-black leading-none mb-4 group-hover:text-white/20 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "3.5rem" }}>{p.n}</p>
                <h3 className="text-white font-black mb-2 text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>{p.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WarpDivider />

      {/* ── CTA BREAK ── */}
      <section ref={ctaRef} className="relative overflow-hidden py-40 lg:py-56 min-h-[70vh] flex items-center">
        <PlanetBg src={NEBULA_IMG} overlay="rgba(0,0,0,0.30)" sectionRef={ctaRef} side="left" glow="rgba(35,100,220,0.55)" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <AnimReveal>
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Ready?</p>
            <h2
              className="text-white leading-[0.88] mb-10"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, 9vw, 9rem)", fontWeight: 900 }}
            >
              LET'S BUILD<br />
              <span style={{
                backgroundImage: `url('${HERO_IMG}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "brightness(3)",
              }}>YOUR AI SYSTEM</span>
            </h2>
            <motion.button
              onClick={() => onNavigate("contact")}
              className="group inline-flex items-center gap-4 bg-white text-black text-sm font-black tracking-widest uppercase px-12 py-5 hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              BOOK FREE AI STRATEGY CALL <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </AnimReveal>
        </div>
      </section>

      <WarpDivider />

      {/* ── WHY US — Nebula ── */}
      <section ref={whyRef} className="relative overflow-hidden py-28 lg:py-40 min-h-[80vh] flex items-center border-t border-white/8">
        <div className="absolute inset-0 z-0" style={{ background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: STARS_BG }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-14">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Why Choose Us</p>
            <h2 className="text-white leading-[0.92]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900 }}>
              WHY BUSINESSES<br />CHOOSE BEPROMPTER
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {WHY_US.map((w, i) => {
              const Icon = w.icon;
              return (
                <AnimReveal key={w.title} delay={i * 0.08}>
                  <div className="border border-white/8 p-7 hover:border-white/20 transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                    <Icon size={20} className="text-white/30 mb-5" />
                    <h3 className="text-white font-black mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.15rem" }}>{w.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{w.desc}</p>
                  </div>
                </AnimReveal>
              );
            })}
          </div>

          {/* Technologies */}
          <AnimReveal>
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Technologies We Use</p>
            <div className="flex flex-wrap gap-2">
              {TECHNOLOGIES.map((t) => (
                <span key={t.name} className="border border-white/10 px-3 py-2 text-xs font-semibold tracking-wider" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}>
                  {t.name}
                </span>
              ))}
            </div>
          </AnimReveal>

          {/* Testimonials placeholder */}
          <AnimReveal className="mt-20" delay={0.1}>
            <div className="border border-white/8 p-10 text-center" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Client Testimonials</p>
              <p className="text-white/50 text-xl mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 300 }}>
                "Client testimonials coming soon."
              </p>
              <p className="text-white/25 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                We believe in publishing only genuine customer feedback. Our first verified testimonials will appear here.
              </p>
            </div>
          </AnimReveal>
        </div>
      </section>
    </div>
  );
}
