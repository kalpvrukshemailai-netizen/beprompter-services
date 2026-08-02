import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type UserRole = "admin" | "sales" | "developer" | "client";
export type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "on_hold";
export type TaskStatus = "todo" | "in_progress" | "review" | "completed";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
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
