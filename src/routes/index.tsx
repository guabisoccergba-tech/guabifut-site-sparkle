import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { WHATSAPP_RESERVE_LINK } from "@/lib/constants";
import heroImg from "@/assets/hero-campo.jpg";
import campoImg from "@/assets/hero-campo.jpg";
import gourmetImg from "@/assets/espaco-gourmet.jpg";
import quadraImg from "@/assets/quadra-poliesportiva.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GuabiSoccer | Campo Society e Espaço para Festas em Guabiruba-SC" },
      { name: "description", content: "Campo society, quadra poliesportiva e espaço gourmet para festas em Guabiruba-SC. Reserve seu horário ou evento pelo WhatsApp. Próximo a Brusque e Blumenau." },
      { property: "og:title", content: "GuabiSoccer | Campo Society e Festas em Guabiruba-SC" },
      { property: "og:description", content: "Reserve seu campo ou espaço de festa em Guabiruba. Campo society, quadra poliesportiva e área gourmet." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Campo society GuabiSoccer Guabiruba SC"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            O melhor complexo esportivo de Guabiruba
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
            Campo society, quadra poliesportiva e espaço gourmet para festas. Reserve agora!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="lg" className="text-base">Reservar horário</Button>
            </a>
            <Link to="/estrutura">
              <Button variant="heroOutline" size="lg" className="text-base">Conheça o espaço</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: "⚽", title: "Campo Society", desc: "Gramado sintético de alta qualidade para jogos, peladas e campeonatos", img: campoImg, alt: "Campo society GuabiSoccer" },
            { icon: "🎉", title: "Espaço de Festas", desc: "Área gourmet com churrasqueira para aniversários, formaturas e confraternizações", img: gourmetImg, alt: "Espaço gourmet GuabiSoccer" },
            { icon: "🏐", title: "Quadra Poliesportiva", desc: "Quadra coberta para futsal, vôlei e muito mais", img: quadraImg, alt: "Quadra poliesportiva GuabiSoccer" },
          ].map((c) => (
            <div key={c.title} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
              <div className="aspect-video overflow-hidden">
                <img src={c.img} alt={c.alt} loading="lazy" width={800} height={450} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="text-3xl">{c.icon}</div>
                <h3 className="mt-2 text-xl font-bold text-card-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por que escolher */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-secondary-foreground">Por que escolher a GuabiSoccer?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "📍", text: "Localização central em Guabiruba" },
              { icon: "🌿", text: "Gramado sintético profissional" },
              { icon: "🅿️", text: "Estacionamento gratuito" },
              { icon: "🚿", text: "Vestiários completos" },
              { icon: "👥", text: "Espaço para todos os tamanhos de grupo" },
              { icon: "💬", text: "Atendimento rápido via WhatsApp" },
            ].map((i) => (
              <div key={i.text} className="flex items-start gap-4 rounded-lg bg-card p-5 shadow-sm">
                <span className="text-2xl">{i.icon}</span>
                <p className="text-sm font-medium text-card-foreground">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Nosso Espaço</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[campoImg, gourmetImg, quadraImg, campoImg, gourmetImg, quadraImg].map((src, i) => (
            <div key={i} className="aspect-video overflow-hidden rounded-lg">
              <img src={src} alt={`GuabiSoccer Guabiruba foto ${i + 1}`} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold text-primary-foreground">Pronto para reservar?</h2>
          <p className="mt-3 text-primary-foreground/80">Entre em contato pelo WhatsApp e garanta seu horário!</p>
          <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
            <Button variant="whatsapp" size="lg" className="text-base">Reservar pelo WhatsApp</Button>
          </a>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsActivityLocation",
            name: "GuabiSoccer",
            description: "Campo society, quadra poliesportiva e espaço gourmet para festas em Guabiruba-SC.",
            url: "https://www.guabisoccer.com.br",
            telephone: "+55-47-XXXXX-XXXX",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rua Brusque, 885",
              addressLocality: "Guabiruba",
              addressRegion: "SC",
              postalCode: "88360-000",
              addressCountry: "BR",
            },
            geo: { "@type": "GeoCoordinates", latitude: -27.0758, longitude: -48.9786 },
            openingHoursSpecification: [
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "17:30", closes: "22:30" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "10:30" },
              
            ],
            sameAs: ["https://www.instagram.com/guabisoccer/", "https://www.facebook.com/guabisoccer"],
          }),
        }}
      />
    </SiteLayout>
  );
}
