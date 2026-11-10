import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/grupos/")({
  head: () => ({
    meta: [
      { title: "Meus grupos | GuabiSoccer" },
      { name: "description", content: "Crie seu grupo de futebol, confirme presença e sorteie os times." },
      { property: "og:title", content: "Meus grupos | GuabiSoccer" },
      { property: "og:description", content: "Crie seu grupo de futebol, confirme presença e sorteie os times." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GroupsPage,
});

function GroupsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("play_groups").select("id, name, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const create = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const id = crypto.randomUUID();
      const { error } = await supabase.from("play_groups").insert({ id, name: name.trim(), owner_id: u.user!.id });
      if (error) throw error;
      const meName = (u.user!.email ?? "Eu").split("@")[0]!;
      await supabase.from("group_members").insert({ group_id: id, name: meName, email: u.user!.email });
    },
    onSuccess: () => { setName(""); qc.invalidateQueries({ queryKey: ["groups"] }); },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground">Meus grupos</h1>
        <p className="mt-1 text-muted-foreground">Crie seu grupo, marque o jogo, confirme presença e deixe o sistema montar os times.</p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => { e.preventDefault(); if (name.trim().length >= 2) create.mutate(); }}
        >
          <Input placeholder="Nome do grupo (ex.: Pelada de quinta)" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" disabled={create.isPending}>Criar grupo</Button>
        </form>
        {create.error && <p className="mt-2 text-sm text-destructive">{(create.error as Error).message}</p>}
        <div className="mt-8 grid gap-3">
          {groups.isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {groups.data?.length === 0 && <p className="text-muted-foreground">Você ainda não está em nenhum grupo.</p>}
          {groups.data?.map((g) => (
            <Link key={g.id} to="/grupos/$groupId" params={{ groupId: g.id }}>
              <Card className="transition-colors hover:border-primary">
                <CardContent className="p-4 font-semibold text-foreground">{g.name}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
