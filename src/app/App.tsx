import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Nav } from "@/app/components/Nav";
import { Footer } from "@/app/components/Footer";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { HomePage } from "@/app/pages/HomePage";
import { RealEstateIndustryPage } from "@/app/pages/RealEstateIndustryPage";
import { AboutPage } from "@/app/pages/AboutPage";
import { ServicesPage } from "@/app/pages/ServicesPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { AuthPage } from "@/app/pages/AuthPage";
import { ClientDashboard } from "@/app/pages/ClientDashboard";
import { DeveloperDashboard } from "@/app/pages/DeveloperDashboard";
import { SalesDashboard } from "@/app/pages/SalesDashboard";
import { AdminDashboard } from "@/app/pages/AdminDashboard";
import { IndustriesPage } from "@/app/pages/IndustriesPage";
import { InsightsPage } from "@/app/pages/InsightsPage";
import { CaseStudiesPage } from "@/app/pages/CaseStudiesPage";
import { AgencyPartnersPage } from "@/app/pages/AgencyPartnersPage";
import { TrustPage } from "@/app/pages/TrustPage";
import { PrivacyPolicyPage } from "@/app/pages/PrivacyPolicyPage";
import { TermsPage } from "@/app/pages/TermsPage";
import { RefundPolicyPage } from "@/app/pages/RefundPolicyPage";
import { CookiePolicyPage } from "@/app/pages/CookiePolicyPage";
import { AcceptableUsePage } from "@/app/pages/AcceptableUsePage";
import { AIDisclaimerPage } from "@/app/pages/AIDisclaimerPage";
import { SecurityPage } from "@/app/pages/SecurityPage";
import { GrievancePage } from "@/app/pages/GrievancePage";
import { IntellectualPropertyPage } from "@/app/pages/IntellectualPropertyPage";
import { LetsTalkPage } from "@/app/pages/LetsTalkPage";
import { SitemapPage } from "@/app/pages/SitemapPage";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useSEO } from "@/lib/seo";
import { StructuredData } from "@/app/components/StructuredData";

type Page =
  | "home" | "about" | "services"
  | "contact" | "real-estate"
  | "industries" | "insights" | "case-studies" | "agency-partners" | "trust" | "privacy-policy" | "lets-talk"
  | "terms" | "refund-policy" | "cookie-policy" | "acceptable-use" | "ai-disclaimer" | "security" | "grievance" | "intellectual-property"
  | "sitemap"
  | "auth" | "client-dashboard" | "developer-dashboard" | "sales-dashboard" | "admin-dashboard";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

const DASHBOARD_PAGES: Page[] = ["auth", "client-dashboard", "developer-dashboard", "sales-dashboard", "admin-dashboard"];

