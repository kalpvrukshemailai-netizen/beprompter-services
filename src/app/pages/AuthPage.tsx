import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { supabase, UserRole, Profile } from "@/lib/supabase";

type Mode = "signin" | "signup";

const AGENCY_TYPES = ["Marketing Agency", "Web Agency", "Branding Studio", "Software Consultancy", "Freelance Developer", "Digital Consultant", "IT Firm", "Other"];
const INDUSTRIES = ["Healthcare", "Real Estate", "Restaurants", "Manufacturing", "Education", "Finance", "Legal", "E-Commerce", "Other"];
const PROJECT_TYPES = ["AI Chatbot", "AI Voice Agent", "Workflow Automation", "WhatsApp Automation", "CRM Automation", "Custom AI Agent", "Custom Software", "Web Application", "Mobile App", "Other"];

function Field({ label, type = "text", value, onChange, placeholder, required = true }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {label}{required && <span className="text-white/30 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPass && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {label} <span className="text-white/30">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-white/40 transition-colors appearance-none"
        style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#0d0d0d" }}
      >
        <option value="" disabled>{placeholder ?? "Select…"}</option>
        {options.map((o) => <option key={o} value={o} style={{ backgroundColor: "#0d0d0d" }}>{o}</option>)}
      </select>
    </div>
  );
}

interface ClientForm {
  fullName: string; company: string; email: string; phone: string;
  industry: string; projectType: string; password: string;
}

interface PartnerForm {
  fullName: string; agency: string; email: string; phone: string;
  agencyType: string; website: string; password: string;
}

function ErrorBox({ message, email, onResend }: { message: string; email?: string; onResend?: () => void }) {
  const isUnconfirmed = message.toLowerCase().includes("not confirmed") || message.toLowerCase().includes("email");
  return (
    <div className="p-4 bg-red-400/8 border border-red-400/20 space-y-2">
      <div className="flex items-start gap-2 text-red-400 text-xs">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <span style={{ fontFamily: "'Inter', sans-serif" }}>
          {isUnconfirmed && email
            ? `Please confirm your email address before signing in. We sent a confirmation link to ${email}.`
            : message}
        </span>
      </div>
      {isUnconfirmed && onResend && (
        <button
          type="button"
          onClick={onResend}
          className="text-white/50 hover:text-white text-xs underline underline-offset-2 transition-colors ml-5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Resend confirmation email
        </button>
      )}
    </div>
  );
}

function ClientAuth({ mode, onSuccess, onVerificationNeeded }: {
  mode: Mode; onSuccess: () => void; onVerificationNeeded: (email: string) => void;
}) {
  const [form, setForm] = useState<ClientForm>({ fullName: "", company: "", email: "", phone: "", industry: "", projectType: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const set = (k: keyof ClientForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const resendConfirmation = async () => {
    setResending(true);
    await supabase.auth.resend({ type: "signup", email: form.email });
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: "client" as UserRole,
            full_name: form.fullName,
            company_name: form.company,
          },
        },
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }

      // If session exists, email confirmation is disabled — update profile and redirect
      if (data.session) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles").update({
            phone: form.phone, industry: form.industry, project_type: form.projectType,
          }).eq("id", user.id);
        }
        onSuccess();
      } else {
        // Email confirmation required — show verify screen
        onVerificationNeeded(form.email);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" />
            <Field label="Company Name" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Industry" value={form.industry} onChange={set("industry")} options={INDUSTRIES} placeholder="Select industry" />
            <Select label="Project Type" value={form.projectType} onChange={set("projectType")} options={PROJECT_TYPES} placeholder="What do you need?" />
          </div>
          <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" required={false} />
        </>
      )}
      <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
      <Field label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" />

      {error && (
        <ErrorBox
          message={error}
          email={form.email}
          onResend={resending || resent ? undefined : resendConfirmation}
        />
      )}
      {resent && (
        <div className="flex items-center gap-2 text-green-400 text-xs p-3 bg-green-400/8 border border-green-400/20">
          <CheckCircle size={14} />
          <span style={{ fontFamily: "'Inter', sans-serif" }}>Confirmation email resent.</span>
        </div>
      )}

      <motion.button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-black text-xs font-black tracking-widest uppercase py-4 hover:bg-white/90 transition-colors disabled:opacity-50"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : mode === "signup" ? "CREATE CLIENT ACCOUNT" : "SIGN IN"}
        {!loading && <ArrowRight size={13} />}
      </motion.button>
    </form>
  );
}

