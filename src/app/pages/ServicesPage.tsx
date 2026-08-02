import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { CheckoutModal } from "@/app/components/CheckoutModal";


function AnimReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const SERVICES = [
  {
    id: "ai-agents",
    letter: "A",
    tab: "AI AGENTS",
    heading: "INTELLIGENT AI AGENTS FOR YOUR BUSINESS",
    sub: "Custom AI Agent Solutions",
    body: "We design, develop, deploy, and maintain intelligent AI agents that automate business operations, answer customer queries, access your company knowledge, and integrate with your existing software. Unlike basic chatbots, our agents can reason, use tools, and connect with CRMs, ERPs, and communication platforms.",
    cta: "BUILD YOUR AI AGENT",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=480&fit=crop&auto=format",
    alt: "Custom AI agents",
    capabilities: ["Customer Support Agent", "Sales & Lead Qualification Agent", "HR & Recruitment Agent", "Knowledge Base Agent", "Executive Assistant", "Document Processing Agent", "Multi-Agent Systems", "CRM / ERP Integration", "Admin Dashboard", "30 Days Support"],
    tech: ["OPENAI GPT-4o", "ANTHROPIC CLAUDE", "GOOGLE GEMINI", "N8N", "NEXT.JS", "REACT", "NESTJS", "FASTAPI", "POSTGRESQL", "PGVECTOR", "CLOUDFLARE R2", "DOCKER"],
    packages: [
      {
        name: "AI Agent Lite",
        price: "₹34,999",
        delivery: "2–3 Weeks",
        features: ["1 AI Agent", "Web Chat Interface", "Knowledge Base Setup", "Basic RAG", "Admin Dashboard", "Authentication", "Conversation History", "Analytics Dashboard", "1 Business Integration", "Deployment + Training", "30 Days Support"],
      },
      {
        name: "AI Agent Pro",
        price: "₹89,999",
        delivery: "4–6 Weeks",
        features: ["Everything in Lite", "Multiple AI Agents", "Advanced RAG & Memory", "Multiple Integrations", "Custom Workflows", "WhatsApp Integration", "Priority Support"],
      },
      {
        name: "Enterprise",
        price: "₹2,49,999+",
        delivery: "6–12 Weeks",
        features: ["Everything in Pro", "Multi-Agent System", "ERP Integration", "Custom UI/UX", "Enterprise Architecture", "SLA Support", "Discovery Workshop"],
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
    id: "workflow",
    letter: "W",
    tab: "WORKFLOW AUTOMATION",
    heading: "AUTOMATE YOUR ENTIRE BUSINESS WORKFLOW",
    sub: "AI Workflow Automation",
    body: "Automate repetitive processes by connecting your applications, AI models, databases, and communication channels. From lead capture and CRM updates to invoice processing, employee onboarding, document approval, and payment reminders — every step automated, every system connected.",
    cta: "AUTOMATE MY WORKFLOW",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&h=480&fit=crop&auto=format",
    alt: "Workflow automation",
    capabilities: ["Lead Capture & CRM Automation", "Invoice Processing", "HR Employee Onboarding", "Document Approval Workflow", "Sales Follow-up Automation", "WhatsApp Notification System", "Email Automation", "Inventory Updates", "Payment Reminder Automation", "AI Decision Nodes"],
    tech: ["N8N", "MAKE", "OPENAI", "CLAUDE", "GEMINI", "FASTAPI", "NESTJS", "POSTGRESQL", "GMAIL / OUTLOOK", "GOOGLE DRIVE / M365", "SLACK / WHATSAPP", "ZOHO / HUBSPOT / SALESFORCE"],
    packages: [
      {
        name: "Workflow Lite",
        price: "₹29,999",
        delivery: "1–2 Weeks",
        features: ["Up to 5 Workflows", "Up to 3 Integrations", "AI Decision Nodes", "Email Automation", "WhatsApp Notifications", "Basic Dashboard", "Deployment + Documentation", "Team Training", "30 Days Support"],
      },
      {
        name: "Workflow Pro",
        price: "₹79,999",
        delivery: "3–5 Weeks",
        features: ["Everything in Lite", "Up to 15 Workflows", "Up to 10 Integrations", "AI Document Processing", "CRM Integration", "Custom Dashboard", "Priority Support"],
      },
      {
        name: "Enterprise",
        price: "₹1,99,999+",
        delivery: "5–10 Weeks",
        features: ["Everything in Pro", "Unlimited Workflows", "ERP Integration", "Custom Middleware", "Enterprise Security", "SLA Support"],
      },
    ],
    maintenance: "Basic ₹3,999 / Standard ₹6,999 / Premium ₹11,999 per month",
  },
  {
    id: "ai-integration",
    letter: "I",
    tab: "AI INTEGRATION",
    heading: "ADD AI TO YOUR EXISTING SOFTWARE",
    sub: "AI Integration Services",
    body: "Seamlessly integrate AI capabilities into your existing software, CRMs, ERPs, and business tools — without rebuilding your tech stack. Add AI assistants, document analysis, content generation, workflow automation, and predictive insights to platforms you already use.",
    cta: "INTEGRATE AI NOW",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=700&h=480&fit=crop&auto=format",
    alt: "AI integration",
    capabilities: ["OpenAI / Claude / Gemini Integration", "Zoho / Salesforce / HubSpot AI", "Google Workspace AI Add-ons", "Microsoft 365 AI Integration", "WhatsApp AI Integration", "Document Analysis AI", "Custom AI Middleware", "Authentication Setup", "Error Handling & Logging", "Basic Dashboard"],
    tech: ["OPENAI", "CLAUDE", "GEMINI", "GROK", "DEEPSEEK", "FASTAPI", "NESTJS", "N8N / MAKE", "POSTGRESQL / SUPABASE", "AWS / CLOUDFLARE / AZURE / GCP", "ZOHO / SALESFORCE / SAP / ODOO", "WHATSAPP / TWILIO"],
    packages: [
      {
        name: "AI Integration Lite",
        price: "₹24,999",
        delivery: "1–2 Weeks",
        features: ["1 AI Model Integration", "Up to 2 API Integrations", "Authentication Setup", "Error Handling", "Logging", "Basic Dashboard", "Deployment + Documentation", "Team Training", "30 Days Support"],
      },
      {
        name: "AI Integration Pro",
        price: "₹69,999",
        delivery: "3–5 Weeks",
        features: ["Everything in Lite", "Multiple AI Models", "Up to 8 API Integrations", "CRM Integration", "Custom Middleware", "Advanced Dashboard", "WhatsApp Integration"],
      },
      {
        name: "Enterprise",
        price: "₹1,99,999+",
        delivery: "6–8 Weeks",
        features: ["Everything in Pro", "ERP Integration", "SSO / OAuth Setup", "Enterprise Security", "SLA Support", "Data Migration"],
      },
    ],
    maintenance: "Basic ₹2,999 / Standard ₹5,999 / Premium ₹9,999 per month",
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
    tab: "WEBSITE DEVELOPMENT",
    heading: "MODERN, FAST & SEO-READY WEBSITES",
    sub: "Website Development",
    body: "Modern, secure, responsive, and SEO-ready websites built to scale. From quick business websites to full e-commerce platforms and enterprise portals — every site is future-ready for AI, CRM, and automation integrations. Built on proven technology that grows with your business.",
    cta: "BUILD MY WEBSITE",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&h=480&fit=crop&auto=format",
    alt: "Website development",
    capabilities: ["Custom UI/UX Design", "Mobile-Responsive", "CMS Integration", "SEO Optimized", "WhatsApp Integration", "Analytics Setup", "SSL & Security", "Google Analytics", "Contact Forms & Booking", "Payment Gateway Ready"],
    tech: ["REACT / NEXT.JS / HTML5 / TAILWIND", "NODE.JS / NESTJS / FASTAPI", "POSTGRESQL / SUPABASE / FIREBASE", "CLERK / SUPABASE AUTH", "CLOUDFLARE R2 / AWS S3", "STRAPI / SANITY CMS", "RAZORPAY / STRIPE / PAYU", "VERCEL / CLOUDFLARE / AWS"],
    packages: [
      {
        name: "Express Website",
        price: "₹2,999",
        delivery: "48–72 Hours",
        features: ["Up to 5 Pages", "Mobile Responsive", "Contact Form", "WhatsApp Integration", "Google Maps", "Basic SEO", "SSL Certificate"],
      },
      {
        name: "Business Website",
        price: "₹14,999",
        delivery: "2–4 Weeks",
        features: ["Custom UI/UX Design", "Up to 15 Pages", "CMS Integration", "Blog / News Section", "Testimonials", "SEO-Ready", "Analytics Dashboard", "WhatsApp Integration"],
      },
      {
        name: "E-Commerce Website",
        price: "₹29,999",
        delivery: "3–6 Weeks",
        features: ["Full Online Store", "Product Catalog", "Shopping Cart", "Razorpay / Stripe Payment", "Order Management", "Inventory Management", "Admin Dashboard"],
      },
      {
        name: "Enterprise Website",
        price: "₹99,999+",
        delivery: "6–12 Weeks",
        features: ["Corporate Portal / University / Hospital", "Multi-location Support", "Advanced Integrations", "Custom Architecture", "Security Hardening", "60 Days Support"],
      },
    ],
    maintenance: "Basic ₹999 / Standard ₹2,999 / Premium ₹5,999 per month",
  },
  {
    id: "mobile-app",
    letter: "M",
    tab: "MOBILE APPS",
    heading: "ANDROID, IOS & CROSS-PLATFORM APPS",
    sub: "Mobile App Development",
    body: "Scalable, secure, high-performance mobile applications for Android, iOS, and cross-platform. Integrates with CRMs, ERPs, AI, and payment gateways. From business apps and e-commerce to field force tools and enterprise platforms — built to engage users and streamline operations.",
    cta: "BUILD MY MOBILE APP",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&h=480&fit=crop&auto=format",
    alt: "Mobile app development",
    capabilities: ["Android & iOS Apps", "Cross-Platform (Flutter / React Native)", "User Authentication", "Push Notifications", "Payment Gateway Integration", "CRM Integration", "Admin Dashboard", "Analytics Integration", "App Store & Play Store Deployment", "Performance Optimization"],
    tech: ["FLUTTER", "REACT NATIVE", "KOTLIN", "SWIFT", "NESTJS / FASTAPI / NODE.JS", "POSTGRESQL / SUPABASE / FIREBASE", "RAZORPAY / STRIPE", "FCM / ONESIGNAL", "FIREBASE / GOOGLE ANALYTICS"],
    packages: [
      {
        name: "Business Mobile App",
        price: "₹49,999",
        delivery: "4–6 Weeks",
        features: ["Android + Cross-Platform", "User Authentication", "Push Notifications", "Contact Forms", "Basic Admin Dashboard", "Analytics Integration", "API Integration (1)", "Google Play Store Deployment", "Documentation + Training", "30 Days Support"],
      },
      {
        name: "Professional Mobile App",
        price: "₹1,49,999",
        delivery: "8–12 Weeks",
        features: ["Android & iOS", "Custom UI/UX Design", "Customer Accounts", "Payment Gateway", "Analytics Dashboard", "CMS Integration", "CRM Integration", "API Integrations (up to 5)", "Performance Optimization", "Security Hardening", "30 Days Support"],
      },
      {
        name: "Enterprise",
        price: "₹3,99,999+",
        delivery: "3–6 Months",
        features: ["Discovery Workshop", "Business Requirement Analysis", "Enterprise Architecture", "Multi-user Role Management", "Advanced Authentication", "ERP & CRM Integration", "Load Testing", "Security Audit", "60 Days Support"],
      },
    ],
    maintenance: "Basic ₹4,999 / Standard ₹9,999 / Premium ₹19,999 per month",
  },
  {
    id: "business-software",
    letter: "B",
    tab: "BUSINESS SOFTWARE",
    heading: "CUSTOM SOFTWARE BUILT FOR YOUR OPERATIONS",
    sub: "Business Software Development",
    body: "End-to-end custom software development for organizations seeking to replace spreadsheets and disconnected systems with unified, scalable digital platforms. From CRM and ERP systems to inventory management, HRMS, hospital management, school ERP, and fully custom enterprise platforms.",
    cta: "BUILD MY SOFTWARE",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=480&fit=crop&auto=format",
    alt: "Business software development",
    capabilities: ["CRM System", "ERP System", "HRMS", "Inventory & Warehouse Management", "Hospital Management System", "School / College ERP", "Custom Enterprise Software", "Business Intelligence Dashboard", "Role-Based Access Control", "API & Third-Party Integrations"],
    tech: ["REACT / NEXT.JS / TAILWIND", "NESTJS / FASTAPI / NODE.JS", "POSTGRESQL / SUPABASE / MONGODB", "CLERK / SUPABASE AUTH / OAUTH 2.0 / SSO", "AWS / GCP / AZURE / CLOUDFLARE", "CLOUDFLARE R2 / AWS S3", "METABASE / APACHE SUPERSET / POWER BI", "ZOHO / SALESFORCE / SAP / TALLY / RAZORPAY"],
    packages: [
      { name: "CRM System", price: "₹1,49,999", delivery: "6–10 Weeks", features: ["Lead Management", "Sales Pipeline", "Customer Database", "Task Management", "Follow-up Reminders", "Reports & Analytics", "Role-Based Access", "WhatsApp Integration", "Documentation + Training", "30 Days Support"] },
      { name: "HRMS", price: "₹1,99,999", delivery: "8–12 Weeks", features: ["Employee Management", "Attendance & Leave", "Payroll Module", "Recruitment Module", "Performance Tracking", "Employee Portal", "HR Dashboard", "Reports", "Training + 30 Days Support"] },
      { name: "Inventory Management", price: "₹2,49,999", delivery: "8–12 Weeks", features: ["Product Management", "Warehouse Management", "Purchase Orders", "Vendor Management", "Barcode Support", "Stock Alerts", "Reports & Dashboard", "Training + 30 Days Support"] },
      { name: "School ERP", price: "₹3,49,999", delivery: "3–5 Months", features: ["Student Management", "Admissions", "Attendance", "Fees Management", "Timetable", "Examination", "Parent Portal", "Training + 30 Days Support"] },
      { name: "Hospital Management System", price: "₹4,99,999", delivery: "4–6 Months", features: ["Patient Management", "Doctor Scheduling", "Billing", "Pharmacy", "Laboratory", "Electronic Medical Records", "Appointment Booking", "Training + 30 Days Support"] },
      { name: "ERP System", price: "₹3,99,999", delivery: "5–8 Months", features: ["Procurement", "Inventory", "Accounting", "Production", "Sales & Purchase", "Vendor Management", "Finance Dashboard", "Training + 30 Days Support"] },
      { name: "Custom Enterprise Software", price: "₹5,99,999+", delivery: "Based on Scope", features: ["Business Analysis", "Solution Architecture", "UI/UX Design", "Complete Custom Development", "Enterprise Integrations", "Security Implementation", "Load Testing", "90 Days Support"] },
    ],
    maintenance: "Basic ₹9,999 / Professional ₹24,999 / Enterprise ₹49,999+ per month (AMC)",
  },
  {
    id: "ecommerce",
    letter: "E",
    tab: "E-COMMERCE",
    heading: "COMPLETE E-COMMERCE PLATFORMS THAT SELL",
    sub: "E-Commerce Solutions",
    body: "End-to-end e-commerce platforms that go beyond a simple online store. We build complete commerce ecosystems integrating inventory management, payment gateways, logistics, CRM, marketing automation, analytics, and AI-powered customer engagement — designed to maximize conversions and scale.",
    cta: "BUILD MY STORE",
    img: "https://images.unsplash.com/photo-1557821552-17105176677c?w=700&h=480&fit=crop&auto=format",
    alt: "E-commerce platform",
    capabilities: ["Custom Responsive Design", "Product Catalog & Variants", "Shopping Cart & Checkout", "Payment Gateway Integration", "Order & Inventory Management", "CRM Integration", "Marketing Automation", "Shipping Integration", "Customer Reviews & Wishlist", "Analytics Dashboard"],
    tech: ["NEXT.JS / REACT / TAILWIND", "NESTJS / FASTAPI / NODE.JS", "POSTGRESQL / SUPABASE / REDIS", "RAZORPAY / STRIPE / PAYU / CASHFREE", "CLOUDFLARE R2 / AWS S3", "SHIPROCKET / DELHIVERY / BLUE DART", "WHATSAPP BUSINESS API", "GOOGLE ANALYTICS / META PIXEL"],
    packages: [
      {
        name: "Starter E-Commerce Store",
        price: "₹49,999",
        delivery: "3–5 Weeks",
        features: ["Custom Responsive Design", "Up to 100 Products", "Product Categories", "Customer Registration", "Shopping Cart + Checkout", "Payment Gateway", "Order Management", "Basic Inventory", "Admin Dashboard", "Basic SEO + Analytics", "Deployment + 30 Days Support"],
      },
      {
        name: "Professional E-Commerce",
        price: "₹1,49,999",
        delivery: "6–10 Weeks",
        features: ["Unlimited Products", "Advanced UI/UX", "Product Variants", "Coupons & Discounts", "Wishlist & Reviews", "Shipping Integration", "CRM Integration", "Marketing Automation", "Analytics Dashboard", "Advanced SEO", "30 Days Support"],
      },
      {
        name: "Enterprise Commerce",
        price: "₹4,99,999",
        delivery: "3–6 Months",
        features: ["Multi-location Inventory", "ERP Integration", "AI Product Recommendations", "Loyalty Program", "Advanced Reporting", "Role-Based Access", "Security Hardening", "60 Days Support"],
      },
      {
        name: "Marketplace Development",
        price: "₹9,99,999",
        delivery: "5–8 Months",
        features: ["Vendor Portal & Dashboard", "Commission Management", "Product Approval Workflow", "Wallet System", "Payment Settlement", "Shipping Integration", "Advanced Analytics", "90 Days Support"],
      },
    ],
    maintenance: "Basic ₹7,999 / Professional ₹19,999 / Enterprise ₹39,999+ per month",
  },
  {
    id: "digital-marketing",
    letter: "D",
    tab: "DIGITAL MARKETING",
    heading: "GROW YOUR BUSINESS WITH DIGITAL MARKETING",
    sub: "Digital Marketing & SEO",
    body: "Comprehensive growth strategies combining SEO, Paid Advertising, Social Media Marketing, Content Marketing, Email Marketing, CRO, and AI-powered marketing automation. Every campaign is built around measurable business objectives — qualified leads, revenue growth, and sustainable long-term growth.",
    cta: "START GROWING NOW",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=700&h=480&fit=crop&auto=format",
    alt: "Digital marketing",
    capabilities: ["Search Engine Optimization (SEO)", "Google Ads Management", "Meta Ads Management", "Social Media Marketing", "Content Marketing & Blog Strategy", "Email Marketing", "Conversion Rate Optimization", "AI Marketing Automation", "Analytics & Performance Tracking", "Marketing Automation"],
    tech: ["GOOGLE SEARCH CONSOLE / GA4 / GTM", "AHREFS / SEMRUSH / SCREAMING FROG", "GOOGLE ADS / META ADS MANAGER", "LINKEDIN / YOUTUBE ADS", "HUBSPOT / MAILCHIMP / BREVO / ACTIVECAMPAIGN", "CANVA PRO / ADOBE SUITE / CAPCUT", "CHATGPT / CLAUDE / GEMINI / MIDJOURNEY", "GOOGLE LOOKER STUDIO / META PIXEL"],
    packages: [
      {
        name: "Starter Growth",
        price: "₹19,999/month",
        delivery: "Ongoing Monthly",
        features: ["Initial Marketing Audit", "Keyword Research", "Google Business Profile Optimization", "Basic On-Page SEO", "8 Social Media Posts/Month", "Monthly Performance Report", "Basic Analytics Setup", "Email Support"],
      },
      {
        name: "Business Growth",
        price: "₹49,999/month",
        delivery: "Ongoing Monthly",
        features: ["Complete SEO", "Google Ads Management", "Meta Ads Management", "Social Media Marketing", "16 Social Media Posts/Month", "Content Marketing + Blog", "Email Marketing", "Analytics Dashboard", "Monthly Strategy Meeting"],
      },
      {
        name: "Enterprise Growth",
        price: "₹99,999/month",
        delivery: "Ongoing Monthly",
        features: ["Enterprise SEO", "Multi-platform Advertising", "Marketing Automation", "Conversion Rate Optimization", "Advanced Analytics", "AI Campaign Optimization", "Dedicated Marketing Manager", "Weekly Performance Reviews"],
      },
      {
        name: "Performance Marketing",
        price: "₹29,999/month",
        delivery: "Ongoing Monthly",
        features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "YouTube Ads", "Conversion Tracking", "Landing Page Optimization", "Weekly Performance Reports"],
      },
    ],
    maintenance: "",
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
  },
];

export function ServicesPage({ onNavigate, initialServiceIndex = 0, scrollToDetail = false }: { onNavigate: (p: string) => void; initialServiceIndex?: number; scrollToDetail?: boolean }) {
  const [active, setActive] = useState(initialServiceIndex);
  const [checkoutService, setCheckoutService] = useState<{ name: string; price: string } | null>(null);
  const srv = SERVICES[active];

  useEffect(() => {
    setActive(initialServiceIndex);
    if (scrollToDetail) {
      // Small delay to let the page render before scrolling
      setTimeout(() => {
        document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }, [initialServiceIndex, scrollToDetail]);

  return (
    <div className="bg-white">
      {/* Page hero */}
      <section className="bg-[#0a0a0a] pt-16">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="w-6 h-px bg-white/50" /> Services
            </p>
            <h1 className="text-white leading-[0.92] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900 }}>
              AI SYSTEMS &<br />
              <span className="text-white">AUTOMATION</span><br />
              THAT SCALE
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              We build AI agents, voice agents, workflow automation, custom software, e-commerce platforms, digital marketing, and AI video — everything your business needs to grow with AI.
            </p>
            <motion.button
              onClick={() => onNavigate("contact")}
              className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors group"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              GET IN TOUCH TODAY <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="hidden lg:block">
            <div className="relative h-[420px] rounded-2xl overflow-hidden bg-[#1a1a1a]">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=500&fit=crop&auto=format" alt="BePrompter services" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-[#0a0a0a]/60" />
              <motion.div
                className="absolute bottom-6 left-6 bg-white px-4 py-3 rounded-lg shadow-xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-black font-black text-xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>11 Services</p>
                <p className="text-[#0a0a0a] text-xs font-semibold uppercase tracking-wider">AI-First Engineering</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Service count strip */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <span key={s.id} className="border border-white/10 text-white/35 text-xs px-3 py-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.tab}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW GRID ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-12">
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Our Services</p>
            <h2 className="text-[#0a0a0a]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1 }}>
              AI-FIRST SERVICES.<br />ONE ENGINEERING PARTNER.
            </h2>
          </AnimReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#f0f0f0]">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => {
                  setActive(i);
                  document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-5 text-left group transition-colors ${active === i ? "bg-[#0a0a0a]" : "bg-white hover:bg-[#0a0a0a]"}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ scale: 1.01 }}
              >
                <p
                  className={`font-black text-xs leading-tight uppercase tracking-wide group-hover:!text-white ${active === i ? "text-white" : "text-[#0a0a0a]"}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}
                >
                  {s.tab}
                </p>
                {active === i && (
                  <motion.div layoutId="activeBar" className="mt-2 w-6 h-0.5 bg-white" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE DETAIL ── */}
      <section id="service-detail" className="bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Tab strip */}
          <div className="flex overflow-x-auto gap-1 mb-12 pb-2 border-b border-white/10 scrollbar-hide">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                className={`shrink-0 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                  active === i ? "bg-white text-black" : "text-white/40 hover:text-white border border-white/10 hover:border-white/30"
                }`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                {s.tab}
              </motion.button>
            ))}
          </div>

          {/* Detail content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Top: heading + description + image */}
              <div className="grid lg:grid-cols-2 gap-16 items-start relative mb-16">
                <div
                  className="absolute top-0 right-0 text-white/[0.03] font-black select-none pointer-events-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(8rem, 18vw, 16rem)", lineHeight: 0.85 }}
                >
                  {srv.letter}
                </div>

                <div className="relative z-10">
                  <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{srv.sub}</p>
                  <h2 className="text-white leading-[0.95] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.6rem)", fontWeight: 900 }}>
                    {srv.heading}
                  </h2>
                  <p className="text-white/60 text-base leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>{srv.body}</p>

                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {srv.capabilities.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-white/60 rounded-full shrink-0" />
                        <span className="text-white/50 text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{c}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => onNavigate("contact")}
                    className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-7 py-3.5 flex items-center gap-3 transition-colors group"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    {srv.cta} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                <div className="relative">
                  <motion.div
                    className="rounded-xl overflow-hidden h-[360px] bg-[#222]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <img
                      src={srv.img}
                      alt={srv.alt}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-white/10 to-transparent pointer-events-none" />
                  </motion.div>
                </div>
              </div>

              {/* Pricing packages */}
              <div className="mb-4">
                <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Packages & Pricing</p>
                <div className={`grid gap-4 ${srv.packages.length <= 2 ? "md:grid-cols-2" : srv.packages.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
                  {srv.packages.map((pkg, pi) => (
                    <motion.div
                      key={pkg.name}
                      className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-6 flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pi * 0.08 }}
                    >
                      <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{pkg.name}</p>
                      <p className="text-white font-black mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>{pkg.price}</p>
                      <p className="text-white/40 text-xs uppercase tracking-wide mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{pkg.delivery}</p>
                      <ul className="space-y-1.5 flex-1">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check size={11} className="text-white/50 mt-0.5 shrink-0" />
                            <span className="text-white/55 text-xs leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <motion.button
                        onClick={() => setCheckoutService({ name: `${srv.sub} - ${pkg.name}`, price: pkg.price })}
                        className="mt-5 border border-white/20 hover:bg-white hover:text-black text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 transition-all flex items-center gap-2 justify-center group"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      >
                        Get Started <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
                {srv.maintenance && (
                  <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Monthly Maintenance: {srv.maintenance}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimReveal className="mb-10">
            <p className="text-black/50 text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Technology</p>
            <h2 className="text-[#0a0a0a] leading-[0.95]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
              TOOLS WE USE FOR<br />
              <span className="text-black">{srv.tab}</span>
            </h2>
          </AnimReveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={active + "tech"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#f0f0f0]"
            >
              {srv.tech.map((t, ti) => (
                <motion.div
                  key={t}
                  className="bg-white px-6 py-4 flex items-center gap-3 group hover:bg-[#0a0a0a] transition-colors cursor-default"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ti * 0.04 }}
                >
                  <div className="w-1.5 h-1.5 bg-black rounded-full shrink-0 group-hover:scale-150 transition-transform" />
                  <span className="text-[#333] group-hover:text-white text-sm font-bold uppercase tracking-widest transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {t}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-[#0a0a0a] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimReveal>
              <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Ready to Start?</p>
              <h2 className="text-white leading-[0.95] mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 900 }}>
                LET'S BUILD SOMETHING<br />
                REMARKABLE TOGETHER
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Whether you need a custom AI agent, a complete e-commerce platform, workflow automation, or a digital marketing strategy — we have the expertise, the technology, and the team to deliver it.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => onNavigate("contact")}
                  className="bg-white hover:bg-white/90 text-black text-xs font-bold tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors group"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  GET A FREE CONSULTATION <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </AnimReveal>

            <AnimReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "11", label: "Services Offered" },
                  { stat: "AI-First", label: "Engineering Approach" },
                  { stat: "30 Days", label: "Post-Delivery Support" },
                  { stat: "₹2,999", label: "Starting Price" },
                ].map((item) => (
                  <div key={item.label} className="border border-white/10 p-5">
                    <p className="text-white font-black text-2xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.stat}</p>
                    <p className="text-white/40 text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </AnimReveal>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutService}
        onClose={() => setCheckoutService(null)}
        serviceName={checkoutService?.name || ""}
        price={checkoutService?.price || ""}
        onNavigate={onNavigate}
      />
    </div>
  );
}