export default function App() {
  const location = useLocation();
  const routeNavigate = useNavigate();
  const [page, setPage] = useState<Page>("home");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [scrollToDetail, setScrollToDetail] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);

  // Sync page state with current route
  useEffect(() => {
    let path = location.pathname.replace(/^\//, "");
    if (!path) path = "home";
    setPage(path as Page);
  }, [location.pathname]);

  // ── SEO: update meta tags + JSON-LD on every page navigation ──
  useSEO(page);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      
      let pRole = u?.user_metadata?.role;
      if (u) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", u.id).single();
        if (profile?.role) pRole = profile.role;
        setProfileRole(pRole);
      }

      // If already logged in on mount and sitting on auth page, redirect to dashboard
      if (u) {
        if (location.pathname === "/auth") {
          if (pRole === "admin") routeNavigate("/admin-dashboard");
          else if (pRole === "developer") routeNavigate("/developer-dashboard");
          else if (pRole === "sales") routeNavigate("/sales-dashboard");
          else routeNavigate("/client-dashboard");
        }
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      
      let pRole = u?.user_metadata?.role;
      if (u) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", u.id).single();
        if (profile?.role) pRole = profile.role;
        setProfileRole(pRole);
      }

      // When auth state changes to logged-in while on auth page, redirect immediately
      if (u) {
        if (location.pathname === "/auth") {
          if (pRole === "admin") routeNavigate("/admin-dashboard");
          else if (pRole === "developer") routeNavigate("/developer-dashboard");
          else if (pRole === "sales") routeNavigate("/sales-dashboard");
          else routeNavigate("/client-dashboard");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const navigate = (p: string) => {
    if (p.startsWith("services:")) {
      const idx = parseInt(p.split(":")[1], 10);
      setServiceIndex(isNaN(idx) ? 0 : idx);
      setScrollToDetail(true);
      routeNavigate("/services");
    } else if (p.startsWith("home:")) {
      routeNavigate("/");
      setTimeout(() => {
        const element = document.getElementById(p.split(":")[1]);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      if (p === "services") setScrollToDetail(false);
      routeNavigate(p === "home" ? "/" : `/${p}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isDashboard = DASHBOARD_PAGES.includes(page);

  const getDashboardPage = (): Page => {
    if (profileRole === "admin") return "admin-dashboard";
    if (profileRole === "developer") return "developer-dashboard";
    if (profileRole === "sales") return "sales-dashboard";
    return "client-dashboard";
  };

  const renderPage = () => {
    // If logged in and trying to view auth page, redirect to dashboard
    if (page === "auth" && user) {
      const dp = getDashboardPage();
      if (dp === "admin-dashboard") return <AdminDashboard onNavigate={navigate} />;
      if (dp === "developer-dashboard") return <DeveloperDashboard onNavigate={navigate} />;
      if (dp === "sales-dashboard") return <SalesDashboard onNavigate={navigate} />;
      return <ClientDashboard onNavigate={navigate} />;
    }
    switch (page) {
      case "home":             return <HomePage onNavigate={navigate} />;
      case "real-estate":      return <RealEstateIndustryPage onNavigate={navigate} />;
      case "about":            return <AboutPage onNavigate={navigate} />;
      case "services":         return <ServicesPage onNavigate={navigate} initialServiceIndex={serviceIndex} scrollToDetail={scrollToDetail} />;
      case "contact":          return <ContactPage />;
      case "industries":       return <IndustriesPage onNavigate={navigate} />;
      case "insights":         return <InsightsPage onNavigate={navigate} />;
      case "case-studies":     return <CaseStudiesPage onNavigate={navigate} />;
      case "agency-partners":  return <AgencyPartnersPage onNavigate={navigate} />;
      case "trust":            return <TrustPage onNavigate={navigate} />;
      case "privacy-policy":   return <PrivacyPolicyPage />;
      case "terms":            return <TermsPage />;
      case "refund-policy":    return <RefundPolicyPage />;
      case "cookie-policy":    return <CookiePolicyPage />;
      case "acceptable-use":   return <AcceptableUsePage />;
      case "ai-disclaimer":    return <AIDisclaimerPage />;
      case "security":         return <SecurityPage />;
      case "grievance":        return <GrievancePage />;
      case "intellectual-property": return <IntellectualPropertyPage />;
      case "lets-talk":        return <LetsTalkPage />;
      case "sitemap":          return <SitemapPage onNavigate={navigate} />;
      case "auth":             return <AuthPage onNavigate={navigate} />;
      case "client-dashboard": return <ClientDashboard onNavigate={navigate} />;
      case "developer-dashboard":return <DeveloperDashboard onNavigate={navigate} />;
      case "sales-dashboard":  return <SalesDashboard onNavigate={navigate} />;
      case "admin-dashboard":  return <AdminDashboard onNavigate={navigate} />;
      default:                 return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Barlow', 'Inter', sans-serif" }}>
      {/* ── JSON-LD Structured Data (injected into <head> via dangerouslySetInnerHTML) ── */}
      <StructuredData page={page} />

      <Nav currentPage={page} onNavigate={navigate} user={user} userRole={profileRole} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <ErrorBoundary key={page}>
            {renderPage()}
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>

      {!isDashboard && <Footer onNavigate={navigate} />}
    </div>
  );
}
