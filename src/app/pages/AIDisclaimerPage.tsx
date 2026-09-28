import { motion } from "motion/react";

export function AIDisclaimerPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            AI Services Disclaimer
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. AI Nature</h2>
              <p>BePrompter services may use artificial intelligence and machine-learning systems. AI output is probabilistic and may be inaccurate, incomplete, outdated, biased or unsuitable for a particular situation.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Human Review</h2>
              <p>Clients are responsible for appropriate human review where automated outputs may affect customers, employees, finances, legal rights, health, safety or other consequential interests.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. No Professional Advice</h2>
              <p>Unless expressly agreed in writing, our AI systems do not provide legal, medical, financial, investment, tax or other regulated professional advice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Third-Party Models</h2>
              <p>Our services may rely on third-party AI models and APIs. Their capabilities, availability, pricing, policies and outputs may change.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Business Results</h2>
              <p>We do not guarantee a specific number of leads, sales, conversions, revenue, cost savings, ROI or other business outcome unless expressly stated in a signed agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Automated Communications</h2>
              <p>Clients should review and configure automated communications appropriately. Clients remain responsible for the content and lawful use of messages sent through their systems.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">7. Intellectual Property</h2>
              <p>Rights in AI-generated output may depend on the applicable agreement, the underlying inputs, third-party provider terms and applicable law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">8. Contact</h2>
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
