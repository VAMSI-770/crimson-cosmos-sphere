
-- Fix contact_messages: remove public SELECT, restrict to authenticated
DROP POLICY IF EXISTS "Public read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Auth manage contact_messages" ON public.contact_messages;
CREATE POLICY "Authenticated read contact_messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated manage contact_messages" ON public.contact_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Fix write policies on all content tables: restrict to authenticated
DROP POLICY IF EXISTS "Auth write achievements" ON public.achievements;
CREATE POLICY "Auth write achievements" ON public.achievements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write certifications" ON public.certifications;
CREATE POLICY "Auth write certifications" ON public.certifications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write education" ON public.education;
CREATE POLICY "Auth write education" ON public.education
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write goals" ON public.goals;
CREATE POLICY "Auth write goals" ON public.goals
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write ideas" ON public.ideas;
CREATE POLICY "Auth write ideas" ON public.ideas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write internships" ON public.internships;
CREATE POLICY "Auth write internships" ON public.internships
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write projects" ON public.projects;
CREATE POLICY "Auth write projects" ON public.projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write site_content" ON public.site_content;
CREATE POLICY "Auth write site_content" ON public.site_content
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write skill_categories" ON public.skill_categories;
CREATE POLICY "Auth write skill_categories" ON public.skill_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write skills" ON public.skills;
CREATE POLICY "Auth write skills" ON public.skills
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
