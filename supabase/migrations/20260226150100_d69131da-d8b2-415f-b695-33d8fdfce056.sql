
CREATE OR REPLACE FUNCTION public.increment_spots_filled(run_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE runs SET spots_filled = spots_filled + 1 WHERE id = run_id_input;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_spots_filled(run_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE runs SET spots_filled = GREATEST(spots_filled - 1, 0) WHERE id = run_id_input;
END;
$$;
