import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";


function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const CLIENTS = [
  { name: "Nova Retail", industry: "E-Commerce", logo: "NR", color: "#1a1a1a" },
  { name: "Apex Fintech", industry: "Finance", logo: "AF", color: "#1a1a2e" },
  { name: "Meridian Health", industry: "Healthcare", logo: "MH", color: "#0a3d62" },
  { name: "CoreLogic", industry: "Real Estate", logo: "CL", color: "#1e3799" },
  { name: "Summit Labs", industry: "Technology", logo: "SL", color: "#006266" },
  { name: "BlueSky SaaS", industry: "Software", logo: "BS", color: "#192a56" },
  { name: "Vertex Energy", industry: "Energy", logo: "VE", color: "#4a4a4a" },
  { name: "Prism Creative", industry: "Media", logo: "PC", color: "#6c2b7e" },
  { name: "Forte Legal", industry: "Legal", logo: "FL", color: "#2c3e50" },
  { name: "Orbit Travel", industry: "Travel", logo: "OT", color: "#2980b9" },
  { name: "Pulse Fitness", industry: "Health", logo: "PF", color: "#c0392b" },
  { name: "Maven Education", industry: "EdTech", logo: "ME", color: "#16a085" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchel", role: "CEO, Nova Retail",
    quote: "BePrompter transformed our customer experience. The AI platform they built exceeded every KPI we set. The team was professional, responsive, and genuinely invested in our success.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format&facepad=3",
    rating: 5,
  },
  {
    name: "James Okafor", role: "CTO, Apex Fintech",
    quote: "From brand identity to our full SaaS web app — delivered on time, on budget, and miles ahead of what we imagined possible. BePrompter is the only agency we trust.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&facepad=3",
    rating: 5,
  },
  {
    name: "Dr. Priya Nair", role: "Marketing Director, Meridian Health",
    quote: "The marketing strategy they crafted generated 580% ROI in the first six months. The data-driven approach is second to none — real analytics, real results.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format&facepad=3",
    rating: 5,
  },
  {
    name: "Tom Watkins", role: "Founder, CoreLogic",
    quote: "They rebuilt our entire digital presence from the ground up. The UX improvements alone increased conversions by 140%. A game-changing partnership.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format&facepad=3",
    rating: 5,
  },
];

export function ClientsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl">
            <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/50" /> Our Clients
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
              BRANDS WE'VE<br /><span className="text-white">HELPED GROW</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              From startups to enterprises across 15+ industries — we partner with ambitious brands that want transformative results, not incremental improvements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Client grid */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-12">
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Trusted By</p>
            <h2 className="text-[#0a0a0a]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1 }}>OUR CLIENT ROSTER</h2>
          </AnimReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#f0f0f0]">
            {CLIENTS.map((client, i) => (
              <motion.div
                key={client.name}
                className="bg-white p-8 flex flex-col items-center group hover:bg-[#0a0a0a] transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-white font-black text-lg group-hover:bg-white group-hover:text-black transition-colors"
                  style={{ backgroundColor: client.color, fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {client.logo}
                </div>
                <p className="text-[#0a0a0a] group-hover:text-white font-black text-sm text-center mb-1 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
                  {client.name}
                </p>
                <p className="text-[#999] group-hover:text-white/50 text-xs transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {client.industry}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-14">
            <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Client Voices</p>
            <h2 className="text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1 }}>
              WHAT CLIENTS SAY<br />ABOUT US
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-[#111] border border-white/10 p-8 group hover:border-white transition-colors"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, si) => (
                    <span key={si} className="text-white text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/70 text-base leading-relaxed mb-6 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#222] shrink-0">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{t.name}</p>
                    <p className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[["200+", "Clients Served"], ["98%", "Retention Rate"], ["15+", "Industries"], ["$50M+", "Revenue Generated"]].map(([v, l]) => (
              <AnimReveal key={l}>
                <p className="text-white font-black leading-none mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "3rem" }}>{v}</p>
                <p className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{l}</p>
              </AnimReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
