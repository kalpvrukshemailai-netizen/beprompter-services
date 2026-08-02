import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Clock, Briefcase, Bot, Zap, MessageSquare, Cpu } from "lucide-react";

function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const PLACEHOLDER_CASES = [
  {
    id: 1, icon: Bot, label: "AI Chatbot", industry: "Healthcare",
    problem: "Manual patient intake and FAQ responses consuming staff hours.",
    solution: "Custom AI chatbot handling appointment scheduling, FAQs, and triage.",
    gradient: "from-blue-950 to-[#0a0a0a]",
    accent: "#60c8ff",
  },
  {
    id: 2, icon: Zap, label: "Workflow Automation", industry: "Real Estate",
    problem: "Lead follow-up delays causing prospects to go cold.",
    solution: "Automated CRM pipeline with AI-driven follow-up sequences and lead scoring.",
    gradient: "from-violet-950 to-[#0a0a0a]",
    accent: "#a78bfa",
  },
  {
    id: 3, icon: MessageSquare, label: "WhatsApp Automation", industry: "Restaurants",
    problem: "High volume of WhatsApp orders handled manually by staff.",
    solution: "Automated order-taking, confirmation, and kitchen notification via WhatsApp API.",
    gradient: "from-emerald-950 to-[#0a0a0a]",
    accent: "#34d399",
  },
  {
    id: 4, icon: Cpu, label: "Custom AI Agent", industry: "Finance",
    problem: "Document-heavy compliance reviews slowing operations.",
    solution: "AI agent that reads, classifies, and flags compliance documents automatically.",
    gradient: "from-amber-950 to-[#0a0a0a]",
    accent: "#fbbf24",
  },
  {
    id: 5, icon: Briefcase, label: "CRM Automation", industry: "Legal",
    problem: "Client onboarding requiring manual data entry across multiple systems.",
    solution: "End-to-end CRM automation syncing intake forms, billing, and case management.",
    gradient: "from-rose-950 to-[#0a0a0a]",
    accent: "#fb7185",
  },
  {
    id: 6, icon: Bot, label: "AI Voice Agent", industry: "E-Commerce",
    problem: "High call volume for order status and returns overwhelming support team.",
    solution: "AI voice agent handling inbound calls for order queries, returns, and escalation.",
    gradient: "from-cyan-950 to-[#0a0a0a]",
    accent: "#22d3ee",
  },
];

export function CaseStudiesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero */}
      <section className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/40" /> Case Studies
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
              REAL PROJECTS.<br /><span style={{ color: "#60c8ff" }}>COMING SOON.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              We are actively deploying AI systems for our early clients. Case studies will be published here once results are verified and clients have approved disclosure.
            </p>
            <p className="text-white/30 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              We believe in publishing only genuine, verified results. No inflated numbers. No fabricated outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notice bar */}
      <AnimReveal>
        <div className="border-t border-b border-white/8 bg-white/[0.02] py-5 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Clock size={14} className="text-white/30 shrink-0" />
            <p className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              Case studies will be updated with live customer projects. Check back soon — or{" "}
              <button onClick={() => onNavigate("contact")} className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">
                reach out directly
              </button>{" "}
              to speak with us about our current work.
            </p>
          </div>
        </div>
      </AnimReveal>

      {/* Placeholder cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-10">
            <p className="text-white/30 text-xs font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Examples of the projects we deliver
            </p>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLACEHOLDER_CASES.map((c, i) => {
              const Icon = c.icon;
              return (
                <AnimReveal key={c.id} delay={i * 0.08}>
                  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${c.gradient} border border-white/8 p-7 h-full flex flex-col`}>
                    {/* Coming soon badge */}
                    <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <span className="text-white/30 text-xs font-semibold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>COMING SOON</span>
                    </div>

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center mb-6" style={{ backgroundColor: `${c.accent}18` }}>
                      <Icon size={18} style={{ color: c.accent }} />
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded" style={{ fontFamily: "'Barlow Condensed', sans-serif", backgroundColor: `${c.accent}20`, color: c.accent }}>
                        {c.label}
                      </span>
                      <span className="text-white/30 text-xs font-semibold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {c.industry}
                      </span>
                    </div>

                    {/* Problem / Solution */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Problem</p>
                        <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{c.problem}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Solution</p>
                        <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{c.solution}</p>
                      </div>
                    </div>

                    {/* Results placeholder */}
                    <div className="mt-6 pt-5 border-t border-white/8">
                      <p className="text-white/20 text-xs mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>RESULTS — PENDING VERIFICATION</p>
                      <div className="flex gap-3">
                        {["Time saved", "Cost reduced", "ROI"].map((label) => (
                          <div key={label} className="flex-1 bg-white/[0.03] rounded p-2 text-center">
                            <p className="text-white/15 text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>—</p>
                            <p className="text-white/20 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px" }}>{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimReveal>
        <section className="border-t border-white/8 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Want to be one of our first published clients?</p>
            <h2 className="text-white font-black mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              LET'S BUILD YOUR CASE STUDY
            </h2>
            <motion.button
              onClick={() => onNavigate("contact")}
              className="group inline-flex items-center gap-3 bg-white text-black text-sm font-black tracking-widest uppercase px-10 py-4 hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              BOOK FREE STRATEGY CALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </section>
      </AnimReveal>
    </div>
  );
}
