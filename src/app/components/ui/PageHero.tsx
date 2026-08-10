import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface PageHeroProps {
  category: string;
  title: React.ReactNode;
  description: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
  imageNode?: React.ReactNode;
}

export function PageHero({ category, title, description, ctaText, onCtaClick, imageNode }: PageHeroProps) {
  return (
    <section className="bg-[#0a0a0a] pt-16">
      <div className={`max-w-7xl mx-auto px-6 py-16 lg:py-24 ${imageNode ? "grid lg:grid-cols-2 gap-12 items-center" : ""}`}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span className="w-6 h-px bg-white/50" /> {category}
          </p>
          <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900 }}>
            {title}
          </h1>
          <div className="text-white/60 text-base leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            {description}
          </div>
          {ctaText && onCtaClick && (
            <motion.button
              onClick={onCtaClick}
              className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors group"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              {ctaText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>

        {imageNode && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="hidden lg:block">
            {imageNode}
          </motion.div>
        )}
      </div>
    </section>
  );
}
