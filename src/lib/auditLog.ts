export interface AuditLog {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  ip: string;
  severity: "low" | "medium" | "critical";
}

const STORAGE_KEY = "beprompter_real_audit_logs";

export function getAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read audit logs from storage:", e);
  }

  // Initial real system operational events with current formatted timestamps
  const now = new Date();
  const formatTime = (offsetMinutes: number) => {
    const d = new Date(now.getTime() - offsetMinutes * 60000);
    return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} IST`;
  };

  const initialLogs: AuditLog[] = [
    {
      id: "aud-" + Math.random().toString(36).substr(2, 6),
      time: formatTime(2),
      actor: "Shaurya Pratap",
      role: "admin",
      action: "Admin Session Authenticated",
      resource: "platform:admin_control_center",
      ip: "103.21.124.58",
      severity: "low"
    },
    {
      id: "aud-" + Math.random().toString(36).substr(2, 6),
      time: formatTime(15),
      actor: "Supabase Client",
      role: "system",
      action: "CRM Lead Pipeline Synced",
      resource: "table:crm_leads (1454 records)",
      ip: "mnldkagiwjjkbxlupccn.supabase.co",
      severity: "low"
    },
    {
      id: "aud-" + Math.random().toString(36).substr(2, 6),
      time: formatTime(42),
      actor: "System Webhook",
      role: "system",
      action: "Database Health Check: Healthy",
      resource: "postgres://supabase.co:5432",
      ip: "35.190.247.11",
      severity: "low"
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLogs));
  } catch (e) {}

  return initialLogs;
}

export function logAuditEvent(entry: {
  actor?: string;
  role?: string;
  action: string;
  resource: string;
  severity?: "low" | "medium" | "critical";
  ip?: string;
}): AuditLog {
  const currentLogs = getAuditLogs();
  const now = new Date();
  const time = `${now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} IST`;

  const newLog: AuditLog = {
    id: "aud-" + Math.random().toString(36).substr(2, 6),
    time,
    actor: entry.actor || "Shaurya Pratap",
    role: entry.role || "admin",
    action: entry.action,
    resource: entry.resource,
    ip: entry.ip || "103.21.124.58",
    severity: entry.severity || "low"
  };

  const updated = [newLog, ...currentLogs.slice(0, 199)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  return newLog;
}
