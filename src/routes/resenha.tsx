import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { WHATSAPP_RESERVE_LINK } from "@/lib/constants";
import g1 from "@/assets/resenha-galeria-1.jpg";
import g2 from "@/assets/resenha-galeria-2.jpg";
import g3 from "@/assets/resenha-galeria-3.jpg";
import g4 from "@/assets/resenha-galeria-4.jpg";
import g5 from "@/assets/resenha-galeria-5.jpg";
import g6 from "@/assets/resenha-galeria-6.jpg";
import g7 from "@/assets/resenha-galeria-7.jpg";
import g8 from "@/assets/resenha-galeria-8.jpg";

export const Route = createFileRoute("/resenha")({
  head: () => ({
    meta: [
      { title: "Avaliações e Depoimentos | GuabiSoccer Guabiruba-SC" },
      { name: "description", content: "Veja o que nossos clientes dizem sobre a GuabiSoccer. Avaliações, depoimentos e momentos no melhor complexo esportivo de Guabiruba." },
    ],
  }),
  component: ResenhaPage,
});

function ResenhaPage() {
  const depoimentos = [
    { name: "Lucas M.", city: "Guabiruba", text: "Melhor campo da região! Gramado impecável e estrutura top. Recomendo demais!" },
    { name: "Fernanda S.", city: "Brusque", text: "Fizemos a festa de aniversário do meu filho aqui. Espaço incrível, todos amaram!" },
    { name: "Rafael C.", city: "Blumenau", text: "Jogamos toda semana na GuabiSoccer. Atendimento rápido e campo sempre bem cuidado." },
    { name: "Juliana P.", city: "Guabiruba", text: "O espaço gourmet é perfeito para confraternizações. Já fizemos duas festas aqui!" },
    { name: "Marcos T.", city: "Botuverá", text: "Campeonato muito bem organizado. Estrutura completa com vestiários e tudo mais." },
    { name: "Ana L.", city: "Brusque", text: "Lugar lindo, bem cuidado e com ótima localização. Voltaremos com certeza!" },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h1 className="text-4xl font-extrabold text-foreground">Resenha GuabiSoccer</h1>
        <p className="mt-2 text-lg text-muted-foreground">O que nossos clientes dizem sobre a gente</p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {depoimentos.map((d, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.city}</p>
                </div>
              </div>
              <div className="mt-3 text-amber">★★★★★</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">"{d.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Avaliação Google */}
      <section className="bg-secondary py-12 text-center">
        <div className="mx-auto max-w-xl px-4">
          <p className="text-lg font-semibold text-secondary-foreground">⭐ Avalie-nos no Google</p>
          <p className="mt-2 text-sm text-muted-foreground">Sua opinião é muito importante para nós!</p>
          <a href="https://search.google.com/local/writereview?placeid=INSERIR_PLACE_ID" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
            <Button variant="default" size="lg">Avaliar no Google</Button>
          </a>
        </div>
      </section>

      {/* Galeria de momentos */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Galeria de Momentos</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {[g1, g2, g3, g4, g5, g6, g7, g8].map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg">
              <img src={src} alt={`Momento GuabiSoccer foto ${i + 1}`} loading="lazy" width={400} height={400} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground">Venha fazer sua resenha aqui também!</h2>
        <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button variant="whatsapp" size="lg">Reservar pelo WhatsApp</Button>
        </a>
      </section>
    </SiteLayout>
  );
}
