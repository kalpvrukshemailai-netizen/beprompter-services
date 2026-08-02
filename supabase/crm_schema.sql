-- CRM Leads Table for Sales ERP

DROP TABLE IF EXISTS public.crm_leads;
CREATE TABLE public.crm_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  google_link TEXT,
  name TEXT NOT NULL,
  rating TEXT,
  reviews TEXT,
  firm_type TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  city TEXT,
  source_file TEXT,
  status TEXT DEFAULT 'New', -- New, Contacted, In Progress, Closed
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  developer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage CRM leads" 
ON public.crm_leads 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Sales Reps can only view and update leads assigned to them
CREATE POLICY "Sales reps can view assigned leads" 
ON public.crm_leads 
FOR SELECT 
USING (
  assigned_to = auth.uid()
);

CREATE POLICY "Sales reps can update assigned leads" 
ON public.crm_leads 
FOR UPDATE 
USING (
  assigned_to = auth.uid()
);
