-- Safe patch to add discovery fields and fix developer visibility

-- 1. Add structured discovery fields to existing crm_leads table
ALTER TABLE public.crm_leads 
ADD COLUMN IF NOT EXISTS services_wanted TEXT,
ADD COLUMN IF NOT EXISTS budget_constraints TEXT,
ADD COLUMN IF NOT EXISTS objections TEXT;

-- 2. Add Developer RLS policy so they can see their assigned leads
CREATE POLICY "Developers can view assigned leads" 
ON public.crm_leads 
FOR SELECT 
USING (
  developer_id = auth.uid()
);
