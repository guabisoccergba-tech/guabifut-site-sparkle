import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { WHATSAPP_RESERVE_LINK } from "@/lib/constants";
import campoImg from "@/assets/hero-campo.jpg";
import quadraImg from "@/assets/quadra-poliesportiva.jpg";
import galeria1 from "@/assets/jogos-galeria-1.jpg";
import galeria2 from "@/assets/jogos-galeria-2.jpg";
import galeria3 from "@/assets/jogos-galeria-3.jpg";
import galeria4 from "@/assets/jogos-galeria-4.jpg";
import galeria5 from "@/assets/jogos-galeria-5.jpg";
import galeria6 from "@/assets/jogos-galeria-6.jpg";

export const Route = createFileRoute("/jogos")({
  head: () => ({
    meta: [
      { title: "Locação de Campo Society em Guabiruba | GuabiSoccer" },
      { name: "description", content: "Reserve seu horário e jogue no melhor campo society de Guabiruba. Pelada avulsa, mensalidade, torneios e campeonatos na GuabiSoccer." },
    ],
  }),
  component: JogosPage,
});

function JogosPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h1 className="text-4xl font-extrabold text-foreground">Locação de Campo e Quadra</h1>
        <p className="mt-2 text-lg text-muted-foreground">Reserve seu horário e jogue no melhor campo society de Guabiruba</p>

        {/* Modalidades */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {["Pelada avulsa", "Mensalidade", "Torneio", "Campeonato", "Treinamento de equipe"].map((m) => (
            <div key={m} className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <span className="text-3xl">⚽</span>
              <h3 className="mt-3 text-sm font-bold text-card-foreground">{m}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Como reservar */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-secondary-foreground">Como reservar</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Escolha seu horário", desc: "Verifique a disponibilidade pelo WhatsApp" },
              { step: "2", title: "Entre em contato", desc: "Envie uma mensagem pelo WhatsApp" },
              { step: "3", title: "Confirme e jogue!", desc: "Pague no local ou via PIX e venha jogar" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">{s.step}</div>
                <h3 className="mt-4 font-bold text-secondary-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Galeria de Jogos</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[galeria1, galeria2, galeria3, galeria4, galeria5, galeria6].map((src, i) => (
            <figure key={i} className="overflow-hidden rounded-lg">
              <img src={src} alt={`Jogo na GuabiSoccer foto ${i + 1}`} loading="lazy" width={800} height={600} className="aspect-video w-full object-cover" />
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground">Quer reservar um horário?</h2>
        <p className="mt-2 text-primary-foreground/80">Seg–Sex: 08h–23h | Sáb: 08h–23h | Dom: 08h–22h</p>
        <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button variant="whatsapp" size="lg">Reservar pelo WhatsApp</Button>
        </a>
      </section>
    </SiteLayout>
  );
}
