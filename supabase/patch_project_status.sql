-- Add project_status to crm_leads for Developer Dashboard project board
ALTER TABLE public.crm_leads 
ADD COLUMN IF NOT EXISTS project_status TEXT DEFAULT 'Planning';
