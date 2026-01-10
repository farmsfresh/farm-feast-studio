-- Add dietary_tags column to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN dietary_tags text[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.menu_items.dietary_tags IS 'Array of dietary tags: vegetarian, vegan, gluten-free';