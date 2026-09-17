/**
 * seo.ts — Centralized SEO configuration for BePrompter Services Website
 * Domain: https://beprompter.services
 *
 * Provides a useSEO hook that dynamically updates document.title,
 * meta description, canonical URL, and Open Graph / Twitter Card tags
 * on every page navigation.
 */

import { useEffect } from "react";

const SITE_NAME = "BePrompter";
const BASE_URL = "https://beprompter.services";
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const OG_IMAGE_WIDTH = "1200";
const OG_IMAGE_HEIGHT = "630";
const TWITTER_HANDLE = "@BePrompter";

export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string;
  noIndex?: boolean;
}

/** Per-page SEO configuration */
export const PAGE_SEO: Record<string, PageSEO> = {
  home: {
    title: "BePrompter | AI Automation — WhatsApp Bots, CRM & Smart Landing Pages",
    description:
      "BePrompter builds AI WhatsApp Bots, CRM Automations, and Smart Landing Pages that capture leads 24/7, eliminate manual data entry, and grow your revenue. Book a free strategy call.",
    canonical: `${BASE_URL}/`,
    keywords:
      "AI automation, WhatsApp bot, AI CRM, lead generation, smart landing pages, AI real estate, business automation, BePrompter",
  },
  about: {
    title: "About BePrompter | AI-First Engineering Team",
    description:
      "Meet the team behind BePrompter — an AI-first engineering company on a mission to automate business growth for real estate, retail, and service industries.",
    canonical: `${BASE_URL}/about`,
    keywords: "BePrompter team, AI company, AI engineering, about BePrompter",
  },
  services: {
    title: "AI Services | WhatsApp Bots, CRM, Smart Pages & Internal AI — BePrompter",
    description:
      "Explore BePrompter's full suite of AI services: WhatsApp Customer Acquisition Bots, CRM Automation Engines, AI Smart Landing Pages, and Internal Brain knowledge systems.",
    canonical: `${BASE_URL}/services`,
    keywords:
      "AI WhatsApp bot, CRM automation, smart landing pages, internal AI brain, AI services, business automation",
  },
  "real-estate": {
    title: "AI Automation for Real Estate Agents & Brokers — BePrompter",
    description:
      "BePrompter builds AI WhatsApp bots and CRM automations purpose-built for real estate brokers to capture more leads, respond instantly, and close more deals — 24/7.",
    canonical: `${BASE_URL}/real-estate`,
    keywords:
      "AI real estate, WhatsApp bot for real estate, real estate CRM automation, real estate lead generation, real estate AI",
  },
  industries: {
    title: "Industries We Serve | AI Automation for Real Estate, Retail & More — BePrompter",
    description:
      "Discover how BePrompter's intelligent AI systems serve real estate, retail, healthcare, D2C, and service industries with scalable automation and lead capture.",
    canonical: `${BASE_URL}/industries`,
    keywords:
      "AI for real estate, AI for retail, AI for healthcare, industry AI automation, BePrompter industries",
  },
  insights: {
    title: "AI Insights & Industry Reports — BePrompter",
    description:
      "Stay ahead of the curve with BePrompter's expert insights on AI automation, WhatsApp marketing strategies, CRM best practices, and lead generation tactics.",
    canonical: `${BASE_URL}/insights`,
    keywords:
      "AI insights, WhatsApp marketing, CRM best practices, AI automation blog, lead generation tips",
  },
  "case-studies": {
    title: "Case Studies | Real AI Automation Results — BePrompter",
    description:
      "Real results from real businesses. See how BePrompter's AI systems have transformed lead capture rates, automated sales, and streamlined operations for clients.",
    canonical: `${BASE_URL}/case-studies`,
    keywords:
      "AI case studies, automation results, AI ROI, BePrompter case studies, lead capture results",
  },
  "agency-partners": {
    title: "Agency Partners | White-Label AI Automation — BePrompter",
    description:
      "Partner with BePrompter to deliver enterprise-grade AI automation to your clients under your own brand. Expand your service offering with our white-label AI solutions.",
    canonical: `${BASE_URL}/agency-partners`,
    keywords:
      "white-label AI, agency partner, AI reseller, automation partnership, BePrompter agency",
  },
  trust: {
    title: "Security & Trust | How We Protect Your Data — BePrompter",
    description:
      "Learn how BePrompter protects client data with SOC-2 aligned infrastructure, end-to-end encryption, strict access controls, and GDPR-conscious engineering.",
    canonical: `${BASE_URL}/trust`,
    keywords:
      "AI security, data privacy, SOC-2 AI, GDPR compliant AI, BePrompter security, trust",
  },
  contact: {
    title: "Contact BePrompter | Book a Free AI Strategy Call",
    description:
      "Ready to automate your business growth? Schedule a free strategy call with BePrompter's lead AI engineers and discover exactly how to capture more leads and reduce manual work.",
    canonical: `${BASE_URL}/contact`,
    keywords:
      "contact BePrompter, book AI consultation, free strategy call, AI automation consultation",
  },
  "lets-talk": {
    title: "Let's Talk — Start Your AI Journey | BePrompter",
    description:
      "Ready to automate? Start a conversation with BePrompter today and discover how AI can transform your business operations and lead generation.",
    canonical: `${BASE_URL}/lets-talk`,
    keywords: "talk to BePrompter, AI consultation, start AI automation, BePrompter contact",
  },
  "privacy-policy": {
    title: "Privacy Policy — BePrompter",
    description:
      "BePrompter's privacy policy: how we collect, use, protect, and manage your personal data in compliance with applicable data protection regulations.",
    canonical: `${BASE_URL}/privacy-policy`,
    noIndex: false,
  },
  sitemap: {
    title: "Sitemap — BePrompter | All Pages",
    description:
      "A complete map of every page on beprompter.services — from AI services and case studies to contact and legal pages.",
    canonical: `${BASE_URL}/sitemap`,
    keywords: "BePrompter sitemap, all pages, site map",
  },
  // Internal/auth pages — noindex
  auth: {
    title: "Sign In — BePrompter",
    description: "Sign in to your BePrompter client portal.",
    canonical: `${BASE_URL}/auth`,
    noIndex: true,
  },
  "client-dashboard": {
    title: "Client Dashboard — BePrompter",
    description: "BePrompter client dashboard.",
    canonical: `${BASE_URL}/client-dashboard`,
    noIndex: true,
  },
  "developer-dashboard": {
    title: "Developer Dashboard — BePrompter",
    description: "BePrompter developer dashboard.",
    canonical: `${BASE_URL}/developer-dashboard`,
    noIndex: true,
  },
  "sales-dashboard": {
    title: "Sales Dashboard — BePrompter",
    description: "BePrompter sales dashboard.",
    canonical: `${BASE_URL}/sales-dashboard`,
    noIndex: true,
  },
  "admin-dashboard": {
    title: "Admin Dashboard — BePrompter",
    description: "BePrompter admin dashboard.",
    canonical: `${BASE_URL}/admin-dashboard`,
    noIndex: true,
  },
};

