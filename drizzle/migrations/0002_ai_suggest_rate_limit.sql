CREATE TABLE public.ai_suggest_log (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, ip text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_suggest_log TO service_role;
ALTER TABLE public.ai_suggest_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX ai_suggest_log_ip_created ON public.ai_suggest_log (ip, created_at);
CREATE INDEX ai_suggest_log_created ON public.ai_suggest_log (created_at);

CREATE OR REPLACE FUNCTION public.ai_suggest_take_slot(p_ip text, p_limit int DEFAULT 20)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE n int; g int;
BEGIN
  IF p_ip IS NULL OR length(p_ip) < 1 OR length(p_ip) > 64 OR p_limit < 1 OR p_limit > 20 THEN RETURN false; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('ai_suggest_global'));
  DELETE FROM public.ai_suggest_log WHERE created_at < now() - interval '1 hour';
  SELECT count(*) INTO n FROM public.ai_suggest_log WHERE ip = p_ip;
  SELECT count(*) INTO g FROM public.ai_suggest_log;
  IF n >= p_limit OR g >= 300 THEN RETURN false; END IF;
  INSERT INTO public.ai_suggest_log (ip) VALUES (p_ip);
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.ai_suggest_take_slot(text, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ai_suggest_take_slot(text, int) TO service_role;