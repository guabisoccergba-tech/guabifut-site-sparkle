import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_RESERVE_LINK } from "@/lib/constants";
import logoImg from "@/assets/logo-guabisoccer.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/estrutura", label: "Estrutura" },
  { to: "/jogos", label: "Jogos" },
  { to: "/eventos", label: "Eventos" },
  { to: "/horarios", label: "Horários" },
  { to: "/resenha", label: "Resenha" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="GuabiSoccer logo" width={36} height={36} />
          <span className="text-xl font-bold text-primary">GuabiSoccer</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm">
              Reservar via WhatsApp
            </Button>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span className={`h-0.5 w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === l.to ? "bg-secondary text-primary" : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a href={WHATSAPP_RESERVE_LINK} target="_blank" rel="noopener noreferrer" className="mt-2">
              <Button variant="whatsapp" className="w-full">Reservar via WhatsApp</Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
