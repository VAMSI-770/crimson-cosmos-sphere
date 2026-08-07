ALTER TABLE public.blockchain_records REPLICA IDENTITY FULL;
ALTER TABLE public.blockchain_config REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blockchain_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blockchain_config;