import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import beLogo from "@/imports/BE-logo.jpeg";

interface FooterProps {
  onNavigate: (page: string) => void;
}

const COLS = [
  { heading: "Services", links: [["Property Lead Generation", "services"], ["WhatsApp & CRM Automation", "services"], ["AI Property Sales Agents", "services"], ["Property Websites & Funnels", "services"], ["Workflow Automation", "services"]] },
  { heading: "Company", links: [["About Us", "about"], ["Contact", "contact"]] },
  { heading: "Solutions", links: [["Real Estate Agencies", "about"], ["Property Developers", "about"], ["Brokerages", "about"]] },
  { heading: "Resources", links: [["Get a Free AI Audit", "contact"], ["Contact Us", "contact"]] },
];

export function Footer({ onNavigate }: FooterProps) {
  const go = (page: string) => { onNavigate(page); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <footer style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* Big CTA */}
      <div className="border-t border-white/8 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <div>
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Ready to Start?</p>
            <h2
              className="text-white leading-[0.88]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900 }}
            >
              LET'S BUILD<br />
              SOMETHING<br />
              GREAT.
            </h2>
          </div>
          <motion.button
            onClick={() => go("contact")}
            className="group flex items-center gap-4 border border-white/30 hover:border-white text-white text-sm font-black tracking-widest uppercase px-10 py-5 hover:bg-white hover:text-black transition-all"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            GET A FREE AI WORKFLOW AUDIT
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Links grid */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={beLogo} alt="BePrompter logo" className="h-7 w-7 object-cover" />
              <span className="text-white font-black tracking-widest text-xs uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.22em" }}>
                BePrompter
              </span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              AI Engineering & Automation partner — building AI agents, workflow automation, and custom software for businesses and agencies.
            </p>
            <div className="flex gap-2">
              {["in", "tw", "ig", "yt"].map((s) => (
                <div key={s} className="w-7 h-7 border border-white/10 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-colors cursor-pointer text-xs font-bold uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-xs font-black tracking-[0.25em] uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, page]) => (
                  <li key={label}>
                    <button onClick={() => go(page)} className="text-white/30 hover:text-white text-xs transition-colors text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>© 2026 BePrompter Technology. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-white/20 hover:text-white/50 text-xs transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
