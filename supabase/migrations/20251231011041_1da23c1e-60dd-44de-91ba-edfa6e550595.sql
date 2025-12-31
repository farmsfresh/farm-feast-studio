-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for admins to view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update orders
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Farms Fresh Food Team',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for blog posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published blog posts
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

-- Admins can manage all blog posts
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, author, published, published_at) VALUES
('The Art of Farm-to-Table Catering', 'farm-to-table-catering', 'Discover how we bring the freshest ingredients from local farms directly to your events.', 'At Farms Fresh Food Catering, we believe that the best meals start with the best ingredients. Our commitment to farm-to-table catering means we partner directly with local farmers to source the freshest produce, meats, and dairy for every event we cater.\n\nWhy Farm-to-Table Matters\n\nWhen you choose farm-to-table catering, you''re not just getting fresher food—you''re supporting local agriculture, reducing environmental impact, and enjoying meals at their peak flavor. Our chefs visit local farms weekly to select ingredients at their prime.\n\nOur Partner Farms\n\nWe work with over 15 local farms within a 50-mile radius. From organic vegetables to pasture-raised proteins, every ingredient tells a story of quality and care.\n\nThe Difference You Can Taste\n\nGuests at our events consistently comment on the exceptional flavor and freshness of our dishes. That''s the farm-to-table difference—food that''s prepared within days of harvest, not weeks.', 'Chef Maria Rodriguez', true, now() - interval '5 days'),
('5 Tips for Planning Your Corporate Event Menu', 'corporate-event-menu-tips', 'Planning a corporate event? Here are our top tips for creating a menu that impresses.', 'Corporate events require careful menu planning to ensure all guests are satisfied while maintaining a professional atmosphere. Here are our top five tips:\n\n1. Consider Dietary Restrictions Early\n\nAlways gather dietary information during the RSVP process. Plan for vegetarian, vegan, gluten-free, and allergy-friendly options from the start.\n\n2. Match the Menu to the Event Type\n\nA morning strategy session calls for different fare than an evening awards ceremony. Light, energizing options work for working events; more substantial choices suit celebrations.\n\n3. Think About Logistics\n\nConsider how food will be served and eaten. Standing receptions need finger foods; seated dinners allow for plated courses.\n\n4. Seasonal Menus Shine\n\nSeasonal ingredients not only taste better but often cost less. Our chefs design rotating menus that highlight what''s freshest.\n\n5. Don''t Forget Beverages\n\nA thoughtful beverage selection, from morning coffee service to evening cocktails, elevates any corporate event.', 'Event Director James Chen', true, now() - interval '3 days'),
('Behind the Scenes: A Day in Our Kitchen', 'day-in-our-kitchen', 'Ever wondered what happens behind the scenes at a catering company? Join us for a day in our kitchen.', 'The alarm goes off at 4:30 AM. For our head chef and kitchen team, this is when the magic begins.\n\n5:00 AM - Receiving Fresh Deliveries\n\nOur day starts with receiving deliveries from local farms. Every ingredient is inspected for quality before it enters our prep kitchen.\n\n6:00 AM - Prep Begins\n\nOur prep cooks begin their meticulous work—washing, chopping, marinating, and preparing base sauces. Everything is made fresh daily.\n\n9:00 AM - Production Meeting\n\nThe team gathers to review the day''s events. Every detail is discussed, from dietary restrictions to presentation requirements.\n\n10:00 AM - Cooking Begins\n\nMultiple stations work in harmony. The grill station handles proteins, the sauté station prepares vegetables, and the pastry team works on desserts.\n\n2:00 PM - Packing and Loading\n\nFood is carefully packed into temperature-controlled containers. Our logistics team loads trucks with military precision.\n\n4:00 PM - On-Site Setup\n\nOur event team arrives to set up, ensuring everything is perfect before guests arrive.\n\nThis dedication to excellence is what makes every Farms Fresh Food event special.', 'Chef Maria Rodriguez', true, now() - interval '1 day');