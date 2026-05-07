import { Link } from "@tanstack/react-router";
import { WHATSAPP_LINK, INSTAGRAM_LINK, FACEBOOK_LINK, ADDRESS, CNPJ } from "@/lib/constants";
import logoImg from "@/assets/logo-guabisoccer.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="GuabiSoccer" width={32} height={32} className="brightness-200" />
            <span className="text-lg font-bold">GuabiSoccer</span>
          </div>
          <p className="text-sm text-primary-foreground/80">Seu campo. Sua festa. Seu espaço.</p>
          <div className="flex gap-3">
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href={FACEBOOK_LINK} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">Links</h3>
          <nav className="flex flex-col gap-2 text-sm text-primary-foreground/80">
            <Link to="/" className="hover:text-primary-foreground">Home</Link>
            <Link to="/sobre" className="hover:text-primary-foreground">Sobre</Link>
            <Link to="/estrutura" className="hover:text-primary-foreground">Estrutura</Link>
            <Link to="/jogos" className="hover:text-primary-foreground">Jogos</Link>
            <Link to="/eventos" className="hover:text-primary-foreground">Eventos</Link>
            <Link to="/horarios" className="hover:text-primary-foreground">Horários</Link>
            <Link to="/resenha" className="hover:text-primary-foreground">Resenha</Link>
          </nav>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">Contato</h3>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
            <p>{ADDRESS}</p>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground">
              WhatsApp: [INSERIR NÚMERO]
            </a>
            <p>Seg–Sex: 17:30 - 22:30 (último horário para reserva)</p>
            <p>Sábado: 08:00–23:00</p>
            
          </div>
        </div>

        {/* Col 4 - Map */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">Localização</h3>
          <div className="overflow-hidden rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.5!2d-48.9786!3d-27.0758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDA0JzMyLjkiUyA0OMKwNTgnNDMuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização GuabiSoccer"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © 2025 GuabiSoccer | CNPJ {CNPJ} | Guabiruba-SC
      </div>
    </footer>
  );
}
