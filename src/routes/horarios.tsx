import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { WHATSAPP_RESERVE_LINK } from "@/lib/constants";

export const Route = createFileRoute("/horarios")({
  head: () => ({
    meta: [
      { title: "Horários e Reservas | GuabiSoccer Guabiruba" },
      { name: "description", content: "Consulte os horários de funcionamento e reserve seu campo ou espaço na GuabiSoccer. Atendimento via WhatsApp." },
    ],
  }),
  component: HorariosPage,
});

function HorariosPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-20">
        <h1 className="text-4xl font-extrabold text-foreground">Horários e Reservas</h1>
        <p className="mt-2 text-lg text-muted-foreground">Consulte a disponibilidade e reserve seu horário agora</p>

        {/* Tabela */}
        <div className="mt-12 overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dia</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Abertura</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Fechamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { day: "Segunda a Sexta", open: "17:30", close: "22:30 (último horário)" },
                { day: "Sábado", open: "08:00", close: "10:30 (último horário)" },
                { day: "Domingo", open: "-", close: "FECHADO" },
                
              ].map((r) => (
                <tr key={r.day} className="bg-card">
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{r.day}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.open}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground italic">* Horários especiais para eventos — consulte disponibilidade</p>
      </section>

      {/* Tipos de locação */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-secondary-foreground">Tipos de Locação</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Avulso por hora", desc: "Ideal para peladas e jogos esporádicos. Reserve o horário que preferir.", icon: "⏱️" },
              { title: "Mensalidade", desc: "Horário fixo semanal com desconto. Perfeito para times regulares.", icon: "📅" },
              { title: "Pacote para evento", desc: "Inclui campo, área gourmet e churrasqueira. Solicite orçamento.", icon: "🎉" },
            ].map((t) => (
              <div key={t.title} className="rounded-xl bg-card p-6 text-center shadow-sm">
                <span className="text-3xl">{t.icon}</span>
                <h3 className="mt-3 font-bold text-card-foreground">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Política */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Política de Reserva</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: "💬", text: "Reserva confirmada via WhatsApp" },
            { icon: "🕐", text: "Cancelamento com 24h de antecedência" },
            { icon: "💳", text: "Pagamento no local ou via PIX" },
            { icon: "📋", text: "Horários sujeitos a disponibilidade" },
          ].map((p) => (
            <div key={p.text} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <span className="text-xl">{p.icon}</span>
              <p className="text-sm text-card-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground">Verificar horários disponíveis</h2>
        <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button variant="whatsapp" size="lg">Consultar via WhatsApp</Button>
        </a>
      </section>
    </SiteLayout>
  );
}
