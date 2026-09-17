import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Home,
  Info,
  Layers,
  Building2,
  Factory,
  BookOpen,
  BarChart3,
  Handshake,
  ShieldCheck,
  Phone,
  MessageCircle,
  Lock,
  ChevronRight,
  Globe,
  ArrowUpRight,
} from "lucide-react";

interface SitemapPageProps {
  onNavigate: (page: string) => void;
}

// ─── Site structure ──────────────────────────────────────────────────────────

const SITE_SECTIONS = [
  {
    category: "Main",
    color: "#60c8ff",
    pages: [
      {
        icon: Home,
        label: "Home",
        page: "home",
        url: "https://beprompter.services/",
        desc: "AI automation for business growth — WhatsApp Bots, CRM, Landing Pages.",
      },
      {
        icon: Info,
        label: "About",
        page: "about",
        url: "https://beprompter.services/about",
        desc: "The team, mission, and values behind BePrompter.",
      },
      {
        icon: Layers,
        label: "Services",
        page: "services",
        url: "https://beprompter.services/services",
        desc: "Full suite of AI services: WhatsApp Bots, CRM, Smart Pages, Brain AI.",
      },
    ],
  },
  {
    category: "Solutions",
    color: "#a78bfa",
    pages: [
      {
        icon: Building2,
        label: "Real Estate AI",
        page: "real-estate",
        url: "https://beprompter.services/real-estate",
        desc: "AI purpose-built for real estate agents, brokers, and developers.",
      },
      {
        icon: Factory,
        label: "Industries",
        page: "industries",
        url: "https://beprompter.services/industries",
        desc: "How BePrompter serves retail, healthcare, D2C, and service industries.",
      },
      {
        icon: Handshake,
        label: "Agency Partners",
        page: "agency-partners",
        url: "https://beprompter.services/agency-partners",
        desc: "White-label AI automation for digital agencies and consultancies.",
      },
    ],
  },
  {
    category: "Resources",
    color: "#34d399",
    pages: [
      {
        icon: BookOpen,
        label: "Insights",
        page: "insights",
        url: "https://beprompter.services/insights",
        desc: "Expert articles on AI automation, WhatsApp marketing, and CRM trends.",
      },
      {
        icon: BarChart3,
        label: "Case Studies",
        page: "case-studies",
        url: "https://beprompter.services/case-studies",
        desc: "Real results: lead capture rates, revenue impact, and automation ROI.",
      },
    ],
  },
  {
    category: "Contact & Trust",
    color: "#fb923c",
    pages: [
      {
        icon: Phone,
        label: "Contact",
        page: "contact",
        url: "https://beprompter.services/contact",
        desc: "Book a free AI strategy call with BePrompter's lead engineers.",
      },
      {
        icon: MessageCircle,
        label: "Let's Talk",
        page: "lets-talk",
        url: "https://beprompter.services/lets-talk",
        desc: "Start a conversation — describe your challenge and we'll respond fast.",
      },
      {
        icon: ShieldCheck,
        label: "Security & Trust",
        page: "trust",
        url: "https://beprompter.services/trust",
        desc: "SOC-2 aligned infrastructure, encryption, and data privacy practices.",
      },
    ],
  },
  {
    category: "Legal",
    color: "#94a3b8",
    pages: [
      {
        icon: Lock,
        label: "Privacy Policy",
        page: "privacy-policy",
        url: "https://beprompter.services/privacy-policy",
        desc: "How we collect, use, and protect your personal data.",
      },
    ],
  },
];

// Also list the four core services (sub-links within /services)
const SERVICE_LINKS = [
  { label: "AI WhatsApp Customer Acquisition Bot", anchor: "whatsapp-bot", url: "https://beprompter.services/services#whatsapp-bot" },
  { label: "WhatsApp-to-CRM Automation Engine",    anchor: "crm-engine",   url: "https://beprompter.services/services#crm-engine" },
  { label: "AI Smart Landing Pages",               anchor: "landing-pages", url: "https://beprompter.services/services#landing-pages" },
  { label: "Internal Brain AI Knowledge System",   anchor: "brain-ai",      url: "https://beprompter.services/services#brain-ai" },
];

