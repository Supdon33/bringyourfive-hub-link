
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, username, email, account_type, cell_phone, birth_month, birth_year, home_state)
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
    NEW.raw_user_meta_data->>'home_state'
  );
  RETURN NEW;
END;
$function$;
