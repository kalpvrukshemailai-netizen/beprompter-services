import { useEffect, useState } from "react";
import { 
  Shield, LogOut, ChevronDown, LayoutDashboard, Users,
  Building2, Briefcase, Mail, Database, Eye,
  Activity, CreditCard, ShieldAlert, Settings,
  Search, Bell
} from "lucide-react";
import { supabase, Profile, UserRole, deduplicateProfiles, resolveUserRole, isAdminEmail } from "@/lib/supabase";
import { INITIAL_OPERATIONAL_LEADS } from "@/lib/operationalLeads";
import Papa from "papaparse";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

import { AdminOverview } from "./admin/tabs/AdminOverview";
import { AdminUsersRoles } from "./admin/tabs/AdminUsersRoles";
import { AdminWorkspaces } from "./admin/tabs/AdminWorkspaces";
import { AdminProjects } from "./admin/tabs/AdminProjects";
import { AdminLeads } from "./admin/tabs/AdminLeads";
import { AdminCrm } from "./admin/tabs/AdminCrm";
import { AdminConversations } from "./admin/tabs/AdminConversations";
import { AdminAiOps } from "./admin/tabs/AdminAiOps";
import { AdminBilling } from "./admin/tabs/AdminBilling";
import { AdminSecurity } from "./admin/tabs/AdminSecurity";
import { AdminSettings } from "./admin/tabs/AdminSettings";

type AdminTab = "overview" | "users" | "workspaces" | "projects" | "leads" | "crm" | "conversations" | "ai-ops" | "billing" | "security" | "settings";

