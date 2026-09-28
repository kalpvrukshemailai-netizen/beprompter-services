import { motion } from "motion/react";

export function AcceptableUsePage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Acceptable Use Policy
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. Purpose</h2>
              <p>This policy applies to use of BePrompter services, including AI agents, WhatsApp automation, CRM integrations, workflows, landing pages and internal AI systems.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Prohibited Uses</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fraud, scams, impersonation or deceptive practices.</li>
                <li>Unlawful spam or unauthorized bulk messaging.</li>
                <li>Unauthorized access to systems, accounts or data.</li>
                <li>Malware, harmful code or attempts to compromise security.</li>
                <li>Unlawful collection, disclosure or misuse of personal data.</li>
                <li>Harassment, threats or other unlawful communications.</li>
                <li>Activities that violate applicable law or the policies of required third-party platforms.</li>
                <li>Any use intended to bypass security, access controls or platform restrictions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. Customer Responsibility</h2>
              <p>Clients are responsible for their campaigns, databases, content, automated decisions and use of the systems. Clients must obtain appropriate permissions and maintain appropriate notices or records where required.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. WhatsApp Compliance</h2>
              <p>Clients must comply with applicable WhatsApp/Meta rules, including requirements applicable to business messaging, templates and consent. BePrompter may suspend workflows that create a material compliance or security risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Enforcement</h2>
              <p>We may investigate suspected violations and may suspend or terminate access where reasonably necessary to protect our systems, customers, users or third-party providers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Report Abuse</h2>
              <p>Report suspected abuse or security misuse to security@beprompter.in.</p>
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