// ─── Animation helpers ───────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SitemapPage({ onNavigate }: SitemapPageProps) {
  const navigate = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/8 overflow-hidden">
        {/* Grid lines */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#60c8ff] opacity-[0.04] blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <FadeIn>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/30 mb-8">
              <button onClick={() => navigate("home")} className="hover:text-white/60 transition-colors">
                Home
              </button>
              <ChevronRight size={12} />
              <span className="text-white/50">Sitemap</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="flex items-center gap-4 mb-5">
              <Globe size={28} strokeWidth={1.5} className="text-[#60c8ff]" />
              <h1
                className="text-4xl md:text-6xl font-black tracking-tight"
                style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" }}
              >
                SITE MAP
              </h1>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Every page on <span className="text-white/70">beprompter.services</span> — organised by section. Click any link to navigate directly.
            </p>
          </FadeIn>

          {/* Domain pill */}
          <FadeIn delay={0.15}>
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#60c8ff] animate-pulse" />
              <span className="text-xs font-mono text-white/50 tracking-widest">https://beprompter.services</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SITEMAP GRID ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {SITE_SECTIONS.map((section, si) => (
            <FadeIn key={section.category} delay={si * 0.06}>
              <div>
                {/* Section heading */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <h2
                    className="text-xs font-mono uppercase tracking-[0.3em] text-white/40"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {section.category}
                  </h2>
                </div>

                {/* Page cards */}
                <div
                  className={`grid gap-px bg-white/8 border border-white/8 rounded-xl overflow-hidden ${
                    section.pages.length === 1
                      ? "grid-cols-1"
                      : section.pages.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {section.pages.map((p, pi) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={p.label}
                        className="bg-black group relative cursor-pointer"
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        transition={{ duration: 0.2 }}
                        onClick={() => navigate(p.page)}
                      >
                        <div className="p-7 flex flex-col gap-4 h-full">
                          {/* Icon + label row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${section.color}15`, border: `1px solid ${section.color}30` }}
                              >
                                <Icon
                                  size={15}
                                  strokeWidth={1.8}
                                  style={{ color: section.color }}
                                />
                              </div>
                              <h3
                                className="text-sm font-semibold text-white group-hover:text-white transition-colors"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                {p.label}
                              </h3>
                            </div>
                            <ArrowUpRight
                              size={14}
                              className="text-white/20 group-hover:text-white/60 shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                            />
                          </div>

                          {/* Description */}
                          <p
                            className="text-white/35 text-xs leading-relaxed group-hover:text-white/55 transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {p.desc}
                          </p>

                          {/* URL */}
                          <div className="mt-auto pt-3 border-t border-white/5">
                            <span
                              className="text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors break-all"
                            >
                              {p.url}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* ── Services deep-links ── */}
          <FadeIn delay={0.3}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 rounded-full bg-[#60c8ff]" />
                <h2
                  className="text-xs font-mono uppercase tracking-[0.3em] text-white/40"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Services — Individual Pages
                </h2>
              </div>

              <div className="border border-white/8 rounded-xl overflow-hidden divide-y divide-white/8">
                {SERVICE_LINKS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="bg-black group flex items-center justify-between gap-4 px-6 py-4 cursor-pointer"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
                    onClick={() => navigate(`services`)}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-mono text-white/20 w-5 shrink-0"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-sm text-white/60 group-hover:text-white transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-white/20 hidden md:block">
                        {s.url}
                      </span>
                      <ArrowUpRight
                        size={13}
                        className="text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── XML Sitemap reference ── */}
          <FadeIn delay={0.35}>
            <div className="border border-white/8 rounded-xl p-6 bg-white/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest text-white/30 mb-1"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  For Search Engines
                </p>
                <p
                  className="text-sm text-white/60"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  The machine-readable XML sitemap is available at:
                </p>
                <a
                  href="https://beprompter.services/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#60c8ff] text-xs font-mono hover:underline mt-1 block"
                >
                  https://beprompter.services/sitemap.xml
                </a>
              </div>
              <a
                href="https://beprompter.services/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 border border-white/10 hover:border-white/30 px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors rounded"
              >
                View XML <ArrowUpRight size={12} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/8 py-24 px-6">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl md:text-5xl font-black tracking-tight mb-5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              CAN'T FIND WHAT YOU NEED?
            </h2>
            <p
              className="text-white/40 text-base mb-10"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Talk to our team directly — we respond fast.
            </p>
            <button
              onClick={() => navigate("contact")}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold tracking-wide hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get in Touch
              <ArrowUpRight size={16} />
            </button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
