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
import { PricingPage } from "@/app/pages/PricingPage";
import { supabase, resolveUserRole, isAdminEmail, UserRole } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useSEO } from "@/lib/seo";
import { StructuredData } from "@/app/components/StructuredData";

type Page =
  | "home" | "about" | "services" | "pricing"
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

const DASHBOARD_PAGES: Page[] = ["client-dashboard", "developer-dashboard", "sales-dashboard", "admin-dashboard"];

export default function App() {
  const location = useLocation();
  const routeNavigate = useNavigate();
  const [page, setPage] = useState<Page>("home");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
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

  const syncUserAndRole = async (u: User | null) => {
    setUser(u);
    if (!u) {
      setProfileRole(null);
      return;
    }

    let pRole: UserRole = resolveUserRole(u.email, u.user_metadata?.role);

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .or(`id.eq.${u.id},email.eq.${u.email}`)
        .maybeSingle();

      if (profile?.role) {
        pRole = resolveUserRole(u.email, profile.role, u.user_metadata?.role);
      }

      // Enforce admin profile in database for authorized admin accounts (e.g. shauryap0000@gmail.com)
      if (pRole === "admin" || isAdminEmail(u.email)) {
        pRole = "admin";
        await supabase.from("profiles").upsert({
          id: u.id,
          email: u.email!,
          role: "admin",
          full_name: profile?.full_name || u.user_metadata?.full_name || "Shaurya Pratap",
          company_name: profile?.company_name || "BePrompter Admin",
          phone: profile?.phone || u.user_metadata?.phone || null,
          created_at: profile?.created_at || new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn("syncUserAndRole note:", err);
    }

    setProfileRole(pRole);

    const currentPath = location.pathname.replace(/\/+$/, "") || "/";
    // If an admin is on auth OR on client-dashboard, route to admin-dashboard
    if (pRole === "admin" || isAdminEmail(u.email)) {
      if (currentPath === "/auth" || currentPath === "/client-dashboard") {
        routeNavigate("/admin-dashboard");
      }
    } else if (currentPath === "/auth") {
      if (pRole === "developer") routeNavigate("/developer-dashboard");
      else if (pRole === "sales") routeNavigate("/sales-dashboard");
      else routeNavigate("/client-dashboard");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUserAndRole(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserAndRole(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [location.pathname]);

  const navigate = (p: string) => {
    if (p.startsWith("services:")) {
      const idx = parseInt(p.split(":")[1], 10);
      setServiceIndex(isNaN(idx) ? 0 : idx);
      setScrollToDetail(true);
      routeNavigate("/services");
    } else if (p.startsWith("industries:")) {
      const ind = p.split(":")[1];
      setSelectedIndustry(ind);
      routeNavigate("/industries");
    } else if (p === "industries") {
      setSelectedIndustry(null);
      routeNavigate("/industries");
    } else if (p === "pricing") {
      routeNavigate("/pricing");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    const role = resolveUserRole(user?.email, profileRole, user?.user_metadata?.role);
    if (role === "admin" || isAdminEmail(user?.email)) return "admin-dashboard";
    if (role === "developer") return "developer-dashboard";
    if (role === "sales") return "sales-dashboard";
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
      case "pricing":          return <PricingPage onNavigate={navigate} />;
      case "contact":          return <ContactPage />;
      case "industries":       return <IndustriesPage onNavigate={navigate} initialIndustry={selectedIndustry || undefined} />;
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
      case "client-dashboard": {
        const role = resolveUserRole(user?.email, profileRole, user?.user_metadata?.role);
        if (role === "admin" || isAdminEmail(user?.email)) return <AdminDashboard onNavigate={navigate} />;
        return <ClientDashboard onNavigate={navigate} />;
      }
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

      {!isDashboard && <Nav currentPage={page} onNavigate={navigate} user={user} userRole={profileRole} />}

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
