import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { CheckoutModal } from "@/app/components/CheckoutModal";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import { TiltCard } from "@/app/components/ui/TiltCard";

function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SplitText({ text, className = "", stagger = 0.02, delay = 0 }: { text: string; className?: string; stagger?: number; delay?: number }) {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          initial={{ opacity: 0, y: 40, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

const SERVICES = [
  {
    id: "ai-agents",
    letter: "A",
    tab: "AI AGENTS & WORKFLOWS",
    heading: "INTELLIGENT AI AGENTS & WORKFLOW AUTOMATION",
    sub: "AI Agents & Automation Solutions",
    body: "We design, develop, deploy, and maintain intelligent AI agents that automate business operations, answer customer queries, access your company knowledge, and integrate with your existing software. Automate repetitive processes by connecting your applications, AI models, databases, and communication channels. From lead capture and CRM updates to invoice processing and employee onboarding — every step automated, every system connected.",
    cta: "BUILD YOUR AI AGENT",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=480&fit=crop&auto=format",
    alt: "Custom AI agents and workflows",
    capabilities: ["Customer Support Agent", "Sales & Lead Qualification Agent", "Knowledge Base Agent", "Lead Capture & CRM Automation", "Invoice Processing Workflow", "Document Approval Workflow", "Multi-Agent Systems", "CRM / ERP Integration", "Admin Dashboard", "WhatsApp Notification System"],
    tech: ["OPENAI GPT-4o", "ANTHROPIC CLAUDE", "GOOGLE GEMINI", "N8N / MAKE", "NEXT.JS / REACT", "NESTJS / FASTAPI", "POSTGRESQL", "PGVECTOR", "CLOUDFLARE R2", "DOCKER"],
    packages: [
      {
        name: "Agent & Workflow Lite",
        price: "₹34,999",
        delivery: "2–3 Weeks",
        features: ["1 AI Agent", "Web Chat Interface", "Up to 5 Automated Workflows", "Knowledge Base Setup", "Basic RAG", "Admin Dashboard", "1 Business Integration", "Email / WhatsApp Automation", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "Agent & Workflow Pro",
        price: "₹89,999",
        delivery: "4–6 Weeks",
        features: ["Everything in Lite", "Multiple AI Agents", "Up to 15 Workflows", "Advanced RAG & Memory", "Multiple Integrations", "AI Document Processing", "Custom Workflows", "WhatsApp Integration", "Priority Support"],
      },
      {
        name: "Enterprise System",
        price: "₹2,49,999+",
        delivery: "6–12 Weeks",
        features: ["Everything in Pro", "Multi-Agent System", "Unlimited Workflows", "ERP Integration", "Custom UI/UX", "Enterprise Architecture", "SLA Support", "Discovery Workshop"],
      },
    ],
    maintenance: "Basic ₹4,999 / Standard ₹7,999 / Premium ₹12,999 per month",
  },
  {
    id: "ai-voice",
    letter: "V",
    tab: "AI VOICE AGENTS",
    heading: "CONVERSATIONAL VOICE AI FOR YOUR BUSINESS",
    sub: "AI Voice Agent Solutions",
    body: "Automate inbound and outbound phone conversations using natural, human-like AI voices. Our voice agents answer calls, qualify leads, schedule appointments, provide customer support, and handle follow-ups — 24/7, without human intervention. Unlike traditional IVR systems, they understand natural language.",
    cta: "BUILD YOUR VOICE AGENT",
    img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=700&h=480&fit=crop&auto=format",
    alt: "AI voice agent",
    capabilities: ["AI Receptionist", "Appointment Booking Agent", "Sales Calling Agent", "Lead Qualification Agent", "Customer Support Agent", "Follow-up Calling Agent", "Survey & Feedback Agent", "Order Confirmation Agent", "Inbound Call Handling", "CRM Integration"],
    tech: ["ELEVENLABS", "OPENAI REALTIME API", "TWILIO", "EXOTEL", "PLIVO", "OPENAI", "CLAUDE", "GEMINI", "FASTAPI", "NESTJS", "N8N", "ZOHO / HUBSPOT / SALESFORCE"],
    packages: [
      {
        name: "Voice Agent Lite",
        price: "₹49,999",
        delivery: "2–3 Weeks",
        features: ["1 AI Voice Agent", "1 Phone Number Integration", "Inbound Call Handling", "Appointment Booking", "FAQ Responses", "Call Logging", "CRM Integration (1)", "Admin Dashboard", "Call Analytics", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "Voice Agent Pro",
        price: "₹1,24,999",
        delivery: "4–6 Weeks",
        features: ["Everything in Lite", "Outbound Calling Campaign", "Multiple Phone Numbers", "Advanced CRM Sync", "WhatsApp Follow-up", "Multi-language Support", "Custom Analytics"],
      },
      {
        name: "Enterprise",
        price: "₹3,49,999+",
        delivery: "6–10 Weeks",
        features: ["Everything in Pro", "Multi-Agent Call Center", "Custom Voice Cloning", "ERP Integration", "Enterprise Security", "Dedicated Support"],
      },
    ],
    maintenance: "Basic ₹7,999 / Standard ₹12,999 / Premium ₹19,999 per month",
  },
  {
    id: "whatsapp-crm",
    letter: "W",
    tab: "WHATSAPP & CRM",
    heading: "AUTOMATE YOUR BUSINESS ON WHATSAPP",
    sub: "WhatsApp & CRM Automation",
    body: "Automate customer communication, lead management, follow-ups, sales pipelines, and appointment scheduling via WhatsApp Business API combined with CRM and AI. Auto replies, lead qualification, broadcast campaigns, and full pipeline management — all on the platform your customers already use.",
    cta: "AUTOMATE WHATSAPP",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&h=480&fit=crop&auto=format",
    alt: "WhatsApp business automation",
    capabilities: ["Auto Reply & Welcome Messages", "FAQ Automation", "Appointment Booking", "Order & Payment Updates", "Broadcast Campaigns", "Lead Capture & Qualification", "CRM Pipeline Management", "AI Response Suggestions", "Conversation Summaries", "Follow-up Recommendations"],
    tech: ["WHATSAPP BUSINESS API", "META CLOUD API", "TWILIO", "GUPSHUP", "ZOHO / HUBSPOT / SALESFORCE / PIPEDRIVE / ODOO", "OPENAI / CLAUDE / GEMINI", "N8N", "FASTAPI / NESTJS", "POSTGRESQL"],
    packages: [
      {
        name: "WhatsApp & CRM Lite",
        price: "₹39,999",
        delivery: "1–2 Weeks",
        features: ["WhatsApp Business API Setup", "CRM Integration (1)", "Auto Replies", "Welcome Messages", "Lead Capture", "Pipeline Setup", "Basic AI Lead Qualification", "Admin Dashboard", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "Professional",
        price: "₹99,999",
        delivery: "2–4 Weeks",
        features: ["Everything in Lite", "Multiple CRM Integrations", "AI Chatbot", "Broadcast Campaign System", "Custom Analytics", "Marketing Automation", "Multi-language Support"],
      },
      {
        name: "Enterprise",
        price: "₹2,99,999+",
        delivery: "4–8 Weeks",
        features: ["Everything in Pro", "Voice Agent Integration", "ERP Integration", "Customer Feedback System", "Advanced AI Insights", "SLA Support"],
      },
    ],
    maintenance: "Basic ₹4,999 / Standard ₹8,999 / Premium ₹14,999 per month",
  },
  {
    id: "website",
    letter: "W",
    tab: "WEB, MOBILE & E-COMMERCE",
    heading: "MODERN WEBSITES, APPS & ONLINE STORES",
    sub: "Web & Mobile Development",
    body: "Modern, secure, and highly scalable digital platforms. From corporate websites and full e-commerce platforms to cross-platform mobile applications. We build complete commerce ecosystems and business applications integrated with CRM, AI, and payment gateways — designed to maximize growth and engagement.",
    cta: "BUILD YOUR PLATFORM",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&h=480&fit=crop&auto=format",
    alt: "Web and mobile development",
    capabilities: ["Custom UI/UX Design", "Corporate Websites", "E-Commerce Platforms", "Android & iOS Apps", "Cross-Platform (Flutter / React Native)", "Shopping Cart & Checkout", "Order & Inventory Management", "Payment Gateway Integration", "CMS Integration", "Analytics & SEO Optimized"],
    tech: ["REACT / NEXT.JS / TAILWIND", "FLUTTER / REACT NATIVE", "NODE.JS / NESTJS / FASTAPI", "POSTGRESQL / SUPABASE / FIREBASE", "RAZORPAY / STRIPE / PAYU", "CLOUDFLARE R2 / AWS S3", "STRAPI / SANITY CMS", "VERCEL / CLOUDFLARE / AWS"],
    packages: [
      {
        name: "Business Website",
        price: "₹14,999",
        delivery: "2–4 Weeks",
        features: ["Custom UI/UX Design", "Up to 15 Pages", "CMS Integration", "Blog / News Section", "SEO-Ready", "Analytics Dashboard", "WhatsApp Integration", "Deployment + Support"],
      },
      {
        name: "E-Commerce Store",
        price: "₹49,999",
        delivery: "3–6 Weeks",
        features: ["Custom Responsive Design", "Unlimited Products", "Shopping Cart + Checkout", "Payment Gateway", "Order & Inventory Management", "Admin Dashboard", "Basic SEO + Analytics", "30 Days Support"],
      },
      {
        name: "Mobile App (iOS + Android)",
        price: "₹1,49,999",
        delivery: "8–12 Weeks",
        features: ["Cross-Platform App", "User Authentication", "Push Notifications", "Payment Gateway", "Analytics Dashboard", "CRM / API Integrations", "App Store Deployment", "Security Hardening", "30 Days Support"],
      },
      {
        name: "Enterprise Platform",
        price: "₹4,99,999+",
        delivery: "3–6 Months",
        features: ["Web + Mobile App", "Multi-location Inventory", "ERP Integration", "AI Recommendations", "Advanced Reporting", "Role-Based Access", "Security Audit", "60 Days Support"],
      },
    ],
    maintenance: "Basic ₹2,999 / Standard ₹9,999 / Premium ₹19,999 per month",
  },
  {
    id: "ai-video",
    letter: "V",
    tab: "AI VIDEO & UGC",
    heading: "AI-POWERED MARKETING VIDEOS AT SCALE",
    sub: "AI Video Generation & UGC Ads",
    body: "High-quality marketing videos, social media content, product demonstrations, advertisements, and user-generated content (UGC) produced using AI. We combine AI video generation, AI avatars, AI voiceovers, motion graphics, scriptwriting, and editing — at significantly lower cost and faster turnaround than traditional video production.",
    cta: "CREATE AI VIDEOS",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=700&h=480&fit=crop&auto=format",
    alt: "AI video generation",
    capabilities: ["AI Video Generation", "AI Avatar Spokespersons", "AI Voiceover (Multi-language)", "Script Writing", "Motion Graphics", "Social Media Reels & Shorts", "YouTube Content", "Meta & Google Ad Creatives", "Product Demo Videos", "UGC Advertising Creatives"],
    tech: ["RUNWAY / KLING AI / VEO / PIKA / LUMA AI", "HEYGEN / SYNTHESIA / TAVUS (AI AVATARS)", "ELEVENLABS / OPENAI VOICE / GOOGLE AI VOICE", "ADOBE PREMIERE PRO / AFTER EFFECTS", "CAPCUT PRO / DAVINCI RESOLVE", "CANVA PRO / ADOBE PHOTOSHOP / FIGMA", "CHATGPT / CLAUDE / GEMINI (SCRIPTS)"],
    packages: [
      {
        name: "Starter Content",
        price: "₹14,999/month",
        delivery: "Weekly Deliverables",
        features: ["8 AI Videos/Month", "AI Voiceover", "Script Writing", "Basic Editing", "Brand Logo Integration", "Background Music", "Vertical Format", "Monthly Content Plan", "1 Revision per Video"],
      },
      {
        name: "Business Content",
        price: "₹39,999/month",
        delivery: "Weekly Deliverables",
        features: ["20 AI Videos/Month", "AI Avatar", "Premium Voiceover", "Motion Graphics", "Captions & Subtitles", "Multi-format Export", "Platform Optimization", "Content Calendar", "3 Revisions per Video", "Monthly Performance Review"],
      },
      {
        name: "Enterprise Content",
        price: "₹99,999/month",
        delivery: "Continuous Production",
        features: ["High-Volume Video Production", "AI Avatars", "Multiple Languages", "Campaign Strategy", "Premium Motion Graphics", "Dedicated Creative Team", "Advanced Analytics", "Priority Delivery", "Unlimited Revisions (within scope)"],
      },
      {
        name: "UGC Advertisement",
        price: "₹7,500/video",
        delivery: "2–4 Days",
        features: ["Creative Research", "Script Writing", "AI UGC Creator", "AI Voice", "Product Demonstration", "Strong Hook + CTA", "Multiple Aspect Ratios", "Ad Optimization", "2 Revisions"],
      },
    ],
    maintenance: "",
  }
];

export function ServicesPage({ onNavigate, initialServiceIndex = 0, scrollToDetail = false }: { onNavigate: (p: string) => void; initialServiceIndex?: number; scrollToDetail?: boolean }) {
  const [active, setActive] = useState(initialServiceIndex);
  const [checkoutService, setCheckoutService] = useState<{ name: string; price: string } | null>(null);
  const srv = SERVICES[active];

  useEffect(() => {
    setActive(initialServiceIndex);
    if (scrollToDetail) {
      setTimeout(() => {
        document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }, [initialServiceIndex, scrollToDetail]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen font-sans">
      {/* Page hero */}
      <section ref={heroRef} className="relative pt-16 bg-[#0a0a0a] overflow-hidden">
        {/* Animated Background Cover */}
        <motion.div style={{ y }} className="absolute inset-0 z-0 pointer-events-none -top-[10%] h-[120%]">
           <motion.img 
             src="/images/services_hero_bg.png" 
             className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 0.4 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
           <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "64px 64px", backgroundPosition: "center top" }} />
        </motion.div>
        
        <div className="relative z-10 w-full min-h-[90vh] flex flex-col justify-center py-20 overflow-hidden">
          {/* Main typographic composition */}
          <div className="max-w-[1400px] mx-auto px-6 w-full relative z-20 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="inline-flex items-center gap-3 border border-white/20 bg-black/50 px-4 py-2 mb-8 backdrop-blur-md">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-white/80 text-[10px] font-bold font-mono tracking-[0.25em] uppercase">
                  Service Matrix
                </span>
              </div>
            </motion.div>
            
            <h1 className="text-white font-heading font-black leading-[0.85] uppercase tracking-tighter" style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}>
              <SplitText text="AI SYSTEMS &" delay={0.1} stagger={0.04} /><br />
              <SplitText text="AUTOMATION" delay={0.3} stagger={0.04} className="text-white/90" /><br />
              <SplitText text="THAT SCALE" delay={0.5} stagger={0.04} />
            </h1>
          </div>

          {/* Floating Image / Data Core */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[85%] md:w-[60%] lg:w-[45%] max-w-[800px] z-10 pointer-events-auto mix-blend-lighten hidden md:block">
             <TiltCard className="translate-x-[15%] lg:translate-x-[10%] opacity-80 hover:opacity-100 transition-opacity duration-700">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-transparent border border-white/10 group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=500&fit=crop&auto=format')] bg-cover bg-center mix-blend-luminosity opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                  
                  {/* Floating Brutalist Badge */}
                  <motion.div
                    className="absolute bottom-10 left-[-20%] bg-black/80 border border-white/20 p-5 flex flex-col gap-2 shadow-2xl backdrop-blur-xl w-[320px]"
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-3 mb-2 border-b border-white/10 pb-3">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </div>
                      <p className="text-white/60 font-mono text-[10px] font-bold uppercase tracking-widest">Live: Core Systems</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/40 text-[9px] uppercase font-mono tracking-wider">Active Deployments</p>
                        <p className="text-white font-heading font-black text-2xl">142<span className="text-white/40 text-sm">.0</span></p>
                      </div>
                      <div>
                        <p className="text-white/40 text-[9px] uppercase font-mono tracking-wider">Avg Latency</p>
                        <p className="text-white font-heading font-black text-2xl">12<span className="text-white/40 text-sm">ms</span></p>
                      </div>
                    </div>
                    <p className="text-white/70 font-mono text-[9px] uppercase tracking-widest border-t border-white/10 pt-3 mt-1 text-center">11 CORE SERVICES • VERIFIED</p>
                  </motion.div>
                </div>
             </TiltCard>
          </div>

          {/* Subtext and CTA */}
          <div className="max-w-[1400px] mx-auto px-6 w-full relative z-30 mt-12 grid md:grid-cols-2 gap-12 pointer-events-auto">
             <div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-white/60 text-base md:text-lg leading-relaxed max-w-md font-sans border-l-2 border-white/20 pl-6 bg-black/40 backdrop-blur-md p-4 rounded-r-lg"
                >
                  We build AI agents, voice agents, workflow automation, custom software, e-commerce platforms, digital marketing, and AI video — everything your business needs to grow.
                </motion.p>
             </div>
             <div className="flex items-end justify-start md:justify-end mt-6 md:mt-0">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.6 }}>
                  <MagneticButton
                    onClick={() => onNavigate("contact")}
                    className="bg-white text-black font-heading font-black text-sm tracking-widest uppercase px-10 py-5 flex items-center gap-4 transition-colors group shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
                  >
                    DEPLOY YOUR SYSTEM <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </MagneticButton>
                </motion.div>
             </div>
          </div>
        </div>

        {/* Service count strip */}
        <div className="border-t border-white/10 relative z-10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <span key={s.id} className="border border-white/10 text-white/40 text-xs px-3 py-1.5 font-mono uppercase tracking-wider">{s.tab}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW GRID ── */}
      <section className="bg-black py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-12">
            <p className="text-white/50 text-xs font-mono tracking-[0.25em] uppercase mb-3">Our Services</p>
            <h2 className="text-white font-heading font-black leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              <SplitText text="AI-FIRST SERVICES." delay={0.1} /><br />
              <SplitText text="ONE ENGINEERING PARTNER." delay={0.3} className="text-white/70" />
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10 border border-white/10">
            {SERVICES.map((s, i) => (
              <TiltCard key={s.id} className="bg-black">
                <motion.button
                  onClick={() => {
                    setActive(i);
                    document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full h-full p-5 text-left group transition-all duration-300 ${active === i ? "bg-white/10 border-white/20" : "bg-black hover:bg-white/5"}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                >
                  <p
                    className={`font-heading font-black text-xs leading-tight uppercase tracking-wide transition-colors group-hover:text-white ${active === i ? "text-white" : "text-white/50"}`}
                  >
                    {s.tab}
                  </p>
                  {active === i && (
                    <motion.div layoutId="activeBarServices" className="mt-2 w-6 h-0.5 bg-white" />
                  )}
                </motion.button>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE DETAIL ── */}
      <section id="service-detail" className="bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Tab strip */}
          <div className="flex overflow-x-auto gap-1 mb-12 pb-2 border-b border-white/10 scrollbar-hide">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                className={`shrink-0 px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all whitespace-nowrap ${
                  active === i ? "bg-white text-black font-bold" : "text-white/40 hover:text-white border border-white/10 hover:border-white/30"
                }`}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                {s.tab}
              </motion.button>
            ))}
          </div>

          {/* Detail content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Top: heading + description + image */}
              <div className="grid lg:grid-cols-2 gap-16 items-start relative mb-16">
                <div
                  className="absolute top-0 right-0 text-white/[0.02] font-heading font-black select-none pointer-events-none"
                  style={{ fontSize: "clamp(8rem, 18vw, 16rem)", lineHeight: 0.85 }}
                >
                  {srv.letter}
                </div>

                <div className="relative z-10">
                  <p className="text-white/50 font-mono text-xs font-bold tracking-[0.25em] uppercase mb-3">{srv.sub}</p>
                  <h2 className="text-white font-heading font-black leading-[0.95] mb-6" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
                    {srv.heading}
                  </h2>
                  <p className="text-white/60 text-base leading-relaxed mb-8 font-sans">{srv.body}</p>

                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {srv.capabilities.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-white/60 rounded-full shrink-0" />
                        <span className="text-white/50 text-xs font-mono uppercase tracking-wider font-semibold">{c}</span>
                      </div>
                    ))}
                  </div>

                  <MagneticButton
                    onClick={() => onNavigate("contact")}
                    className="bg-white text-black font-heading font-black text-xs tracking-widest uppercase px-7 py-3.5 flex items-center gap-3 transition-colors group"
                  >
                    {srv.cta} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </div>

                <div className="relative">
                  <TiltCard>
                    <motion.div
                      className="rounded-xl overflow-hidden h-[360px] bg-[#111] border border-white/10"
                      transition={{ duration: 0.4 }}
                    >
                      <img
                        src={srv.img}
                        alt={srv.alt}
                        className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105 mix-blend-luminosity hover:mix-blend-normal"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-transparent pointer-events-none" />
                    </motion.div>
                  </TiltCard>
                </div>
              </div>

              {/* Pricing packages */}
              <div className="mb-4">
                <p className="text-white/50 text-xs font-mono font-bold tracking-[0.25em] uppercase mb-6">Packages & Pricing</p>
                <div className={`grid gap-4 ${srv.packages.length <= 2 ? "md:grid-cols-2" : srv.packages.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
                  {srv.packages.map((pkg, pi) => (
                    <TiltCard key={pkg.name}>
                      <motion.div
                        className="border border-white/10 bg-[#0a0a0a] hover:border-white/30 hover:bg-white/5 transition-all p-6 flex flex-col h-full rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: pi * 0.08 }}
                      >
                        <p className="text-white/60 text-xs font-mono font-bold tracking-widest uppercase mb-2">{pkg.name}</p>
                        <p className="text-white font-heading font-black mb-1" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>{pkg.price}</p>
                        <p className="text-white/40 text-xs font-mono uppercase tracking-wide mb-4">{pkg.delivery}</p>
                        <ul className="space-y-1.5 flex-1">
                          {pkg.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <Check size={11} className="text-white/50 mt-0.5 shrink-0" />
                              <span className="text-white/60 text-xs leading-snug font-sans">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <MagneticButton
                          onClick={() => setCheckoutService({ name: `${srv.sub} - ${pkg.name}`, price: pkg.price })}
                          className="mt-5 border border-white/20 hover:bg-white text-white hover:text-black font-heading font-black text-xs tracking-widest uppercase px-4 py-2.5 transition-all flex items-center gap-2 justify-center group w-full"
                        >
                          Get Started <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                        </MagneticButton>
                      </motion.div>
                    </TiltCard>
                  ))}
                </div>
                {srv.maintenance && (
                  <p className="text-white/30 text-xs mt-4 font-mono">
                    Monthly Maintenance: {srv.maintenance}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="bg-black py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-10">
            <p className="text-white/50 text-xs font-mono tracking-[0.25em] uppercase mb-3">Technology</p>
            <h2 className="text-white font-heading font-black leading-[0.95]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              TOOLS WE USE FOR<br />
              <span className="text-white/70">{srv.tab}</span>
            </h2>
          </AnimReveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={active + "tech"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10"
            >
              {srv.tech.map((t, ti) => (
                <motion.div
                  key={t}
                  className="bg-black px-6 py-4 flex items-center gap-3 group hover:bg-white/5 transition-colors cursor-default"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ti * 0.04 }}
                >
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full shrink-0 group-hover:scale-150 group-hover:bg-white transition-all" />
                  <span className="text-white/60 group-hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
                    {t}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-[#050505] py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimReveal>
              <p className="text-white/50 font-mono text-xs font-bold tracking-[0.25em] uppercase mb-4">Ready to Start?</p>
              <h2 className="text-white font-heading font-black leading-[0.95] mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                LET'S BUILD SOMETHING<br />
                REMARKABLE TOGETHER
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8 font-sans">
                Whether you need a custom AI agent, a complete e-commerce platform, workflow automation, or a digital marketing strategy — we have the expertise, the technology, and the team to deliver it.
              </p>
              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  onClick={() => onNavigate("contact")}
                  className="bg-white text-black font-heading font-black text-xs tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors group"
                >
                  GET A FREE CONSULTATION <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>
            </AnimReveal>

            <AnimReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "11", label: "Services Offered" },
                  { stat: "AI-First", label: "Engineering Approach" },
                  { stat: "30 Days", label: "Post-Delivery Support" },
                  { stat: "₹2,999", label: "Starting Price" },
                ].map((item) => (
                  <TiltCard key={item.label}>
                     <div className="border border-white/10 bg-[#0a0a0a] p-5 h-full rounded-md hover:bg-white/5 transition-colors">
                       <p className="text-white font-heading font-black text-2xl mb-1">{item.stat}</p>
                       <p className="text-white/40 text-xs font-mono uppercase tracking-wider font-semibold">{item.label}</p>
                     </div>
                  </TiltCard>
                ))}
              </div>
            </AnimReveal>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {checkoutService && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setCheckoutService(null)}
          planName={checkoutService.name}
          price={checkoutService.price}
        />
      )}
    </div>
  );
}
