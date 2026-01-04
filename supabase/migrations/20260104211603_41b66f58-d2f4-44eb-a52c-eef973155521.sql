-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Orders are viewable by authenticated users with matching email" ON public.orders;

-- Create a more secure policy that properly validates the email claim
-- This ensures users can only view orders where customer_email matches their verified auth email
CREATE POLICY "Users can view their own orders by verified email"
ON public.orders
FOR SELECT
TO authenticated
USING (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Also add INSERT policy for orders (currently missing - orders are inserted by webhook)
-- Service role inserts orders, so we don't need an authenticated user INSERT policy