
CREATE TABLE public.gtm_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT false,
  gtm_id text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gtm_config ENABLE ROW LEVEL SECURITY;

-- Insert default row
INSERT INTO public.gtm_config (enabled, gtm_id) VALUES (false, '');
