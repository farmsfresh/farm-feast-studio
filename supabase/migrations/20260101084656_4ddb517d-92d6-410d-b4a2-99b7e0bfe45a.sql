-- Create visitor logs table for tracking IP addresses and visits
CREATE TABLE public.visitor_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view visitor logs (contains PII)
CREATE POLICY "Admins can view visitor logs"
  ON public.visitor_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow anonymous inserts from edge function (via service role)
CREATE POLICY "Service role can insert visitor logs"
  ON public.visitor_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_visitor_logs_created_at ON public.visitor_logs(created_at DESC);
CREATE INDEX idx_visitor_logs_ip ON public.visitor_logs(ip_address);