import { useRef, useState } from "react";
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

const ARTICLES = [
  {
    id: 1, category: "AI", featured: true,
    title: "How AI Chatbots Reduced Our Client's Support Costs by 60%",
    excerpt: "A deep dive into the architecture, prompt engineering, and fine-tuning process that made Nova Retail's AI platform the most capable in their sector.",
    author: "Priya Nair", date: "June 18, 2026", readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&h=500&fit=crop&auto=format",
  },
  {
    id: 2, category: "Web Design",
    title: "The UX Principles That Drove a 140% Increase in Property Leads",
    excerpt: "What user research revealed about property seekers, and how we redesigned CoreLogic's portal around six key insight areas.",
    author: "Marcus Chen", date: "June 12, 2026", readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 3, category: "SEO",
    title: "B2B Content Strategy: How Summit Labs Ranked #1 for 200+ Keywords",
    excerpt: "The topic cluster methodology, internal linking architecture, and promotion strategy behind a 890% organic sessions increase.",
    author: "Alex Mercer", date: "June 5, 2026", readTime: "10 min read",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 4, category: "Digital Marketing",
    title: "580% Campaign ROI: Inside Meridian Health's Performance Marketing System",
    excerpt: "How audience segmentation, creative testing, and landing page CRO combined to deliver record-breaking healthcare marketing results.",
    author: "Sophie Laurent", date: "May 28, 2026", readTime: "7 min read",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 5, category: "AI",
    title: "Prompt Engineering for Enterprise: 12 Patterns We Use With Clients",
    excerpt: "The prompting techniques, chain-of-thought structures, and system prompt architectures that make our AI implementations perform at scale.",
    author: "Priya Nair", date: "May 20, 2026", readTime: "12 min read",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 6, category: "Brand Strategy",
    title: "Building a Fintech Brand That Raised $48M: The Apex Story",
    excerpt: "From initial positioning workshops to launch-day brand assets — the full story of how we built Apex Fintech's identity from zero.",
    author: "Yuna Park", date: "May 14, 2026", readTime: "9 min read",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&auto=format",
  },
];

const CATS = ["All", "AI", "Web Design", "SEO", "Digital Marketing", "Brand Strategy"];

export function InsightsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [cat, setCat] = useState("All");
  const featured = ARTICLES.find((a) => a.featured);
  const filtered = (cat === "All" ? ARTICLES.filter((a) => !a.featured) : ARTICLES.filter((a) => a.category === cat && !a.featured));

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/50" /> Insights
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
              IDEAS & INSIGHTS<br /><span className="text-white">FROM THE FIELD</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Real stories, strategies, and lessons from the projects we build. No fluff — just what actually worked and why.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <AnimReveal>
              <motion.div
                className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-xl bg-[#0a0a0a] group cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <div className="relative h-[360px] lg:h-auto overflow-hidden">
                  <img src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/40" />
                </div>
                <div className="p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-white text-black text-xs font-bold tracking-widest uppercase px-2.5 py-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {featured.category}
                    </span>
                    <span className="text-white/30 text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Featured</span>
                  </div>
                  <h2 className="text-white font-black mb-4 leading-[1.1]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                    {featured.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{featured.author}</p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{featured.date} · {featured.readTime}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <ArrowRight size={14} className="text-black -rotate-45" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimReveal>
          </div>
        </section>
      )}

      {/* Grid */}
      <section style={{ backgroundColor: "#f5f5f5" }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category filter */}
          <AnimReveal className="flex flex-wrap gap-2 mb-10">
            {CATS.map((c) => (
              <motion.button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all ${
                  cat === c ? "bg-black text-white" : "bg-white border border-[#e0e0e0] text-[#666] hover:border-black hover:text-black"
                }`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                {c}
              </motion.button>
            ))}
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a, i) => (
              <motion.div
                key={a.id}
                className="bg-white group cursor-pointer overflow-hidden rounded-xl hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative h-[200px] overflow-hidden bg-[#f0f0f0]">
                  <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold tracking-widest uppercase px-2.5 py-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {a.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-[#0a0a0a] font-black mb-3 leading-tight group-hover:text-black transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem" }}>
                    {a.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{a.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#0a0a0a] text-xs font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{a.author}</p>
                      <p className="text-[#999] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{a.date} · {a.readTime}</p>
                    </div>
                    <ArrowRight size={16} className="text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <AnimReveal>
            <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Stay Sharp</p>
            <h2 className="text-white mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1 }}>
              GET INSIGHTS IN YOUR INBOX
            </h2>
            <p className="text-white/50 text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Monthly deep-dives on AI, web design, and digital marketing strategy. No spam, unsubscribe any time.
            </p>
            <div className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#111] border border-white/20 text-white px-4 py-3.5 text-sm outline-none focus:border-white transition-colors placeholder:text-white/30"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <motion.button
                className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-6 py-3.5 transition-colors shrink-0"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </AnimReveal>
        </div>
      </section>
    </div>
  );
}
