import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type UserRole = "admin" | "sales" | "developer" | "client";

export const ADMIN_EMAILS = [
  "shauryap0000@gmail.com"
];

export const SALES_EMAILS = [
  "namitakumari4000@gmail.com",
  "kavyashah8605@gmail.com",
  "ranjeetkumarprajapat2005@gmail.com",
  "ranjeetkumarpradjapat2005@gmail.com",
  "ggarv3532@gmail.com"
];

export const CLIENT_EMAILS = [
  "shauryapratap80033@gmail.com",
  "kalpvruksh.email.ai@gmail.com"
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.some(e => e.toLowerCase() === norm) ||
    norm.endsWith("@beprompter.com") ||
    norm === "shauryap0000" ||
    norm.startsWith("shauryap0000@") ||
    norm.includes("shauryap0000")
  );
}

export function isSalesEmail(email?: string | null): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return SALES_EMAILS.some(e => e.toLowerCase() === norm);
}

export function isClientEmail(email?: string | null): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return CLIENT_EMAILS.some(e => e.toLowerCase() === norm);
}

export function resolveUserRole(
  email?: string | null,
  roleA?: string | null,
  roleB?: string | null
): UserRole {
  const normEmail = (email || "").trim().toLowerCase();

  // 1. ABSOLUTE HIGHEST PRIORITY: Authoritative platform superadmins
  // Master admin accounts like shauryap0000@gmail.com or @beprompter.com must NEVER
  // be downgraded to client or sales under any circumstance.
  if (isAdminEmail(normEmail)) {
    return "admin";
  }

  // Check if either explicit role argument is "admin"
  if (roleA === "admin" || roleB === "admin") {
    return "admin";
  }

  // 2. Authoritative sales staff emails (unless specifically assigned developer)
  if (isSalesEmail(normEmail)) {
    if (roleA === "developer" || roleB === "developer") {
      return "developer";
    }
    return "sales";
  }

  // 3. Developer role
  if (roleA === "developer" || roleB === "developer") {
    return "developer";
  }

  // 4. Sales role
  if (roleA === "sales" || roleB === "sales") {
    return "sales";
  }

  // 5. Client fallback
  return "client";
}

/**
 * Deduplicate profiles by email, retaining richest metadata and resolving correct roles.
 */
export function deduplicateProfiles(profiles: Profile[]): Profile[] {
  if (!profiles || !Array.isArray(profiles)) return [];
  const emailMap = new Map<string, Profile>();

  for (const p of profiles) {
    if (!p.email) continue;
    let normEmail = p.email.trim().toLowerCase();
    // Normalize Ranjeet's email typo so both pradjapat and prajapat merge into prajapat
    if (normEmail === "ranjeetkumarpradjapat2005@gmail.com") {
      normEmail = "ranjeetkumarprajapat2005@gmail.com";
    }
    const correctRole = resolveUserRole(normEmail, p.role);

    if (!emailMap.has(normEmail)) {
      emailMap.set(normEmail, {
        ...p,
        email: normEmail,
        role: correctRole,
      });
    } else {
      const existing = emailMap.get(normEmail)!;
      // Merge: retain best names, phone numbers, company names, and sheets
      const mergedName = (p.full_name && p.full_name !== p.email.split("@")[0])
        ? p.full_name
        : (existing.full_name || p.full_name);

      const finalRole = isAdminEmail(normEmail)
        ? "admin"
        : (isSalesEmail(normEmail) && p.role !== "developer" && existing.role !== "developer")
        ? "sales"
        : (p.role && ["admin", "sales", "developer", "client"].includes(p.role))
        ? p.role
        : (existing.role || correctRole);

      emailMap.set(normEmail, {
        ...existing,
        // Prefer DB UUID if present (doesn't start with usr-)
        id: (existing.id && !existing.id.startsWith("usr-")) ? existing.id : (p.id || existing.id),
        full_name: mergedName,
        phone: p.phone !== undefined ? p.phone : existing.phone,
        company_name: p.company_name !== undefined ? p.company_name : existing.company_name,
        google_sheet_url: p.google_sheet_url !== undefined ? p.google_sheet_url : existing.google_sheet_url,
        role: finalRole,
        created_at: existing.created_at || p.created_at
      });
    }
  }

  return Array.from(emailMap.values());
}

/**
 * Robust matching for lead assignments: matches either rep.id, rep.email, or rep username.
 */
export function isLeadAssignedToRep(
  assignedTo: any,
  rep: { id?: string; email?: string }
): boolean {
  if (!assignedTo) return false;
  const target = String(assignedTo).trim().toLowerCase();
  const repId = String(rep.id || "").trim().toLowerCase();
  const repEmail = String(rep.email || "").trim().toLowerCase();
  const repUser = repEmail ? repEmail.split("@")[0] : "";

  // Normalize Ranjeet aliases so either spelling matches
  const isTargetRanjeet = target.includes("ranjeetkumarpradjapat") || target.includes("ranjeetkumarprajapat");
  const isRepRanjeet = repEmail.includes("ranjeetkumarpradjapat") || repEmail.includes("ranjeetkumarprajapat") || repId.includes("ranjeet");
  if (isTargetRanjeet && isRepRanjeet) return true;

  // Normalize Namita aliases
  const isTargetNamita = target.includes("namitakumari") || target.includes("namita");
  const isRepNamita = repEmail.includes("namitakumari") || repId.includes("namita");
  if (isTargetNamita && isRepNamita) return true;

  return (
    (!!repId && target === repId) ||
    (!!repEmail && target === repEmail) ||
    (!!repUser && target === repUser)
  );
}
export type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "on_hold";
export type TaskStatus = "todo" | "in_progress" | "review" | "completed";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  google_sheet_url?: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  target_end_date: string | null;
  budget: number | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: TaskStatus;
  due_date: string | null;
  order_index: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  milestone_id: string | null;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
}
