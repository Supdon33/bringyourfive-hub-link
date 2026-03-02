
-- Add skill_level and sex columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skill_level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sex text;

-- Update the handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, username, email, account_type, cell_phone, birth_month, birth_year, home_state, skill_level, sex)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'individual'),
    NEW.raw_user_meta_data->>'cell_phone',
    (NEW.raw_user_meta_data->>'birth_month')::integer,
    (NEW.raw_user_meta_data->>'birth_year')::integer,
    NEW.raw_user_meta_data->>'home_state',
    NEW.raw_user_meta_data->>'skill_level',
    NEW.raw_user_meta_data->>'sex'
  );
  RETURN NEW;
END;
$function$;
