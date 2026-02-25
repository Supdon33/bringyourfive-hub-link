
-- Remove the failing trigger and function
DROP TRIGGER IF EXISTS on_profile_created_sync_hubspot ON public.profiles;
DROP FUNCTION IF EXISTS public.notify_hubspot_new_profile();
