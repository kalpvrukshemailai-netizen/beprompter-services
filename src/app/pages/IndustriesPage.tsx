import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ArrowRight, Heart, Home, UtensilsCrossed, Factory, GraduationCap, Landmark, Scale, ShoppingBag, Megaphone } from "lucide-react";

function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const INDUSTRIES = [
  {
    id: "healthcare", Icon: Heart, name: "Healthcare",
    desc: "AI-powered patient intake, appointment scheduling bots, symptom checkers, and HIPAA-compliant automation for clinics and health networks.",
    services: ["Patient Intake Automation", "Appointment AI", "Medical Chatbots", "Billing Automation"],
    accent: "#fb7185",
  },
  {
    id: "realestate", Icon: Home, name: "Real Estate",
    desc: "Lead qualification agents, automated follow-up sequences, property search bots, and CRM automation for agencies and brokerages.",
    services: ["Lead Qualification AI", "CRM Automation", "Property Chatbots", "Follow-up Sequences"],
    accent: "#60c8ff",
  },
  {
    id: "restaurants", Icon: UtensilsCrossed, name: "Restaurants",
    desc: "WhatsApp ordering automation, reservation management bots, customer feedback collection, and loyalty programme automation.",
    services: ["WhatsApp Order Bot", "Reservation AI", "Feedback Automation", "Loyalty Workflows"],
    accent: "#fb923c",
  },
  {
    id: "manufacturing", Icon: Factory, name: "Manufacturing",
    desc: "Process automation, supply chain monitoring agents, quality control AI, and internal workflow systems for production environments.",
    services: ["Process Automation", "Supply Chain AI", "Quality Control", "Internal Workflows"],
    accent: "#a78bfa",
  },
  {
    id: "education", Icon: GraduationCap, name: "Education",
    desc: "AI tutoring assistants, student support chatbots, enrolment automation, and administrative process streamlining for schools and EdTech platforms.",
    services: ["AI Tutoring Bots", "Student Support", "Enrolment Automation", "Admin Workflows"],
    accent: "#34d399",
  },
  {
    id: "finance", Icon: Landmark, name: "Finance",
    desc: "Document processing AI, compliance automation, client onboarding bots, and intelligent reporting for financial services firms.",
    services: ["Document AI", "Compliance Automation", "Onboarding Bots", "Reporting Agents"],
    accent: "#fbbf24",
  },
  {
    id: "legal", Icon: Scale, name: "Legal",
    desc: "Client intake automation, contract review AI, document classification, and billing workflow automation for law firms and legal teams.",
    services: ["Client Intake AI", "Contract Review", "Document Automation", "Billing Workflows"],
    accent: "#e879f9",
  },
  {
    id: "ecommerce", Icon: ShoppingBag, name: "E-Commerce",
    desc: "Customer support AI, order status agents, returns automation, product recommendation engines, and abandoned cart recovery bots.",
    services: ["Support AI", "Order Agents", "Returns Automation", "Recommendation Engine"],
    accent: "#22d3ee",
  },
  {
    id: "agencies", Icon: Megaphone, name: "Marketing Agencies",
    desc: "White-label AI delivery, automated reporting, client onboarding workflows, and AI tools your agency can resell or embed into client projects.",
    services: ["White-Label AI", "Report Automation", "Client Onboarding", "Resellable AI Tools"],
    accent: "#4ade80",
  },
];

export function IndustriesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = INDUSTRIES.find((i) => i.id === activeId);

  return (
    <div style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero */}
      <section className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/40" /> Industries
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
              AI SOLUTIONS<br /><span style={{ color: "#60c8ff" }}>FOR EVERY SECTOR</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              We build AI systems and automation tailored to the specific workflows, compliance requirements, and growth levers of each industry we serve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry cards grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.Icon;
              const isActive = activeId === ind.id;
              return (
                <motion.div
                  key={ind.id}
                  className="relative overflow-hidden rounded-xl border cursor-pointer group p-7 flex flex-col gap-5 transition-colors"
                  style={{ backgroundColor: isActive ? "#111" : "#0d0d0d", borderColor: isActive ? ind.accent + "55" : "rgba(255,255,255,0.07)" }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveId(isActive ? null : ind.id)}
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center" style={{ backgroundColor: `${ind.accent}18` }}>
                    <Icon size={18} style={{ color: ind.accent }} />
                  </div>

                  {/* Name & desc */}
                  <div>
                    <h3 className="text-white font-black mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.25rem" }}>{ind.name}</h3>
                    <p className="text-white/45 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{ind.desc}</p>
                  </div>

                  {/* Services */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-white/8">
                          <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>What we build</p>
                          <div className="flex flex-wrap gap-2 mb-5">
                            {ind.services.map((s) => (
                              <span key={s} className="border text-xs px-2.5 py-1 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", borderColor: `${ind.accent}40`, color: ind.accent + "cc" }}>
                                {s}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); onNavigate("contact"); }}
                            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors group/btn"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", color: ind.accent }}
                          >
                            DISCUSS YOUR PROJECT <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Arrow indicator */}
                  <div className="absolute top-5 right-5">
                    <motion.div animate={{ rotate: isActive ? 90 : -45 }} transition={{ duration: 0.25 }}>
                      <ArrowRight size={14} style={{ color: isActive ? ind.accent : "rgba(255,255,255,0.2)" }} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimReveal>
        <section className="border-t border-white/8 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Don't see your industry?
            </p>
            <h2 className="text-white font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              WE BUILD FOR ANY BUSINESS
            </h2>
            <p className="text-white/40 text-base mb-8 max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              If your business has repetitive processes, customer interactions, or data workflows — we can automate and improve them with AI.
            </p>
            <motion.button
              onClick={() => onNavigate("contact")}
              className="group inline-flex items-center gap-3 bg-white text-black text-sm font-black tracking-widest uppercase px-10 py-4 hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              BOOK FREE AI STRATEGY CALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </section>
      </AnimReveal>
    </div>
  );
}
