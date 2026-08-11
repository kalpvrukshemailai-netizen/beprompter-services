import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, MessageCircle, Settings, Users, Globe, Database, Zap, Bot, Mail, Home, LayoutDashboard, Building2, MapPin, Calendar, Smartphone, FileText, CheckCircle } from "lucide-react";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import { TiltCard } from "@/app/components/ui/TiltCard";

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
      <div style={{ position: "relative", height: "1px", background: "rgba(255,255,255,0.1)", overflow: "hidden", zIndex: 10 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
          animation: "warpSlide 3.5s linear infinite",
        }} />
      </div>
    </>
  );
}

const BUILDING_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577700547072-466d62fdb0b7?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=2070&auto=format&fit=crop"
];

function GlobalBuildingBg() {
  const { scrollYProgress } = useScroll();
  // Parallax layers for building animations
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-transparent">
      {/* Background Skyline (Slow Parallax) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        <motion.img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-[120%] object-cover opacity-40"
        />
      </motion.div>

      {/* Midground Isolated Building (Medium Parallax + Slide up) */}
      <motion.div style={{ y: y2 }} className="absolute inset-x-0 bottom-[-10%] h-[90%] flex justify-end pr-[10%]">
         <motion.img 
           src="https://images.unsplash.com/photo-1577700547072-466d62fdb0b7?q=80&w=2070&auto=format&fit=crop"
           initial={{ opacity: 0, y: 150 }}
           animate={{ opacity: 0.4, y: 0 }}
           transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           className="w-auto h-full object-cover opacity-60"
         />
      </motion.div>

      {/* Foreground Low-Angle Building (Fast Parallax + Slide up) */}
      <motion.div style={{ y: y3 }} className="absolute inset-x-0 bottom-[-20%] h-[80%] flex justify-start pl-[5%]">
         <motion.img 
           src="https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=2070&auto=format&fit=crop"
           initial={{ opacity: 0, y: 200 }}
           animate={{ opacity: 0.5, y: 0 }}
           transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
           className="w-auto h-full object-cover opacity-80"
         />
      </motion.div>

      {/* Basic Overlays so text remains readable */}
      <div className="absolute inset-0 bg-transparent/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
    </div>
  );
}

const SERVICES_CYCLE = [
  "PROPERTY LEAD GENERATION",
  "WHATSAPP AUTOMATION",
  "AI SALES AGENTS",
  "PROPERTY WEBSITES",
  "WORKFLOW AUTOMATION",
];

