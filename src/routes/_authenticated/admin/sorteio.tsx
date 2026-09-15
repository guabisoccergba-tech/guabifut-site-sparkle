import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCheck, Clipboard, Dices, Trophy } from "lucide-react";
import { adminListMonthly, adminListRaffles, adminRunRaffle } from "@/lib/raffle.functions";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const Route = createFileRoute("/_authenticated/admin/sorteio")({
  head: () => ({ meta: [
    { title: "Sorteio de mensalistas | GuabiSoccer" },
    { name: "description", content: "Sorteio administrativo entre os mensalistas da GuabiSoccer." },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: "Sorteio de mensalistas | GuabiSoccer" },
    { property: "og:description", content: "Sorteio administrativo entre os mensalistas da GuabiSoccer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: RafflePage,
});

function RafflePage() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminListMonthly);
  const historyFn = useServerFn(adminListRaffles);
  const runFn = useServerFn(adminRunRaffle);
  const monthlyQ = useQuery({ queryKey:["admin-monthly"], queryFn:()=>listFn() });
  const historyQ = useQuery({ queryKey:["admin-raffles"], queryFn:()=>historyFn() });
  const active = useMemo(()=>monthlyQ.data?.monthly.filter((m:any)=>m.monthly_active) ?? [],[monthlyQ.data]);
  const [selected,setSelected]=useState<string[]>([]);
  const [prize,setPrize]=useState("Uma costela");
  const [running,setRunning]=useState(false);
  const [rollingName,setRollingName]=useState("");
  const [winner,setWinner]=useState<{name:string;detail:string}|null>(null);
  const [copied,setCopied]=useState(false);
  const [message,setMessage]=useState<string|null>(null);

  useEffect(()=>{ if(active.length && selected.length===0) setSelected(active.map((m:any)=>m.id)); },[active.length]);
  const allSelected=active.length>0&&selected.length===active.length;

  async function draw() {
    if(selected.length<2) return;
    setRunning(true); setWinner(null); setMessage(null);
    const names=active.filter((m:any)=>selected.includes(m.id)).map((m:any)=>m.customer_name);
    let ticks=0;
    const timer=window.setInterval(()=>{setRollingName(names[ticks%names.length]??"");ticks+=1;},90);
    try {
      const result=await runFn({data:{prize,entryIds:selected}});
      await new Promise((r)=>setTimeout(r,1800));
      window.clearInterval(timer); setRollingName(result.winner.name); setWinner(result.winner);
      await queryClient.invalidateQueries({queryKey:["admin-raffles"]});
    } catch(err:any) { window.clearInterval(timer); setMessage(err?.message??"Não foi possível realizar o sorteio."); }
    finally { setRunning(false); }
  }

  async function copyResult(){if(!winner)return;await navigator.clipboard.writeText(`Sorteio GuabiSoccer – ${prize}\nGanhador: ${winner.name}\n${winner.detail}`);setCopied(true);window.setTimeout(()=>setCopied(false),2000);}

  return <AdminShell>
    <div className="mb-6"><Badge className="mb-2">Área administrativa</Badge><h1 className="text-3xl font-extrabold">Sorteio de mensalistas</h1><p className="mt-1 text-muted-foreground">Escolha os participantes e sorteie um único ganhador.</p></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>Participantes</CardTitle><Badge variant="secondary">{selected.length} selecionados</Badge></div></CardHeader><CardContent>
        {monthlyQ.isLoading?<p>Carregando...</p>:active.length===0?<div className="py-12 text-center text-muted-foreground"><Trophy className="mx-auto mb-3 h-9 w-9"/><p>Nenhum mensalista ativo.</p><p className="text-sm">Cadastre os horários mensais antes de sortear.</p></div>:<div className="space-y-2"><label className="mb-3 flex items-center gap-3 border-b pb-3 text-sm font-semibold"><Checkbox checked={allSelected} onCheckedChange={(v)=>setSelected(v===true?active.map((m:any)=>m.id):[])}/>Selecionar todos</label>{active.map((m:any)=><label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted"><Checkbox checked={selected.includes(m.id)} onCheckedChange={(v)=>setSelected(v===true?[...selected,m.id]:selected.filter(id=>id!==m.id))}/><span className="min-w-0 flex-1"><strong className="block truncate">{m.customer_name}</strong><span className="text-xs text-muted-foreground">{m.courts?.name} · {DAYS[m.monthly_weekday]} {m.start_time.slice(0,5)}</span></span></label>)}</div>}
      </CardContent></Card>
      <div className="space-y-6"><Card className={winner?"border-primary shadow-lg":""}><CardHeader><CardTitle className="flex items-center gap-2"><Dices/> Realizar sorteio</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="prize">Prêmio</Label><Input id="prize" value={prize} maxLength={80} onChange={(e)=>setPrize(e.target.value)}/></div><div className="flex min-h-32 items-center justify-center rounded-md bg-secondary p-5 text-center"><div>{running?<><p className="text-sm text-muted-foreground">Sorteando...</p><p className="mt-2 text-2xl font-extrabold text-primary">{rollingName}</p></>:winner?<><Trophy className="mx-auto mb-2 h-9 w-9 text-accent"/><p className="text-sm font-semibold uppercase text-muted-foreground">Ganhador</p><p className="mt-1 text-2xl font-extrabold text-primary">{winner.name}</p><p className="text-sm text-muted-foreground">{winner.detail}</p></>:<><p className="font-semibold">Tudo pronto?</p><p className="text-sm text-muted-foreground">O resultado ficará salvo no histórico.</p></>}</div></div><Button className="w-full" size="lg" disabled={running||selected.length<2||prize.trim().length<2} onClick={draw}><Dices/>{running?"Sorteando...":"Sortear agora"}</Button>{winner&&<Button variant="outline" className="w-full" onClick={copyResult}>{copied?<CheckCheck/>:<Clipboard/>}{copied?"Copiado":"Copiar resultado"}</Button>}{message&&<p className="text-sm text-destructive">{message}</p>}</CardContent></Card></div>
    </div>
    <section className="mt-8"><h2 className="mb-4 text-xl font-bold">Histórico</h2>{historyQ.isLoading?<p>Carregando...</p>:!historyQ.data?.length?<p className="text-sm text-muted-foreground">Nenhum sorteio realizado ainda.</p>:<div className="grid gap-3 md:grid-cols-2">{historyQ.data.map((r:any)=><Card key={r.id}><CardContent className="flex items-center gap-4 p-4"><div className="rounded-md bg-secondary p-3"><Trophy className="text-primary"/></div><div className="min-w-0"><p className="text-xs text-muted-foreground">{new Date(`${r.raffle_date}T12:00:00`).toLocaleDateString("pt-BR")} · {r.entries_count} participantes</p><p className="font-bold">{r.prize}</p><p className="truncate text-sm">Ganhador: {r.winner_name}</p></div></CardContent></Card>)}</div>}</section>
  </AdminShell>;
}
