
-- Auto-create subscription based on user metadata signup_tier
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (
    NEW.id,
    CASE WHEN NEW.raw_user_meta_data->>'signup_tier' = 'tier2' THEN 'tier2'::subscription_tier ELSE 'tier1'::subscription_tier END,
    'active'
  );
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Enable realtime for runs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.runs;
