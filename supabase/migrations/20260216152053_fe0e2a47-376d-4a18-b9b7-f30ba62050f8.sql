
-- Add new columns to candidature
ALTER TABLE public.candidature 
  ADD COLUMN IF NOT EXISTS tipo text DEFAULT 'privato',
  ADD COLUMN IF NOT EXISTS payload jsonb,
  ADD COLUMN IF NOT EXISTS stato text DEFAULT 'nuova',
  ADD COLUMN IF NOT EXISTS denominazione text,
  ADD COLUMN IF NOT EXISTS referente text;

-- Create email_config table for admin-configurable email settings
CREATE TABLE public.email_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT true,
  from_name text NOT NULL DEFAULT 'Cingoli Post-Sisma',
  from_email text NOT NULL DEFAULT 'onboarding@resend.dev',
  reply_to text,
  to_recipients text NOT NULL DEFAULT 'info@impresacingoli.it',
  cc text,
  bcc text,
  subject_template text NOT NULL DEFAULT '[Candidatura] {tipo} – {comune} – {referente}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: no public access to email_config (only edge functions with service role)
ALTER TABLE public.email_config ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies = completely locked from client

-- Insert default configuration row
INSERT INTO public.email_config (id) VALUES (gen_random_uuid());
