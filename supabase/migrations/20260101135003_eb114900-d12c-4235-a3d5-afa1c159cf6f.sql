-- Create item-modifier link table
CREATE TABLE public.menu_item_modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  modifier_category_id uuid REFERENCES public.modifier_categories(id) ON DELETE CASCADE NOT NULL,
  is_required boolean DEFAULT false,
  min_selections integer DEFAULT 0,
  max_selections integer DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(menu_item_id, modifier_category_id)
);

-- Enable RLS
ALTER TABLE public.menu_item_modifiers ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view menu item modifiers" ON public.menu_item_modifiers
FOR SELECT USING (true);

CREATE POLICY "Admins can manage menu item modifiers" ON public.menu_item_modifiers
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert the Containers modifier category
INSERT INTO public.modifier_categories (name, description, is_required, max_selections, display_order)
VALUES ('Containers', 'Choose your container style', false, 1, 1);

-- Insert the container modifiers
INSERT INTO public.modifiers (modifier_category_id, name, price, display_order)
SELECT id, 'Wrap', 0, 1 FROM public.modifier_categories WHERE name = 'Containers'
UNION ALL
SELECT id, 'Hummus bowl', 0, 2 FROM public.modifier_categories WHERE name = 'Containers'
UNION ALL
SELECT id, 'Bowl', 0, 3 FROM public.modifier_categories WHERE name = 'Containers';

-- Link Containers to Chicken Shawarma
INSERT INTO public.menu_item_modifiers (menu_item_id, modifier_category_id, is_required, min_selections, max_selections)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Chicken Shawarma'),
  (SELECT id FROM public.modifier_categories WHERE name = 'Containers'),
  true, 1, 1;

-- Link Containers to Beef Shawarma
INSERT INTO public.menu_item_modifiers (menu_item_id, modifier_category_id, is_required, min_selections, max_selections)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Beef Shawarma'),
  (SELECT id FROM public.modifier_categories WHERE name = 'Containers'),
  true, 1, 1;