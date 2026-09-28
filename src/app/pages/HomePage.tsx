import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ArrowRight, Bot, Mic, Zap, Settings2, MessageSquare, Database, Cpu, Plug, Monitor, Smartphone, Shield, TrendingUp, Users, Lock, ChevronRight } from "lucide-react";

const SERVICES_GRID = [
  { icon: MessageSquare, title: "AI WhatsApp Bots",         desc: "Instant lead capture and customer qualification 24/7." },
  { icon: Database,      title: "WhatsApp-to-CRM Engine",   desc: "Eliminate manual data entry and sync leads instantly." },
  { icon: Monitor,       title: "AI Smart Landing Pages",   desc: "Interactive sites that capture 3x more customer inquiries." },
  { icon: Bot,           title: "Internal Brain AI",        desc: "Secure RAG search engine trained on your company data." },
];

const WHY_US = [
  { icon: Cpu,        title: "AI-First Engineering",    desc: "Every system is designed with intelligence at its core, not added as an afterthought." },
  { icon: TrendingUp, title: "Outcome-Driven",        desc: "We measure success in concrete business metrics: time saved, costs reduced, and revenue generated." },
  { icon: Lock,       title: "Enterprise Security",     desc: "SOC-2 aligned infrastructure, ensuring your proprietary data remains strictly confidential." }
];

