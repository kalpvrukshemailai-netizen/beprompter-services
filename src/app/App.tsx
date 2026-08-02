import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Nav } from "@/app/components/Nav";
import { Footer } from "@/app/components/Footer";
import { HomePage } from "@/app/pages/HomePage";
import { AboutPage } from "@/app/pages/AboutPage";
import { ServicesPage } from "@/app/pages/ServicesPage";
import { ClientsPage } from "@/app/pages/ClientsPage";
import { IndustriesPage } from "@/app/pages/IndustriesPage";
import { CaseStudiesPage } from "@/app/pages/CaseStudiesPage";
import { InsightsPage } from "@/app/pages/InsightsPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { AgencyPartnersPage } from "@/app/pages/AgencyPartnersPage";
import { AuthPage } from "@/app/pages/AuthPage";
import { ClientDashboard } from "@/app/pages/ClientDashboard";
import { DeveloperDashboard } from "@/app/pages/DeveloperDashboard";
import { SalesDashboard } from "@/app/pages/SalesDashboard";
import { AdminDashboard } from "@/app/pages/AdminDashboard";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Page =
  | "home" | "about" | "services" | "clients" | "industries"
  | "casestudies" | "partner" | "insights" | "contact"
  | "auth" | "client-dashboard" | "developer-dashboard" | "sales-dashboard" | "admin-dashboard";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

const DASHBOARD_PAGES: Page[] = ["auth", "client-dashboard", "developer-dashboard", "sales-dashboard", "admin-dashboard"];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [scrollToDetail, setScrollToDetail] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      // If already logged in on mount and sitting on auth page, redirect to dashboard
      if (u) {
        setPage((prev) => {
          if (prev === "auth") {
            const role = u.user_metadata?.role;
            if (role === "admin") return "admin-dashboard";
            if (role === "developer") return "developer-dashboard";
            if (role === "sales") return "sales-dashboard";
            return "client-dashboard";
          }
          return prev;
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      // When auth state changes to logged-in while on auth page, redirect immediately
      if (u) {
        setPage((prev) => {
          if (prev === "auth") {
            const role = u.user_metadata?.role;
            if (role === "admin") return "admin-dashboard";
            if (role === "developer") return "developer-dashboard";
            if (role === "sales") return "sales-dashboard";
            return "client-dashboard";
          }
          return prev;
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const navigate = (p: string) => {
    if (p.startsWith("services:")) {
      const idx = parseInt(p.split(":")[1], 10);
      setServiceIndex(isNaN(idx) ? 0 : idx);
      setScrollToDetail(true);
      setPage("services");
    } else {
      if (p === "services") setScrollToDetail(false);
      setPage(p as Page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isDashboard = DASHBOARD_PAGES.includes(page);

  const getDashboardPage = (u: typeof user): Page => {
    const role = u?.user_metadata?.role;
    if (role === "admin") return "admin-dashboard";
    if (role === "developer") return "developer-dashboard";
    if (role === "sales") return "sales-dashboard";
    return "client-dashboard";
  };

  const renderPage = () => {
    // If logged in and trying to view auth page, redirect to dashboard
    if (page === "auth" && user) {
      const dp = getDashboardPage(user);
      if (dp === "admin-dashboard") return <AdminDashboard onNavigate={navigate} />;
      if (dp === "developer-dashboard") return <DeveloperDashboard onNavigate={navigate} />;
      if (dp === "sales-dashboard") return <SalesDashboard onNavigate={navigate} />;
      return <ClientDashboard onNavigate={navigate} />;
    }
    switch (page) {
      case "home":             return <HomePage onNavigate={navigate} />;
      case "about":            return <AboutPage onNavigate={navigate} />;
      case "services":         return <ServicesPage onNavigate={navigate} initialServiceIndex={serviceIndex} scrollToDetail={scrollToDetail} />;
      case "clients":          return <ClientsPage onNavigate={navigate} />;
      case "industries":       return <IndustriesPage onNavigate={navigate} />;
      case "casestudies":      return <CaseStudiesPage onNavigate={navigate} />;
      case "partner":          return <AgencyPartnersPage onNavigate={navigate} />;
      case "insights":         return <InsightsPage onNavigate={navigate} />;
      case "contact":          return <ContactPage />;
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
      <Nav currentPage={page} onNavigate={navigate} user={user} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      {!isDashboard && <Footer onNavigate={navigate} />}
    </div>
  );
}
