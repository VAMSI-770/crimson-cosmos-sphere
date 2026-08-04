CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DO $$
DECLARE
  pol RECORD;
  new_using TEXT;
  new_check TEXT;
  stmt TEXT;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
    FROM pg_policies
    WHERE schemaname IN ('public', 'storage')
      AND (qual LIKE '%has_role%' OR with_check LIKE '%has_role%')
  LOOP
    new_using := replace(coalesce(pol.qual, ''), 'has_role(', 'private.has_role(');
    new_using := replace(new_using, 'public.private.has_role(', 'private.has_role(');
    new_check := replace(coalesce(pol.with_check, ''), 'has_role(', 'private.has_role(');
    new_check := replace(new_check, 'public.private.has_role(', 'private.has_role(');

    stmt := format('ALTER POLICY %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    IF pol.qual IS NOT NULL THEN
      stmt := stmt || format(' USING (%s)', new_using);
    END IF;
    IF pol.with_check IS NOT NULL THEN
      stmt := stmt || format(' WITH CHECK (%s)', new_check);
    END IF;
    EXECUTE stmt;
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);