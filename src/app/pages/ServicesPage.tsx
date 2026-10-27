import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, TriangleAlert, CircleCheck, Bot, Database, Monitor, MessageSquare } from "lucide-react";
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

const SERVICES = [
  {
    id: "whatsapp-bot",
    letter: "W",
    tab: "WHATSAPP AI BOT",
    heading: "AI WHATSAPP CUSTOMER ACQUISITION BOT",
    sub: "Never Lose a Lead to a Slow Reply",
    body: "An intelligent, conversational assistant integrated into your official Meta WhatsApp Business API. It understands natural language, answers complex product questions, provides digital menus via WhatsApp Flows, and collects customer contact details 24/7.",
    cta: "BUILD YOUR BOT",
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=700&h=480&fit=crop&auto=format",
    alt: "WhatsApp AI Bot",
    tech: ["OPENAI GPT-4o", "META WHATSAPP API", "MAKE.COM", "FASTAPI", "PGVECTOR", "DOCKER"],
    whoIsThisFor: [
      "Real estate brokers losing massive sales to slow after-hours replies.",
      "Retail shops missing customer inquiries during late nights and weekends.",
      "Clinics and service businesses overwhelmed with repetitive booking questions.",
      "D2C brands that want to instantly greet, qualify, and capture leads 24/7."
    ],
    typicalResults: [
      { stat: "24/7", label: "Instant Lead Response" },
      { stat: "3x", label: "Higher Lead Capture Rate" },
      { stat: "0", label: "Missed Customer Inquiries" },
      { stat: "100%", label: "Automated Lead Qualification" }
    ],
    deliverables: [
      { title: "Intelligent Lead Capture", desc: "Instantly greets prospects, asks qualifying questions, and securely captures their name and phone number." },
      { title: "Automated FAQ & Support", desc: "Answers complex product, pricing, and policy questions immediately using your custom business data." },
      { title: "WhatsApp Flows Integration", desc: "Provides interactive digital menus, catalogs, and forms natively inside the WhatsApp interface." },
      { title: "Human Handoff Protocol", desc: "Seamlessly routes high-value or complex conversations to human agents when necessary." }
    ],
    whyAutomation: {
      problems: [
        "Losing massive sales because staff takes too long to reply.",
        "Missing hot leads completely during late nights and weekends.",
        "Wasting hours manually answering the same basic pricing questions.",
        "Potential customers getting frustrated by slow or ignored messages."
      ],
      solutions: [
        "Instant, intelligent responses to 100% of incoming inquiries.",
        "Automatic qualification and capture of contact details 24/7.",
        "Eliminates repetitive manual chatting for your sales team.",
        "Provides a seamless, modern, and immediate customer experience."
      ]
    }
  },
  {
    id: "whatsapp-crm",
    letter: "C",
    tab: "WHATSAPP-TO-CRM ENGINE",
    heading: "WHATSAPP-TO-CRM REVENUE ENGINE",
    sub: "Eliminate Manual Data Entry",
    body: "A backend middleware automation workflow. The moment your WhatsApp bot captures a qualified lead, this engine instantly formats the data and injects it into your central database (Google Sheets, Zoho, HubSpot).",
    cta: "AUTOMATE YOUR CRM",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=480&fit=crop&auto=format",
    alt: "CRM Dashboard Automation",
    tech: ["N8N / MAKE.COM", "ZOHO CRM", "HUBSPOT", "GOOGLE SHEETS", "NODE.JS", "WEBHOOKS"],
    whoIsThisFor: [
      "Sales teams spending hours manually copying WhatsApp chats to Excel.",
      "B2B companies and manufacturing firms with messy, decentralized lead data.",
      "Revenue leaders lacking visibility into pipeline performance and lead status.",
      "Growing agencies that need automated team alerts for hot leads."
    ],
    typicalResults: [
      { stat: "15 hrs", label: "Saved on Manual Entry / Week" },
      { stat: "100%", label: "Lead Data Accuracy" },
      { stat: "2x", label: "Faster Sales Follow-ups" },
      { stat: "0", label: "Leads Slipping Through Cracks" }
    ],
    deliverables: [
      { title: "Instant CRM Auto-Sync", desc: "Automatically formats and injects WhatsApp lead data directly into your central CRM or Google Sheets." },
      { title: "Automated Team Alerts", desc: "Triggers instant notifications to your sales team via Slack or Email when a high-value lead is qualified." },
      { title: "Follow-up Orchestration", desc: "Schedules and triggers automated follow-up messages days later to nurture leads." },
      { title: "Pipeline Visibility Dashboards", desc: "Provides revenue leaders with real-time tracking of lead volume and conversion metrics." }
    ],
    whyAutomation: {
      problems: [
        "Sales teams wasting hours manually copying names and numbers to Excel.",
        "Leads slipping through the cracks due to messy or lost data.",
        "Zero visibility into pipeline health or follow-up status.",
        "No structured system for triggering timely follow-ups."
      ],
      solutions: [
        "Zero manual data entry required by your sales staff.",
        "100% of leads safely stored and tracked in your central database.",
        "Real-time visibility for managers into pipeline and performance.",
        "Automated, structured follow-up sequences that drive revenue."
      ]
    }
  },
  {
    id: "smart-landing-page",
    letter: "L",
    tab: "SMART LANDING PAGE",
    heading: "AI-POWERED SMART LANDING PAGE",
    sub: "Capture 3x More Customer Inquiries",
    body: "Replace your boring, static website with a high-speed, single-page site featuring a custom interactive AI tool embedded right at the top. It provides instant value to visitors in exchange for their contact details.",
    cta: "UPGRADE YOUR SITE",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=480&fit=crop&auto=format",
    alt: "Interactive Smart Landing Page",
    tech: ["NEXT.JS", "REACT", "TAILWIND CSS", "FRAMER MOTION", "VERCEL", "OPENAI API"],
    whoIsThisFor: [
      "Digital marketers tired of driving traffic to low-converting static sites.",
      "Real estate firms wanting to offer an 'AI Property Valuer' to capture leads.",
      "Gym owners and dietitians looking to offer an 'AI Diet Planner' magnet.",
      "Edtech platforms and consultants needing interactive visitor engagement."
    ],
    typicalResults: [
      { stat: "3x", label: "Higher Conversion Rate" },
      { stat: "50%", label: "Lower Bounce Rate" },
      { stat: "100%", label: "Personalized Visitor Value" },
      { stat: "< 1s", label: "Lightning Fast Page Load" }
    ],
    deliverables: [
      { title: "Interactive AI Lead Magnet", desc: "A custom embedded AI tool (valuer, planner, calculator) that engages visitors immediately." },
      { title: "High-Speed Architecture", desc: "Built with modern frameworks (Next.js) for instant load times and perfect technical SEO." },
      { title: "Seamless Form Capture", desc: "Frictionless capture of names and phone numbers before unlocking the personalized AI analysis." },
      { title: "Premium Visual Design", desc: "Sleek, conversion-optimized layouts with dynamic micro-animations to build instant trust." }
    ],
    whyAutomation: {
      problems: [
        "Traditional websites are boring walls of text that visitors ignore.",
        "High bounce rates because the site offers no immediate interactive value.",
        "Visitors leaving without ever filling out the standard 'Contact Us' form.",
        "Wasting ad spend driving traffic to pages that don't convert."
      ],
      solutions: [
        "Engages visitors immediately with a dynamic, personalized AI tool.",
        "Provides upfront value, making visitors eager to share their contact info.",
        "Dramatically increases the ROI of your ad spend through higher conversions.",
        "Positions your brand as a modern, premium, tech-forward industry leader."
      ]
    }
  },
  {
    id: "internal-brain",
    letter: "I",
    tab: "INTERNAL BRAIN KB",
    heading: "THE 'INTERNAL BRAIN' KNOWLEDGE BASE",
    sub: "Cut Internal Research Time to Seconds",
    body: "A private, secure internal AI search interface using RAG. We index all your PDFs, manuals, and protocols into a secure database. Staff can chat with this private engine like a corporate ChatGPT trained only on your data.",
    cta: "BUILD YOUR AI BRAIN",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&h=480&fit=crop&auto=format",
    alt: "Internal AI Knowledge Base",
    tech: ["LANGCHAIN", "PGVECTOR", "OPENAI EMBEDDINGS", "NEXT.JS", "AWS S3", "FASTAPI"],
    whoIsThisFor: [
      "Mid-sized law firms needing rapid access to specific case files and precedents.",
      "Customer support teams constantly searching through massive product spreadsheets.",
      "Logistics and operational agencies managing complex compliance manuals.",
      "Corporate HR departments answering the same repetitive policy questions."
    ],
    typicalResults: [
      { stat: "90%", label: "Faster Information Retrieval" },
      { stat: "100%", label: "Accurate, Sourced Answers" },
      { stat: "0 hrs", label: "Wasted Searching Folders" },
      { stat: "24/7", label: "Instant Internal Support" }
    ],
    deliverables: [
      { title: "Secure Data Indexing", desc: "We securely process and vectorize your private PDFs, docs, and spreadsheets into a closed database." },
      { title: "Private AI Chat Interface", desc: "A sleek, internal chat portal where employees can ask questions in natural language." },
      { title: "Source Citation System", desc: "Every AI answer includes exact page references and links to the original company document." },
      { title: "Role-Based Access Control", desc: "Ensures sensitive documents are only searchable by authorized departments or management." }
    ],
    whyAutomation: {
      problems: [
        "Employees spending hours searching unorganized Google Drives for basic answers.",
        "Customer support providing slow or incorrect answers due to buried information.",
        "Onboarding new staff takes too long because knowledge is siloed.",
        "Security risks from staff uploading private data to public AI tools."
      ],
      solutions: [
        "Instant, accurate answers retrieved in seconds with exact source citations.",
        "Empowers customer support to answer complex queries immediately.",
        "Drastically speeds up employee onboarding and internal training.",
        "100% secure, private infrastructure ensuring your data is never used for public training."
      ]
    }
  }
];

