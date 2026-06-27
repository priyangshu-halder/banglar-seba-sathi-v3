
-- 1) admin_credentials: deny all client access explicitly (service_role bypasses RLS)
REVOKE ALL ON public.admin_credentials FROM anon, authenticated;
CREATE POLICY "no client access to admin credentials"
  ON public.admin_credentials
  AS RESTRICTIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 2) reports: replace permissive WITH CHECK (true) with validated public-submit policy
DROP POLICY IF EXISTS "anyone can submit report" ON public.reports;
CREATE POLICY "public can submit valid reports"
  ON public.reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(issue_type) BETWEEN 1 AND 100
    AND char_length(description) <= 5000
    AND char_length(location) <= 500
    AND (phone IS NULL OR char_length(phone) <= 20)
    AND (photo_url IS NULL OR char_length(photo_url) <= 2000)
    AND status = 'submitted'
  );

-- 3) reports: ensure no client role can SELECT/UPDATE/DELETE the PII rows
REVOKE SELECT, UPDATE, DELETE ON public.reports FROM anon, authenticated;
GRANT INSERT ON public.reports TO anon, authenticated;
GRANT ALL ON public.reports TO service_role;
