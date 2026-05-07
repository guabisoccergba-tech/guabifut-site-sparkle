import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import gourmetImg from "@/assets/espaco-gourmet.jpg";
import campoImg from "@/assets/hero-campo.jpg";
import quadraImg from "@/assets/quadra-poliesportiva.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a GuabiSoccer | Complexo Esportivo em Guabiruba-SC" },
      { name: "description", content: "Conheça a história da GuabiSoccer, complexo esportivo no centro de Guabiruba-SC, com campo society, quadra poliesportiva e espaço gourmet." },
      { property: "og:title", content: "Sobre a GuabiSoccer | Complexo Esportivo em Guabiruba-SC" },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-20">
        <h1 className="text-4xl font-extrabold text-foreground">Sobre a GuabiSoccer</h1>
        <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
          <p>A GuabiSoccer nasceu em Guabiruba-SC com o objetivo de oferecer um espaço de lazer, esporte e convivência para toda a comunidade do Vale do Itajaí. Fundada em 2017, nossa estrutura reúne campo society sintético, quadra poliesportiva e área gourmet, tudo pensado para proporcionar a melhor experiência para jogadores, famílias e empresas.</p>
          <p>Estamos localizados na Rua Brusque, 885, no Centro de Guabiruba, de fácil acesso para quem vem de Brusque, Blumenau, Botuverá e municípios vizinhos. Nosso compromisso é com a qualidade do espaço, a segurança dos nossos clientes e o atendimento ágil.</p>
          <p>Seja para a pelada de final de semana com os amigos, um campeonato entre empresas, uma festa de aniversário inesquecível ou uma confraternização em família — a GuabiSoccer tem tudo que você precisa.</p>
        </div>
      </section>

      {/* Fotos */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { src: campoImg, caption: "Fachada da GuabiSoccer" },
            { src: gourmetImg, caption: "Área gourmet" },
            { src: quadraImg, caption: "Vista geral do complexo" },
            { src: gourmetImg, caption: "Espaço para eventos" },
          ].map((p, i) => (
            <figure key={i} className="overflow-hidden rounded-lg">
              <img src={p.src} alt={`${p.caption} GuabiSoccer Guabiruba`} loading="lazy" width={800} height={600} className="aspect-video w-full object-cover" />
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Missão Visão Valores */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Missão", text: "Oferecer um espaço esportivo e de eventos de qualidade para a comunidade de Guabiruba e região." },
              { title: "Visão", text: "Ser referência em lazer esportivo no Vale do Itajaí." },
              { title: "Valores", text: "Qualidade, respeito, diversão e comunidade." },
            ].map((v) => (
              <div key={v.title} className="rounded-xl bg-card p-6 text-center shadow-sm">
                <h3 className="text-lg font-bold text-primary">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
