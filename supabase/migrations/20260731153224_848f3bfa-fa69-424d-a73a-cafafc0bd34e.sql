DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages" ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(message)) BETWEEN 1 AND 5000
  AND is_read = false
);