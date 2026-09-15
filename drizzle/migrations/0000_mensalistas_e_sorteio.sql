-- Mensalistas: marcação em bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS is_monthly boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS monthly_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS monthly_weekday smallint;

CREATE INDEX IF NOT EXISTS bookings_monthly_idx
  ON public.bookings (is_monthly, monthly_active)
  WHERE is_monthly = true;

-- Admin pode cadastrar reservas/mensalistas manualmente
DROP POLICY IF EXISTS bookings_insert_admin ON public.bookings;
CREATE POLICY bookings_insert_admin ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Sorteios
CREATE TABLE IF NOT EXISTS public.raffles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prize text NOT NULL,
  raffle_date date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')::date,
  winner_name text,
  winner_phone text,
  winner_detail text,
  entries_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.raffle_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id uuid NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  detail text,
  is_winner boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS raffle_entries_raffle_idx ON public.raffle_entries (raffle_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.raffles TO authenticated;
GRANT ALL ON public.raffles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.raffle_entries TO authenticated;
GRANT ALL ON public.raffle_entries TO service_role;

ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY raffles_admin_all ON public.raffles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY raffle_entries_admin_all ON public.raffle_entries
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));