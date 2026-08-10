import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";


import { AnimReveal } from "@/app/components/ui/AnimReveal";
import { PageHero } from "@/app/components/ui/PageHero";

const ROLES = [
  "Founder & CEO",
  "Head of AI Engineering",
  "Lead Developer",
  "AI Automation Specialist",
  "Product Designer",
  "Client Success Lead",
];

const VALUES = [
  { icon: "⚡", title: "Velocity", desc: "We move fast without breaking things. Speed and precision are not opposites — they are our standard." },
  { icon: "🎯", title: "Results-First", desc: "Every decision traces back to a measurable business outcome. No vanity metrics, no fluff." },
  { icon: "🤖", title: "AI-Powered", desc: "We embed AI into everything — from creative production to analytics — amplifying human expertise." },
  { icon: "🤝", title: "True Partnership", desc: "We are invested in your success as if it were our own. Your wins are our wins." },
];

export function AboutPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="bg-white">
      <PageHero
        category="About BePrompter"
        title={
          <>
            REAL ESTATE<br />
            <span className="text-white">AI ENGINEERING</span><br />
            PARTNER
          </>
        }
        description={
          <p>Founded to bridge the gap between cutting-edge AI and real estate sales workflows. BePrompter combines technical depth with industry expertise to build systems that capture, qualify, and convert property enquiries.</p>
        }
      />
      <section className="bg-[#0a0a0a]">
        {/* Full-width image */}
        <motion.div
          className="relative h-[400px] lg:h-[500px] overflow-hidden"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=600&fit=crop&auto=format"
            alt="BePrompter office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 to-[#0a0a0a]/20" />

          <div className="absolute bottom-8 left-8 bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-3 rounded">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>AI Engineering & Automation Partner</p>
          </div>
        </motion.div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <AnimReveal>
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Our Story</p>
            <h2 className="text-[#0a0a0a] leading-[0.95] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900 }}>
              BUILT FOR<br />REAL ESTATE SALES
            </h2>
            <p className="text-[#555] text-base leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              BePrompter was founded with a clear mission: build AI systems that make real-estate businesses run better. Not demos. Not experiments. Production-grade lead generation funnels, WhatsApp automation, and AI sales agents that capture leads, qualify enquiries, and help developers and brokerages scale.
            </p>
            <p className="text-[#555] text-base leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              We work with real estate developers, property agencies, and brokerages who want to modernize their sales workflow. Every system we build is custom-engineered for your property pipeline — no generic templates, no off-the-shelf chatbots repurposed to fit.
            </p>
            <button
              onClick={() => onNavigate("contact")}
              className="bg-black hover:bg-black/90 text-white text-xs font-bold tracking-widest uppercase px-7 py-3.5 flex items-center gap-3 transition-colors group w-fit"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              WORK WITH US <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimReveal>

          <AnimReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&auto=format", "Team session"],
                ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop&auto=format", "Office culture"],
                ["https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=300&fit=crop&auto=format", "Collaboration"],
                ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop&auto=format", "Strategy"],
              ].map(([src, alt], i) => (
                <motion.div
                  key={alt}
                  className="relative overflow-hidden rounded-xl h-[160px] bg-[#f0f0f0]"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <img src={src} alt={alt} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </AnimReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-14">
            <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>What Drives Us</p>
            <h2 className="text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1 }}>OUR CORE VALUES</h2>
          </AnimReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                className="p-8 border border-white/10 group hover:border-white transition-colors"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="text-3xl mb-5">{v.icon}</div>
                <h3 className="text-white font-black mb-3 text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team — placeholder */}
      <section style={{ backgroundColor: "#f5f5f5" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-10">
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Our People</p>
            <h2 className="text-[#0a0a0a] mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1 }}>MEET THE TEAM</h2>
            <p className="text-black/40 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Team profiles coming soon — we will introduce each team member individually.</p>
          </AnimReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ROLES.map((role, i) => (
              <motion.div
                key={role}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="rounded-xl h-[200px] mb-3 border-2 border-dashed border-[#ccc] flex items-center justify-center" style={{ backgroundColor: "#eee" }}>
                  <span className="text-[#bbb] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Photo</span>
                </div>
                <p className="text-[#999] text-xs font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
