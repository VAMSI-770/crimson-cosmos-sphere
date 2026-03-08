
CREATE TABLE public.admin_login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth read login_logs" ON public.admin_login_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert login_logs" ON public.admin_login_logs FOR INSERT TO authenticated WITH CHECK (true);
