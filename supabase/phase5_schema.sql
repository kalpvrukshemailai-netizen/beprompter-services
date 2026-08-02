-- Phase 5: Messaging Schema

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Message Policies
-- Admins, Sales, and Developers can read all messages
DROP POLICY IF EXISTS "Employees can view all messages" ON public.messages;
CREATE POLICY "Employees can view all messages" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'developer', 'sales')
  )
);

-- Clients can only read messages for their own projects
DROP POLICY IF EXISTS "Clients can view their own project messages" ON public.messages;
CREATE POLICY "Clients can view their own project messages" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = messages.project_id AND projects.client_id = auth.uid()
  )
);

-- Employees can send messages to any project
DROP POLICY IF EXISTS "Employees can insert messages" ON public.messages;
CREATE POLICY "Employees can insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'developer', 'sales')
  )
  AND sender_id = auth.uid()
);

-- Clients can send messages to their own projects
DROP POLICY IF EXISTS "Clients can insert messages to their projects" ON public.messages;
CREATE POLICY "Clients can insert messages to their projects" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = messages.project_id AND projects.client_id = auth.uid()
  )
  AND sender_id = auth.uid()
);

-- Realtime Setup
-- To make chat update in real-time, we must enable realtime for messages
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ==========================================
-- BUG FIX: Missing Projects RLS Policies
-- ==========================================

-- Allow clients to create (purchase) their own projects
DROP POLICY IF EXISTS "Clients can insert own projects" ON public.projects;
CREATE POLICY "Clients can insert own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = client_id);

-- Allow developers and admins to update projects (change status)
DROP POLICY IF EXISTS "Employees can update projects" ON public.projects;
CREATE POLICY "Employees can update projects" 
ON public.projects 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'developer', 'sales')
  )
);
