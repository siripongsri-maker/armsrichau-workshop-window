CREATE TABLE public.open_call_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  language text NOT NULL DEFAULT 'en',
  organisation text NOT NULL,
  link text,
  about text NOT NULL,
  work_type text NOT NULL,
  problem text NOT NULL,
  one_month_change text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  channel text NOT NULL,
  channel_detail text,
  agree_terms text NOT NULL,
  budget text NOT NULL
);
GRANT ALL ON public.open_call_applications TO service_role;
ALTER TABLE public.open_call_applications ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.open_call_rate_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.open_call_rate_log TO service_role;
ALTER TABLE public.open_call_rate_log ENABLE ROW LEVEL SECURITY;