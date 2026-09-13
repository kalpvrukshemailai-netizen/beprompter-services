import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Shield, CheckCircle, ArrowRight, Play, MessageSquare,
  Wallet, Server, Key, Headphones, Lock,
  ChevronRight, ExternalLink, Smartphone, Video,
  Database, CloudOff, Users, FileVideo,
} from "lucide-react";

/* ── Fade-in wrapper ── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TRUST PAGE — "Risk Elimination Page"
   Converts skepticism into confidence for Indian SMBs
   hiring a remote 2–3 person team.
   ═══════════════════════════════════════════════════════ */

export function TrustPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [videoHovered, setVideoHovered] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000", color: "#fff" }}>

      {/* ════════════════════════════════════════
          HERO — Don't trust our words, test our work
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(96,200,255,0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 40% at 30% 70%, rgba(52,211,153,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left — Copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-white/10" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#60c8ff" }}>
                  <Shield size={12} />
                  Zero-Risk Partnership
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <span className="text-white/40">We Don't Ask You to</span>{" "}
                  <span style={{ color: "#60c8ff", textShadow: "0 0 40px rgba(96,200,255,0.3)" }}>Trust Our Words.</span>
                  <br />
                  <span className="text-white">Test Our Work.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.16}>
                <p className="text-white/45 text-base md:text-lg leading-relaxed mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Every business owner asks the same silent questions before hiring a remote team: <em className="text-white/60">"Will they disappear with my money? Do they actually know what they're doing? Will they break what I already have?"</em>
                </p>
                <p className="text-white/45 text-base leading-relaxed mb-10" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  This page exists to answer every one of those questions — with verifiable commitments, not vague promises.
                </p>
              </FadeIn>

              <FadeIn delay={0.24}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    href="https://wa.me/917400242444?text=Hi%2C%20I%20want%20to%20test%20your%20AI%20bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-xs font-black tracking-widest uppercase px-6 py-3.5 transition-colors"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      backgroundColor: "#25D366",
                      color: "#000",
                    }}
                    whileHover={{ scale: 1.03, backgroundColor: "#22c55e" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageSquare size={16} />
                    Test Our WhatsApp Bot Live
                    <ExternalLink size={12} style={{ opacity: 0.6 }} />
                  </motion.a>
                  <motion.button
                    onClick={() => onNavigate("contact")}
                    className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-6 py-3.5 border border-white/15 hover:border-white/40 text-white/50 hover:text-white transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Talk to a Human <ArrowRight size={14} />
                  </motion.button>
                </div>
              </FadeIn>
            </div>

            {/* Right — Loom Video Placeholder */}
            <FadeIn delay={0.2}>
              <motion.div
                className="relative border border-white/10 overflow-hidden cursor-pointer"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", aspectRatio: "16/9" }}
                onHoverStart={() => setVideoHovered(true)}
                onHoverEnd={() => setVideoHovered(false)}
                whileHover={{ borderColor: "rgba(96,200,255,0.25)" }}
                onClick={() => {
                  /* placeholder — would open a Loom embed or modal */
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(96,200,255,0.06) 0%, rgba(0,0,0,0.4) 100%)" }} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center border border-white/20"
                    style={{ backgroundColor: "rgba(96,200,255,0.1)" }}
                    animate={{ scale: videoHovered ? 1.15 : 1, borderColor: videoHovered ? "rgba(96,200,255,0.5)" : "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play size={24} className="ml-1" style={{ color: "#60c8ff" }} />
                  </motion.div>
                  <div className="text-center px-6">
                    <p className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#60c8ff" }}>
                      Meet the Team
                    </p>
                    <p className="text-white/30 text-[11px]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      90-second intro from the developers who'll actually build your system
                    </p>
                  </div>
                </div>

                {/* Corner badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 border border-white/8 z-10" style={{ backgroundColor: "rgba(0,0,0,0.6)", fontSize: 9, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                  <FileVideo size={10} /> Loom Video
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════
          SECTION 1 — Zero-Risk Performance Guarantee
          ════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
            {/* Left — Title block */}
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 mb-5" style={{ backgroundColor: "rgba(251,191,36,0.06)" }}>
                  <Wallet size={22} style={{ color: "#fbbf24" }} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2 block" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#fbbf24" }}>Guarantee #1</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  The "Zero‑Risk" <span style={{ color: "#fbbf24" }}>Performance Guarantee</span>
                </h2>
                <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  We don't demand big upfront cheques. You only pay for verified progress.
                </p>
              </div>
            </FadeIn>

            {/* Right — Content */}
            <FadeIn delay={0.12}>
              <div className="border border-white/8 p-7 md:p-9" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
                <p className="text-white/55 text-[15px] leading-[1.85] mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Our development model is broken into <strong className="text-white/80">clear, verifiable milestones</strong>. You test and approve the working prototype on your own phone — before releasing core project payments. If we don't deliver what was agreed at any milestone, you don't pay for that milestone. Simple.
                </p>

                {/* Milestone flow */}
                <div className="space-y-3">
                  {[
                    { step: "01", title: "Discovery & Scoping", badge: "20% Deposit", desc: "We map your exact requirements. You approve a written scope document before any work begins.", accent: "#fbbf24" },
                    { step: "02", title: "Prototype Delivery", badge: "30% Payment", desc: "A working demo you can test on your own device. You verify it does what was promised.", accent: "#fbbf24" },
                    { step: "03", title: "Core Build & Testing", badge: "30% Payment", desc: "Full system development with weekly progress reports. You see every screen, every flow.", accent: "#fbbf24" },
                    { step: "04", title: "Launch & Handover", badge: "20% Final", desc: "Go-live with documentation, video walkthroughs, and full credential transfer to you.", accent: "#fbbf24" },
                  ].map((m, i) => (
                    <motion.div key={m.step}
                      className="flex gap-4 items-start border border-white/5 px-5 py-4"
                      style={{ backgroundColor: "rgba(251,191,36,0.015)" }}
                      whileHover={{ borderColor: "rgba(251,191,36,0.15)", x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-lg font-black shrink-0 w-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: m.accent, opacity: 0.4 }}>{m.step}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-black tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{m.title}</div>
                          <div className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: m.accent, borderColor: "rgba(251,191,36,0.3)", backgroundColor: "rgba(251,191,36,0.05)" }}>
                            {m.badge}
                          </div>
                        </div>
                        <div className="text-white/35 text-[13px] leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{m.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════
          SECTION 2 — Technical Transparency & System Safety
          ════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 border-t border-white/5" style={{ backgroundColor: "rgba(96,200,255,0.015)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 mb-5" style={{ backgroundColor: "rgba(96,200,255,0.06)" }}>
                  <Server size={22} style={{ color: "#60c8ff" }} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2 block" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#60c8ff" }}>Guarantee #2</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Technical Transparency & <span style={{ color: "#60c8ff" }}>System Safety</span>
                </h2>
                <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Your current systems keep running. Our automation works alongside, never against, what you already have.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="border border-white/8 p-7 md:p-9" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
                <p className="text-white/55 text-[15px] leading-[1.85] mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  We practise <strong className="text-white/80">non‑destructive integration</strong>. Our AI agents, WhatsApp automations, and workflow systems act as a smart layer <em>on top</em> of your current setup. We do not alter your core databases without full offline backups, and we use <strong className="text-white/80">secure middleware</strong> (n8n / Make) to ensure your data stays fully protected.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Database, text: "Full offline backups before any integration" },
                    { icon: Server, text: "Secure middleware — never direct database writes" },
                    { icon: CloudOff, text: "Kill-switch to instantly disable any automation" },
                    { icon: Shield, text: "Staging environment tested before going live" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div key={i}
                        className="flex items-start gap-3 border border-white/5 px-4 py-3.5"
                        style={{ backgroundColor: "rgba(96,200,255,0.02)" }}
                        whileHover={{ borderColor: "rgba(96,200,255,0.15)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon size={15} className="mt-0.5 shrink-0" style={{ color: "#60c8ff", opacity: 0.6 }} />
                        <span className="text-white/45 text-[13px] leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════
          SECTION 3 — Clear Ownership & No Vendor Lock-In
          ════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 mb-5" style={{ backgroundColor: "rgba(52,211,153,0.06)" }}>
                  <Key size={22} style={{ color: "#34d399" }} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2 block" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#34d399" }}>Guarantee #3</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  100% Ownership & <span style={{ color: "#34d399" }}>No Vendor Lock‑In</span>
                </h2>
                <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Your business should never depend on us just to stay online.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="border border-white/8 p-7 md:p-9" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
                <p className="text-white/55 text-[15px] leading-[1.85] mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  You own <strong className="text-white/80">100% of your digital assets</strong>. Once the system is built, the official Meta WhatsApp API credentials, server tokens, and database accounts belong entirely to you. We provide <strong className="text-white/80">step-by-step video handoffs</strong> so your business is never dependent on us just to stay online.
                </p>

                <div className="space-y-3">
                  {[
                    "All source code delivered in open, standard formats",
                    "WhatsApp API credentials registered under your business",
                    "Server & database logins transferred to your accounts",
                    "Detailed video walkthroughs for every system component",
                    "Documentation so any developer can maintain the system",
                    "No recurring licence fees tied to our platform",
                  ].map((item, i) => (
                    <motion.div key={i}
                      className="flex items-center gap-3 border border-white/5 px-5 py-3"
                      style={{ backgroundColor: "rgba(52,211,153,0.015)" }}
                      whileHover={{ borderColor: "rgba(52,211,153,0.15)", x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle size={15} className="shrink-0" style={{ color: "#34d399" }} />
                      <span className="text-white/50 text-[13px]" style={{ fontFamily: "'Barlow', sans-serif" }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════
          SECTION 4 — Direct Access Support Promise
          ════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 border-t border-white/5" style={{ backgroundColor: "rgba(167,139,250,0.015)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 mb-5" style={{ backgroundColor: "rgba(167,139,250,0.06)" }}>
                  <Headphones size={22} style={{ color: "#a78bfa" }} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2 block" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#a78bfa" }}>Guarantee #4</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  The "Direct Access" <span style={{ color: "#a78bfa" }}>Support Promise</span>
                </h2>
                <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  No bots. No ticket queues. Talk to the people actually writing your code.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="border border-white/8 p-7 md:p-9" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
                <p className="text-white/55 text-[15px] leading-[1.85] mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Large agencies hide behind slow support tickets and robotic email threads. When you partner with us, you get a <strong className="text-white/80">dedicated WhatsApp support group</strong> directly connected to the 2–3 developers actually writing your code. We provide <strong className="text-white/80">human updates within hours</strong>, not days.
                </p>

                {/* How it works — 3 cards */}
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: MessageSquare, title: "WhatsApp Group", desc: "Dedicated project group with your entire dev team", accent: "#a78bfa" },
                    { icon: Users, title: "Real Humans", desc: "Direct access to the developers building your system", accent: "#a78bfa" },
                    { icon: Smartphone, title: "Hours, Not Days", desc: "Updates and responses within working hours, same day", accent: "#a78bfa" },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.div key={card.title}
                        className="border border-white/6 p-5 text-center"
                        style={{ backgroundColor: "rgba(167,139,250,0.02)" }}
                        whileHover={{ borderColor: "rgba(167,139,250,0.2)", y: -3 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Icon size={20} className="mx-auto mb-3" style={{ color: card.accent, opacity: 0.6 }} />
                        <div className="text-xs font-black tracking-wider uppercase mb-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{card.title}</div>
                        <div className="text-white/30 text-[11px] leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{card.desc}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════
          SECTION 5 — Open Data Privacy Commitment
          ════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 mb-5" style={{ backgroundColor: "rgba(244,114,182,0.06)" }}>
                  <Lock size={22} style={{ color: "#f472b6" }} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2 block" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#f472b6" }}>Guarantee #5</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Open Data <span style={{ color: "#f472b6" }}>Privacy Commitment</span>
                </h2>
                <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Your customer conversations and business data are never used to train public AI models.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="border border-white/8 p-7 md:p-9" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
                <p className="text-white/55 text-[15px] leading-[1.85] mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Your customer data is <strong className="text-white/80">never used to train public models</strong>. We utilise secure enterprise APIs (like OpenAI Enterprise and Meta Business Developer tools) ensuring that your leads, conversations, and business data remain <strong className="text-white/80">strictly confidential and private to your firm</strong>.
                </p>

                <div className="border border-white/6 p-6" style={{ backgroundColor: "rgba(244,114,182,0.02)" }}>
                  <div className="text-xs font-black tracking-[0.18em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#f472b6" }}>
                    Our Data Promise
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Zero data used for public AI training",
                      "Enterprise-grade API integrations only",
                      "Encrypted at rest and in transit",
                      "Regular access audits and logging",
                      "Data deletion on contract termination",
                      "GDPR-aligned data handling practices",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "#f472b6" }} />
                        <span className="text-white/40 text-[13px]" style={{ fontFamily: "'Barlow', sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════
          FINAL CTA — Still skeptical? Good.
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 border-t border-white/5" style={{ background: "linear-gradient(180deg, rgba(96,200,255,0.03) 0%, transparent 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Still Skeptical? <span style={{ color: "#60c8ff" }}>Good.</span>
            </h2>
            <p className="text-white/40 text-base mb-4 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
              That means you care about your business. We'd rather earn your trust through a 15-minute call and a live demo than through a paragraph on a website.
            </p>
            <p className="text-white/25 text-sm mb-10 max-w-lg mx-auto" style={{ fontFamily: "'Barlow', sans-serif" }}>
              No contracts. No commitments. Just a conversation to see if we're the right fit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://wa.me/917400242444?text=Hi%2C%20I'd%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-xs font-black tracking-widest uppercase px-7 py-3.5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", backgroundColor: "#25D366", color: "#000" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageSquare size={16} />
                WhatsApp Us Directly
              </motion.a>
              <motion.button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2 bg-white text-black text-xs font-black tracking-widest uppercase px-7 py-3.5 hover:bg-white/90 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Book a Discovery Call <ArrowRight size={14} />
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
