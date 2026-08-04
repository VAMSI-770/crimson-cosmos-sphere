CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;

CREATE TABLE public.blockchain_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id text NOT NULL,
  owner_wallet text,
  network text NOT NULL DEFAULT 'polygon-amoy',
  chain_id integer NOT NULL DEFAULT 80002,
  contract_address text,
  deployment_tx text,
  deployed_at timestamptz,
  last_sync_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blockchain_config TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blockchain_config TO authenticated;
GRANT ALL ON public.blockchain_config TO service_role;

ALTER TABLE public.blockchain_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blockchain_config_select_public" ON public.blockchain_config
  FOR SELECT USING (true);
CREATE POLICY "blockchain_config_insert_admin" ON public.blockchain_config
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "blockchain_config_update_admin" ON public.blockchain_config
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "blockchain_config_delete_admin" ON public.blockchain_config
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.blockchain_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  record_type text NOT NULL,
  entity_table text,
  entity_id text,
  title text NOT NULL DEFAULT '',
  verification_id text NOT NULL UNIQUE,
  content_hash text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  network text NOT NULL DEFAULT 'polygon-amoy',
  chain_id integer NOT NULL DEFAULT 80002,
  contract_address text,
  tx_hash text,
  block_number bigint,
  owner_wallet text,
  status text NOT NULL DEFAULT 'pending',
  registered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX blockchain_records_entity_idx ON public.blockchain_records (entity_table, entity_id);
CREATE INDEX blockchain_records_type_idx ON public.blockchain_records (record_type);
CREATE INDEX blockchain_records_created_idx ON public.blockchain_records (created_at DESC);

GRANT SELECT ON public.blockchain_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blockchain_records TO authenticated;
GRANT ALL ON public.blockchain_records TO service_role;

ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blockchain_records_select_public" ON public.blockchain_records
  FOR SELECT USING (true);
CREATE POLICY "blockchain_records_insert_admin" ON public.blockchain_records
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "blockchain_records_update_admin" ON public.blockchain_records
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "blockchain_records_delete_admin" ON public.blockchain_records
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blockchain_config_updated_at BEFORE UPDATE ON public.blockchain_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER update_blockchain_records_updated_at BEFORE UPDATE ON public.blockchain_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();