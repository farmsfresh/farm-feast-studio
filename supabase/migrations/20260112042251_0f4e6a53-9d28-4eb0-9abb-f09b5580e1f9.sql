-- Drop existing restrictive SELECT policies on user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create new PERMISSIVE SELECT policies (default is PERMISSIVE, meaning ANY policy can grant access)
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));