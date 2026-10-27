/**
 * Real Outreach & CRM Leads for BePrompter Sales Platform.
 * Extracted directly from:
 * 1. Real estate - Sheet1.csv (517 leads)
 * 2. real_estate_outreach_master_1032_FINAL-Master Outreach.csv (937 leads)
 * Total: 1,454 real leads with live call deliveries, assignments, and follow-ups.
 */

import realLeadsJson from "./realCrmLeads.json";

export interface OperationalLead {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  firm_type?: string;
  rating?: string;
  reviews?: string;
  address?: string;
  website?: string | null;
  source_file: string;
  status: "New" | "Follow-up" | "Converted" | "Not Answered" | "Not Converted";
  assigned_to: string | null;
  notes?: string;
  services_wanted?: string;
  budget_constraints?: string;
  objections?: string;
  project_status?: string;
  created_at: string;
  dynamic_data?: Record<string, string>;
}

export const INITIAL_OPERATIONAL_LEADS: OperationalLead[] = realLeadsJson as OperationalLead[];
