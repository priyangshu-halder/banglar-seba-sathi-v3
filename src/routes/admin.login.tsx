import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminLogin } from "@/lib/admin.functions";
import { Shield, KeyRound, LogIn, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const login = useServerFn(adminLogin);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await login({ data: { id, password: pw } });
    setBusy(false);
    if (res.ok) navigate({ to: "/admin" });
    else setErr(res.error || "Login failed");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto w-full max-w-md px-5 pt-6">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md px-5 pt-10">
        <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-6 shadow-lift mb-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <p className="text-xs opacity-90 mt-1">BanglaSathi internal access only</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unique ID</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              autoComplete="username"
              className="mt-1 w-full h-12 rounded-2xl border-2 border-input bg-card px-4 text-sm font-semibold focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</span>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                type="password"
                autoComplete="current-password"
                className="w-full h-12 rounded-2xl border-2 border-input bg-card pl-10 pr-4 text-sm font-semibold focus:border-primary focus:outline-none"
              />
            </div>
          </label>
          {err && <p className="text-sm font-semibold text-destructive">{err}</p>}
          <button
            disabled={busy}
            className="w-full h-14 rounded-2xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lift disabled:opacity-60"
          >
            <LogIn className="h-5 w-5" /> {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-[11px] text-muted-foreground text-center mt-6">
          Only authorised personnel. Default ID & password were shared privately.
        </p>
      </div>
    </div>
  );
}