export function RealEstateIndustryPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  return (
    <div className="text-white selection:bg-white selection:text-black font-sans relative min-h-screen">
      <GlobalBuildingBg />
      
      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative min-h-[95vh] flex flex-col justify-center border-b border-white/10 pt-24 pb-16">
        

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pb-16">
          <div className="lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-3 border border-white/20 bg-white/5 px-4 py-2 mb-8 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white/80 text-[10px] font-bold font-mono tracking-[0.25em] uppercase">
                  AI SYSTEMS FOR REAL ESTATE
                </span>
              </div>
              <h1 className="font-heading leading-[0.92] uppercase select-none text-white mb-6 font-black" style={{ fontSize: "clamp(3.5rem, 7vw, 6rem)" }}>
                <SplitText text="TURN PROPERTY" /><br />
                <SplitText text="ENQUIRIES INTO" /><br />
                <SplitText text="SITE VISITS." />
              </h1>
              <p className="text-white/60 text-base max-w-md leading-relaxed mb-10 font-sans">
                AI-powered lead generation, WhatsApp automation, CRM workflows and sales agents built around your real-estate business.
              </p>
              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  onClick={() => onNavigate("contact")}
                  className="bg-white text-black text-xs font-heading font-black tracking-widest uppercase px-8 py-4"
                >
                  GET A FREE AI WORKFLOW AUDIT
                </MagneticButton>
                <MagneticButton
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-white/30 text-white hover:bg-white/5 text-xs font-heading font-black tracking-widest uppercase px-8 py-4"
                >
                  SEE HOW IT WORKS
                </MagneticButton>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            {/* Cinematic Interactive Workflow Visualization */}
            <TiltCard>
              <motion.div 
                className="relative w-full aspect-square md:aspect-[4/3] border border-white/10 p-6 flex flex-col justify-center overflow-hidden bg-black/80 backdrop-blur-xl rounded-xl shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <div className="absolute inset-0 z-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)" }} />
                
                <div className="relative z-10 flex flex-col gap-4 max-w-sm mx-auto w-full">
                  {[
                    { label: "PROPERTY ENQUIRY", icon: Globe, delay: 0 },
                    { label: "AI RESPONSE", icon: Bot, delay: 1.5 },
                    { label: "QUALIFICATION", icon: Settings, delay: 3 },
                    { label: "CRM PIPELINE", icon: Database, delay: 4.5 },
                    { label: "FOLLOW-UP", icon: MessageCircle, delay: 6 },
                    { label: "SITE VISIT", icon: Calendar, delay: 7.5 },
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-3 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: [0.5, 1, 0.5], 
                        x: [ -10, 0, -10],
                        backgroundColor: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.02)"],
                        borderColor: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.05)"]
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: step.delay, 
                        repeat: Infinity, 
                        repeatDelay: 7.5,
                        times: [0, 0.1, 1] 
                      }}
                    >
                      <step.icon size={16} className="text-white/60" />
                      <span className="text-white font-mono font-bold tracking-widest text-[10px] uppercase">{step.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="bg-white overflow-hidden py-3 text-black">
        <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee 28s linear infinite", willChange: "transform" }}>
          {[...SERVICES_CYCLE, ...SERVICES_CYCLE, ...SERVICES_CYCLE].map((s, i) => (
            <span key={i} className="text-black text-xs font-mono font-bold tracking-[0.25em] uppercase shrink-0 flex items-center gap-10">
              {s} <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
            </span>
          ))}
        </div>
      </div>

      <WarpDivider />

      {/* =========================================================
          SECTION 2: THE PROBLEM
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-transparent relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimReveal>
              <h2 className="text-white leading-[0.92] mb-6 font-heading font-black" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
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
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-white/50 text-xs font-mono font-bold tracking-widest uppercase">{step}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-white leading-[0.92] mb-4 font-heading font-black" style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)" }}>
                WE AUTOMATE THE GAP.
              </h3>
              <p className="text-white/60 text-base max-w-md leading-relaxed font-sans">
                BePrompter connects lead capture, AI qualification, CRM and automated follow-ups into a single seamless workflow. Your leads are engaged instantly, qualified automatically, and handed to sales when they are ready to buy.
              </p>
            </AnimReveal>
            <AnimReveal delay={0.2} direction="left">
               <TiltCard>
                 <div className="w-full aspect-square md:aspect-[4/3] bg-transparent border border-white/10 p-8 flex items-center justify-center relative overflow-hidden rounded-xl">
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                   <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
                      <div className="bg-white/5 border border-white/10 p-4 opacity-50 rounded"><p className="text-white/50 text-xs font-bold font-mono">10:00 AM - WhatsApp Enquiry</p></div>
                      <div className="bg-white/5 border border-white/10 p-4 opacity-50 rounded"><p className="text-white/50 text-xs font-bold font-mono">11:30 AM - Salesperson Available</p></div>
                      <div className="bg-white/5 border border-white/10 p-4 opacity-50 rounded"><p className="text-white/50 text-xs font-bold font-mono">11:35 AM - Reply Sent</p></div>
                      <div className="bg-white/10 border border-white/40 p-4 rounded"><p className="text-white text-xs font-bold font-mono uppercase text-center tracking-widest">Lead Lost to Competitor</p></div>
                   </div>
                 </div>
               </TiltCard>
            </AnimReveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: FLAGSHIP PRODUCT (THE REAL ESTATE AI LEAD SYSTEM)
          ========================================================= */}
      <section id="real-estate-ai-system" className="py-32 lg:py-48 bg-transparent relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 w-full text-center mb-24">
          <AnimReveal>
            <h2 className="text-white leading-[0.92] mb-4 font-heading font-black" style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)" }}>
              THE REAL ESTATE<br />AI LEAD SYSTEM
            </h2>
            <p className="text-white/50 text-sm font-mono font-bold tracking-[0.25em] uppercase">
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
                    <h3 className="text-white font-heading font-black mb-2 tracking-widest text-lg uppercase">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-transparent border border-white/20 flex items-center justify-center shrink-0 z-10 relative">
                  <span className="text-white font-mono font-bold text-xs">{item.step}</span>
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
      <section className="py-24 lg:py-32 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-16">
            <h2 className="text-white leading-[0.92] mb-6 font-heading font-black" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
              OUR CORE SERVICES
            </h2>
            <p className="text-white/50 text-sm font-mono font-bold tracking-[0.25em] uppercase">
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
                <TiltCard className="h-full">
                  <div className="border border-white/10 bg-transparent p-8 h-full rounded-xl hover:bg-white/5 transition-colors">
                    <h3 className="text-white font-heading font-black mb-4 tracking-widest text-lg uppercase">{s.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 font-sans">{s.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.caps.map(c => (
                        <span key={c} className="bg-white/5 border border-white/10 text-white/50 text-[10px] px-2 py-1 uppercase tracking-wider font-mono font-semibold rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: SEE WHAT WE CAN BUILD (DEMO BUILDS)
          ========================================================= */}
      <section className="py-24 lg:py-32 bg-transparent border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimReveal className="mb-16 text-center">
            <h2 className="text-white leading-[0.92] mb-4 font-heading font-black" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
              SEE WHAT WE CAN BUILD.
            </h2>
            <p className="text-white/50 text-sm font-mono font-bold tracking-[0.25em] uppercase">
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
                  <div className="flex flex-col gap-3 p-4 bg-transparent rounded-lg border border-white/10 text-xs font-mono w-full h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10" />
                    <div className="self-end bg-white text-black px-3 py-2 max-w-[80%] rounded-l-lg rounded-tr-lg font-bold">I'm looking for a 3BHK in Ahmedabad.</div>
                    <div className="self-start bg-white/10 border border-white/20 text-white px-3 py-2 max-w-[80%] rounded-r-lg rounded-tl-lg">What is your approximate budget?</div>
                    <div className="self-end bg-white text-black px-3 py-2 max-w-[80%] rounded-l-lg rounded-tr-lg font-bold">₹80 lakh.</div>
                    <div className="self-start bg-white/10 border border-white/20 text-white px-3 py-2 max-w-[80%] rounded-r-lg rounded-tl-lg">Which areas do you prefer? We have options in SG Highway.</div>
                  </div>
                )
              },
              {
                title: "REAL ESTATE LEAD CRM",
                desc: "Automated pipeline management interface.",
                points: ["Total leads: 142", "Hot leads: 18", "Lead source tracking", "Site-visit status"],
                preview: (
                  <div className="flex flex-col gap-2 p-4 bg-transparent rounded-lg border border-white/10 text-[10px] uppercase tracking-wider font-mono w-full h-48 overflow-hidden">
                    <div className="grid grid-cols-4 gap-2 text-white/40 pb-2 border-b border-white/10">
                      <span>Name</span><span>Budget</span><span>Status</span><span>Action</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-white/80 py-2 border-b border-white/5">
                      <span>R. Sharma</span><span>₹80L</span><span className="text-white font-bold">HOT</span><span className="underline">Book Visit</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-white/80 py-2 border-b border-white/5">
                      <span>A. Patel</span><span>₹1.2Cr</span><span className="text-white/60">WARM</span><span className="underline">Follow-up</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-white/80 py-2 border-b border-white/5">
                      <span>S. Desai</span><span>₹60L</span><span className="text-white/60">NEW</span><span className="underline">Qualify</span>
                    </div>
                  </div>
                )
              },
              {
                title: "PROPERTY WEBSITE & LEAD FUNNEL",
                desc: "Conversion-focused fictional property project.",
                points: ["The Grand Residences", "3 & 4 BHK", "Enquiry CTA", "WhatsApp CTA"],
                preview: (
                  <div className="flex flex-col items-center justify-center p-4 bg-transparent rounded-lg border border-white/10 w-full h-48 overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black z-10"></div>
                     <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
                     <div className="relative z-20 text-center">
                        <h4 className="text-white font-heading font-black tracking-widest uppercase text-sm mb-2">THE GRAND RESIDENCES</h4>
                        <p className="text-white/60 text-[10px] mb-4 uppercase tracking-widest font-mono">Ahmedabad • 3 & 4 BHK</p>
                        <div className="flex gap-2 justify-center">
                          <div className="bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm">Book Visit</div>
                          <div className="bg-white/10 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm border border-white/20">WhatsApp</div>
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
                  <div className="flex items-center justify-center p-4 bg-transparent rounded-lg border border-white/10 w-full h-48 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.05] to-transparent pointer-events-none" />
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
                <TiltCard>
                  <div className="border border-white/10 bg-transparent p-8 rounded-xl h-full group hover:border-white/30 transition-all">
                    <div className="inline-block bg-white/5 border border-white/10 text-white/60 text-[10px] px-2 py-1 uppercase tracking-widest font-mono font-bold mb-6 rounded">
                      DEMO BUILD — NOT A CLIENT PROJECT
                    </div>
                    <h3 className="text-white font-heading font-black mb-2 tracking-widest text-xl uppercase">{demo.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 font-sans">{demo.desc}</p>
                    
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
                </TiltCard>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>

      <WarpDivider />

      {/* =========================================================
          SECTION 6: HOW WE WORK
          ========================================================= */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <AnimReveal className="mb-16">
            <h2 className="text-white leading-[0.92] mb-4 font-heading font-black" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
              FROM PROBLEM TO DEPLOYMENT.
            </h2>
            <p className="text-white/50 text-sm font-mono font-bold tracking-[0.25em] uppercase">
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
                className="p-8 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <p className="text-white/10 font-heading font-black leading-none mb-4 group-hover:text-white/20 transition-colors" style={{ fontSize: "3.5rem" }}>{p.n}</p>
                <h3 className="text-white font-heading font-black mb-2 text-xl tracking-widest uppercase">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-sans">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 7: WHO WE SERVE & CTA
          ========================================================= */}
      <section className="py-32 lg:py-48 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimReveal>
            <h2 className="text-white font-heading font-black leading-[0.92] mb-6" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}>
              HOW MANY LEADS ARE YOU LOSING TO MANUAL FOLLOW-UP?
            </h2>
            <h3 className="text-white/80 font-heading font-black leading-[0.92] mb-8 uppercase tracking-widest" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
              SHOW US YOUR SALES WORKFLOW.
            </h3>
            <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-2xl mx-auto font-sans">
              Let's identify where your current lead workflow can be automated. Tell us how you currently handle property enquiries, and we'll identify where AI and automation could improve your workflow.
            </p>
            
            <div className="flex justify-center">
               <MagneticButton
                 onClick={() => onNavigate("contact")}
                 className="inline-flex items-center gap-3 bg-white text-black text-sm font-heading font-black tracking-widest uppercase px-12 py-5"
               >
                 GET A FREE AI WORKFLOW AUDIT <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </MagneticButton>
            </div>
          </AnimReveal>
        </div>
      </section>

    </div>
  );
}
