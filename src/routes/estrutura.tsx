import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import campoImg from "@/assets/hero-campo.jpg";
import quadraImg from "@/assets/quadra-poliesportiva.jpg";
import gourmetImg from "@/assets/espaco-gourmet.jpg";

export const Route = createFileRoute("/estrutura")({
  head: () => ({
    meta: [
      { title: "Nossa Estrutura | Campo, Quadra e Área Gourmet — GuabiSoccer" },
      { name: "description", content: "Conheça a estrutura da GuabiSoccer: campo society sintético, quadra poliesportiva coberta, área gourmet com churrasqueira, vestiários e estacionamento." },
    ],
  }),
  component: EstruturaPage,
});

function EstruturaPage() {
  const spaces = [
    {
      title: "Campo Society",
      img: campoImg,
      alt: "Campo society GuabiSoccer Guabiruba",
      desc: "Campo com gramado sintético de alta qualidade, medidas oficiais para Fut-7, iluminação noturna para jogos à noite e gradil de segurança ao redor. Ideal para peladas, campeonatos e treinamentos.",
      tags: ["Gramado sintético", "Iluminação noturna", "Fut-7", "Vestiários"],
    },
    {
      title: "Quadra Poliesportiva",
      img: quadraImg,
      alt: "Quadra poliesportiva GuabiSoccer Guabiruba",
      desc: "Quadra coberta com piso emborrachado, adaptada para futsal, vôlei, basquete e outras modalidades. Disponível para locação avulsa ou mensalidade.",
      tags: ["Coberta", "Piso emborrachado", "Multimodal", "Iluminação LED"],
    },
    {
      title: "Quadra de Areia",
      img: gourmetImg,
      alt: "Espaço gourmet GuabiSoccer Guabiruba",
      desc: "Quadra de areia para Beach Tennis, futevôlei e vôlei de praia. Estrutura completa para lazer e prática esportiva ao ar livre.",
      tags: ["Beach Tennis", "Futevôlei", "Vôlei de praia", "Iluminação"],
    },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h1 className="text-4xl font-extrabold text-foreground">Nossa Estrutura</h1>
        <p className="mt-2 text-lg text-muted-foreground">Conheça cada espaço da GuabiSoccer</p>

        <div className="mt-16 space-y-20">
          {spaces.map((s, i) => (
            <div key={s.title} className={`flex flex-col gap-8 md:flex-row ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
              <div className="flex-1 overflow-hidden rounded-xl">
                <img src={s.img} alt={s.alt} loading="lazy" width={800} height={600} className="aspect-video w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <h2 className="text-2xl font-bold text-foreground">{s.title}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Estrutura Geral */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-secondary-foreground">Estrutura Geral</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🚿", text: "Vestiários masculino e feminino" },
              { icon: "🅿️", text: "Estacionamento gratuito" },
              { icon: "💡", text: "Iluminação em todo o complexo" },
              { icon: "🚻", text: "Banheiros" },
              { icon: "👶", text: "Área kids" },
            ].map((i) => (
              <div key={i.text} className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm">
                <span className="text-xl">{i.icon}</span>
                <p className="text-sm font-medium text-card-foreground">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Galeria</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[campoImg, quadraImg, gourmetImg, campoImg, quadraImg, gourmetImg, campoImg, quadraImg, gourmetImg].map((src, i) => (
            <div key={i} className="aspect-video overflow-hidden rounded-lg">
              <img src={src} alt={`Estrutura GuabiSoccer Guabiruba foto ${i + 1}`} loading="lazy" width={800} height={600} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
