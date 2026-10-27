import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, Zap, Shield, HelpCircle, Sparkles, Building2, ChevronDown } from "lucide-react";
import { CheckoutModal } from "@/app/components/CheckoutModal";

interface PricingPageProps {
  onNavigate: (p: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{ name: string; price: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const discount = billingCycle === "annual" ? 0.8 : 1.0;

  const plans = [
    {
      id: "growth",
      name: "Growth",
      tagline: "Essential WhatsApp AI automation for single-brand businesses and clinics.",
      monthlyPrice: 12000,
      annualPrice: 9600,
      badge: "Fastest Setup",
      popular: false,
      features: [
        "1 Official Meta WhatsApp Business Number",
        "20,000 automated AI conversations / month",
        "24/7 Instant lead qualification & capture",
        "Real-time Google Sheet inventory auto-sync",
        "WhatsApp Interactive Flows & digital menu",
        "Standard OpenAI GPT-4o consultative spine",
        "Email & WhatsApp support within 12h SLA"
      ],
      cta: "Get Started"
    },
    {
      id: "scale",
      name: "Scale",
      tagline: "High-velocity pipeline automation with multi-rep CRM routing and team alerts.",
      monthlyPrice: 25000,
      annualPrice: 20000,
      badge: "Most Popular",
      popular: true,
      features: [
        "Up to 3 WhatsApp Business numbers",
        "50,000 automated AI conversations / month",
        "Full CRM Auto-Sync (Zoho, HubSpot, Google Sheets)",
        "Instant sales team alerts via Slack & Email",
        "Multi-rep call delivery & round-robin assignment",
        "Live human operator takeover & handoff",
        "Custom property/product knowledge base fine-tuning",
        "Dedicated Account Manager (4h SLA)"
      ],
      cta: "Launch Scale Engine"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "Custom RAG internal brains, ERP integrations, and custom model orchestration.",
      monthlyPrice: 45000,
      annualPrice: 36000,
      badge: "Maximum Performance",
      popular: false,
      features: [
        "Unlimited WhatsApp Numbers & multi-branch routing",
        "100,000+ AI conversations / month with volume pooling",
        "Private 'Internal Brain' RAG AI (index all PDFs & SOPs)",
        "Custom webhook connectors (Salesforce, SAP, custom DB)",
        "Multi-tenant data isolation & role-based access",
        "Custom Claude 3.5 + GPT-4o failover circuits",
        "99.95% uptime SLA guarantee",
        "24/7 dedicated solutions architect on-call"
      ],
      cta: "Contact Enterprise"
    }
  ];

  const faqs = [
    {
      q: "Are Meta WhatsApp Cloud API conversation fees included?",
      a: "Our monthly subscription covers our AI orchestration engine, CRM sync, prompt tuning, and dashboard infrastructure. Meta Cloud API per-conversation utility charges are billed directly by Meta via your Facebook Business Manager card."
    },
    {
      q: "Can I upgrade or downgrade my tier anytime?",
      a: "Yes, you can upgrade, downgrade, or pause your workspace plan at any time through the Client Dashboard or Platform Admin settings."
    },
    {
      q: "How long does setup and onboarding take?",
      a: "Standard onboarding for Growth and Scale tiers takes 24 to 48 hours. This includes Meta phone number verification, Google Sheet or CRM field mapping, and prompt testing."
    },
    {
      q: "Do you support custom CRM or ERP tools?",
      a: "Yes! We support Google Sheets, Zoho, HubSpot, and custom REST API webhooks natively out of the box."
    }
  ];

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24 selection:bg-white selection:text-black">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-[#60c8ff]">
          <Sparkles size={12} /> Transparent Multi-Tenant Pricing
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Predictable Pricing.<br />
          <span style={{ color: "#60c8ff" }}>Engineered for Real ROI.</span>
        </h1>

        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          Zero hidden implementation fees. Choose the ideal automation capacity for your sales pipeline and client workspaces.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
          <span className={billingCycle === "monthly" ? "text-white" : "text-white/40"}>Monthly Billing</span>
          <button
            onClick={() => setBillingCycle(b => b === "monthly" ? "annual" : "monthly")}
            className="w-14 h-7 rounded-full bg-white/10 p-1 relative border border-white/20 transition-colors cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${billingCycle === "annual" ? "translate-x-7" : "translate-x-0"}`} />
          </button>
          <span className={`flex items-center gap-1.5 ${billingCycle === "annual" ? "text-emerald-400 font-bold" : "text-white/40"}`}>
            Annual Billing <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => {
          const currentPrice = billingCycle === "annual" ? p.annualPrice : p.monthlyPrice;
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                p.popular
                  ? "border-2 border-[#60c8ff] bg-white/[0.03] shadow-[0_0_40px_rgba(96,200,255,0.15)]"
                  : "border border-white/10 bg-white/[0.01] hover:border-white/20"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#60c8ff] text-black font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {p.name}
                  </h3>
                  {!p.popular && (
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/50 mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {p.tagline}
                </p>

                <div className="mb-8 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-black font-mono text-white">
                      ₹{currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/40 uppercase font-medium">/ month</span>
                  </div>
                  {billingCycle === "annual" && (
                    <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                      Billed annually (₹{(currentPrice * 12).toLocaleString()} / yr)
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Included Capabilities:
                  </p>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    if (p.id === "enterprise") {
                      onNavigate("contact");
                    } else {
                      setSelectedPlanForCheckout({
                        name: `${p.name} Plan (${billingCycle})`,
                        price: `₹${currentPrice.toLocaleString()} / mo`
                      });
                    }
                  }}
                  className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                    p.popular
                      ? "bg-[#60c8ff] text-black hover:bg-[#80d4ff] shadow-lg shadow-[#60c8ff]/20"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Feature Matrix Header */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="border border-white/10 rounded-2xl bg-white/[0.01] p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Comprehensive Capability Matrix
            </h2>
            <p className="text-xs text-white/50">
              Direct comparison of infrastructure, agent bandwidth, and support across all tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Core Feature</th>
                  <th className="py-3 px-4 text-center">Growth</th>
                  <th className="py-3 px-4 text-center text-[#60c8ff]">Scale</th>
                  <th className="py-3 px-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">WhatsApp Cloud API Numbers</td>
                  <td className="py-3.5 px-4 text-center font-mono">1</td>
                  <td className="py-3.5 px-4 text-center font-mono text-[#60c8ff] font-bold">Up to 3</td>
                  <td className="py-3.5 px-4 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Monthly AI Message Quota</td>
                  <td className="py-3.5 px-4 text-center font-mono">20,000</td>
                  <td className="py-3.5 px-4 text-center font-mono text-[#60c8ff] font-bold">50,000</td>
                  <td className="py-3.5 px-4 text-center font-mono">100,000+</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Google Sheet Auto-Sync</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Zoho / HubSpot CRM Integration</td>
                  <td className="py-3.5 px-4 text-center text-white/20">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Sales Rep Call Leaderboard & Distribution</td>
                  <td className="py-3.5 px-4 text-center text-white/20">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Internal Brain RAG Knowledge Base</td>
                  <td className="py-3.5 px-4 text-center text-white/20">—</td>
                  <td className="py-3.5 px-4 text-center text-white/20">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Uptime & Support SLA</td>
                  <td className="py-3.5 px-4 text-center text-white/50">12h SLA</td>
                  <td className="py-3.5 px-4 text-center text-[#60c8ff] font-bold">4h Priority</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">24/7 Dedicated (1h)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 mt-28">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white text-center mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-5 text-left flex justify-between items-center text-sm font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 text-white/40 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-white/60 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={!!selectedPlanForCheckout}
          onClose={() => setSelectedPlanForCheckout(null)}
          serviceName={selectedPlanForCheckout.name}
          price={selectedPlanForCheckout.price}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
