import { motion } from "motion/react";

export function CookiePolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Cookie Policy
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. What Cookies Are</h2>
              <p>Cookies and similar technologies are small files or identifiers used to enable website functionality, remember preferences and understand website usage.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Cookies We May Use</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Essential cookies for security, sessions and core functionality.</li>
                <li>Preference cookies for settings and user choices.</li>
                <li>Analytics technologies to understand traffic, performance and usage trends.</li>
                <li>Marketing or attribution technologies where used for lawful measurement or advertising purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. Third-Party Technologies</h2>
              <p>Third-party services embedded in or connected to the website may use their own cookies or similar technologies, subject to their own policies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Managing Cookies</h2>
              <p>Most browsers allow you to control or delete cookies through browser settings. Disabling essential cookies may affect website functionality.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Changes</h2>
              <p>We may update this Cookie Policy when our use of cookies or similar technologies changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Contact</h2>
              <ul className="list-none space-y-1">
                <li><strong>Website:</strong> https://beprompter.in</li>
                <li><strong>Support:</strong> support@beprompter.in | +91 8200851975</li>
                <li><strong>Sales:</strong> sales@beprompter.in | +91 9825490251</li>
                <li><strong>Privacy:</strong> privacy@beprompter.in</li>
                <li><strong>Legal & Grievance:</strong> legal@beprompter.in</li>
                <li><strong>Billing:</strong> billing@beprompter.in</li>
                <li><strong>Security:</strong> security@beprompter.in</li>
                <li className="mt-3"><strong>Registered Office:</strong> Shop No. 7, S.F. 3410, 3411, B/H. Shethiya Building, Kalupur Chakla, Ahmedabad, Gujarat – 380001</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
