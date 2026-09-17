/**
 * StructuredData.tsx — JSON-LD Structured Data for BePrompter
 *
 * Renders schema.org JSON-LD scripts for rich search results:
 *  - Organization (site-wide)
 *  - WebSite with SearchAction (site-wide)
 *  - Service schemas (per-service page)
 *  - LocalBusiness (contact page)
 *  - FAQPage (services page)
 *  - BreadcrumbList (all non-home pages)
 */

const BASE_URL = "https://beprompter.services";
const LOGO_URL = `${BASE_URL}/favicon.jpeg`;

// ─── Organization Schema ──────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BePrompter",
  alternateName: "BePrompter Services",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 64,
    height: 64,
  },
  description:
    "BePrompter is an AI-first engineering company that builds WhatsApp Automation Bots, CRM Workflows, AI Smart Landing Pages, and Internal Knowledge Systems for real estate and business growth.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${BASE_URL}/contact`,
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://www.linkedin.com/company/beprompter",
    "https://twitter.com/beprompter",
    "https://www.instagram.com/beprompter",
  ],
  areaServed: "Worldwide",
  knowsAbout: [
    "AI Automation",
    "WhatsApp Business API",
    "CRM Integration",
    "Real Estate Technology",
    "Lead Generation",
    "Conversational AI",
    "Business Process Automation",
  ],
};

// ─── WebSite Schema ───────────────────────────────────────────────────────────

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BePrompter",
  url: BASE_URL,
  description:
    "AI WhatsApp Bots, CRM Automations, Smart Landing Pages, and Internal Knowledge Systems for business growth.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/insights?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── Services Schema ──────────────────────────────────────────────────────────

const servicesSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI WhatsApp Customer Acquisition Bot",
    serviceType: "AI Automation",
    description:
      "An intelligent conversational assistant integrated into the official Meta WhatsApp Business API. Understands natural language, captures leads 24/7, answers complex product questions, and provides interactive digital menus.",
    provider: { "@type": "Organization", name: "BePrompter", url: BASE_URL },
    url: `${BASE_URL}/services`,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    areaServed: "Worldwide",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WhatsApp-to-CRM Automation Engine",
    serviceType: "CRM Automation",
    description:
      "Eliminates manual data entry by automatically syncing captured leads and conversation data from WhatsApp directly into your CRM system in real-time.",
    provider: { "@type": "Organization", name: "BePrompter", url: BASE_URL },
    url: `${BASE_URL}/services`,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    areaServed: "Worldwide",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Smart Landing Pages",
    serviceType: "Web Development & AI",
    description:
      "Interactive, AI-powered landing pages designed to capture 3x more customer inquiries through intelligent engagement and lead qualification forms.",
    provider: { "@type": "Organization", name: "BePrompter", url: BASE_URL },
    url: `${BASE_URL}/services`,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    areaServed: "Worldwide",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Internal Brain AI Knowledge System",
    serviceType: "AI Knowledge Management",
    description:
      "A secure RAG (Retrieval-Augmented Generation) search engine trained on your company's proprietary data, enabling instant answers to internal queries.",
    provider: { "@type": "Organization", name: "BePrompter", url: BASE_URL },
    url: `${BASE_URL}/services`,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    areaServed: "Worldwide",
  },
];

// ─── FAQ Schema ───────────────────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an AI WhatsApp Bot and how does it help my business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI WhatsApp Bot is an intelligent conversational agent integrated with Meta's official WhatsApp Business API. It responds instantly to customer inquiries 24/7, captures lead contact details, answers product questions using your business data, and qualifies prospects — all without any human intervention. This means you never miss a lead, even at 2 AM.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to deploy BePrompter's AI systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deployment timelines vary by service complexity. A standard AI WhatsApp Bot can be live within 2–4 weeks. A full CRM Automation Engine or AI Smart Landing Page typically takes 3–6 weeks. We follow a rigorous 4-step process: Discovery & Audit, Architecture Design, Development & Testing, and Deployment & Scaling.",
      },
    },
    {
      "@type": "Question",
      name: "Is BePrompter's AI secure and GDPR compliant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All BePrompter systems are built on SOC-2 aligned infrastructure with end-to-end encryption, strict data access controls, and GDPR-conscious engineering practices. Your proprietary business data remains strictly confidential and is never used to train third-party AI models.",
      },
    },
    {
      "@type": "Question",
      name: "Does BePrompter work with real estate businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Real estate is one of BePrompter's core verticals. Our AI WhatsApp Bots and CRM automations are purpose-built for real estate agents and brokers to capture leads from property inquiries, qualify buyers and renters automatically, and sync all data to their CRM — eliminating the manual follow-up grind.",
      },
    },
    {
      "@type": "Question",
      name: "What CRM systems does BePrompter integrate with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BePrompter's automation engine is platform-agnostic and can integrate with most modern CRM systems including HubSpot, Salesforce, Zoho CRM, Pipedrive, and custom-built CRMs via API. We assess your existing stack during the Discovery & Audit phase and design integrations accordingly.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost to build an AI system with BePrompter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the scope, complexity, and number of services required. We offer project-based pricing with clear deliverables. The best way to get a quote is to book a free strategy call where our engineers will analyze your specific needs and provide a detailed proposal.",
      },
    },
  ],
};

// ─── Local Business Schema ────────────────────────────────────────────────────

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "BePrompter",
  description:
    "AI-first engineering company specializing in WhatsApp Automation, CRM integration, Smart Landing Pages, and AI Knowledge Systems for business growth.",
  url: BASE_URL,
  logo: LOGO_URL,
  image: `${BASE_URL}/og-image.jpg`,
  priceRange: "$$",
  telephone: "",
  email: "hello@beprompter.services",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: `${BASE_URL}/contact`,
    availableLanguage: "English",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
};

// ─── Breadcrumb Builder ───────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  about: "About",
  services: "Services",
  "real-estate": "Real Estate AI",
  industries: "Industries",
  insights: "Insights",
  "case-studies": "Case Studies",
  "agency-partners": "Agency Partners",
  trust: "Security & Trust",
  contact: "Contact",
  "lets-talk": "Let's Talk",
  "privacy-policy": "Privacy Policy",
};

function buildBreadcrumb(page: string) {
  if (page === "home") return null;
  const label = PAGE_LABELS[page];
  if (!label) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: `${BASE_URL}/${page}`,
      },
    ],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface StructuredDataProps {
  page: string;
}

/**
 * StructuredData — renders JSON-LD <script> tags for the current page.
 * Always includes Organization + WebSite schemas.
 * Adds page-specific schemas (Services, FAQ, LocalBusiness, Breadcrumb) as needed.
 */
export function StructuredData({ page }: StructuredDataProps) {
  const schemas: object[] = [organizationSchema, websiteSchema];

  // Page-specific schemas
  if (page === "services") {
    schemas.push(...servicesSchema, faqSchema);
  }
  if (page === "contact" || page === "lets-talk" || page === "trust") {
    schemas.push(localBusinessSchema);
  }

  // Breadcrumb for all non-home pages
  const breadcrumb = buildBreadcrumb(page);
  if (breadcrumb) schemas.push(breadcrumb);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}
