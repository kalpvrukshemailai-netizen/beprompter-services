import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Users, DollarSign, Zap, Shield, Clock, Headphones, CheckCircle, ArrowUpRight } from "lucide-react";

function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const WHO_FOR = [
  "Marketing Agencies", "Web Agencies", "Branding Studios", "Software Consultancies",
  "Freelance Developers", "Digital Consultants", "Growth Agencies", "IT Firms",
];

const BENEFITS = [
  {
    icon: ArrowUpRight, title: "White-Label Delivery",
    desc: "We build under your brand. Your clients never know we exist. Full white-label AI systems delivered with your logo and domain.",
    accent: "#60c8ff",
  },
  {
    icon: DollarSign, title: "Revenue Sharing",
    desc: "Earn competitive margins on every project you refer or resell. Transparent pricing with no surprises.",
    accent: "#34d399",
  },
  {
    icon: Users, title: "Dedicated Technical Team",
    desc: "A dedicated pod of AI engineers, developers, and project managers assigned to your partner account.",
    accent: "#a78bfa",
  },
  {
    icon: Zap, title: "Fast Delivery",
    desc: "Most AI systems delivered in 2–6 weeks. We move fast so you can keep your client relationships strong.",
    accent: "#fbbf24",
  },
  {
    icon: Shield, title: "No Hiring Required",
    desc: "Skip the cost and time of building an AI team in-house. Plug directly into our engineering capability.",
    accent: "#fb7185",
  },
  {
    icon: Headphones, title: "Ongoing Support",
    desc: "Post-launch monitoring, updates, and support included. We help you retain clients with reliable long-term service.",
    accent: "#22d3ee",
  },
];

const STEPS = [
  { num: "01", title: "Apply", desc: "Fill out the partner application. We review within 48 hours." },
  { num: "02", title: "Onboard", desc: "Intro call, NDA, pricing structure, and access to partner portal." },
  { num: "03", title: "Submit Projects", desc: "Send us client briefs. We scope, quote, and deliver — white-label." },
  { num: "04", title: "Grow Together", desc: "Scale your AI offering without adding headcount or infrastructure." },
];

const SERVICES = [
  "AI Chatbots", "AI Voice Agents", "Workflow Automation", "WhatsApp Automation",
  "CRM Automation", "Custom AI Agents", "AI Tool Integration", "Custom Software",
  "Web Applications", "Mobile Applications",
];

export function AgencyPartnersPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero */}
      <section className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/40" /> Agency Partner Programme
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
              BECOME AN<br /><span style={{ color: "#60c8ff" }}>AGENCY PARTNER</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
              Offer enterprise-grade AI systems to your clients without building an AI team. We deliver white-label — your brand, our engineering.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={() => onNavigate("contact")}
                className="group flex items-center gap-3 bg-white text-black text-sm font-black tracking-widest uppercase px-8 py-4 hover:bg-white/90 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                BECOME A PARTNER <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => onNavigate("contact")}
                className="group flex items-center gap-3 border border-white/20 text-white text-sm font-black tracking-widest uppercase px-8 py-4 hover:border-white/50 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                BOOK A CALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who this is for */}
      <AnimReveal>
        <div className="border-t border-white/8 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/30 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Built for
            </p>
            <div className="flex flex-wrap gap-2">
              {WHO_FOR.map((label) => (
                <span key={label} className="border border-white/10 text-white/50 text-xs px-3 py-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnimReveal>

      {/* Benefits */}
      <section className="py-20 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-12">
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              What you get
            </p>
            <h2 className="text-white font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              PARTNER BENEFITS
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <AnimReveal key={b.title} delay={i * 0.07}>
                  <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-7 h-full flex flex-col gap-4 hover:border-white/15 transition-colors">
                    <div className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center" style={{ backgroundColor: `${b.accent}18` }}>
                      <Icon size={18} style={{ color: b.accent }} />
                    </div>
                    <div>
                      <h3 className="text-white font-black mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.15rem" }}>{b.title}</h3>
                      <p className="text-white/45 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{b.desc}</p>
                    </div>
                  </div>
                </AnimReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-12">
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              How it works
            </p>
            <h2 className="text-white font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              FOUR STEPS TO PARTNER
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <AnimReveal key={step.num} delay={i * 0.09}>
                <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-7 relative overflow-hidden">
                  <p className="text-white/[0.06] font-black absolute top-4 right-5 select-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "4rem", lineHeight: 1 }}>{step.num}</p>
                  <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.num}</p>
                  <h3 className="text-white font-black mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.2rem" }}>{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
                </div>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services we deliver */}
      <section className="py-20 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-10">
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Services you can resell
            </p>
            <h2 className="text-white font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              FULL AI STACK, WHITE-LABEL
            </h2>
          </AnimReveal>

          <AnimReveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SERVICES.map((s) => (
                <div key={s} className="flex items-center gap-3 py-3 border-b border-white/5">
                  <CheckCircle size={14} className="text-white/25 shrink-0" />
                  <span className="text-white/60 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{s}</span>
                </div>
              ))}
            </div>
          </AnimReveal>
        </div>
      </section>

      {/* CTA */}
      <AnimReveal>
        <section className="border-t border-white/8 py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Ready to add AI to your service stack?
            </p>
            <h2 className="text-white font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.92 }}>
              LET'S GROW<br />TOGETHER
            </h2>
            <p className="text-white/40 text-base mb-10 max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Apply for the partner programme today. Limited spots available for founding partners.
            </p>
            <motion.button
              onClick={() => onNavigate("contact")}
              className="group inline-flex items-center gap-3 bg-white text-black text-sm font-black tracking-widest uppercase px-12 py-5 hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              BECOME A PARTNER <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </section>
      </AnimReveal>
    </div>
  );
}
