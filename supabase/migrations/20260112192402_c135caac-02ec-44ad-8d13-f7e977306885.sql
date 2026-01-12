-- Fix user_roles policies - drop restrictive and create permissive ones
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

-- Create PERMISSIVE policies (default behavior - any matching policy grants access)
CREATE POLICY "Users can view their own roles"
ON user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));