-- Allow admins to update other users' roles
-- (Fixes the issue where role changes in the Admin Dashboard are blocked by Row Level Security)

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