export function ServicesPage({ 
  onNavigate, 
  initialServiceIndex = 0, 
  scrollToDetail = false 
}: { 
  onNavigate: (p: string) => void;
  initialServiceIndex?: number;
  scrollToDetail?: boolean;
}) {
  const [active, setActive] = useState(initialServiceIndex);
  const detailRef = useRef<HTMLDivElement>(null);
  const srv = SERVICES[active] || SERVICES[0];

  useEffect(() => {
    if (typeof initialServiceIndex === "number" && initialServiceIndex >= 0 && initialServiceIndex < SERVICES.length) {
      setActive(initialServiceIndex);
      if (scrollToDetail && detailRef.current) {
        setTimeout(() => {
          detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    }
  }, [initialServiceIndex, scrollToDetail]);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen pt-24">
      {/* ── HERO ── */}
      <section className="py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <AnimReveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full mb-8 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-[#60c8ff] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-white/70">Our Expertise</span>
            </div>
          </AnimReveal>
          <AnimReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-[0.95] mb-8 uppercase">
              Core Automation<br /><span className="text-white/40">Offerings</span>
            </h1>
          </AnimReveal>
          <AnimReveal delay={0.2}>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-sans leading-relaxed">
              We design, develop, deploy, and maintain intelligent AI agents, smart landing pages, and CRM integrations tailored for the Indian market to eliminate manual tasks and drive revenue.
            </p>
          </AnimReveal>
        </div>
      </section>

      {/* ── SERVICE DETAIL ── */}
      <section ref={detailRef} id="service-detail" className="bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Tab strip */}
          <div className="flex overflow-x-auto gap-2 mb-16 pb-4 border-b border-white/10 scrollbar-hide">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                className={`shrink-0 px-5 py-3 text-sm font-mono tracking-widest uppercase transition-all whitespace-nowrap rounded-md ${
                  active === i ? "bg-white text-black font-bold" : "text-white/40 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
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
              {/* Header block */}
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                <div>
                  <p className="text-[#60c8ff] font-mono text-xs font-bold tracking-[0.25em] uppercase mb-4">{srv.sub}</p>
                  <h2 className="text-white font-heading font-black leading-[1] mb-6 text-4xl md:text-5xl lg:text-6xl uppercase">
                    {srv.heading}
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-8 font-sans">{srv.body}</p>
                  <MagneticButton
                    onClick={() => onNavigate("contact")}
                    className="bg-white text-black font-heading font-black text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors group"
                  >
                    {srv.cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </div>
                <div>
                  <TiltCard>
                    <div className="rounded-xl overflow-hidden h-[400px] border border-white/10 relative">
                      <img src={srv.img} alt={srv.alt} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    </div>
                  </TiltCard>
                </div>
              </div>

              {/* AUTOMALY STYLE SECTION 1: Who Is This For? */}
              <div className="mb-24">
                <h3 className="text-3xl font-heading font-bold text-center mb-10">Who Is This <span className="text-[#60c8ff]">For?</span></h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {srv.whoIsThisFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 border border-white/10 rounded-lg bg-white/[0.02]">
                      <CircleCheck className="text-[#60c8ff] shrink-0 mt-0.5" size={20} />
                      <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUTOMALY STYLE SECTION 2: Typical Results */}
              <div className="mb-24 py-16 border-y border-white/10 bg-white/[0.01]">
                <h3 className="text-3xl font-heading font-bold text-center mb-12">Typical <span className="text-[#60c8ff]">Results</span></h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-6">
                  {srv.typicalResults.map((res, i) => (
                    <div key={i} className="text-center p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="text-4xl font-heading font-black text-white mb-3">{res.stat}</div>
                      <div className="text-xs text-white/50 uppercase tracking-widest font-mono">{res.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUTOMALY STYLE SECTION 3: What We Deliver */}
              <div className="mb-24">
                <h3 className="text-3xl font-heading font-bold text-center mb-12">What We <span className="text-[#60c8ff]">Deliver</span></h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {srv.deliverables.map((del, i) => (
                    <div key={i} className="p-8 border border-white/10 rounded-xl bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-lg bg-[#60c8ff]/10 flex items-center justify-center mb-5 border border-[#60c8ff]/20">
                        <Bot size={20} className="text-[#60c8ff]" />
                      </div>
                      <h4 className="text-lg font-bold mb-3">{del.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{del.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUTOMALY STYLE SECTION 4: Why Need Automation */}
              <div className="mb-24">
                <h3 className="text-3xl font-heading font-bold text-center mb-12">Why You Need <span className="text-[#60c8ff]">Automation</span></h3>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Left: Problems */}
                  <div className="p-8 border border-red-500/20 bg-red-500/[0.02] rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <TriangleAlert className="text-red-400" size={24} />
                      <h4 className="text-lg font-bold text-white">Common Problems</h4>
                    </div>
                    <ul className="space-y-4">
                      {srv.whyAutomation.problems.map((prob, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 shrink-0" />
                          <span className="text-white/60 text-sm">{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Solutions */}
                  <div className="p-8 border border-[#60c8ff]/20 bg-[#60c8ff]/[0.02] rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <CircleCheck className="text-[#60c8ff]" size={24} />
                      <h4 className="text-lg font-bold text-white">With Automation</h4>
                    </div>
                    <ul className="space-y-4">
                      {srv.whyAutomation.solutions.map((sol, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="text-[#60c8ff] shrink-0 mt-0.5" size={16} />
                          <span className="text-white/80 text-sm">{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ── TECH STACK ── */}
              <div className="mt-16 pt-16 border-t border-white/10">
                <p className="text-white/50 text-xs font-mono tracking-[0.25em] uppercase mb-6 text-center">Tech Stack</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {srv.tech.map((t, ti) => (
                    <div key={t} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-white/60 hover:text-white hover:border-white/30 transition-all">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-black py-24 overflow-hidden relative border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimReveal>
            <p className="text-[#60c8ff] font-mono text-xs font-bold tracking-[0.25em] uppercase mb-4">Ready to Automate?</p>
            <h2 className="text-white font-heading font-black leading-[1] mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              BOOK A FREE DISCOVERY CALL
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
              Let's find your biggest business bottleneck and build an automated system to eliminate it.
            </p>
            <MagneticButton
              onClick={() => window.open("https://cal.id/kalpvruksh-ai", "_blank")}
              className="bg-white text-black font-heading font-black text-sm tracking-widest uppercase px-10 py-5 mx-auto flex items-center gap-3 transition-colors group rounded-md hover:bg-white/90"
            >
              SCHEDULE NOW <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </AnimReveal>
        </div>
      </section>
    </div>
  );
}
