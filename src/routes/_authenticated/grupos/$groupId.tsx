import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drawTeams, type DrawMethod, type Team } from "@/lib/team-draw";

export const Route = createFileRoute("/_authenticated/grupos/$groupId")({
  head: () => ({
    meta: [
      { title: "Grupo | GuabiSoccer" },
      { name: "description", content: "Jogadores, presença e sorteio de times do grupo." },
      { property: "og:title", content: "Grupo | GuabiSoccer" },
      { property: "og:description", content: "Jogadores, presença e sorteio de times do grupo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GroupPage,
});

type Member = { id: string; name: string; email: string | null; is_goalkeeper: boolean; is_star: boolean };

function GroupPage() {
  const { groupId } = Route.useParams();
  const qc = useQueryClient();
  const key = ["group", groupId];
  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      const [g, m, mt] = await Promise.all([
        supabase.from("play_groups").select("id, name").eq("id", groupId).maybeSingle(),
        supabase.from("group_members").select("id, name, email, is_goalkeeper, is_star").eq("group_id", groupId).order("name"),
        supabase.from("group_matches").select("id, match_at, location, teams_count, draw_method, teams, match_presence(member_id)").eq("group_id", groupId).order("match_at", { ascending: false }),
      ]);
      if (g.error || m.error || mt.error) throw g.error ?? m.error ?? mt.error;
      return { group: g.data, members: (m.data ?? []) as Member[], matches: (mt.data ?? []) as any[] };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: key });
  const [err, setErr] = useState<string | null>(null);
  const run = async (p: PromiseLike<{ error: any }>) => {
    const { error } = await p;
    setErr(error?.message ?? null);
    refresh();
  };

  const [mName, setMName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [loc, setLoc] = useState("GuabiSoccer");

  if (q.isLoading) return <SiteLayout><p className="p-10 text-muted-foreground">Carregando...</p></SiteLayout>;
  if (!q.data?.group) return <SiteLayout><p className="p-10 text-muted-foreground">Grupo não encontrado.</p></SiteLayout>;
  const { group, members, matches } = q.data;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <div>
          <Link to="/grupos" className="text-sm text-primary underline">← Meus grupos</Link>
          <h1 className="mt-2 text-3xl font-bold text-foreground">{group.name}</h1>
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}

        <Card>
          <CardHeader><CardTitle>Jogadores ({members.length})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <form
              className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (mName.trim().length < 2) return;
                run(supabase.from("group_members").insert({ group_id: groupId, name: mName.trim(), email: mEmail.trim() || null }));
                setMName(""); setMEmail("");
              }}
            >
              <Input placeholder="Nome do jogador" value={mName} onChange={(e) => setMName(e.target.value)} />
              <Input type="email" placeholder="E-mail (opcional, para acessar o app)" value={mEmail} onChange={(e) => setMEmail(e.target.value)} />
              <Button type="submit">Adicionar</Button>
            </form>
            <p className="text-xs text-muted-foreground">Quem tiver e-mail informado pode criar conta com ele e passa a ver o grupo e confirmar presença.</p>
            <div className="divide-y divide-border">
              {members.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center gap-3 py-2">
                  <span className="flex-1 font-medium text-foreground">{m.name}</span>
                  <label className="flex items-center gap-1 text-sm">
                    <Checkbox checked={m.is_goalkeeper} onCheckedChange={(v) => run(supabase.from("group_members").update({ is_goalkeeper: !!v }).eq("id", m.id))} />
                    Goleiro
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <Checkbox checked={m.is_star} onCheckedChange={(v) => run(supabase.from("group_members").update({ is_star: !!v }).eq("id", m.id))} />
                    Bom de bola
                  </label>
                  <Button size="sm" variant="ghost" onClick={() => confirm(`Remover ${m.name}?`) && run(supabase.from("group_members").delete().eq("id", m.id))}>Remover</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Marcar jogo</CardTitle></CardHeader>
          <CardContent>
            <form
              className="grid gap-3 sm:grid-cols-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!date) return;
                run(supabase.from("group_matches").insert({ group_id: groupId, match_at: new Date(`${date}T${time}:00-03:00`).toISOString(), location: loc }));
              }}
            >
              <div className="space-y-1"><Label>Data</Label><Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="space-y-1"><Label>Hora</Label><Input type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></div>
              <div className="space-y-1"><Label>Local</Label><Input value={loc} onChange={(e) => setLoc(e.target.value)} /></div>
              <div className="flex items-end"><Button type="submit" className="w-full">Criar jogo</Button></div>
            </form>
          </CardContent>
        </Card>

        {matches.map((mt) => (
          <MatchCard key={mt.id} match={mt} members={members} run={run} />
        ))}
      </section>
    </SiteLayout>
  );
}