/** Fallback SEO for unknown pages */
const DEFAULT_SEO: PageSEO = {
  title: "BePrompter | AI Automation for Business Growth",
  description:
    "BePrompter builds AI WhatsApp Bots, CRM Automations, and Smart Landing Pages that capture leads 24/7 and grow your revenue.",
  canonical: BASE_URL,
  keywords: "AI automation, WhatsApp bot, CRM automation, BePrompter",
};

// ─── Utility: set or create a <meta> tag ────────────────────────────────────

function setMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useSEO — Call this hook with the current page key on every navigation.
 * It dynamically updates all critical SEO meta tags in the document head.
 */
export function useSEO(page: string) {
  useEffect(() => {
    const seo: PageSEO = PAGE_SEO[page] ?? DEFAULT_SEO;

    const title = seo.title;
    const description = seo.description;
    const canonical = seo.canonical;
    const ogImage = seo.ogImage ?? OG_IMAGE;
    const ogTitle = seo.ogTitle ?? title;
    const ogDescription = seo.ogDescription ?? description;

    // ── Title ──
    document.title = title;

    // ── Robots ──
    setMeta('meta[name="robots"]', "name", "robots", seo.noIndex ? "noindex, nofollow" : "index, follow");

    // ── Description ──
    setMeta('meta[name="description"]', "name", "description", description);

    // ── Keywords ──
    if (seo.keywords) {
      setMeta('meta[name="keywords"]', "name", "keywords", seo.keywords);
    }

    // ── Canonical ──
    setLinkCanonical(canonical);

    // ── Open Graph ──
    setMeta('meta[property="og:title"]', "property", "og:title", ogTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", ogDescription);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:image:width"]', "property", "og:image:width", OG_IMAGE_WIDTH);
    setMeta('meta[property="og:image:height"]', "property", "og:image:height", OG_IMAGE_HEIGHT);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", `${SITE_NAME} — AI Automation for Business Growth`);

    // ── Twitter Card ──
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", ogTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", ogDescription);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
  }, [page]);
}
