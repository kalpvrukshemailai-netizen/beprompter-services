import { motion } from "motion/react";
import { Phone, Calendar } from "lucide-react";

export function LetsTalkPage() {
  return (
    <div className="bg-black min-h-screen pt-24 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#60c8ff] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#60c8ff] text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span className="w-6 h-px bg-[#60c8ff]/50" /> Get In Touch <span className="w-6 h-px bg-[#60c8ff]/50" />
          </p>
          <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
            LET'S <span className="text-white/40">TALK</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-16" style={{ fontFamily: "'Inter', sans-serif" }}>
            Choose the most convenient way to connect with our automation experts. We're ready to help scale your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1: Call Us */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl transition-all group-hover:border-white/30 group-hover:bg-white/10" />
            <div className="relative p-10 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Phone size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Call Us Directly</h2>
              <p className="text-white/50 text-sm mb-8 flex-grow" style={{ fontFamily: "'Inter', sans-serif" }}>
                Need immediate assistance or prefer a quick chat? Call our team right now.
              </p>
              <a
                href="tel:+918200851975"
                className="bg-white hover:bg-gray-200 text-black text-xs font-black tracking-widest uppercase px-8 py-4 transition-all shadow-xl rounded w-full"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                +91 8200851975
              </a>
            </div>
          </motion.div>

          {/* Option 2: Book a Meeting */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#60c8ff]/10 to-transparent border border-[#60c8ff]/20 rounded-2xl transition-all group-hover:border-[#60c8ff]/50 group-hover:bg-[#60c8ff]/15" />
            <div className="relative p-10 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-[#60c8ff]/10 border border-[#60c8ff]/20 flex items-center justify-center mb-6 group-hover:bg-[#60c8ff]/20 transition-colors">
                <Calendar size={24} className="text-[#60c8ff]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Book a Strategy Call</h2>
              <p className="text-white/50 text-sm mb-8 flex-grow" style={{ fontFamily: "'Inter', sans-serif" }}>
                Schedule a dedicated 30-minute meeting to discuss your goals in depth via Google Meet.
              </p>
              <button
                onClick={() => window.open("https://cal.id/kalpvruksh-ai", "_blank")}
                className="bg-[#60c8ff] hover:bg-[#4dbbf5] text-black text-xs font-black tracking-widest uppercase px-8 py-4 transition-all shadow-[0_0_20px_rgba(96,200,255,0.4)] rounded w-full"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                SCHEDULE NOW
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
