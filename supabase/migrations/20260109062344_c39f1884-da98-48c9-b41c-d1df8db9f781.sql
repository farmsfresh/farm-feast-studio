-- Add INSERT and DELETE policies for menu_items (admins only)
CREATE POLICY "Admins can insert menu items"
ON public.menu_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete menu items"
ON public.menu_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add INSERT, UPDATE, and DELETE policies for menu_categories (admins only)
CREATE POLICY "Admins can insert menu categories"
ON public.menu_categories
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update menu categories"
ON public.menu_categories
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete menu categories"
ON public.menu_categories
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));