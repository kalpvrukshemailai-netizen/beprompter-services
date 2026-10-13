-- This migration adds the google_sheet_url column to the profiles table.
-- Run this in your Supabase SQL Editor.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS google_sheet_url TEXT;

-- We can also add a permissions JSON column if needed for future granular control.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"can_view_costs": true, "can_view_conversations": true}'::jsonb;
