-- Allow anyone to look up a profile email by username (needed for username-based sign in)
CREATE POLICY "Anyone can look up profile by username"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;