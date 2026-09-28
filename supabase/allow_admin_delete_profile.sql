-- Allow admins to delete profiles
-- (Fixes the issue where removing members in the Admin Dashboard is blocked by Row Level Security)

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
