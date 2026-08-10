import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, MessageCircle, Settings, Users, Globe, Database, Zap, Bot, Mail, Home, LayoutDashboard, Building2, MapPin, Calendar, Smartphone, FileText, CheckCircle } from "lucide-react";

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
].join(",");

const SERVICES_CYCLE = [
  "PROPERTY LEAD GENERATION",
  "WHATSAPP AUTOMATION",
  "AI SALES AGENTS",
  "PROPERTY WEBSITES",
  "WORKFLOW AUTOMATION",
];

export function HomePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [serviceIdx, setServiceIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setServiceIdx((i) => (i + 1) % SERVICES_CYCLE.length), 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff" }}>
      
      {/* =========================================================
          SECTION 1: HERO SECTION & LEAD SYSTEM ANIMATION
          ========================================================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-white/10" style={{ paddingTop: "120px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: STARS_BG, opacity: 0.4 }} />
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pb-16">
          <div className="lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-3 border border-white/20 bg-white/5 px-4 py-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white/80 text-[10px] font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  AI SYSTEMS FOR REAL ESTATE
                </span>
              </div>
              <h1 className="leading-[0.9] uppercase select-none text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(3.5rem, 7vw, 6rem)" }}>
                TURN PROPERTY<br />ENQUIRIES INTO<br />SITE VISITS.
              </h1>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                AI-powered lead generation, WhatsApp automation, CRM workflows and sales agents built around your real-estate business.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => onNavigate("contact")}
                  className="bg-white text-black text-xs font-black tracking-widest uppercase px-8 py-4 hover:bg-white/90 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  GET A FREE AI WORKFLOW AUDIT
                </motion.button>
                <motion.button
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-white/30 text-white text-xs font-black tracking-widest uppercase px-8 py-4 hover:border-white hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  SEE HOW IT WORKS
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            {/* Cinematic Interactive Workflow Visualization */}
            <motion.div 
              className="relative w-full aspect-square md:aspect-[4/3] border border-white/10 p-6 flex flex-col justify-center overflow-hidden bg-[#050505]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="absolute inset-0 z-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)" }} />
              
              <div className="relative z-10 flex flex-col gap-4">
                {[
                  { label: "PROPERTY ENQUIRY", icon: Globe, delay: 0 },
                  { label: "AI RESPONSE", icon: Bot, delay: 1.5 },
                  { label: "QUALIFICATION", icon: Settings, delay: 3 },
                  { label: "CRM", icon: Database, delay: 4.5 },
                  { label: "FOLLOW-UP", icon: MessageCircle, delay: 6 },
                  { label: "SALES TEAM", icon: Users, delay: 7.5 },
                  { label: "SITE VISIT", icon: Calendar, delay: 9 },
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-3"
                    initial={{ opacity: 0, x: -20, backgroundColor: "rgba(255,255,255,0.05)" }}
                    animate={{ 
                      opacity: [0, 1, 1], 
                      x: [ -20, 0, 0],
                      backgroundColor: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"],
                      borderColor: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.1)"]
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: step.delay, 
                      repeat: Infinity, 
                      repeatDelay: 10.5,
                      times: [0, 0.1, 1] 
                    }}
                  >
                    <step.icon size={16} className="text-white/60" />
                    <span className="text-white font-bold tracking-widest text-xs uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
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

      {/* =========================================================
          SECTION 2: THE PROBLEM
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimReveal>
              <h2 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
                YOUR NEXT LEAD IS<br />ALREADY WAITING.
              </h2>
              <div className="flex flex-col gap-4 mb-10 border-l border-white/20 pl-6">
                {[
                  "NEW ENQUIRY",
                  "SALESPERSON BUSY",
                  "RESPONSE DELAYED",
                  "NO FOLLOW-UP",
                  "LEAD GOES COLD"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <span className="text-white/50 text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-white leading-[0.92] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 900 }}>
                WE AUTOMATE THE GAP.
              </h3>
              <p className="text-white/60 text-base max-w-md leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                BePrompter connects lead capture, AI qualification, CRM and automated follow-ups into a single seamless workflow. Your leads are engaged instantly, qualified automatically, and handed to sales when they are ready to buy.
              </p>
            </AnimReveal>
            <AnimReveal delay={0.2} direction="left">
               <div className="w-full aspect-square md:aspect-[4/3] bg-[#111] border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                 <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
                    <div className="bg-white/5 border border-white/10 p-4 opacity-50"><p className="text-white/50 text-xs font-bold font-mono">10:00 AM - WhatsApp Enquiry</p></div>
                    <div className="bg-white/5 border border-white/10 p-4 opacity-50"><p className="text-white/50 text-xs font-bold font-mono">11:30 AM - Salesperson Available</p></div>
                    <div className="bg-white/5 border border-white/10 p-4 opacity-50"><p className="text-white/50 text-xs font-bold font-mono">11:35 AM - Reply Sent</p></div>
                    <div className="bg-red-500/10 border border-red-500/30 p-4"><p className="text-red-400 text-xs font-bold font-mono uppercase text-center tracking-widest">Lead Lost to Competitor</p></div>
                 </div>
               </div>
            </AnimReveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: FLAGSHIP PRODUCT (THE REAL ESTATE AI LEAD SYSTEM)
          ========================================================= */}
      <section id="real-estate-ai-system" className="py-32 lg:py-48 bg-[#050505] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 w-full text-center mb-24">
          <AnimReveal>
            <h2 className="text-white leading-[0.92] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, 6vw, 5rem)", fontWeight: 900 }}>
              THE REAL ESTATE<br />AI LEAD SYSTEM
            </h2>
            <p className="text-white/50 text-sm font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              FROM FIRST ENQUIRY TO BOOKED SITE VISIT.
            </p>
          </AnimReveal>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
          {[
            { step: "01", title: "AD / WEBSITE / WHATSAPP", desc: "A prospect sees your property ad and clicks to enquire on WhatsApp or your website." },
            { step: "02", title: "LEAD CAPTURE", desc: "The lead's contact information is instantly captured in your database." },
            { step: "03", title: "AI RESPONSE", desc: "Within seconds, an AI agent replies to the prospect, introducing the project." },
            { step: "04", title: "LEAD QUALIFICATION", desc: "The AI asks qualifying questions: budget, preferred location, property type (e.g., 3BHK)." },
            { step: "05", title: "CRM", desc: "The qualified data is pushed directly to your CRM (Salesforce, Zoho, etc.)." },
            { step: "06", title: "AUTOMATED FOLLOW-UP", desc: "If the lead goes cold, an automated follow-up sequence triggers to re-engage them." },
            { step: "07", title: "SALES TEAM ALERT", desc: "Once a lead is marked HOT, a notification is sent to the assigned salesperson." },
            { step: "08", title: "SITE VISIT", desc: "The salesperson takes over to finalize and book the site visit." },
          ].map((item, idx) => (
            <AnimReveal key={idx} delay={0.1}>
              <div className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`md:w-1/2 flex ${idx % 2 === 0 ? "justify-end text-right" : "justify-start text-left"}`}>
                  <div className="max-w-xs">
                    <h3 className="text-white font-black mb-2 tracking-widest text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0 z-10 relative">
                  <span className="text-white font-bold text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.step}</span>
                </div>
                <div className="md:w-1/2" />
              </div>
            </AnimReveal>
          ))}
        </div>
      </section>

      <WarpDivider />

      {/* =========================================================
          SECTION 4: FIVE SERVICES ONLY
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-16">
            <h2 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              OUR CORE SERVICES
            </h2>
            <p className="text-white/50 text-sm font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              BUILT FOR REAL ESTATE
            </p>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "PROPERTY LEAD GENERATION", 
                desc: "Generate qualified property enquiries through conversion-focused campaigns, landing pages and AI-assisted lead qualification.", 
                caps: ["lead-generation campaigns", "property landing pages", "enquiry forms", "AI lead qualification", "lead source tracking", "lead routing", "conversion funnels"]
              },
              { 
                title: "WHATSAPP & CRM AUTOMATION", 
                desc: "Capture, qualify and follow up with property enquiries automatically so fewer opportunities are forgotten.", 
                caps: ["WhatsApp lead capture", "instant responses", "AI qualification", "CRM integration", "automated follow-ups", "lead assignment", "site-visit reminders", "lead status tracking"]
              },
              { 
                title: "AI PROPERTY SALES AGENTS", 
                desc: "AI agents that answer buyer questions, qualify prospects and hand serious buyers to your sales team.", 
                caps: ["property questions", "budget collection", "location preference", "property type", "purchase timeline", "lead qualification", "property information", "appointment scheduling", "human handoff"]
              },
              { 
                title: "PROPERTY WEBSITES & LEAD FUNNELS", 
                desc: "Turn property traffic into enquiries and site visits with conversion-focused websites and landing pages.", 
                caps: ["property listings", "project pages", "property landing pages", "enquiry forms", "WhatsApp CTA", "call CTA", "lead capture", "analytics", "CRM integration", "site-visit booking"]
              },
              { 
                title: "WORKFLOW AUTOMATION", 
                desc: "Connect leads, CRM, WhatsApp and sales operations into one automated workflow.", 
                caps: ["Lead → CRM", "CRM → WhatsApp", "New enquiry → salesperson notification", "Qualified lead → sales team", "Site visit → reminder", "Inactive lead → follow-up", "Form submission → CRM"]
              }
            ].map((s, i) => (
              <AnimReveal key={s.title} delay={i * 0.1}>
                <div className="border border-white/10 bg-white/5 p-8 h-full hover:bg-white/10 transition-colors">
                  <h3 className="text-white font-black mb-4 tracking-widest text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 h-20" style={{ fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.caps.map(c => (
                      <span key={c} className="bg-black border border-white/10 text-white/40 text-[10px] px-2 py-1 uppercase tracking-wider font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: SEE WHAT WE CAN BUILD (DEMO BUILDS)
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-[#111] border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimReveal className="mb-16 text-center">
            <h2 className="text-white leading-[0.92] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              SEE WHAT WE CAN BUILD.
            </h2>
            <p className="text-white/50 text-sm font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Explore our working demonstrations.
            </p>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "AI PROPERTY SALES AGENT",
                desc: "Interactive WhatsApp-style conversation flow.",
                points: ["Property matching", "Qualification", "HOT lead scoring", "Site visit booking"],
                preview: (
                  <div className="flex flex-col gap-3 p-4 bg-[#0a0a0a] rounded border border-white/10 text-xs font-mono w-full h-48 overflow-hidden">
                    <div className="self-end bg-blue-900/40 border border-blue-500/30 text-white px-3 py-2 max-w-[80%] rounded-l-lg rounded-tr-lg">I'm looking for a 3BHK in Ahmedabad.</div>
                    <div className="self-start bg-white/10 border border-white/20 text-white px-3 py-2 max-w-[80%] rounded-r-lg rounded-tl-lg">What is your approximate budget?</div>
                    <div className="self-end bg-blue-900/40 border border-blue-500/30 text-white px-3 py-2 max-w-[80%] rounded-l-lg rounded-tr-lg">₹80 lakh.</div>
                    <div className="self-start bg-white/10 border border-white/20 text-white px-3 py-2 max-w-[80%] rounded-r-lg rounded-tl-lg">Which areas do you prefer? We have options in SG Highway.</div>
                  </div>
                )
              },
              {
                title: "REAL ESTATE LEAD CRM",
                desc: "Automated pipeline management interface.",
                points: ["Total leads: 142", "Hot leads: 18", "Lead source tracking", "Site-visit status"],
                preview: (
                  <div className="flex flex-col gap-2 p-4 bg-[#0a0a0a] rounded border border-white/10 text-[10px] uppercase tracking-wider font-mono w-full h-48 overflow-hidden">
                    <div className="grid grid-cols-4 gap-2 text-white/40 pb-2 border-b border-white/10">
                      <span>Name</span><span>Budget</span><span>Status</span><span>Action</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-white/80 py-2 border-b border-white/5">
                      <span>R. Sharma</span><span>₹80L</span><span className="text-green-400">HOT</span><span>Book Visit</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-white/80 py-2 border-b border-white/5">
                      <span>A. Patel</span><span>₹1.2Cr</span><span className="text-yellow-400">WARM</span><span>Follow-up</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-white/80 py-2 border-b border-white/5">
                      <span>S. Desai</span><span>₹60L</span><span className="text-blue-400">NEW</span><span>Qualify</span>
                    </div>
                  </div>
                )
              },
              {
                title: "PROPERTY WEBSITE & LEAD FUNNEL",
                desc: "Conversion-focused fictional property project.",
                points: ["The Grand Residences", "3 & 4 BHK", "Enquiry CTA", "WhatsApp CTA"],
                preview: (
                  <div className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a] rounded border border-white/10 w-full h-48 overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black z-10"></div>
                     <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                     <div className="relative z-20 text-center">
                        <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>THE GRAND RESIDENCES</h4>
                        <p className="text-white/60 text-[10px] mb-4 uppercase tracking-widest font-mono">Ahmedabad • 3 & 4 BHK</p>
                        <div className="flex gap-2 justify-center">
                          <div className="bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Book Visit</div>
                          <div className="bg-green-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">WhatsApp</div>
                        </div>
                     </div>
                  </div>
                )
              },
              {
                title: "END-TO-END AI LEAD AUTOMATION",
                desc: "Visually impressive workflow simulation.",
                points: ["Ad -> Lead -> AI", "Qualification -> CRM", "Follow-up -> HOT Lead", "Sales Team -> Site Visit"],
                preview: (
                  <div className="flex items-center justify-center p-4 bg-[#0a0a0a] rounded border border-white/10 w-full h-48 overflow-hidden">
                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-mono text-white/60">
                        <div className="bg-white/10 p-2 rounded">AD</div>
                        <ArrowRight size={10} />
                        <div className="bg-white/10 p-2 rounded">AI</div>
                        <ArrowRight size={10} />
                        <div className="bg-white/10 p-2 rounded">CRM</div>
                        <ArrowRight size={10} />
                        <div className="bg-white/10 p-2 rounded text-white border border-white/30">VISIT</div>
                     </div>
                  </div>
                )
              }
            ].map((demo, i) => (
              <AnimReveal key={demo.title} delay={i * 0.1}>
                <div className="border border-white/10 bg-black p-8 group">
                  <div className="inline-block bg-white/10 border border-white/20 text-white/60 text-[10px] px-2 py-1 uppercase tracking-widest font-bold mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    DEMO BUILD — NOT A CLIENT PROJECT
                  </div>
                  <h3 className="text-white font-black mb-2 tracking-widest text-xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{demo.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{demo.desc}</p>
                  
                  {demo.preview}
                  
                  <ul className="mt-6 space-y-2">
                    {demo.points.map(p => (
                      <li key={p} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                        <span className="text-white/50 text-xs font-mono uppercase tracking-wider">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      <WarpDivider />

      {/* =========================================================
          SECTION 6: HOW WE WORK
          ========================================================= */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-16">
            <h2 className="text-white leading-[0.92] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              FROM PROBLEM TO DEPLOYMENT.
            </h2>
            <p className="text-white/50 text-sm font-bold tracking-[0.25em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              HOW WE WORK
            </p>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/10">
            {[
              { n: "01", title: "DISCOVER", desc: "We understand your current lead and sales workflow." },
              { n: "02", title: "DESIGN",   desc: "We identify where AI and automation can remove repetitive work." },
              { n: "03", title: "BUILD",    desc: "We build and integrate the system around your existing tools." },
              { n: "04", title: "OPTIMIZE", desc: "We monitor, improve and refine the workflow after deployment." },
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
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 7: WHY BEPROMPTER
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-[#111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-16">
            <h2 className="text-white leading-[0.92] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              BUILT AROUND<br />YOUR BUSINESS.
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: "REAL-ESTATE FOCUSED", desc: "We design around property sales workflows." },
              { icon: Settings, title: "CUSTOM SYSTEMS", desc: "We build around your existing processes and tools." },
              { icon: Bot, title: "AI + AUTOMATION", desc: "AI handles repetitive work while your team focuses on high-value conversations." },
              { icon: ArrowRight, title: "END-TO-END", desc: "From lead capture to CRM, follow-up and site visits." },
            ].map((p, i) => (
              <AnimReveal key={p.title} delay={i * 0.1}>
                <div className="border border-white/10 bg-white/5 p-8 h-full">
                  <p.icon size={24} className="text-white/30 mb-6" />
                  <h3 className="text-white font-black mb-3 tracking-widest text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{p.desc}</p>
                </div>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 8: WHO WE SERVE
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-16 text-center">
            <h2 className="text-white leading-[0.92]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
              BUILT FOR REAL ESTATE<br />SALES TEAMS.
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              { title: "REAL ESTATE AGENCIES", desc: "Automate lead handling across your sales team." },
              { title: "BROKERAGES", desc: "Centralize and automate property enquiries." },
              { title: "PROPERTY DEVELOPERS", desc: "Manage project enquiries and site-visit workflows." },
              { title: "HIGH-VOLUME AGENTS", desc: "Respond to and follow up with more prospects automatically." },
            ].map((c, i) => (
              <AnimReveal key={c.title} delay={i * 0.1}>
                <div className="bg-black p-8 h-full hover:bg-white/5 transition-colors text-center border border-transparent hover:border-white/10">
                  <h3 className="text-white font-black mb-3 tracking-widest text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{c.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{c.desc}</p>
                </div>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 9: TRUST WITHOUT FAKE SOCIAL PROOF
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-[#111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimReveal>
              <h2 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900 }}>
                WHAT YOU CAN EXPECT
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                We believe in delivering measurable business value and professional engineering, without relying on fabricated claims or generic templates.
              </p>
            </AnimReveal>
            <AnimReveal delay={0.2}>
              <ul className="space-y-4">
                {[
                  "Clear workflow audit",
                  "Custom system design",
                  "Transparent scope",
                  "Integration with existing tools",
                  "Deployment support",
                  "Post-launch optimization"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 border border-white/10 bg-white/5 px-6 py-4">
                    <CheckCircle size={16} className="text-white/50" />
                    <span className="text-white font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimReveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 10 & 11: FREE AI WORKFLOW AUDIT & FINAL CTA
          ========================================================= */}
      <section className="py-32 lg:py-48 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.15), transparent 60%)" }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimReveal>
            <h2 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900 }}>
              HOW MANY LEADS ARE YOU LOSING TO MANUAL FOLLOW-UP?
            </h2>
            <h3 className="text-white/80 leading-[0.92] mb-8 uppercase tracking-widest font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
              SHOW US YOUR SALES WORKFLOW.
            </h3>
            <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Let's identify where your current lead workflow can be automated. Tell us how you currently handle property enquiries, and we'll identify where AI and automation could improve your workflow.
            </p>
            
            <motion.button
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-3 bg-white text-black text-sm font-black tracking-widest uppercase px-12 py-5 hover:bg-white/90 transition-colors group"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              GET A FREE AI WORKFLOW AUDIT <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </AnimReveal>
        </div>
      </section>

    </div>
  );
}
