import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, LogOut, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/admin/sorteio" className="font-extrabold text-primary">GuabiSoccer Admin</Link>
          <nav className="flex items-center gap-1" aria-label="Administração">
            <Button variant="ghost" size="sm" asChild><Link to="/admin/mensalistas"><CalendarDays /> Mensalistas</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link to="/admin/sorteio"><Trophy /> Sorteio</Link></Button>
            <Button variant="ghost" size="icon" title="Sair" aria-label="Sair" onClick={signOut}><LogOut /></Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
