import { motion } from "motion/react";

export function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Terms & Conditions
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. Acceptance</h2>
              <p>These Terms & Conditions (“Terms”) govern access to the BePrompter Services website and services provided by BePrompter Technology Private Limited.</p>
              <p className="mt-3">By using the website, submitting an enquiry, requesting a quotation, signing a proposal/order form, making payment or using a service, you agree to these Terms. If you act for a company, you represent that you have authority to bind that company.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Services</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>AI WhatsApp Bot</li>
                <li>WhatsApp-to-CRM Engine</li>
                <li>Smart Landing Pages</li>
                <li>Internal Brain AI</li>
              </ul>
              <p className="mt-3">Services may include AI agents, workflow automation, integrations, implementation, configuration, maintenance and related technology work. The exact deliverables, timelines, fees and support obligations are determined by the applicable quotation, proposal, statement of work or service agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. Project Scope</h2>
              <p>Only items expressly included in the agreed scope are included in the project price. New features, additional integrations, material revisions, additional data migration, new workflows or work outside scope may require additional fees and time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Client Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide accurate project information and timely approvals.</li>
                <li>Provide required credentials, API access, Meta/WhatsApp access, CRM access and other permissions when necessary.</li>
                <li>Provide lawful content, data and business materials.</li>
                <li>Review and approve automated messages and workflows where human approval is appropriate.</li>
                <li>Maintain the confidentiality of credentials and administrator accounts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Payments and Taxes</h2>
              <p>Payment milestones, subscriptions, usage charges and third-party costs are stated in the applicable proposal or invoice. Work may be paused where amounts are overdue.</p>
              <p className="mt-3">Applicable taxes and statutory charges, if any, will be charged as required by law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Third-Party Platforms</h2>
              <p>Services may depend on third-party platforms, including WhatsApp/Meta, AI providers, CRM systems, cloud infrastructure, payment providers and automation platforms. We do not control their availability, pricing, policies, API changes or continued operation. Changes by a third party may require additional work or affect functionality.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">7. WhatsApp and Messaging</h2>
              <p>Clients using WhatsApp-based services must comply with applicable Meta/WhatsApp requirements and applicable law. Our systems must not be used for spam, fraud, misleading communications, unauthorized bulk messaging or prohibited activities. We may suspend an integration when necessary to address a legal, security or platform-compliance risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">8. AI Services</h2>
              <p>AI systems are probabilistic and may produce inaccurate, incomplete or unsuitable outputs. Unless expressly agreed in writing, BePrompter does not guarantee AI accuracy, a particular response rate, lead volume, conversion rate, revenue, ROI or other business outcome.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">9. Intellectual Property</h2>
              <p>Unless a written agreement states otherwise, BePrompter retains rights in its pre-existing software, frameworks, templates, reusable components, workflows, methodologies, know-how, internal tools and general-purpose technology.</p>
              <p className="mt-3">Client-provided materials remain the client's property. Third-party software, APIs, models and services remain subject to their own terms and licences. Ownership or licensing of custom deliverables will be determined by the applicable written agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">10. Confidentiality</h2>
              <p>Each party will use reasonable measures to protect confidential information received from the other party. Confidential information does not include information that is publicly available without breach, already lawfully known, independently developed, lawfully received from another source, or required to be disclosed by law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">11. Availability and Support</h2>
              <p>Unless a separate SLA applies, services are provided on a commercially reasonable efforts basis. Scheduled maintenance, third-party outages, internet failures, infrastructure failures and events outside our reasonable control may affect availability.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">12. Suspension and Termination</h2>
              <p>We may suspend or terminate services for material non-payment, unlawful use, material breach of these Terms, serious security risks, or loss/suspension of a required third-party platform. Project-specific termination provisions in a signed agreement take precedence to the extent permitted by law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">13. Refunds</h2>
              <p>Refunds and cancellations are governed by our Refund & Cancellation Policy and any project-specific agreement. Nothing in this section limits rights that cannot lawfully be excluded.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">14. Liability</h2>
              <p>To the maximum extent permitted by applicable law, BePrompter will not be liable for indirect, incidental, special, consequential or loss-of-profit damages arising from use of the services.</p>
              <p className="mt-3">To the extent legally permitted, aggregate liability relating to a particular service will not exceed the fees actually paid to BePrompter for that service during the applicable contractual period. Nothing excludes liability that cannot lawfully be excluded or limited.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">15. Force Majeure</h2>
              <p>We are not responsible for delay or failure caused by events outside reasonable control, including third-party outages, API changes, government actions, natural disasters, cyber incidents, telecommunications failures, power failures or similar events.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">16. Governing Law and Jurisdiction</h2>
              <p>These Terms are governed by the laws of India. Subject to applicable law and any different written project agreement, courts having appropriate jurisdiction in Ahmedabad, Gujarat will have jurisdiction over disputes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">17. Contact</h2>
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
