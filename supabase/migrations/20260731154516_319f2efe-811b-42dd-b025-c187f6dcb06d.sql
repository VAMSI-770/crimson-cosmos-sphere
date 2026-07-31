CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  actor_email text,
  actor_id uuid,
  entity text,
  entity_id text,
  ip_address text,
  user_agent text,
  session_id text,
  request_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_select_auth" ON public.audit_logs
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);
CREATE INDEX audit_logs_action_idx ON public.audit_logs (action);

CREATE TABLE public.login_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  email text,
  success boolean NOT NULL DEFAULT false,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.login_attempts TO service_role;

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX login_attempts_ip_idx ON public.login_attempts (ip_address, created_at DESC);