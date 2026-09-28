import { motion } from "motion/react";

export function GrievancePage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Grievance Redressal
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. Purpose</h2>
              <p>BePrompter maintains a grievance channel for service, privacy, billing and other customer concerns.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Contact Channels</h2>
              <ul className="list-none space-y-1">
                <li><strong>General support:</strong> support@beprompter.in</li>
                <li><strong>Privacy/data requests:</strong> privacy@beprompter.in</li>
                <li><strong>Legal and grievances:</strong> legal@beprompter.in</li>
                <li><strong>Billing/refunds:</strong> billing@beprompter.in</li>
                <li><strong>Security incidents:</strong> security@beprompter.in</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. What to Include</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your name and company name, where applicable.</li>
                <li>Email address and phone number.</li>
                <li>Invoice, proposal or project reference, if applicable.</li>
                <li>Description of the issue or complaint.</li>
                <li>Relevant screenshots or supporting documents.</li>
                <li>The resolution you are requesting, if any.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Review</h2>
              <p>We will review complaints and respond through the contact details provided, subject to verification and the nature of the issue.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. No Waiver of Legal Rights</h2>
              <p>This process does not limit any rights or remedies available under applicable law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Company Details</h2>
              <p>BePrompter Technology Private Limited</p>
              <p>Brand: BePrompter Services</p>
              <p>CIN: U62099GJ2026PTC175198</p>
              <p className="mt-3">Registered Office: Shop No. 7, S.F. 3410, 3411, B/H. Shethiya Building, Kalupur Chakla, Ahmedabad, Gujarat – 380001</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">7. Contact</h2>
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
