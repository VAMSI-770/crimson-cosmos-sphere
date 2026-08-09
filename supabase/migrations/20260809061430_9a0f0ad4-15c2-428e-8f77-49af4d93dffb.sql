ALTER TABLE public.blockchain_config
  ADD COLUMN IF NOT EXISTS deployment_block bigint,
  ADD COLUMN IF NOT EXISTS contract_verified_at timestamp with time zone;