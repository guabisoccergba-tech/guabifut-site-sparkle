CREATE OR REPLACE FUNCTION public.claim_initial_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(842791);

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    claimed := true;
  END IF;

  RETURN claimed OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  );
END;
$$;

REVOKE ALL ON FUNCTION public.claim_initial_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_initial_admin() TO authenticated;