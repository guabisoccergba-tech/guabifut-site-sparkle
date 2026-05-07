import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { WHATSAPP_EVENT_LINK } from "@/lib/constants";
import gourmetImg from "@/assets/espaco-gourmet.jpg";
import campoImg from "@/assets/hero-campo.jpg";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Festas e Eventos em Guabiruba-SC | GuabiSoccer" },
      { name: "description", content: "O espaço ideal para festas de aniversário, confraternizações, formaturas e eventos corporativos em Guabiruba-SC. Solicite um orçamento!" },
    ],
  }),
  component: EventosPage,
});

function EventosPage() {
  const eventTypes = [
    { icon: "🎂", title: "Festas de aniversário", desc: "Comemore com espaço, churrasco e campo" },
    { icon: "🏢", title: "Confraternizações de empresa", desc: "Integre sua equipe com esporte e lazer" },
    { icon: "🎓", title: "Formaturas e colação", desc: "Celebre com seus colegas em grande estilo" },
    { icon: "👨‍👩‍👧", title: "Reuniões de família", desc: "Espaço amplo para toda a família" },
    { icon: "⚽", title: "Campeonatos e torneios", desc: "Organize seu campeonato na melhor estrutura" },
    { icon: "🍖", title: "Churrascos e happy hour", desc: "Área gourmet completa para seu churrasco" },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h1 className="text-4xl font-extrabold text-foreground">Festas e Eventos</h1>
        <p className="mt-2 text-lg text-muted-foreground">O espaço ideal para o seu evento em Guabiruba</p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((e) => (
            <div key={e.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <span className="text-3xl">{e.icon}</span>
              <h3 className="mt-3 font-bold text-card-foreground">{e.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que está incluído */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-secondary-foreground">O que está incluído</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Área gourmet", "Churrasqueiras", "Mesas e cadeiras", "Estacionamento", "Campo para atividades", "Vestiários"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm">
                <span className="text-lg text-primary">✓</span>
                <p className="text-sm font-medium text-card-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Galeria de Eventos</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[gourmetImg, campoImg, gourmetImg, campoImg, gourmetImg, campoImg].map((src, i) => (
            <div key={i} className="aspect-video overflow-hidden rounded-lg">
              <img src={src} alt={`Evento GuabiSoccer foto ${i + 1}`} loading="lazy" width={800} height={600} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground">Solicite um orçamento sem compromisso</h2>
        <a href={WHATSAPP_EVENT_LINK} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button variant="whatsapp" size="lg">Solicitar orçamento via WhatsApp</Button>
        </a>
      </section>
    </SiteLayout>
  );
}
