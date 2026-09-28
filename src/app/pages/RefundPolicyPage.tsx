import { motion } from "motion/react";

export function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Refund & Cancellation Policy
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. General</h2>
              <p>BePrompter provides customized technology, automation, configuration, integration and development services. Refund eligibility therefore depends on the service, project stage, work completed, third-party costs and the applicable proposal or agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Cancellation Before Work Starts</h2>
              <p>If a client requests cancellation before substantive work has started, BePrompter may refund the applicable amount after deducting any non-refundable payment-processing charges, third-party charges or other costs already incurred.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. After Work Begins</h2>
              <p>Once development, configuration, integration, research, implementation or other substantive work has begun, amounts attributable to work already performed and non-refundable third-party costs may not be refundable, subject to applicable law and the project agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Completed Services</h2>
              <p>Fees for completed implementation, development, consulting or other services are generally not refundable unless the applicable agreement provides otherwise or a refund is required by applicable law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Recurring Services</h2>
              <p>Recurring maintenance or support services normally continue through the paid billing period unless the applicable agreement states otherwise. Unused periods are generally not refundable except where required by law or agreed in writing.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Client-Caused Delays</h2>
              <p>Delays caused by missing credentials, information, approvals, feedback, access or client-requested changes do not by themselves create a refund entitlement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">7. Service Issues</h2>
              <p>If a client believes a deliverable materially fails to match the agreed scope, the client should notify us promptly. Depending on the circumstances, we may correct the issue, re-perform the affected service, provide a service credit, or provide another agreed remedy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">8. Third-Party Costs</h2>
              <p>Charges imposed by third-party providers, including messaging, API, AI, cloud, hosting, payment or software providers, may be non-refundable to the extent actually incurred.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">9. Refund Requests</h2>
              <p>Send requests to billing@beprompter.in with the client/company name, invoice/project reference, date of purchase, reason for the request and supporting information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">10. Project-Specific Terms</h2>
              <p>A signed proposal, statement of work, order form or service agreement may contain different cancellation or refund terms. Those project-specific terms govern the relevant engagement to the extent permitted by law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">11. Contact</h2>
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
