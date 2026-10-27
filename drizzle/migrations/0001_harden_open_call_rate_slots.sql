CREATE INDEX IF NOT EXISTS open_call_rate_log_ip_created_at_idx ON public.open_call_rate_log (ip, created_at);
CREATE INDEX IF NOT EXISTS open_call_rate_log_created_at_idx ON public.open_call_rate_log (created_at);
CREATE OR REPLACE FUNCTION public.open_call_take_slot(p_ip text, p_limit int DEFAULT 5)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  cutoff timestamptz := clock_timestamp() - interval '1 hour';
BEGIN
  IF p_ip IS NULL OR length(p_ip) = 0 OR length(p_ip) > 64 OR p_limit IS NULL OR p_limit < 1 OR p_limit > 5 THEN
    RAISE EXCEPTION 'Invalid rate slot arguments';
  END IF;
  -- Serialize the global ceiling before acquiring each per-IP lock.
  PERFORM pg_advisory_xact_lock(hashtext('open_call_rate:global'));
  PERFORM pg_advisory_xact_lock(hashtext('open_call_rate:' || p_ip));
  DELETE FROM public.open_call_rate_log WHERE created_at <= cutoff;
  IF (SELECT count(*) FROM public.open_call_rate_log WHERE ip = p_ip AND created_at > cutoff) >= p_limit THEN
    RETURN false;
  END IF;
  -- Reservations also include failed inserts: conservative, atomic spam protection.
  IF (SELECT count(*) FROM public.open_call_rate_log WHERE created_at > cutoff) >= 50
     OR (SELECT count(*) FROM public.open_call_applications WHERE created_at > cutoff) >= 50 THEN
    RETURN false;
  END IF;
  INSERT INTO public.open_call_rate_log (ip) VALUES (p_ip);
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.open_call_take_slot(text, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.open_call_take_slot(text, int) TO service_role;
COMMENT ON FUNCTION public.open_call_take_slot(text, int) IS 'Atomic five-per-IP and fifty-global hourly reservations; expires raw IP logs during each call.';