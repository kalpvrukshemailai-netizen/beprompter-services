import { motion } from "motion/react";

export function IntellectualPropertyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Intellectual Property Policy
          </h1>
          <div className="text-black/60 mb-8 font-sans text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            BePrompter Services | BePrompter Technology Private Limited
          </div>
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. BePrompter Intellectual Property</h2>
              <p>Unless expressly transferred or licensed in writing, BePrompter retains rights in its pre-existing software, source code, frameworks, templates, reusable components, workflows, methodologies, documentation, internal tools, website content, branding and general-purpose technology.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. Client Materials</h2>
              <p>Clients retain ownership of materials they provide to BePrompter, subject to the rights necessary for us to perform the contracted services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. Custom Deliverables</h2>
              <p>Ownership or licensing of custom deliverables will be determined by the applicable quotation, statement of work or service agreement. Payment does not automatically transfer ownership of BePrompter's underlying reusable technology.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Third-Party Materials</h2>
              <p>Third-party software, APIs, libraries, AI models and other components remain subject to their respective licences and terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Infringement Reports</h2>
              <p>Copyright or intellectual-property concerns may be submitted to legal@beprompter.in with sufficient information to identify the material and explain the basis of the complaint.</p>
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
