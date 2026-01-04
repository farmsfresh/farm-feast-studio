-- Allow admins to update menu items (for image management)
CREATE POLICY "Admins can update menu items"
ON public.menu_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));