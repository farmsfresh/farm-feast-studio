-- Create modifier categories table
CREATE TABLE public.modifier_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  menu_category_id uuid REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  is_required boolean DEFAULT false,
  max_selections integer DEFAULT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create modifiers table
CREATE TABLE public.modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modifier_category_id uuid REFERENCES public.modifier_categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  is_available boolean DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modifier_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifiers ENABLE ROW LEVEL SECURITY;

-- RLS policies for viewing
CREATE POLICY "Anyone can view modifier categories" ON public.modifier_categories
FOR SELECT USING (true);

CREATE POLICY "Anyone can view available modifiers" ON public.modifiers
FOR SELECT USING (is_available = true);

-- Admin policies
CREATE POLICY "Admins can manage modifier categories" ON public.modifier_categories
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage modifiers" ON public.modifiers
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));