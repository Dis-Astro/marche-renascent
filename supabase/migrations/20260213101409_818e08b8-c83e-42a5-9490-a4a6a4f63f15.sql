
-- Candidature table
CREATE TABLE public.candidature (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  comune TEXT NOT NULL,
  tipologia TEXT,
  descrizione TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public insert, no auth needed (lead gen form)
ALTER TABLE public.candidature ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert candidature"
  ON public.candidature FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No public read"
  ON public.candidature FOR SELECT
  USING (false);

-- Storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('candidature-files', 'candidature-files', true);

CREATE POLICY "Anyone can upload candidature files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'candidature-files');

CREATE POLICY "Public read candidature files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'candidature-files');
