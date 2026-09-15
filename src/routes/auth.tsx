import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito | GuabiSoccer" },
      { name: "description", content: "Área de acesso da administração da GuabiSoccer." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso restrito | GuabiSoccer" },
      { property: "og:description", content: "Área de acesso da administração da GuabiSoccer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await supabase.rpc("claim_initial_admin");
        navigate({ to: "/admin/sorteio" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/sorteio` },
        });
        if (error) throw error;
        if (data.session) {
          await supabase.rpc("claim_initial_admin");
          navigate({ to: "/admin/sorteio" });
        } else {
          setMessage("Conta criada. Se pedir confirmação, verifique seu e-mail e depois entre.");
        }
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">Acesso restrito</h1>
        <p className="mt-1 text-sm text-muted-foreground">Área da administração GuabiSoccer.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}

        <button
          type="button"
          className="mt-4 text-sm text-primary underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
        </button>
      </div>
    </main>
  );
}