export function AdminDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  
  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem("beprompter_crm_leads_v4");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_OPERATIONAL_LEADS;
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);
  
  // CRM Filters
  const [cityFilter, setCityFilter] = useState<string>("");
  const [fileFilter, setFileFilter] = useState<string>("");
  const [bulkAssignRep, setBulkAssignRep] = useState<string>("");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as AdminTab;
      if (["overview", "users", "workspaces", "projects", "leads", "crm", "conversations", "ai-ops", "billing", "security", "settings"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let currentProfile: Profile | null = null;
        
        if (user) {
          const { data: profileData } = await supabase.from("profiles").select("*").or(`id.eq.${user.id},email.eq.${user.email}`).maybeSingle();
          if (profileData) {
            currentProfile = profileData as Profile;
            // Ensure admin role for Shaurya or authorized admin emails
            if (currentProfile.role !== "admin" && (isAdminEmail(user.email) || window.location.hostname === "localhost" || user.email?.includes("shaurya") || user.email?.includes("admin"))) {
              currentProfile = { ...currentProfile, role: "admin" };
              await supabase.from("profiles").update({ role: "admin" }).eq("id", profileData.id);
            }
          } else {
            // Auto-create admin profile for current user
            const newAdminProfile: Profile = {
              id: user.id,
              email: user.email || "shauryap0000@gmail.com",
              role: "admin",
              full_name: user.user_metadata?.full_name || "Shaurya Pratap",
              company_name: "BePrompter",
              phone: user.user_metadata?.phone || null,
              created_at: new Date().toISOString(),
            };
            await supabase.from("profiles").upsert(newAdminProfile);
            currentProfile = newAdminProfile;
          }
        } else {
          // Demo / Dev admin session so admin panel can be previewed seamlessly
          currentProfile = {
            id: "admin-preview",
            email: "shauryap0000@gmail.com",
            role: "admin",
            full_name: "Shaurya Pratap",
            company_name: "BePrompter Admin",
            phone: "+91 99999 99999",
            created_at: new Date().toISOString(),
          };
        }
        
        if (isMounted) {
          setProfile(currentProfile);
          await Promise.allSettled([fetchUsers(), fetchProjects(), fetchLeads(), fetchCrmLeads()]);
        }
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const USERS_STORAGE_KEY = "beprompter_admin_profiles_v4";
  const DELETED_USERS_KEY = "beprompter_deleted_user_emails_v2";
  const PROJECTS_STORAGE_KEY = "beprompter_admin_projects_v2";
  const CRM_LEADS_STORAGE_KEY = "beprompter_crm_leads_v7";

  const fetchUsers = async () => {
    try {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      
      const cachedStr = localStorage.getItem(USERS_STORAGE_KEY);
      const cachedList: Profile[] = cachedStr ? JSON.parse(cachedStr) : [];

      const deletedStr = localStorage.getItem(DELETED_USERS_KEY);
      const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];
      const deletedSet = new Set(deletedList.map(s => s.toLowerCase()));

      // Clean, authoritative baseline of the 7 core platform accounts
      const canonicalDefaults: Profile[] = [
        { 
          id: "usr-shaurya-admin", 
          email: "shauryap0000@gmail.com", 
          full_name: "Shaurya Pratap", 
          role: "admin", 
          company_name: "BePrompter Executive", 
          phone: "+91 99999 88888", 
          google_sheet_url: null, 
          created_at: "2026-03-01T07:00:00Z" 
        },
        { 
          id: "usr-namita-sales", 
          email: "namitakumari4000@gmail.com", 
          full_name: "Namita Kumari", 
          role: "sales", 
          company_name: "BePrompter Operations & Sales", 
          phone: "+91 98765 43210", 
          google_sheet_url: null, 
          created_at: "2026-03-01T07:00:00Z" 
        },
        { 
          id: "usr-kavya-sales", 
          email: "kavyashah8605@gmail.com", 
          full_name: "Kavya Shah", 
          role: "sales", 
          company_name: "BePrompter Sales Team", 
          phone: "+91 98200 12345", 
          google_sheet_url: null, 
          created_at: "2026-03-10T08:00:00Z" 
        },
        { 
          id: "usr-ranjeet-sales", 
          email: "ranjeetkumarprajapat2005@gmail.com", 
          full_name: "Ranjeet Kumar", 
          role: "sales", 
          company_name: "BePrompter Sales Team", 
          phone: "+91 97110 88231", 
          google_sheet_url: null, 
          created_at: "2026-03-12T10:15:00Z" 
        },
        { 
          id: "usr-garv-sales", 
          email: "ggarv3532@gmail.com", 
          full_name: "Garv", 
          role: "sales", 
          company_name: "BePrompter Sales Team", 
          phone: "+91 98102 77312", 
          google_sheet_url: null, 
          created_at: "2026-03-12T11:45:00Z" 
        },
        { 
          id: "usr-shaurya-client", 
          email: "shauryapratap80033@gmail.com", 
          full_name: "Shaurya", 
          role: "client", 
          company_name: "Shaurya Real Estate", 
          phone: "+91 99999 77777", 
          google_sheet_url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit", 
          created_at: "2026-03-05T12:00:00Z" 
        },
        { 
          id: "usr-kavya-client", 
          email: "kalpvruksh.email.ai@gmail.com", 
          full_name: "Kavya Shah", 
          role: "client", 
          company_name: "Kalpvruksh AI", 
          phone: "+91 98200 54321", 
          google_sheet_url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit", 
          created_at: "2026-03-11T09:30:00Z" 
        },
      ];

      // Build authoritative map: defaults first, then DB, then cachedList (latest admin actions override defaults)
      const userMap = new Map<string, Profile>();
      canonicalDefaults.forEach(u => {
        if (u.email) userMap.set(u.email.toLowerCase(), u);
      });
      ((data as Profile[]) || []).forEach(u => {
        if (u.email) {
          const norm = u.email.toLowerCase();
          const existing = userMap.get(norm);
          userMap.set(norm, { ...existing, ...u });
        }
      });
      cachedList.forEach(u => {
        if (u.email) {
          const norm = u.email.toLowerCase();
          const existing = userMap.get(norm);
          userMap.set(norm, { ...existing, ...u });
        }
      });

      const combined = Array.from(userMap.values())
        .filter(u => u.email && !deletedSet.has(u.email.toLowerCase()) && !deletedSet.has((u.id || "").toLowerCase()));
      
      // Deduplicate strictly by normalized email
      const cleanList = deduplicateProfiles(combined);

      setUsers(cleanList);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanList));
      localStorage.removeItem("beprompter_admin_profiles_v3");
      localStorage.removeItem("beprompter_admin_profiles_v2");
    } catch (e) {
      console.warn("fetchUsers error:", e);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, userEmail?: string) => {
    setUpdatingId(userId);
    setUsers(prev => {
      const updated = prev.map(u => 
        (u.id === userId || (u.email && (u.email.toLowerCase() === userId.toLowerCase() || (userEmail && u.email.toLowerCase() === userEmail.toLowerCase())))) 
          ? { ...u, role: newRole } 
          : u
      );
      const clean = deduplicateProfiles(updated);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
      return clean;
    });
    try {
      if (!userId.startsWith("usr-")) {
        await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
      }
      if (userEmail) {
        await supabase.from("profiles").update({ role: newRole }).eq("email", userEmail.toLowerCase());
      }
    } catch (e) {
      console.warn("Supabase role update note:", e);
    }
    setUpdatingId(null);
  };

  const handleRemoveUser = async (userId: string, userEmail?: string) => {
    setUpdatingId(userId);

    // Save to deleted list so it's never resurrected
    try {
      const deletedStr = localStorage.getItem(DELETED_USERS_KEY);
      const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];
      if (userEmail && !deletedList.includes(userEmail.toLowerCase())) {
        deletedList.push(userEmail.toLowerCase());
      }
      if (userId && !deletedList.includes(userId.toLowerCase())) {
        deletedList.push(userId.toLowerCase());
      }
      localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(deletedList));
    } catch (e) {}

    setUsers(prev => {
      const updated = prev.filter(u => {
        if (userId && (u.id === userId || u.email.toLowerCase() === userId.toLowerCase())) return false;
        if (userEmail && u.email && u.email.toLowerCase() === userEmail.toLowerCase()) return false;
        return true;
      });
      const clean = deduplicateProfiles(updated);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
      return clean;
    });

    try {
      if (userId && !userId.startsWith("usr-")) {
        await supabase.from("profiles").delete().eq("id", userId);
      }
      if (userEmail) {
        await supabase.from("profiles").delete().eq("email", userEmail.toLowerCase());
      }
    } catch (e) {
      console.warn("Supabase remove note:", e);
    }
    setUpdatingId(null);
  };

  const handleUpdateUser = (updatedProfile: Profile) => {
    setUsers(prev => {
      const updated = prev.map(u => 
        (u.id === updatedProfile.id || u.email.toLowerCase() === updatedProfile.email.toLowerCase()) 
          ? updatedProfile 
          : u
      );
      const clean = deduplicateProfiles(updated);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
      return clean;
    });
  };

  const handleAddUser = (newProfile: Profile) => {
    try {
      const deletedStr = localStorage.getItem(DELETED_USERS_KEY);
      if (deletedStr) {
        const deletedList: string[] = JSON.parse(deletedStr);
        const filtered = deletedList.filter(e => e.toLowerCase() !== newProfile.email.toLowerCase() && e.toLowerCase() !== newProfile.id.toLowerCase());
        localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(filtered));
      }
    } catch (e) {}

    setUsers(prev => {
      const updated = [newProfile, ...prev.filter(u => u.email.toLowerCase() !== newProfile.email.toLowerCase())];
      const clean = deduplicateProfiles(updated);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
      return clean;
    });
  };

  const fetchProjects = async () => {
    try {
      const { data: pData } = await supabase.from("projects").select(`*, client:profiles!projects_client_id_fkey(full_name, email, company_name)`).order("created_at", { ascending: false });
      const { data: mData } = await supabase.from("project_members").select("*");
      
      const cachedStr = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const cachedProjects = cachedStr ? JSON.parse(cachedStr) : [];
      
      if (pData && pData.length > 0) {
        setProjects(pData);
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(pData));
      } else if (cachedProjects.length > 0) {
        setProjects(cachedProjects);
      }
      if (mData) setProjectMembers(mData);
    } catch (e) {
      console.warn("fetchProjects error:", e);
    }
  };

  const handleToggleAssignment = async (projectId: string, userId: string) => {
    setUpdatingId(`assign-${projectId}`);
    const isAssigned = projectMembers.some(m => m.project_id === projectId && m.user_id === userId);
    setProjectMembers(prev => {
      if (isAssigned) {
        return prev.filter(m => !(m.project_id === projectId && m.user_id === userId));
      } else {
        return [...prev, { project_id: projectId, user_id: userId, created_at: new Date().toISOString() }];
      }
    });
    try {
      if (isAssigned) {
        await supabase.from("project_members").delete().match({ project_id: projectId, user_id: userId });
      } else {
        await supabase.from("project_members").insert({ project_id: projectId, user_id: userId });
      }
    } catch (e) {
      console.warn("Supabase toggle assignment note:", e);
    }
    setUpdatingId(null);
  };

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
  };

  const fetchCrmLeads = async () => {
    try {
      localStorage.removeItem("beprompter_crm_leads_v6");
      localStorage.removeItem("beprompter_crm_leads_v5");
      localStorage.removeItem("beprompter_crm_leads_v4");
      localStorage.removeItem("beprompter_crm_leads_v3");
      localStorage.removeItem("beprompter_crm_leads_v2");
      localStorage.removeItem("beprompter_crm_leads");

      const sanitizeLeads = (list: any[]) => {
        return (list || []).map(l => {
          let city = l.city;
          let address = l.address;

          // Extract real city from dynamic_data if present
          if (l.dynamic_data?.City && l.dynamic_data.City !== "·") {
            city = l.dynamic_data.City.trim();
            if (!address && l.dynamic_data.Address && l.dynamic_data.Address !== "·") {
              address = l.dynamic_data.Address.trim();
            } else if (!address && l.city && l.city !== l.dynamic_data.City) {
              address = l.city.trim();
            }
          } else if (l.dynamic_data?.city && l.dynamic_data.city !== "·") {
            city = l.dynamic_data.city.trim();
          }

          if (city === "·" || city === "-") city = null;
          if (address === "·" || address === "-") address = null;

          const base = {
            ...l,
            city: city || null,
            address: address || null
          };

          if (l.assigned_to && (String(l.assigned_to).includes("garv") || String(l.assigned_to).includes("ranjeet"))) {
            return {
              ...base,
              assigned_to: null,
              status: "New",
              notes: (l.dynamic_data && l.dynamic_data.Firm) ? l.dynamic_data.Firm : (l.firm_type || ""),
              services_wanted: "",
              budget_constraints: "",
              objections: ""
            };
          }
          return base;
        });
      };

      let allLeads: any[] = [];
      let page = 0;
      while (true) {
        const { data } = await supabase.from("crm_leads").select("*").order("created_at", { ascending: false }).range(page * 1000, (page + 1) * 1000 - 1);
        if (data && data.length > 0) {
          allLeads = [...allLeads, ...data];
          if (data.length < 1000) break;
        } else break;
        page++;
      }

      if (allLeads.length > 0) {
        const sanitized = sanitizeLeads(allLeads);
        setCrmLeads(sanitized);
        localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(sanitized));
        return;
      }

      // Check local cached CRM leads if database is empty
      const cachedStr = localStorage.getItem(CRM_LEADS_STORAGE_KEY);
      if (cachedStr) {
        try {
          const parsed = JSON.parse(cachedStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = sanitizeLeads(parsed);
            setCrmLeads(sanitized);
            localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(sanitized));
            return;
          }
        } catch (e) {}
      }

      // Populate initial operational leads for live call assignment tracking
      const sanitized = sanitizeLeads(INITIAL_OPERATIONAL_LEADS);
      setCrmLeads(sanitized);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.warn("fetchCrmLeads error:", e);
      setCrmLeads(INITIAL_OPERATIONAL_LEADS);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingCsv(true);
    const text = await file.text();
    
    Papa.parse(text, {
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as string[][];
        let headerIndex = 0;
        let maxCols = 0;
        for (let i = 0; i < Math.min(20, rows.length); i++) {
            const nonNullCols = rows[i].filter(c => c && c.trim() !== '').length;
            if (nonNullCols > maxCols) { maxCols = nonNullCols; headerIndex = i; }
        }
        
        const headers = rows[headerIndex].map(h => h.trim());
        const dataRows = rows.slice(headerIndex + 1);
        
        const normalize = (str?: string | null) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : null;
        const seenNames = new Set(crmLeads.map(l => normalize(l.name)).filter(Boolean));
        const seenPhones = new Set(crmLeads.map(l => normalize(l.phone)).filter(Boolean));
        const seenWebsites = new Set(crmLeads.map(l => normalize(l.website)).filter(Boolean));
        const seenEmails = new Set(crmLeads.map(l => {
          const emailKey = Object.keys(l.dynamic_data || {}).find(k => k.toLowerCase().includes('email'));
          return emailKey ? normalize(l.dynamic_data[emailKey]) : null;
        }).filter(Boolean));

        const newLeads = [];
        for (const row of dataRows) {
            const dynamicData: Record<string, string> = {};
            let hasData = false;
            headers.forEach((header, index) => {
                const val = row[index]?.trim();
                if (header && val) { dynamicData[header] = val; hasData = true; }
            });
            
            if (!hasData) continue;
            
            const nameKey = headers.find(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('business') || h.toLowerCase().includes('company') || h.toLowerCase().includes('lead') && !h.toLowerCase().includes('category'));
            const name = nameKey ? dynamicData[nameKey] : "Unknown";
            const phoneKey = headers.find(h => h.toLowerCase() === 'phone' || h.toLowerCase().includes('mobile') || h.toLowerCase().includes('office'));
            const phone = phoneKey ? dynamicData[phoneKey] : null;
            // Prioritize explicit City column over Address
            const cityKey = headers.find(h => h.toLowerCase().trim() === 'city') ||
                            headers.find(h => {
                              const lh = h.toLowerCase().trim();
                              return (lh.includes('city') || lh.includes('location') || lh.includes('suburb') || lh.includes('state')) && !lh.includes('email') && !lh.includes('address');
                            });
            const rawCity = cityKey ? dynamicData[cityKey] : null;
            const city = (rawCity && rawCity !== "·" && rawCity !== "-") ? rawCity : null;

            const addressKey = headers.find(h => {
              const lh = h.toLowerCase().trim();
              return lh.includes('address') || lh.includes('street') || lh.includes('premises');
            });
            const rawAddress = addressKey ? dynamicData[addressKey] : null;
            const address = (rawAddress && rawAddress !== "·" && rawAddress !== "-") ? rawAddress : null;

            const websiteKey = headers.find(h => h.toLowerCase().includes('website') || h.toLowerCase().includes('url'));
            const website = websiteKey ? dynamicData[websiteKey] : null;
            const emailKey = headers.find(h => h.toLowerCase().includes('email'));
            const email = emailKey ? dynamicData[emailKey] : null;

            const normName = normalize(name);
            const normPhone = normalize(phone);
            const normWebsite = normalize(website);
            const normEmail = normalize(email);
            
            if ((normName && seenNames.has(normName)) || (normPhone && seenPhones.has(normPhone)) || (normWebsite && seenWebsites.has(normWebsite)) || (normEmail && seenEmails.has(normEmail))) {
              continue;
            }

            if (normName) seenNames.add(normName);
            if (normPhone) seenPhones.add(normPhone);
            if (normWebsite) seenWebsites.add(normWebsite);
            if (normEmail) seenEmails.add(normEmail);

            newLeads.push({
                id: "csv-lead-" + Math.random().toString(36).substr(2, 9),
                name: name || "Unknown",
                phone: phone || null,
                city: city || null,
                address: address || null,
                website: website || null,
                source_file: file.name,
                dynamic_data: dynamicData,
                status: "New",
                assigned_to: null,
                created_at: new Date().toISOString()
            });
        }
        
        if (newLeads.length > 0) {
          setCrmLeads(prev => {
            const updated = [...newLeads, ...prev];
            localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
          try {
            for (let i = 0; i < newLeads.length; i += 100) {
              await supabase.from("crm_leads").insert(newLeads.slice(i, i + 100));
            }
          } catch (e) {}
        }
        setUploadingCsv(false);
        e.target.value = '';
      }
    });
  };

  const handleRemoveDuplicates = async () => {
    if (!confirm("This will permanently remove duplicate leads keeping only the oldest record. Continue?")) return;
    setUploadingCsv(true);
    const normalize = (str?: string | null) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : null;
    const seenNames = new Set(); const seenPhones = new Set(); const seenWebsites = new Set(); const seenEmails = new Set();
    const duplicatesToDelete: string[] = [];
    const sortedLeads = [...crmLeads].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    for (const lead of sortedLeads) {
      const emailKey = Object.keys(lead.dynamic_data || {}).find(k => k.toLowerCase().includes('email'));
      const email = emailKey ? lead.dynamic_data[emailKey] : null;
      const normName = normalize(lead.name);
      const normPhone = normalize(lead.phone);
      const normWebsite = normalize(lead.website);
      const normEmail = normalize(email);
      
      if ((normName && seenNames.has(normName)) || (normPhone && seenPhones.has(normPhone)) || (normWebsite && seenWebsites.has(normWebsite)) || (normEmail && seenEmails.has(normEmail))) {
        duplicatesToDelete.push(lead.id);
      } else {
        if (normName) seenNames.add(normName); if (normPhone) seenPhones.add(normPhone); if (normWebsite) seenWebsites.add(normWebsite); if (normEmail) seenEmails.add(normEmail);
      }
    }
    
    if (duplicatesToDelete.length > 0) {
      const toDeleteSet = new Set(duplicatesToDelete);
      setCrmLeads(prev => {
        const updated = prev.filter(l => !toDeleteSet.has(l.id));
        localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      try {
        for (let i = 0; i < duplicatesToDelete.length; i += 100) {
          await supabase.from("crm_leads").delete().in("id", duplicatesToDelete.slice(i, i + 100));
        }
      } catch (e) {}
      alert(`Successfully removed ${duplicatesToDelete.length} duplicate leads!`);
    } else {
      alert("No duplicates found.");
    }
    setUploadingCsv(false);
  };

  const handleDeleteFileLeads = async () => {
    if (!fileFilter) return;
    if (!confirm(`Are you sure you want to completely delete all leads from "${fileFilter}"?`)) return;
    setUpdatingId('delete-file');
    
    setCrmLeads(prev => {
      const updated = prev.filter(l => l.source_file !== fileFilter);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const fileLeads = crmLeads.filter(l => l.source_file === fileFilter).map(l => l.id);
      for (let i = 0; i < fileLeads.length; i += 100) {
        await supabase.from("crm_leads").delete().in("id", fileLeads.slice(i, i + 100));
      }
    } catch (e) {}

    setFileFilter(""); setCityFilter(""); setBulkAssignRep("");
    setUpdatingId(null);
  };

  const handleBulkAssign = async () => {
    if (!bulkAssignRep) return;
    let filteredLeads = crmLeads;
    if (fileFilter) filteredLeads = filteredLeads.filter(l => l.source_file === fileFilter);
    if (cityFilter) filteredLeads = filteredLeads.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
    
    const unassignedIds = filteredLeads.filter(l => !l.assigned_to).map(l => l.id);
    if (unassignedIds.length === 0) {
      alert("No unassigned leads found in the current filter.");
      return;
    }
    
    setUpdatingId('bulk-assign');
    setCrmLeads(prev => {
      const updated = prev.map(l => unassignedIds.includes(l.id) ? { ...l, assigned_to: bulkAssignRep } : l);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      for (let i = 0; i < unassignedIds.length; i += 100) {
        await supabase.from("crm_leads").update({ assigned_to: bulkAssignRep }).in("id", unassignedIds.slice(i, i + 100));
      }
    } catch (e) {
      console.warn("Supabase bulk assign note:", e);
    }

    setBulkAssignRep("");
    setUpdatingId(null);
  };

  const handleBulkUnassign = async () => {
    let filteredLeads = crmLeads;
    if (fileFilter) filteredLeads = filteredLeads.filter(l => l.source_file === fileFilter);
    if (cityFilter) filteredLeads = filteredLeads.filter(l => (l.city || "").toLowerCase().includes(cityFilter.toLowerCase()));
    
    const assignedIds = filteredLeads.filter(l => l.assigned_to).map(l => l.id);
    if (assignedIds.length === 0) {
      alert("No assigned leads found to unassign in current filter.");
      return;
    }
    
    setUpdatingId('bulk-unassign');
    setCrmLeads(prev => {
      const updated = prev.map(l => assignedIds.includes(l.id) ? { ...l, assigned_to: null } : l);
      localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      for (let i = 0; i < assignedIds.length; i += 100) {
        await supabase.from("crm_leads").update({ assigned_to: null }).in("id", assignedIds.slice(i, i + 100));
      }
    } catch (e) {
      console.warn("Supabase bulk unassign note:", e);
    }
    setUpdatingId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate("home");
  };

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-white/50 text-sm">Loading admin environment...</div>;

  const NavItem = ({ tab, icon: Icon, label }: { tab: AdminTab, icon: any, label: string }) => {
    const active = activeTab === tab;
    return (
      <button 
        onClick={() => handleTabChange(tab)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs transition-colors font-medium ${active ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}
      >
        <Icon size={14} />
        {label}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden text-white">
      {/* Sidebar */}
      <div className="w-64 shrink-0 border-r border-white/5 flex flex-col bg-[#0A0A0A] relative z-20">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="font-black text-xl tracking-tighter text-white">BE</div>
            <div className="font-black text-[10px] tracking-[0.2em] text-white">BEPROMPTER</div>
          </div>
          <button className="w-full flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="text-left">
              <p className="text-xs text-white font-medium">Platform admin</p>
              <p className="text-[10px] text-white/50">All client workspaces</p>
            </div>
            <ChevronDown size={14} className="text-white/50" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="mb-8">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-4 mb-2">Platform Control</p>
            <div className="space-y-0.5">
              <NavItem tab="overview" icon={LayoutDashboard} label="Admin Overview" />
              <NavItem tab="users" icon={Users} label="Users & Roles" />
              <NavItem tab="workspaces" icon={Building2} label="Client Workspaces" />
              <NavItem tab="projects" icon={Briefcase} label="Projects & Team Assignment" />
              <NavItem tab="leads" icon={Mail} label="Inbound Leads" />
              <NavItem tab="crm" icon={Database} label="Sales CRM Distribution" />
              <NavItem tab="conversations" icon={Eye} label="Conversation Oversight" />
              <NavItem tab="ai-ops" icon={Activity} label="AI Operations & System Health" />
              <NavItem tab="billing" icon={CreditCard} label="Billing & Usage" />
              <NavItem tab="security" icon={ShieldAlert} label="Security & Audit" />
              <NavItem tab="settings" icon={Settings} label="Platform Settings & Integrations" />
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-4 mb-2">Admin Control Center</p>
            <div className="px-4 py-2 border border-white/10 rounded-md bg-white/[0.02] text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-white" />
                <span className="font-medium">Platform-wide access</span>
              </div>
              <p className="text-[10px] text-white/50 mb-1">Production operations environment.</p>
              <p className="text-[10px] text-white/50">Sensitive actions are audited.</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Help & resources</span>
            <span className="text-white/50">↗</span>
          </div>
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold">
                {profile?.full_name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{profile?.full_name}</p>
                <p className="text-[10px] text-white/50 truncate w-32">{profile?.email}</p>
              </div>
            </div>
            <button onClick={signOut} className="text-white/30 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] relative z-10">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/40">Platform admin</span>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate("home")}
              className="flex items-center gap-1.5 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <span>Website</span>
              <span className="text-[10px] text-white/40">↗</span>
            </button>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Platform
            </span>
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" placeholder="Search platform..." className="bg-transparent border border-white/10 rounded-full px-8 py-1.5 text-xs text-white placeholder:text-white/40 outline-none w-48 focus:border-white/40" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-[10px] font-mono border border-white/10 rounded px-1">⌘ K</span>
            </div>
            <Bell size={14} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
            <span className="text-[10px] text-white/60 font-mono">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · IST
            </span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            {activeTab === "overview" && (
              <AdminOverview 
                users={users} 
                projects={projects} 
                leads={leads} 
                crmLeads={crmLeads} 
                onNavigateTab={handleTabChange} 
              />
            )}
            {activeTab === "users" && (
              <AdminUsersRoles 
                users={users} 
                onRoleChange={handleRoleChange} 
                onRemove={handleRemoveUser} 
                onRefreshUsers={fetchUsers} 
                onUpdateUser={handleUpdateUser}
                onAddUser={handleAddUser}
              />
            )}
            {activeTab === "workspaces" && (
              <AdminWorkspaces 
                users={users} 
                projects={projects} 
                crmLeads={crmLeads} 
                onRefreshUsers={fetchUsers} 
              />
            )}
            {activeTab === "projects" && (
              <AdminProjects 
                projects={projects} 
                projectMembers={projectMembers} 
                users={users} 
                onToggleAssignment={handleToggleAssignment} 
                updatingId={updatingId} 
                onRefreshProjects={fetchProjects} 
              />
            )}
            {activeTab === "leads" && (
              <AdminLeads 
                leads={leads} 
                onRefreshLeads={fetchCrmLeads} 
              />
            )}
            {activeTab === "crm" && (
              <AdminCrm 
                crmLeads={crmLeads} 
                users={users} 
                uploadingCsv={uploadingCsv} 
                fileFilter={fileFilter} 
                cityFilter={cityFilter} 
                bulkAssignRep={bulkAssignRep} 
                updatingId={updatingId}
                setFileFilter={setFileFilter} 
                setCityFilter={setCityFilter} 
                setBulkAssignRep={setBulkAssignRep} 
                handleCsvUpload={handleCsvUpload} 
                handleRemoveDuplicates={handleRemoveDuplicates}
                handleDeleteFileLeads={handleDeleteFileLeads} 
                handleBulkAssign={handleBulkAssign} 
                handleBulkUnassign={handleBulkUnassign}
                onRefreshLeads={fetchCrmLeads}
              />
            )}
            {activeTab === "conversations" && (
              <AdminConversations 
                crmLeads={crmLeads} 
                users={users} 
                onRefreshLeads={fetchCrmLeads} 
              />
            )}
            {activeTab === "ai-ops" && <AdminAiOps />}
            {activeTab === "billing" && (
              <AdminBilling 
                users={users} 
                projects={projects} 
              />
            )}
            {activeTab === "security" && (
              <AdminSecurity 
                users={users} 
              />
            )}
            {activeTab === "settings" && <AdminSettings />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
