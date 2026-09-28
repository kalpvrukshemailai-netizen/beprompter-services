-- Add dynamic_data column to store flexible CSV properties
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS dynamic_data JSONB DEFAULT '{}'::jsonb;
