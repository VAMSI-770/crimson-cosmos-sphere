-- Lock down admin login logs: no public/authenticated access, service role only
DROP POLICY IF EXISTS "Public read login_logs" ON public.admin_login_logs;
DROP POLICY IF EXISTS "Public insert login_logs" ON public.admin_login_logs;
REVOKE ALL ON public.admin_login_logs FROM anon, authenticated;
GRANT ALL ON public.admin_login_logs TO service_role;

-- Replace always-true write policies with explicit signed-in checks
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['achievements','certifications','education','goals','ideas','internships','projects','site_content','skill_categories','skills']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Auth write ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)', t || '_insert_auth', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)', t || '_update_auth', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL)', t || '_delete_auth', t);
  END LOOP;
END $$;

-- contact_messages: keep public submissions, restrict management to signed-in users explicitly
DROP POLICY IF EXISTS "Authenticated manage contact_messages" ON public.contact_messages;
CREATE POLICY "contact_messages_update_auth" ON public.contact_messages FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "contact_messages_delete_auth" ON public.contact_messages FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);