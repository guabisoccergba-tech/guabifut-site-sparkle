DROP VIEW IF EXISTS public.booked_slots;

REVOKE SELECT ON public.bookings FROM anon;
GRANT SELECT (court_id, booking_date, start_time, end_time, status) ON public.bookings TO anon;

CREATE POLICY "bookings_anon_read_slots" ON public.bookings FOR SELECT TO anon
  USING (status <> 'cancelada');

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;