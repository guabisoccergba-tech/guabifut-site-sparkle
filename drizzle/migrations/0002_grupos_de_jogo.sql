CREATE TABLE public.play_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.play_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  is_goalkeeper boolean NOT NULL DEFAULT false,
  is_star boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX group_members_group_idx ON public.group_members(group_id);
CREATE INDEX group_members_email_idx ON public.group_members(lower(email));
CREATE TABLE public.group_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.play_groups(id) ON DELETE CASCADE,
  match_at timestamptz NOT NULL,
  location text,
  teams_count int NOT NULL DEFAULT 2,
  draw_method text NOT NULL DEFAULT 'equilibrado',
  teams jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.match_presence (
  match_id uuid NOT NULL REFERENCES public.group_matches(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.group_members(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (match_id, member_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.play_groups, public.group_members, public.group_matches, public.match_presence TO authenticated;
GRANT ALL ON public.play_groups, public.group_members, public.group_matches, public.match_presence TO service_role;

CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.play_groups g WHERE g.id = _group_id AND g.owner_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.group_members m WHERE m.group_id = _group_id
                 AND m.email IS NOT NULL AND lower(m.email) = lower(auth.jwt()->>'email'))
$$;
CREATE OR REPLACE FUNCTION public.match_group(_match_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT group_id FROM public.group_matches WHERE id = _match_id
$$;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid), public.match_group(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid), public.match_group(uuid) TO authenticated;

ALTER TABLE public.play_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY pg_select ON public.play_groups FOR SELECT TO authenticated USING (public.is_group_member(id));
CREATE POLICY pg_insert ON public.play_groups FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY pg_update ON public.play_groups FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY pg_delete ON public.play_groups FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY gm_all ON public.group_members FOR ALL TO authenticated
  USING (public.is_group_member(group_id)) WITH CHECK (public.is_group_member(group_id));
CREATE POLICY gmat_all ON public.group_matches FOR ALL TO authenticated
  USING (public.is_group_member(group_id)) WITH CHECK (public.is_group_member(group_id));
CREATE POLICY mp_all ON public.match_presence FOR ALL TO authenticated
  USING (public.is_group_member(public.match_group(match_id))) WITH CHECK (public.is_group_member(public.match_group(match_id)));