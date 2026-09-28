import { motion } from "motion/react";

export function SecurityPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Security & Data Protection
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. Security Approach</h2>
              <p>BePrompter uses reasonable technical and organizational measures appropriate to the services provided. Depending on the project, these may include access controls, authentication, restricted administrative access, secure API practices, logging, monitoring and appropriate cloud security controls.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Client Access</h2>
              <p>We seek to limit access to client systems and information to what is reasonably necessary to provide the contracted service. Clients should provide the minimum permissions necessary.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. Credentials</h2>
              <p>Clients are responsible for safeguarding passwords, API keys, administrator accounts and credentials under their control.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Client Data</h2>
              <p>Client data is processed according to the applicable service agreement and Privacy Policy. Enterprise clients may request additional contractual data-protection terms, including a Data Processing Addendum where appropriate.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Security Incidents</h2>
              <p>If we become aware of a security incident affecting client information, we will take reasonable steps to investigate, contain and address it and make notifications required by applicable law or contractual commitments.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Third-Party Infrastructure</h2>
              <p>Our services may depend on third-party cloud, AI, messaging, CRM and automation providers. Their security and availability are also governed by their respective terms and controls.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">7. Responsible Disclosure</h2>
              <p>Potential vulnerabilities should be reported to security@beprompter.in with enough technical information for investigation.</p>
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
