import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AnimReveal } from "@/app/components/ui/AnimReveal";
import { PageHero } from "@/app/components/ui/PageHero";

const SERVICES = [
  {
    id: "lead-generation",
    letter: "L",
    tab: "LEAD GENERATION",
    heading: "PROPERTY LEAD GENERATION",
    sub: "Generate Qualified Enquiries",
    body: "Generate more qualified property enquiries through high-converting campaigns, landing pages and AI-assisted lead qualification. We design lead-generation systems specifically for real-estate businesses — from campaign landing pages and enquiry forms to lead qualification and source tracking. The goal is not simply more leads, but better leads your sales team can actually convert.",
    cta: "GET A FREE AUDIT",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&h=480&fit=crop&auto=format",
    alt: "Property lead generation",
    capabilities: ["Meta & Google lead campaigns", "Property landing pages", "Lead capture forms", "AI-assisted lead qualification", "Lead source tracking", "Lead routing", "Conversion-focused funnels"],
    tech: ["META ADS", "GOOGLE ADS", "NEXT.JS", "TAILWIND", "SUPABASE", "OPENAI", "CLAUDE", "N8N"],
  },
  {
    id: "whatsapp-crm",
    letter: "W",
    tab: "WHATSAPP & CRM",
    heading: "WHATSAPP & CRM AUTOMATION",
    sub: "Capture, Qualify, Follow Up",
    body: "Connect your WhatsApp enquiries, CRM and sales workflow into one automated system. New leads can receive instant responses, answer qualification questions, enter your CRM and receive structured follow-ups while your team focuses on serious buyers. Fewer leads get lost.",
    cta: "AUTOMATE WORKFLOWS",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&h=480&fit=crop&auto=format",
    alt: "WhatsApp & CRM automation",
    capabilities: ["WhatsApp lead capture", "Instant automated responses", "AI lead qualification", "CRM integration", "Follow-up sequences", "Lead assignment", "Site-visit reminders", "Lead status tracking"],
    tech: ["WHATSAPP BUSINESS API", "META CLOUD API", "TWILIO", "ZOHO / HUBSPOT / SALESFORCE", "OPENAI / CLAUDE / GEMINI", "N8N", "FASTAPI / NESTJS", "POSTGRESQL"],
  },
  {
    id: "ai-sales-agents",
    letter: "A",
    tab: "AI SALES AGENTS",
    heading: "AI PROPERTY SALES AGENTS",
    sub: "Answer, Qualify & Route",
    body: "Deploy AI agents that can handle repetitive first-level conversations around your properties, collect buyer requirements and identify high-intent prospects before handing them to your team. The AI doesn't replace salespeople; it handles the initial qualification so they can focus on closing deals.",
    cta: "BUILD AN AI AGENT",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=480&fit=crop&auto=format",
    alt: "AI property sales agents",
    capabilities: ["Answer common property questions", "Collect budget", "Collect preferred location", "Collect property type", "Collect purchase timeline", "Qualify leads", "Share relevant information", "Schedule calls or site visits", "Hand qualified leads to human salespeople"],
    tech: ["OPENAI GPT-4o", "ANTHROPIC CLAUDE", "GOOGLE GEMINI", "N8N", "NEXT.JS", "REACT", "FASTAPI", "POSTGRESQL", "PGVECTOR", "WHATSAPP API"],
  },
  {
    id: "websites-funnels",
    letter: "F",
    tab: "WEBSITES & FUNNELS",
    heading: "PROPERTY WEBSITES & LEAD FUNNELS",
    sub: "Turn Traffic Into Enquiries",
    body: "We build property websites and landing pages designed around one objective: turning visitors into enquiries and site visits. Capture leads effectively with conversion-focused experiences tailored for the real estate industry.",
    cta: "BUILD MY FUNNEL",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&h=480&fit=crop&auto=format",
    alt: "Property websites and lead funnels",
    capabilities: ["Property listings", "Project pages", "Property landing pages", "Enquiry forms", "WhatsApp CTA", "Call CTA", "Lead capture", "Analytics", "CRM integration", "Site-visit booking"],
    tech: ["REACT / NEXT.JS / TAILWIND", "NODE.JS / NESTJS / FASTAPI", "POSTGRESQL / SUPABASE", "CLERK / SUPABASE AUTH", "CLOUDFLARE", "SANITY CMS", "VERCEL / AWS"],
  },
  {
    id: "workflow-automation",
    letter: "W",
    tab: "WORKFLOW AUTOMATION",
    heading: "WORKFLOW AUTOMATION",
    sub: "Connect Your Operations",
    body: "We automate repetitive processes across your real-estate operations so information moves automatically between the tools your team already uses. Connect your leads, CRM, WhatsApp, sales team and business tools into unified automated workflows.",
    cta: "AUTOMATE OPERATIONS",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&h=480&fit=crop&auto=format",
    alt: "Workflow automation",
    capabilities: ["Lead → CRM", "CRM → WhatsApp", "New enquiry → salesperson notification", "Qualified lead → sales team", "Site visit → reminder", "Inactive lead → follow-up", "Form submission → CRM", "Lead status → reporting"],
    tech: ["N8N", "MAKE", "OPENAI", "CLAUDE", "GEMINI", "FASTAPI", "NESTJS", "POSTGRESQL", "GMAIL / OUTLOOK", "SLACK / WHATSAPP", "ZOHO / HUBSPOT / SALESFORCE"],
  }
];

