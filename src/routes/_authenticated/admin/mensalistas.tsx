import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminDeleteMonthly, adminListMonthly, adminSaveMonthly } from "@/lib/raffle.functions";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
type FormState = { id?: string; customer_name: string; customer_phone: string; court_id: string; monthly_weekday: number; start_time: string; monthly_active: boolean };
const EMPTY: FormState = { customer_name: "", customer_phone: "", court_id: "", monthly_weekday: 1, start_time: "17:30", monthly_active: true };

export const Route = createFileRoute("/_authenticated/admin/mensalistas")({
  head: () => ({ meta: [
    { title: "Mensalistas | GuabiSoccer" },
    { name: "description", content: "Cadastro administrativo de horários mensais da GuabiSoccer." },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: "Mensalistas | GuabiSoccer" },
    { property: "og:description", content: "Cadastro administrativo de horários mensais da GuabiSoccer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: MonthlyPage,
});

function MonthlyPage() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminListMonthly);
  const saveFn = useServerFn(adminSaveMonthly);
  const deleteFn = useServerFn(adminDeleteMonthly);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-monthly"], queryFn: () => listFn() });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMessage(null);
    try {
      await saveFn({ data: form });
      setForm(EMPTY);
      await queryClient.invalidateQueries({ queryKey: ["admin-monthly"] });
      setMessage("Mensalista salvo.");
    } catch (err: any) { setMessage(err?.message ?? "Não foi possível salvar."); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este mensalista?")) return;
    await deleteFn({ data: { id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-monthly"] });
  }

  return <AdminShell>
    <div className="mb-6"><h1 className="text-3xl font-extrabold">Mensalistas</h1><p className="mt-1 text-muted-foreground">Cadastre os horários fixos que participarão dos sorteios.</p></div>
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card><CardHeader><CardTitle>{form.id ? "Editar mensalista" : "Novo mensalista"}</CardTitle></CardHeader><CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2"><Label htmlFor="team">Nome do time ou responsável</Label><Input id="team" required value={form.customer_name} onChange={(e) => setForm({...form, customer_name:e.target.value})}/></div>
          <div className="space-y-2"><Label htmlFor="phone">WhatsApp</Label><Input id="phone" required value={form.customer_phone} onChange={(e) => setForm({...form, customer_phone:e.target.value})}/></div>
          <div className="space-y-2"><Label>Quadra</Label><Select value={form.court_id} onValueChange={(v) => setForm({...form,court_id:v})}><SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger><SelectContent>{data?.courts.map((c:any)=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Dia fixo</Label><Select value={String(form.monthly_weekday)} onValueChange={(v)=>setForm({...form,monthly_weekday:Number(v)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{DAYS.map((d,i)=><SelectItem key={d} value={String(i)}>{d}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="time">Horário</Label><Input id="time" type="time" required value={form.start_time} onChange={(e)=>setForm({...form,start_time:e.target.value})}/></div>
          <label className="flex items-center gap-2 text-sm font-medium"><Checkbox checked={form.monthly_active} onCheckedChange={(v)=>setForm({...form,monthly_active:v===true})}/> Mensalista ativo</label>
          <div className="flex gap-2"><Button type="submit" className="flex-1" disabled={saving || !form.court_id}>{saving?"Salvando...":"Salvar"}</Button>{form.id&&<Button type="button" variant="outline" onClick={()=>setForm(EMPTY)}>Cancelar</Button>}</div>
          {message&&<p className="text-sm text-muted-foreground">{message}</p>}
        </form>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4"/> Horários cadastrados</CardTitle></CardHeader><CardContent>
        {isLoading ? <p className="text-muted-foreground">Carregando...</p> : error ? <p className="text-destructive">Não foi possível carregar.</p> : !data?.monthly.length ? <div className="py-12 text-center text-muted-foreground"><p>Nenhum mensalista cadastrado.</p><p className="text-sm">Use o formulário para adicionar o primeiro.</p></div> :
        <Table><TableHeader><TableRow><TableHead>Mensalista</TableHead><TableHead>Horário</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{data.monthly.map((m:any)=><TableRow key={m.id}><TableCell><strong>{m.customer_name}</strong><div className="text-xs text-muted-foreground">{m.courts?.name} · {m.customer_phone}</div></TableCell><TableCell>{DAYS[m.monthly_weekday]} · {m.start_time.slice(0,5)}</TableCell><TableCell>{m.monthly_active?"Ativo":"Inativo"}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" title="Editar" onClick={()=>setForm({id:m.id,customer_name:m.customer_name,customer_phone:m.customer_phone,court_id:m.court_id,monthly_weekday:m.monthly_weekday,start_time:m.start_time.slice(0,5),monthly_active:m.monthly_active})}><Pencil/></Button><Button variant="ghost" size="icon" title="Excluir" onClick={()=>remove(m.id)}><Trash2/></Button></TableCell></TableRow>)}</TableBody></Table>}
      </CardContent></Card>
    </div>
  </AdminShell>;
}
