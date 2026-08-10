import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { supabase } from "@/lib/supabase";

import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";

function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ pointerEvents: "auto" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const SALESPEOPLE_OPTIONS = ["1-5", "6-20", "21-50", "50+"];
const ENQUIRIES_OPTIONS = ["Under 100/mo", "100-500/mo", "500-2000/mo", "2000+/mo"];

const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycby4YSqhMQ_Vv5GZs84NSbA7lh6m0EvG_I-3QpiNfbNNE4GEjuukXEOWA8Rkn7FyZquWVg/exec";

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    salespeople: "",
    enquiries: "",
    crm: "",
    problem: "",
    goals: ""
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      // 1. Insert into Supabase (Updating fields to match old schema temporarily if exact match fails, or use standard names)
      const { error: supabaseError } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company_name: form.company,
        service_interest: form.city + " | " + form.salespeople + " sales | " + form.enquiries + " enq | CRM: " + form.crm, // pack info if schema didn't change
        budget: "",
        message: "Problem: " + form.problem + "\n\nGoals: " + form.goals
      });

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
      }

      // 2. Insert into Google Sheets (Backup / Existing flow)
      await fetch(SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          name: form.name,
          email: form.email,
          phone: form.phone || "",
          company: form.company || "",
          service: form.city + " | " + form.salespeople + " | " + form.enquiries + " | " + form.crm,
          budget: "",
          message: "Problem: " + form.problem + "\nGoals: " + form.goals
        })
      });

      setSent(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/50" /> Get In Touch
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
              LET'S AUDIT YOUR<br /><span className="text-white">SALES WORKFLOW</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tell us how you currently manage property enquiries. We'll identify where AI and automation can speed up your response times and increase conversions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section style={{ backgroundColor: "#f5f5f5" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Form */}
          <div className="bg-white p-8 lg:p-12 shadow-sm" style={{ position: "relative", zIndex: 1 }}>
              {!sent ? (
                <>
                  <h2 className="text-[#0a0a0a] font-black mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.8rem" }}>FREE AI WORKFLOW AUDIT</h2>
                  <p className="text-[#999] text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>All fields marked with * are required.</p>

                  <form onSubmit={handleSubmit} className="space-y-5" style={{ pointerEvents: "auto", position: "relative", zIndex: 2 }}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Full Name *</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Jane Smith"
                          className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email Address *</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="jane@company.com"
                          className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Phone / WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Company Name</label>
                        <input
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="Acme Real Estate"
                          className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>City</label>
                        <input
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          placeholder="Dubai, London, etc."
                          className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Current CRM</label>
                        <input
                          value={form.crm}
                          onChange={(e) => setForm({ ...form, crm: e.target.value })}
                          placeholder="Salesforce, Zoho, Excel, etc."
                          className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Size of Sales Team *</label>
                        <div className="flex flex-wrap gap-2">
                          {SALESPEOPLE_OPTIONS.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setForm({ ...form, salespeople: s })}
                              className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase border transition-all ${
                                form.salespeople === s ? "bg-black border-black text-white" : "border-[#e0e0e0] text-[#666] hover:border-black hover:text-black"
                              }`}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Monthly Enquiries *</label>
                        <div className="flex flex-wrap gap-2">
                          {ENQUIRIES_OPTIONS.map((e) => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => setForm({ ...form, enquiries: e })}
                              className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase border transition-all ${
                                form.enquiries === e ? "bg-black border-black text-white" : "border-[#e0e0e0] text-[#666] hover:border-black hover:text-black"
                              }`}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Biggest Lead-Management Problem *</label>
                      <textarea
                        required
                        rows={3}
                        value={form.problem}
                        onChange={(e) => setForm({ ...form, problem: e.target.value })}
                        placeholder="e.g. Leads take too long to get a response, too much junk data, hard to track follow-ups..."
                        className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black resize-none"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#333]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Automation Goals *</label>
                      <textarea
                        required
                        rows={3}
                        value={form.goals}
                        onChange={(e) => setForm({ ...form, goals: e.target.value })}
                        placeholder="e.g. We want to automate WhatsApp responses and sync leads directly to our CRM..."
                        className="w-full border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white text-black resize-none"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading || !form.salespeople || !form.enquiries}
                      className="bg-black hover:bg-black/90 disabled:opacity-50 text-white text-xs font-bold tracking-widest uppercase px-10 py-4 flex items-center gap-3 transition-colors group w-full justify-center"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      whileHover={loading || !form.salespeople || !form.enquiries ? {} : { scale: 1.02 }} whileTap={loading || !form.salespeople || !form.enquiries ? {} : { scale: 0.97 }}
                    >
                      {loading ? "SENDING…" : <> CLAIM FREE AUDIT <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> </>}
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-3xl">✓</span>
                  </div>
                  <h2 className="text-[#0a0a0a] font-black mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "2rem" }}>REQUEST SENT!</h2>
                  <p className="text-[#666] text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Thank you! We'll review your workflow and be in touch within one business day.
                  </p>
                </motion.div>
              )}
          </div>

          {/* Info sidebar */}
          <AnimReveal delay={0.2} className="flex flex-col gap-4">
            <div className="bg-[#0a0a0a] p-8">
              <h3 className="text-white font-black mb-6 text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>CONTACT INFO</h3>
              <div className="space-y-5">
                {[
                  { icon: Mail, label: "Email", value: "hello@beprompter.com" },
                  { icon: Phone, label: "Phone", value: "+1 (888) 000-0000" },
                  { icon: MapPin, label: "Office", value: "123 Digital Ave, San Francisco, CA 94105" },
                  { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–6pm PST" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0">
                      <item.icon size={14} className="text-black" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.label}</p>
                      <p className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black p-8">
              <h3 className="text-white font-black mb-3 text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>BOOK A STRATEGY CALL</h3>
              <p className="text-white/80 text-sm mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Prefer to talk first? Book a free 30-minute workflow review call with one of our experts.
              </p>
              <motion.button
                className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-6 py-3 transition-colors w-full"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              >
                SCHEDULE CALL
              </motion.button>
            </div>
          </AnimReveal>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-[300px] bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MapPin size={24} className="text-black" />
            </motion.div>
            <p className="text-white font-black text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>San Francisco, CA</p>
            <p className="text-white/40 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>123 Digital Ave, Suite 400</p>
          </div>
        </div>
      </section>
    </div>
  );
}
