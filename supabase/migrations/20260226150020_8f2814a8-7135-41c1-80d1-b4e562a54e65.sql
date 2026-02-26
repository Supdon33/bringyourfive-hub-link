
CREATE TABLE public.run_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id uuid NOT NULL,
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(run_id, user_id)
);

ALTER TABLE public.run_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view run participants"
  ON public.run_participants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join runs"
  ON public.run_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave runs"
  ON public.run_participants FOR DELETE
  USING (auth.uid() = user_id);
