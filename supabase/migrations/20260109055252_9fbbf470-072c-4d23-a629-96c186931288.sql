
-- Add parent_category_id column to menu_categories for subcategory support
ALTER TABLE menu_categories 
ADD COLUMN parent_category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL;

-- Update Biryani to be a subcategory of Indian
UPDATE menu_categories 
SET parent_category_id = '561fe2b9-66c8-40f2-a82c-6d905522fe8b'
WHERE id = '9533dcc9-7eff-44f9-a3a5-663c8ee9d01c';