function PartnerAuth({ mode, onSuccess, onVerificationNeeded }: {
  mode: Mode; onSuccess: () => void; onVerificationNeeded: (email: string) => void;
}) {
  const [form, setForm] = useState<PartnerForm>({ fullName: "", agency: "", email: "", phone: "", agencyType: "", website: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const set = (k: keyof PartnerForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const resendConfirmation = async () => {
    setResending(true);
    await supabase.auth.resend({ type: "signup", email: form.email });
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: "developer" as UserRole, // Example fallback for partner replacement
            full_name: form.fullName,
            company_name: form.agency,
          },
        },
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }

      if (data.session) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles").update({
            phone: form.phone, agency_type: form.agencyType, website: form.website,
          }).eq("id", user.id);
        }
        onSuccess();
      } else {
        onVerificationNeeded(form.email);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Your Name" value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" />
            <Field label="Agency Name" value={form.agency} onChange={set("agency")} placeholder="Studio Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Agency Type" value={form.agencyType} onChange={set("agencyType")} options={AGENCY_TYPES} placeholder="Select type" />
            <Field label="Website" type="url" value={form.website} onChange={set("website")} placeholder="https://youragency.com" required={false} />
          </div>
          <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" required={false} />
        </>
      )}
      <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@agency.com" />
      <Field label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" />

      {error && (
        <ErrorBox
          message={error}
          email={form.email}
          onResend={resending || resent ? undefined : resendConfirmation}
        />
      )}
      {resent && (
        <div className="flex items-center gap-2 text-green-400 text-xs p-3 bg-green-400/8 border border-green-400/20">
          <CheckCircle size={14} />
          <span style={{ fontFamily: "'Inter', sans-serif" }}>Confirmation email resent.</span>
        </div>
      )}

      <motion.button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-3 text-xs font-black tracking-widest uppercase py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", backgroundColor: "#60c8ff", color: "#000" }}
        whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : mode === "signup" ? "CREATE PARTNER ACCOUNT" : "PARTNER SIGN IN"}
        {!loading && <ArrowRight size={13} />}
      </motion.button>
    </form>
  );
}

function VerifyEmailScreen({ email, onBack }: { email: string; onBack: () => void }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const resend = async () => {
    setResending(true);
    await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#0a0a0a" }}>
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(96,200,255,0.08)" }}>
          <Mail size={28} style={{ color: "#60c8ff" }} />
        </div>
        <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Check your inbox</p>
        <h1 className="text-white font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>
          CONFIRM YOUR EMAIL
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          We sent a confirmation link to
        </p>
        <p className="text-white/80 text-sm font-semibold mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          {email}
        </p>
        <p className="text-white/30 text-xs leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          Click the link in that email to activate your account. Check your spam folder if you don't see it within a minute.
        </p>

        <div className="space-y-3">
          {resent ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xs py-3">
              <CheckCircle size={14} />
              <span style={{ fontFamily: "'Inter', sans-serif" }}>Confirmation email resent.</span>
            </div>
          ) : (
            <motion.button
              onClick={resend}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 border border-white/15 text-white/50 hover:text-white hover:border-white/30 text-xs font-bold tracking-widest uppercase py-3 transition-colors disabled:opacity-40"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileTap={{ scale: 0.97 }}
            >
              {resending ? <Loader2 size={12} className="animate-spin" /> : "RESEND EMAIL"}
            </motion.button>
          )}
          <button
            onClick={onBack}
            className="w-full text-white/25 hover:text-white/60 text-xs font-bold uppercase tracking-wider py-2 transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            ← Back to sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function AuthPage({ onNavigate, defaultRole = "client", defaultMode = "signin" }: {
  onNavigate: (p: string) => void;
  defaultRole?: UserRole;
  defaultMode?: Mode;
}) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [done, setDone] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  const onSuccess = async () => {
    setDone(true);
    // Fetch user profile to determine correct dashboard
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const userRole = profile?.role || role;
      
      setTimeout(() => {
        if (userRole === "admin") onNavigate("admin-dashboard");
        else if (userRole === "developer") onNavigate("developer-dashboard");
        else if (userRole === "sales") onNavigate("sales-dashboard");
        else onNavigate("client-dashboard");
      }, 1200);
    } else {
      setTimeout(() => onNavigate("client-dashboard"), 1200);
    }
  };

  const onVerificationNeeded = (email: string) => {
    setVerifyEmail(email);
  };

  if (verifyEmail) {
    return <VerifyEmailScreen email={verifyEmail} onBack={() => setVerifyEmail(null)} />;
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#60c8ff" }} />
          <p className="text-white font-black text-2xl mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {mode === "signup" ? "ACCOUNT CREATED" : "WELCOME BACK"}
          </p>
          <p className="text-white/40 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Redirecting to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#0a0a0a" }}>
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>BePrompter</p>
          <h1 className="text-white font-black leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            {mode === "signup" ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </h1>
        </div>



        {/* Form card */}
        <div className="border border-white/10 p-8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
          {/* Sign in / Sign up toggle */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/8">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="text-xs font-black tracking-widest uppercase transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: mode === m ? "#fff" : "rgba(255,255,255,0.25)" }}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
                {mode === m && <div className="mt-1 h-px bg-white w-full" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <ClientAuth mode={mode} onSuccess={onSuccess} onVerificationNeeded={onVerificationNeeded} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom link */}
        <p className="text-center text-white/25 text-xs mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          {mode === "signup" ? "Already have an account? " : "No account yet? "}
          <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-white/60 hover:text-white underline underline-offset-2 transition-colors">
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>

        <p className="text-center text-white/15 text-xs mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          By continuing you agree to our{" "}
          <button className="underline underline-offset-2">Privacy Policy</button> and{" "}
          <button className="underline underline-offset-2">Terms of Service</button>
        </p>
      </motion.div>
    </div>
  );
}