export function ServicesPage({ onNavigate, initialServiceIndex = 0, scrollToDetail = false }: { onNavigate: (p: string) => void; initialServiceIndex?: number; scrollToDetail?: boolean }) {
  const [active, setActive] = useState(initialServiceIndex);
  const srv = SERVICES[active];

  useEffect(() => {
    setActive(initialServiceIndex);
    if (scrollToDetail) {
      setTimeout(() => {
        document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }, [initialServiceIndex, scrollToDetail]);

  return (
    <div className="bg-white">
      <PageHero
        category="Services"
        title={
          <>
            AI SYSTEMS FOR<br />
            <span className="text-white">REAL ESTATE</span>
          </>
        }
        description={
          <p>We build AI-powered lead generation, WhatsApp automation, CRM workflows, sales agents and property websites that help real-estate businesses respond faster and convert more enquiries.</p>
        }
        ctaText="GET A FREE AUDIT"
        onCtaClick={() => onNavigate("contact")}
        imageNode={
          <div className="relative h-[420px] rounded-2xl overflow-hidden bg-[#1a1a1a]">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop&auto=format" alt="Real Estate AI Services" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-[#0a0a0a]/60" />
            <motion.div
              className="absolute bottom-6 left-6 bg-white px-4 py-3 rounded-lg shadow-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-black font-black text-xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>5 Services</p>
              <p className="text-[#0a0a0a] text-xs font-semibold uppercase tracking-wider">AI Workflow Systems</p>
            </motion.div>
          </div>
        }
      />
      <section className="bg-[#0a0a0a]">
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <span key={s.id} className="border border-white/10 text-white/35 text-xs px-3 py-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.tab}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW GRID ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-12">
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Our Services</p>
            <h2 className="text-[#0a0a0a]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1 }}>
              FOCUSED ON CONVERTING<br />PROPERTY ENQUIRIES.
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[#f0f0f0]">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => {
                  setActive(i);
                  document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-5 text-left group transition-colors ${active === i ? "bg-[#0a0a0a]" : "bg-white hover:bg-[#0a0a0a]"}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ scale: 1.01 }}
              >
                <p
                  className={`font-black text-xs leading-tight uppercase tracking-wide group-hover:!text-white ${active === i ? "text-white" : "text-[#0a0a0a]"}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}
                >
                  {s.tab}
                </p>
                {active === i && (
                  <motion.div layoutId="activeBar" className="mt-2 w-6 h-0.5 bg-white" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE DETAIL ── */}
      <section id="service-detail" className="bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="flex overflow-x-auto gap-1 mb-12 pb-2 border-b border-white/10 scrollbar-hide">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                className={`shrink-0 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                  active === i ? "bg-white text-black" : "text-white/40 hover:text-white border border-white/10 hover:border-white/30"
                }`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                {s.tab}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-2 gap-16 items-start relative mb-16">
                <div
                  className="absolute top-0 right-0 text-white/[0.03] font-black select-none pointer-events-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(8rem, 18vw, 16rem)", lineHeight: 0.85 }}
                >
                  {srv.letter}
                </div>

                <div className="relative z-10">
                  <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{srv.sub}</p>
                  <h2 className="text-white leading-[0.95] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.6rem)", fontWeight: 900 }}>
                    {srv.heading}
                  </h2>
                  <p className="text-white/60 text-base leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>{srv.body}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
                    {srv.capabilities.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-white/60 rounded-full shrink-0" />
                        <span className="text-white/50 text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{c}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => onNavigate("contact")}
                    className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-7 py-3.5 flex items-center gap-3 transition-colors group"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    GET A FREE AUDIT <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                <div className="relative">
                  <motion.div
                    className="rounded-xl overflow-hidden h-[360px] bg-[#222]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <img
                      src={srv.img}
                      alt={srv.alt}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-white/10 to-transparent pointer-events-none" />
                  </motion.div>
                </div>
              </div>

              {/* Custom Pricing Section */}
              <div className="mb-4">
                <div className="border border-white/10 bg-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Pricing & Scope</p>
                    <h3 className="text-white font-black mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.8rem", textTransform: "uppercase" }}>Custom Built For Your Workflow</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Every real-estate sales workflow is different. We scope the system around your lead volume, tools, sales process and goals.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => onNavigate("contact")}
                    className="border border-white/20 hover:bg-white hover:text-black text-white text-xs font-bold tracking-widest uppercase px-6 py-4 transition-all whitespace-nowrap group"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    GET A CUSTOM QUOTE
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-10">
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Technology</p>
            <h2 className="text-[#0a0a0a] leading-[0.95]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
              TOOLS WE USE FOR<br />
              <span className="text-black">{srv.tab}</span>
            </h2>
          </AnimReveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={active + "tech"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#f0f0f0]"
            >
              {srv.tech.map((t, ti) => (
                <motion.div
                  key={t}
                  className="bg-white px-6 py-4 flex items-center gap-3 group hover:bg-[#0a0a0a] transition-colors cursor-default"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ti * 0.04 }}
                >
                  <div className="w-1.5 h-1.5 bg-black rounded-full shrink-0 group-hover:scale-150 transition-transform" />
                  <span className="text-[#333] group-hover:text-white text-sm font-bold uppercase tracking-widest transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {t}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-[#0a0a0a] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimReveal>
              <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Ready to Start?</p>
              <h2 className="text-white leading-[0.95] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 900 }}>
                LET'S BUILD YOUR<br />
                REAL ESTATE AI SYSTEM
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Whether you need a custom AI sales agent, WhatsApp automation, or a complete property lead funnel — we have the expertise to deliver it.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => onNavigate("contact")}
                  className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors group"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  GET A FREE AI WORKFLOW AUDIT <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </AnimReveal>

            <AnimReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "5", label: "Core Services" },
                  { stat: "AI-First", label: "Workflow Focus" },
                  { stat: "Custom", label: "Built Solutions" },
                  { stat: "24/7", label: "Lead Capture" },
                ].map((item) => (
                  <div key={item.label} className="border border-white/10 p-5">
                    <p className="text-white font-black text-2xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.stat}</p>
                    <p className="text-white/40 text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </AnimReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