function MatchCard({ match, members, run }: { match: any; members: Member[]; run: (p: PromiseLike<{ error: any }>) => Promise<void> }) {
  const present = new Set<string>((match.match_presence ?? []).map((p: any) => p.member_id));
  const [teamsCount, setTeamsCount] = useState<number>(match.teams_count ?? 2);
  const [method, setMethod] = useState<DrawMethod>(match.draw_method ?? "equilibrado");
  const teams = match.teams as Team[] | null;
  const when = new Date(match.match_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "full", timeStyle: "short" });

  const toggle = (id: string) =>
    run(present.has(id)
      ? supabase.from("match_presence").delete().eq("match_id", match.id).eq("member_id", id)
      : supabase.from("match_presence").insert({ match_id: match.id, member_id: id }));

  const draw = () => {
    const players = members.filter((m) => present.has(m.id));
    if (players.length < teamsCount) return alert("Confirme mais jogadores antes de sortear.");
    const result = drawTeams(players, teamsCount, method);
    run(supabase.from("group_matches").update({ teams: result as any, teams_count: teamsCount, draw_method: method }).eq("id", match.id));
  };

  const copy = () => {
    if (!teams) return;
    const txt = `⚽ ${when}\n\n` + teams.map((t) => `*${t.name}*\n` + t.players.map((p) => `- ${p.name}${p.is_goalkeeper ? " (goleiro)" : ""}`).join("\n")).join("\n\n");
    navigator.clipboard.writeText(txt);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{when}</CardTitle>
        <p className="text-sm text-muted-foreground">{match.location} · {present.size} confirmados</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Presença (toque para confirmar ou desmarcar)</p>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <button key={m.id} type="button" onClick={() => toggle(m.id)}>
                <Badge variant={present.has(m.id) ? "default" : "outline"}>
                  {present.has(m.id) ? "✓ " : ""}{m.name}{m.is_goalkeeper ? " 🧤" : ""}{m.is_star ? " ⭐" : ""}
                </Badge>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label>Times</Label>
            <Input type="number" min={2} max={6} className="w-20" value={teamsCount} onChange={(e) => setTeamsCount(Number(e.target.value) || 2)} />
          </div>
          <div className="space-y-1">
            <Label>Método</Label>
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={method} onChange={(e) => setMethod(e.target.value as DrawMethod)}>
              <option value="equilibrado">Equilibrado (1 goleiro por time + bons de bola divididos)</option>
              <option value="aleatorio">Totalmente aleatório</option>
            </select>
          </div>
          <Button onClick={draw}>{teams ? "Sortear de novo" : "Sortear times"}</Button>
          {teams && <Button variant="outline" onClick={copy}>Copiar times</Button>}
          <Button variant="ghost" onClick={() => confirm("Excluir este jogo?") && run(supabase.from("group_matches").delete().eq("id", match.id))}>Excluir jogo</Button>
        </div>
        {teams && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((t) => (
              <div key={t.name} className="rounded-lg border border-border bg-secondary p-3">
                <p className="font-bold text-primary">{t.name}</p>
                <ul className="mt-1 text-sm text-foreground">
                  {t.players.map((p) => <li key={p.id}>{p.name}{p.is_goalkeeper ? " 🧤" : ""}{p.is_star ? " ⭐" : ""}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
