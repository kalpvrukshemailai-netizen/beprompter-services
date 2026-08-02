import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, CreditCard, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  price: string;
  onNavigate: (p: string) => void;
}

export function CheckoutModal({ isOpen, onClose, serviceName, price, onNavigate }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [isOpen]);

  const handlePayment = async () => {
    if (!user) {
      onClose();
      onNavigate("auth");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // Mock payment delay
    await new Promise((r) => setTimeout(r, 1500));

    // Create the project in the database
    const { error } = await supabase.from("projects").insert({
      client_id: user.id,
      title: serviceName,
      description: "Auto-generated project from demo purchase.",
      status: "planning",
    });

    if (error) {
      console.error("Error creating project:", error);
      setErrorMsg(error.message || "Failed to create project. Did you run the SQL script?");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setLoading(false);
      onNavigate("client-dashboard");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={!loading && !success ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              disabled={loading || success}
              className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors disabled:opacity-0"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <CheckCircle size={48} className="text-green-400 mb-4" />
                <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>PAYMENT SUCCESSFUL</h3>
                <p className="text-white/50 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Creating your project dashboard...
                </p>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Secure Checkout (Demo)
                </h2>
                <h3 className="text-white font-black text-2xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{serviceName}</h3>
                <p className="text-white/60 text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>{price}</p>
                
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-6 rounded" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {errorMsg}
                  </div>
                )}

                {!user ? (
                  <div className="bg-white/5 border border-white/10 p-4 rounded text-center mb-6">
                    <p className="text-white/60 text-sm mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                      You need to create a client account before purchasing.
                    </p>
                    <button
                      onClick={() => { onClose(); onNavigate("auth"); }}
                      className="bg-white text-black text-xs font-black tracking-widest uppercase px-6 py-3 hover:bg-white/90 transition-colors w-full"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      CREATE ACCOUNT
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Card Information</label>
                      <div className="relative flex items-center bg-white/5 border border-white/10 px-4 py-3">
                        <CreditCard size={16} className="text-white/30 mr-3" />
                        <span className="text-white/40 text-sm tracking-widest font-mono flex-1">**** **** **** 4242</span>
                        <span className="text-white/30 text-xs font-mono ml-2">12/24</span>
                        <span className="text-white/30 text-xs font-mono ml-2">123</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#60c8ff] text-black text-xs font-black tracking-widest uppercase py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <>PAY {price} <Lock size={12} /></>}
                      </button>
                    </div>
                    <p className="text-center text-white/30 text-[10px] uppercase tracking-wider mt-4 flex items-center justify-center gap-1">
                      <Lock size={10} /> Secure Demo Transaction
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