import { NetworkBackground } from "@/app/components/ui/NetworkBackground";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HomePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen">
      
      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative min-h-[95vh] flex flex-col justify-center px-6 overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: "center top"
        }} />
        
        {/* Network Background */}
        <NetworkBackground />
        
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />

        <motion.div className="relative z-10 max-w-6xl mx-auto w-full pt-20" style={{ y, opacity }}>
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
            {/* Left Copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-white/10 rounded-full mb-8 bg-white/5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#60c8ff] animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-white/70">BePrompter Engineering</span>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.1}>
                <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-heading font-medium leading-[1.05] tracking-tight mb-8">
                  Stop Losing Leads. <br />
                  <span className="text-[#60c8ff]">Start Automating Growth.</span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.2} className="max-w-xl">
                <p className="text-lg md:text-xl text-white/60 font-sans leading-relaxed mb-10">
                  We build AI WhatsApp Bots, Smart Landing Pages, and CRM Automations that capture leads 24/7, eliminate manual data entry, and increase your revenue.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <button 
                  onClick={() => onNavigate("casestudies")}
                  className="group inline-flex items-center gap-3 text-white/60 hover:text-white text-sm font-medium tracking-wide transition-colors"
                >
                  View Case Studies
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </FadeIn>
            </div>

            {/* Right Form */}
            <FadeIn delay={0.25}>
              <div className="border border-white/10 bg-white/5 backdrop-blur-lg p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-5 text-white">Find your bottleneck.</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onNavigate("contact"); }}>
                  <div>
                    <input type="text" placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#60c8ff] text-white placeholder-white/30" required />
                  </div>
                  <div>
                    <input type="tel" placeholder="Business Phone Number (WhatsApp)" className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#60c8ff] text-white placeholder-white/30" required />
                  </div>
                  <div>
                    <select className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#60c8ff] text-white/70 appearance-none" required defaultValue="">
                      <option value="" disabled>Biggest business bottleneck right now?</option>
                      <option value="leads">Losing leads & slow response times</option>
                      <option value="data">Too much manual data entry</option>
                      <option value="website">Low website conversion rate</option>
                      <option value="internal">Team can't find internal information</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-white text-black py-3 text-sm font-bold tracking-wide rounded-md hover:bg-white/90 transition-colors">
                    Get Free Custom Report
                  </button>
                </form>
                <p className="text-[11px] text-white/30 text-center mt-4">We respect your privacy. No spam.</p>
              </div>
            </FadeIn>
          </div>
        </motion.div>
      </section>

      {/* ── CLIENT STRIP ── */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-xs font-mono uppercase tracking-widest text-white/40 shrink-0">Trusted by Forward-Thinking Teams</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6 opacity-40 grayscale">
             {/* Placeholder Logos */}
             {["Nexus", "Aura", "Vertex", "Quantum"].map(logo => (
               <span key={logo} className="text-lg font-heading font-semibold tracking-tight">{logo}</span>
             ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID: SERVICES ── */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-heading font-medium tracking-tight mb-6">Capabilities</h2>
              <p className="text-white/50 text-lg max-w-xl font-sans leading-relaxed">
                We design, build, and deploy intelligent infrastructure. From customer-facing AI agents to deep backend automation.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
            {SERVICES_GRID.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.05} className="bg-black relative group h-full">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />
                <div className="p-10 md:p-12 h-full flex flex-col justify-between">
                  <div className="mb-16">
                    <s.icon size={28} strokeWidth={1.5} className="text-white/30 group-hover:text-white transition-colors duration-500 mb-8" />
                    <h3 className="text-xl font-heading font-medium tracking-tight mb-3">{s.title}</h3>
                    <p className="text-sm font-sans text-white/50 leading-relaxed">{s.desc}</p>
                  </div>
                  <button onClick={() => onNavigate("services")} className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-white/30 group-hover:text-white transition-colors duration-500">
                    Explore <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS SECTION ── */}
      <section className="py-32 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-heading font-medium tracking-tight mb-6">Our Process</h2>
              <p className="text-white/50 text-lg font-sans leading-relaxed mb-10">
                We don't just write code; we engineer solutions. Our methodology ensures that every deployment is scalable, secure, and directly contributes to your bottom line.
              </p>
              <button 
                onClick={() => onNavigate("about")}
                className="inline-flex items-center gap-3 border border-white/20 hover:border-white px-6 py-3 text-sm font-medium transition-colors"
              >
                Learn More
              </button>
            </FadeIn>

            <div className="flex flex-col gap-10">
              {[
                { n: "01", title: "Discovery & Audit", desc: "We analyze your current operations to pinpoint bottlenecks and high-ROI automation targets." },
                { n: "02", title: "Architecture Design", desc: "Detailed technical mapping of AI integrations, data pipelines, and security protocols." },
                { n: "03", title: "Development & Testing", desc: "Rigorous engineering with continuous client alignment and extensive edge-case testing." },
                { n: "04", title: "Deployment & Scaling", desc: "Seamless rollout with ongoing monitoring and SLA-backed support." }
              ].map((step, i) => (
                <FadeIn key={step.n} delay={i * 0.1} className="flex gap-6 group">
                  <div className="text-white/20 font-mono text-sm pt-1 group-hover:text-white transition-colors">{step.n}</div>
                  <div>
                    <h3 className="text-lg font-heading font-medium mb-2">{step.title}</h3>
                    <p className="text-sm font-sans text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-32 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-medium tracking-tight">The BePrompter Standard</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.1}>
                <div className="p-8 border border-white/10 bg-black/50 hover:bg-white/[0.02] transition-colors rounded-lg">
                  <w.icon size={24} strokeWidth={1.5} className="text-white mb-6" />
                  <h3 className="text-lg font-heading font-medium tracking-tight mb-3">{w.title}</h3>
                  <p className="text-sm font-sans text-white/50 leading-relaxed">{w.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-white/5" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-8">
              Ready to automate?
            </h2>
            <p className="text-lg text-white/50 font-sans leading-relaxed mb-12 max-w-2xl mx-auto">
              Book a strategy call with our lead engineers. We'll discuss your workflows and outline exactly how AI can optimize your operations.
            </p>
            <button 
              onClick={() => onNavigate("contact")}
              className="bg-white text-black px-10 py-5 text-sm font-medium tracking-wide hover:scale-[1.02] transition-transform"
            >
              Schedule a Consultation
            </button>
          </FadeIn>
        </div>
      </section>
      
    </div>
  );
}
