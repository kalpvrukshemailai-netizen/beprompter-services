const fs = require("fs");
let content = fs.readFileSync("src/app/pages/ServicesPage.tsx", "utf-8");

const startStr = "const SERVICES = [";
const endStr = "];\n\nexport function ServicesPage";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newServices = `const SERVICES = [
  {
    id: "ai-agents",
    letter: "A",
    tab: "AI AGENTS & WORKFLOWS",
    heading: "INTELLIGENT AI AGENTS & WORKFLOW AUTOMATION",
    sub: "AI Agents & Automation Solutions",
    body: "We design, develop, deploy, and maintain intelligent AI agents that automate business operations, answer customer queries, access your company knowledge, and integrate with your existing software. Automate repetitive processes by connecting your applications, AI models, databases, and communication channels. From lead capture and CRM updates to invoice processing and employee onboarding — every step automated, every system connected.",
    cta: "BUILD YOUR AI AGENT",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=480&fit=crop&auto=format",
    alt: "Custom AI agents and workflows",
    capabilities: ["Customer Support Agent", "Sales & Lead Qualification Agent", "Knowledge Base Agent", "Lead Capture & CRM Automation", "Invoice Processing Workflow", "Document Approval Workflow", "Multi-Agent Systems", "CRM / ERP Integration", "Admin Dashboard", "WhatsApp Notification System"],
    tech: ["OPENAI GPT-4o", "ANTHROPIC CLAUDE", "GOOGLE GEMINI", "N8N / MAKE", "NEXT.JS / REACT", "NESTJS / FASTAPI", "POSTGRESQL", "PGVECTOR", "CLOUDFLARE R2", "DOCKER"],
    packages: [
      {
        name: "Agent & Workflow Lite",
        price: "₹34,999",
        delivery: "2–3 Weeks",
        features: ["1 AI Agent", "Web Chat Interface", "Up to 5 Automated Workflows", "Knowledge Base Setup", "Basic RAG", "Admin Dashboard", "1 Business Integration", "Email / WhatsApp Automation", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "Agent & Workflow Pro",
        price: "₹89,999",
        delivery: "4–6 Weeks",
        features: ["Everything in Lite", "Multiple AI Agents", "Up to 15 Workflows", "Advanced RAG & Memory", "Multiple Integrations", "AI Document Processing", "Custom Workflows", "WhatsApp Integration", "Priority Support"],
      },
      {
        name: "Enterprise System",
        price: "₹2,49,999+",
        delivery: "6–12 Weeks",
        features: ["Everything in Pro", "Multi-Agent System", "Unlimited Workflows", "ERP Integration", "Custom UI/UX", "Enterprise Architecture", "SLA Support", "Discovery Workshop"],
      },
    ],
    maintenance: "Basic ₹4,999 / Standard ₹7,999 / Premium ₹12,999 per month",
  },
  {
    id: "ai-voice",
    letter: "V",
    tab: "AI VOICE AGENTS",
    heading: "CONVERSATIONAL VOICE AI FOR YOUR BUSINESS",
    sub: "AI Voice Agent Solutions",
    body: "Automate inbound and outbound phone conversations using natural, human-like AI voices. Our voice agents answer calls, qualify leads, schedule appointments, provide customer support, and handle follow-ups — 24/7, without human intervention. Unlike traditional IVR systems, they understand natural language.",
    cta: "BUILD YOUR VOICE AGENT",
    img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=700&h=480&fit=crop&auto=format",
    alt: "AI voice agent",
    capabilities: ["AI Receptionist", "Appointment Booking Agent", "Sales Calling Agent", "Lead Qualification Agent", "Customer Support Agent", "Follow-up Calling Agent", "Survey & Feedback Agent", "Order Confirmation Agent", "Inbound Call Handling", "CRM Integration"],
    tech: ["ELEVENLABS", "OPENAI REALTIME API", "TWILIO", "EXOTEL", "PLIVO", "OPENAI", "CLAUDE", "GEMINI", "FASTAPI", "NESTJS", "N8N", "ZOHO / HUBSPOT / SALESFORCE"],
    packages: [
      {
        name: "Voice Agent Lite",
        price: "₹49,999",
        delivery: "2–3 Weeks",
        features: ["1 AI Voice Agent", "1 Phone Number Integration", "Inbound Call Handling", "Appointment Booking", "FAQ Responses", "Call Logging", "CRM Integration (1)", "Admin Dashboard", "Call Analytics", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "Voice Agent Pro",
        price: "₹1,24,999",
        delivery: "4–6 Weeks",
        features: ["Everything in Lite", "Outbound Calling Campaign", "Multiple Phone Numbers", "Advanced CRM Sync", "WhatsApp Follow-up", "Multi-language Support", "Custom Analytics"],
      },
      {
        name: "Enterprise",
        price: "₹3,49,999+",
        delivery: "6–10 Weeks",
        features: ["Everything in Pro", "Multi-Agent Call Center", "Custom Voice Cloning", "ERP Integration", "Enterprise Security", "Dedicated Support"],
      },
    ],
    maintenance: "Basic ₹7,999 / Standard ₹12,999 / Premium ₹19,999 per month",
  },
  {
    id: "whatsapp-crm",
    letter: "W",
    tab: "WHATSAPP & CRM",
    heading: "AUTOMATE YOUR BUSINESS ON WHATSAPP",
    sub: "WhatsApp & CRM Automation",
    body: "Automate customer communication, lead management, follow-ups, sales pipelines, and appointment scheduling via WhatsApp Business API combined with CRM and AI. Auto replies, lead qualification, broadcast campaigns, and full pipeline management — all on the platform your customers already use.",
    cta: "AUTOMATE WHATSAPP",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&h=480&fit=crop&auto=format",
    alt: "WhatsApp business automation",
    capabilities: ["Auto Reply & Welcome Messages", "FAQ Automation", "Appointment Booking", "Order & Payment Updates", "Broadcast Campaigns", "Lead Capture & Qualification", "CRM Pipeline Management", "AI Response Suggestions", "Conversation Summaries", "Follow-up Recommendations"],
    tech: ["WHATSAPP BUSINESS API", "META CLOUD API", "TWILIO", "GUPSHUP", "ZOHO / HUBSPOT / SALESFORCE / PIPEDRIVE / ODOO", "OPENAI / CLAUDE / GEMINI", "N8N", "FASTAPI / NESTJS", "POSTGRESQL"],
    packages: [
      {
        name: "WhatsApp & CRM Lite",
        price: "₹39,999",
        delivery: "1–2 Weeks",
        features: ["WhatsApp Business API Setup", "CRM Integration (1)", "Auto Replies", "Welcome Messages", "Lead Capture", "Pipeline Setup", "Basic AI Lead Qualification", "Admin Dashboard", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "Professional",
        price: "₹99,999",
        delivery: "2–4 Weeks",
        features: ["Everything in Lite", "Multiple CRM Integrations", "AI Chatbot", "Broadcast Campaign System", "Custom Analytics", "Marketing Automation", "Multi-language Support"],
      },
      {
        name: "Enterprise",
        price: "₹2,99,999+",
        delivery: "4–8 Weeks",
        features: ["Everything in Pro", "Voice Agent Integration", "ERP Integration", "Customer Feedback System", "Advanced AI Insights", "SLA Support"],
      },
    ],
    maintenance: "Basic ₹4,999 / Standard ₹8,999 / Premium ₹14,999 per month",
  },
  {
    id: "website",
    letter: "W",
    tab: "WEB, MOBILE & E-COMMERCE",
    heading: "MODERN WEBSITES, APPS & ONLINE STORES",
    sub: "Web & Mobile Development",
    body: "Modern, secure, and highly scalable digital platforms. From corporate websites and full e-commerce platforms to cross-platform mobile applications. We build complete commerce ecosystems and business applications integrated with CRM, AI, and payment gateways — designed to maximize growth and engagement.",
    cta: "BUILD YOUR PLATFORM",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&h=480&fit=crop&auto=format",
    alt: "Web and mobile development",
    capabilities: ["Custom UI/UX Design", "Corporate Websites", "E-Commerce Platforms", "Android & iOS Apps", "Cross-Platform (Flutter / React Native)", "Shopping Cart & Checkout", "Order & Inventory Management", "Payment Gateway Integration", "CMS Integration", "Analytics & SEO Optimized"],
    tech: ["REACT / NEXT.JS / TAILWIND", "FLUTTER / REACT NATIVE", "NODE.JS / NESTJS / FASTAPI", "POSTGRESQL / SUPABASE / FIREBASE", "RAZORPAY / STRIPE / PAYU", "CLOUDFLARE R2 / AWS S3", "STRAPI / SANITY CMS", "VERCEL / CLOUDFLARE / AWS"],
    packages: [
      {
        name: "Business Website",
        price: "₹14,999",
        delivery: "2–4 Weeks",
        features: ["Custom UI/UX Design", "Up to 15 Pages", "CMS Integration", "Blog / News Section", "SEO-Ready", "Analytics Dashboard", "WhatsApp Integration", "Deployment + Support"],
      },
      {
        name: "E-Commerce Store",
        price: "₹49,999",
        delivery: "3–6 Weeks",
        features: ["Custom Responsive Design", "Unlimited Products", "Shopping Cart + Checkout", "Payment Gateway", "Order & Inventory Management", "Admin Dashboard", "Basic SEO + Analytics", "30 Days Support"],
      },
      {
        name: "Mobile App (iOS + Android)",
        price: "₹1,49,999",
        delivery: "8–12 Weeks",
        features: ["Cross-Platform App", "User Authentication", "Push Notifications", "Payment Gateway", "Analytics Dashboard", "CRM / API Integrations", "App Store Deployment", "Security Hardening", "30 Days Support"],
      },
      {
        name: "Enterprise Platform",
        price: "₹4,99,999+",
        delivery: "3–6 Months",
        features: ["Web + Mobile App", "Multi-location Inventory", "ERP Integration", "AI Recommendations", "Advanced Reporting", "Role-Based Access", "Security Audit", "60 Days Support"],
      },
    ],
    maintenance: "Basic ₹2,999 / Standard ₹9,999 / Premium ₹19,999 per month",
  },
  {
    id: "ai-video",
    letter: "V",
    tab: "AI VIDEO & UGC",
    heading: "AI-POWERED MARKETING VIDEOS AT SCALE",
    sub: "AI Video Generation & UGC Ads",
    body: "High-quality marketing videos, social media content, product demonstrations, advertisements, and user-generated content (UGC) produced using AI. We combine AI video generation, AI avatars, AI voiceovers, motion graphics, scriptwriting, and editing — at significantly lower cost and faster turnaround than traditional video production.",
    cta: "CREATE AI VIDEOS",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=700&h=480&fit=crop&auto=format",
    alt: "AI video generation",
    capabilities: ["AI Video Generation", "AI Avatar Spokespersons", "AI Voiceover (Multi-language)", "Script Writing", "Motion Graphics", "Social Media Reels & Shorts", "YouTube Content", "Meta & Google Ad Creatives", "Product Demo Videos", "UGC Advertising Creatives"],
    tech: ["RUNWAY / KLING AI / VEO / PIKA / LUMA AI", "HEYGEN / SYNTHESIA / TAVUS (AI AVATARS)", "ELEVENLABS / OPENAI VOICE / GOOGLE AI VOICE", "ADOBE PREMIERE PRO / AFTER EFFECTS", "CAPCUT PRO / DAVINCI RESOLVE", "CANVA PRO / ADOBE PHOTOSHOP / FIGMA", "CHATGPT / CLAUDE / GEMINI (SCRIPTS)"],
    packages: [
      {
        name: "Starter Content",
        price: "₹14,999/month",
        delivery: "Weekly Deliverables",
        features: ["8 AI Videos/Month", "AI Voiceover", "Script Writing", "Basic Editing", "Brand Logo Integration", "Background Music", "Vertical Format", "Monthly Content Plan", "1 Revision per Video"],
      },
      {
        name: "Business Content",
        price: "₹39,999/month",
        delivery: "Weekly Deliverables",
        features: ["20 AI Videos/Month", "AI Avatar", "Premium Voiceover", "Motion Graphics", "Captions & Subtitles", "Multi-format Export", "Platform Optimization", "Content Calendar", "3 Revisions per Video", "Monthly Performance Review"],
      },
      {
        name: "Enterprise Content",
        price: "₹99,999/month",
        delivery: "Continuous Production",
        features: ["High-Volume Video Production", "AI Avatars", "Multiple Languages", "Campaign Strategy", "Premium Motion Graphics", "Dedicated Creative Team", "Advanced Analytics", "Priority Delivery", "Unlimited Revisions (within scope)"],
      },
      {
        name: "UGC Advertisement",
        price: "₹7,500/video",
        delivery: "2–4 Days",
        features: ["Creative Research", "Script Writing", "AI UGC Creator", "AI Voice", "Product Demonstration", "Strong Hook + CTA", "Multiple Aspect Ratios", "Ad Optimization", "2 Revisions"],
      },
    ],
    maintenance: "",
  }
];\n\nexport function ServicesPage`;

  // We find 'export function ServicesPage' to properly replace the whole block
  content = content.substring(0, startIndex) + newServices + content.substring(endIndex + endStr.length);
  fs.writeFileSync("src/app/pages/ServicesPage.tsx", content);
  console.log("Services array successfully rewritten.");
} else {
  console.log("Could not find SERVICES array boundaries.", startIndex, endIndex);
}
