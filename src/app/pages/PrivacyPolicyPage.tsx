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
          
          <div className="space-y-8 text-black/80 font-sans text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p><strong>Effective Date:</strong> January 1, 2026</p>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">1. Information We Collect</h2>
              <p className="mb-3">We collect information that you provide directly to us when you use our services, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Contact information (such as name, email address, phone number, and company name)</li>
                <li>Messages and project details submitted through our contact forms</li>
                <li>Information provided during strategy calls or consultations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve our automation services</li>
                <li>Communicate with you about your projects, inquiries, and proposals</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Analyze trends and usage of our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">3. Information Sharing</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">4. Data Security</h2>
              <p>
                We implement reasonable security measures to protect the confidentiality and integrity of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">5. Contact Us</h2>
              <p className="mb-3">If you have any questions about this Privacy Policy, please contact us at:</p>
              <ul className="list-none space-y-1">
                <li><strong>Email:</strong> support@beprompter.in</li>
                <li><strong>Phone:</strong> 8200851975</li>
                <li><strong>Address:</strong> Shop No. 7, S.F. 3410, 3411, Behind Shethiya Building, Kalupur Chakla, Ahmadabad City, Ahmedabad, Gujarat, India — 380001</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
