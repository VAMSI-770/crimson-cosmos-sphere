
-- Drop all existing restrictive policies and recreate as permissive

-- achievements
DROP POLICY IF EXISTS "Auth write achievements" ON public.achievements;
DROP POLICY IF EXISTS "Public read achievements" ON public.achievements;
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Auth write achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

-- admin_login_logs
DROP POLICY IF EXISTS "Auth insert login_logs" ON public.admin_login_logs;
DROP POLICY IF EXISTS "Auth read login_logs" ON public.admin_login_logs;
CREATE POLICY "Public read login_logs" ON public.admin_login_logs FOR SELECT USING (true);
CREATE POLICY "Public insert login_logs" ON public.admin_login_logs FOR INSERT WITH CHECK (true);

-- certifications
DROP POLICY IF EXISTS "Auth write certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public read certifications" ON public.certifications;
CREATE POLICY "Public read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Auth write certifications" ON public.certifications FOR ALL USING (true) WITH CHECK (true);

-- contact_messages
DROP POLICY IF EXISTS "Auth manage contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public read contact_messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth manage contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- education
DROP POLICY IF EXISTS "Auth write education" ON public.education;
DROP POLICY IF EXISTS "Public read education" ON public.education;
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Auth write education" ON public.education FOR ALL USING (true) WITH CHECK (true);

-- goals
DROP POLICY IF EXISTS "Auth write goals" ON public.goals;
DROP POLICY IF EXISTS "Public read goals" ON public.goals;
CREATE POLICY "Public read goals" ON public.goals FOR SELECT USING (true);
CREATE POLICY "Auth write goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- ideas
DROP POLICY IF EXISTS "Auth write ideas" ON public.ideas;
DROP POLICY IF EXISTS "Public read ideas" ON public.ideas;
CREATE POLICY "Public read ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Auth write ideas" ON public.ideas FOR ALL USING (true) WITH CHECK (true);

-- internships
DROP POLICY IF EXISTS "Auth write internships" ON public.internships;
DROP POLICY IF EXISTS "Public read internships" ON public.internships;
CREATE POLICY "Public read internships" ON public.internships FOR SELECT USING (true);
CREATE POLICY "Auth write internships" ON public.internships FOR ALL USING (true) WITH CHECK (true);

-- projects
DROP POLICY IF EXISTS "Auth write projects" ON public.projects;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- site_content
DROP POLICY IF EXISTS "Auth write site_content" ON public.site_content;
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Auth write site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

-- skill_categories
DROP POLICY IF EXISTS "Auth write skill_categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Public read skill_categories" ON public.skill_categories;
CREATE POLICY "Public read skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Auth write skill_categories" ON public.skill_categories FOR ALL USING (true) WITH CHECK (true);

-- skills
DROP POLICY IF EXISTS "Auth write skills" ON public.skills;
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Auth write skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
