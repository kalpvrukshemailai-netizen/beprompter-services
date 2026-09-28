import { motion } from "motion/react";

export function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Privacy Policy
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. About this Policy</h2>
              <p>This Privacy Policy explains how BePrompter Technology Private Limited, operating under the brand BePrompter Services (“BePrompter”, “we”, “us”, or “our”), collects, uses, stores, discloses and protects personal data when you visit our website, contact us, request a service, or use services provided by us.</p>
              <p className="mt-3">This policy applies to information collected through our website, forms, sales and support communications, and technology services we operate for clients.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name, business/company name, job title and contact details.</li>
                <li>Email address, telephone number and WhatsApp number.</li>
                <li>Information submitted through enquiry, consultation, quotation, demo or contact forms.</li>
                <li>Billing, invoicing and business information provided for a transaction.</li>
                <li>Project requirements, documents, instructions and other information provided by a client.</li>
                <li>Technical information such as IP address, browser/device information, pages visited, logs and cookie-related information.</li>
                <li>Client data that a client authorizes us to process as part of an agreed service, such as customer enquiries, CRM records, WhatsApp conversations, lead information, property requirements or internal business information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. How We Use Information</h2>
              <p>We may use information to provide and support our services; respond to enquiries; prepare proposals and quotations; configure AI, WhatsApp, CRM and workflow systems; process payments and invoices; communicate about projects; maintain security; troubleshoot and improve our services; prevent fraud or abuse; maintain business records; and comply with applicable legal obligations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Client Data</h2>
              <p>When a business client provides customer or employee data to BePrompter for an agreed service, the client generally determines the business purpose for which that data is used. BePrompter processes such data to provide the contracted service and according to the applicable project agreement.</p>
              <p className="mt-3">The client is responsible for having the necessary rights, notices, permissions and lawful basis to provide such data to BePrompter and to use it in the relevant automation.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. AI and Automated Processing</h2>
              <p>Our services may use artificial intelligence to generate responses, classify or summarize information, qualify leads, extract information, create content, automate workflows or perform other functions requested by a client.</p>
              <p className="mt-3">AI outputs can be inaccurate, incomplete or inappropriate. Clients should apply human review where appropriate, especially for consequential decisions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">6. Third-Party Providers</h2>
              <p>Depending on the service, information may be processed by third-party providers such as Meta/WhatsApp, AI providers, CRM platforms, cloud infrastructure providers, analytics providers, payment processors and automation platforms. Their own terms and privacy policies may also apply.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">7. Sharing and Disclosure</h2>
              <p>We may disclose information to service providers and contractors who help us operate or deliver our services, professional advisers, payment providers, technology providers, or authorities where required by law or reasonably necessary to protect our rights, users, systems or customers.</p>
              <p className="mt-3">We do not sell personal data as a standalone commercial product.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">8. Data Security</h2>
              <p>We use reasonable technical and organizational safeguards appropriate to the nature of the information and service, including access controls, authentication, restricted administrative access and security practices appropriate to the systems involved. No internet or cloud system can be guaranteed to be completely secure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">9. Retention</h2>
              <p>We retain information for as long as reasonably necessary for service delivery, contractual and business records, security, dispute resolution and legal obligations. Project-specific retention periods may be stated in the applicable agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">10. Rights and Requests</h2>
              <p>Subject to applicable law, individuals may have rights concerning access, correction, updating, deletion/erasure, withdrawal of consent where applicable, and grievance redressal. Requests should be sent to privacy@beprompter.in. We may verify identity before acting on a request.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">11. Cookies</h2>
              <p>Our website may use essential, preference, analytics and similar technologies. See our Cookie Policy for details.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">12. International Processing</h2>
              <p>Some service providers used to deliver our services may process information outside India. Where applicable, such processing is subject to applicable law and relevant contractual, technical or organizational safeguards.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">13. Changes</h2>
              <p>We may update this policy from time to time. The current version will be published on this page with its updated date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">14. Contact</h2>
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
