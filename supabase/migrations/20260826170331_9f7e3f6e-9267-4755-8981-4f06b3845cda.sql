-- 1. profiles: remove public read
DROP POLICY IF EXISTS "Anyone can look up profile by username" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 2. run_participants: authenticated only
DROP POLICY IF EXISTS "Anyone can view run participants" ON public.run_participants;
CREATE POLICY "Authenticated users can view run participants"
ON public.run_participants FOR SELECT TO authenticated
USING (true);

-- 3. Revoke SECURITY DEFINER function execute from anon/authenticated where not needed
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.handle_new_user_subscription() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.increment_spots_filled(uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.decrement_spots_filled(uuid) FROM anon, authenticated, public;

-- Roster RPCs must stay callable by signed-in users, but not anonymously.
-- Make them SECURITY INVOKER and rely on RLS-safe targeted updates.
CREATE OR REPLACE FUNCTION public.increment_spots_filled(run_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE runs SET spots_filled = LEAST(spots_filled + 1, spots_total) WHERE id = run_id_input;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_spots_filled(run_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE runs SET spots_filled = GREATEST(spots_filled - 1, 0) WHERE id = run_id_input;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_spots_filled(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_spots_filled(uuid) TO authenticated;

-- 4. storage.objects policies
DROP POLICY IF EXISTS "Public can read email assets" ON storage.objects;
CREATE POLICY "Public can read email assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'email-assets');

DROP POLICY IF EXISTS "Authenticated users can upload email assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload email assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'email-assets' AND owner = auth.uid());

DROP POLICY IF EXISTS "Owners can update their email assets" ON storage.objects;
CREATE POLICY "Owners can update their email assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'email-assets' AND owner = auth.uid())
WITH CHECK (bucket_id = 'email-assets' AND owner = auth.uid());

DROP POLICY IF EXISTS "Owners can delete their email assets" ON storage.objects;
CREATE POLICY "Owners can delete their email assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'email-assets' AND owner = auth.uid());