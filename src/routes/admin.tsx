import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getAdminSession,
  adminLogout,
  saveUpdate,
  deleteUpdate,
  fetchYoutubeMeta,
  saveBenefit,
  deleteBenefit,
  saveService,
  deleteService,
  listReports,
  updateReportStatus,
  changeAdminPassword,
} from "@/lib/admin.functions";
import { listUpdates, listBenefits, listServices } from "@/lib/content.functions";
import {
  Shield, LogOut, Megaphone, Gift, Building2, Inbox, KeyRound,
  Plus, Trash2, Save, X, Youtube, Loader2, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminDashboard,
});

type Tab = "updates" | "benefits" | "services" | "reports" | "settings";

function AdminDashboard() {
  const getSess = useServerFn(getAdminSession);
  const logout = useServerFn(adminLogout);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("updates");

  useEffect(() => {
    getSess().then((s) => {
      if (!s.admin_id) navigate({ to: "/admin/login" });
      else setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="bg-gradient-hero text-primary-foreground px-5 pt-6 pb-8 rounded-b-[2rem] shadow-lift">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Console</h1>
              <p className="text-xs opacity-90">BanglaSathi control panel</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); navigate({ to: "/" }); }}
            className="h-10 px-3 rounded-xl bg-white/20 backdrop-blur text-sm font-semibold flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <nav className="mx-auto max-w-3xl px-5 mt-4 flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "updates", label: "Updates", icon: Megaphone },
          { id: "benefits", label: "Benefits", icon: Gift },
          { id: "services", label: "Services", icon: Building2 },
          { id: "reports", label: "Reports", icon: Inbox },
          { id: "settings", label: "Password", icon: KeyRound },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === (t.id as Tab);
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`shrink-0 flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </nav>

      <main className="mx-auto max-w-3xl px-5 pt-4">
        {tab === "updates" && <UpdatesTab />}
        {tab === "benefits" && <BenefitsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "reports" && <ReportsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>

      <div className="mx-auto max-w-3xl px-5 mt-6 text-center">
        <Link to="/" className="text-xs font-semibold text-muted-foreground">← Back to app</Link>
      </div>
    </div>
  );
}

// ---------------- Updates ----------------
function UpdatesTab() {
  const list = useServerFn(listUpdates);
  const save = useServerFn(saveUpdate);
  const del = useServerFn(deleteUpdate);
  const fetchMeta = useServerFn(fetchYoutubeMeta);
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const { updates } = await list();
    setRows(updates);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  if (editing) {
    return (
      <UpdateForm
        initial={editing}
        onCancel={() => setEditing(null)}
        onSave={async (data: any) => { await save({ data }); setEditing(null); reload(); }}
        onFetchMeta={async (url: string) => fetchMeta({ data: { url } })}
      />
    );
  }

  return (
    <div className="space-y-3">
      <button onClick={() => setEditing(blankUpdate())} className="w-full h-12 rounded-2xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-soft">
        <Plus className="h-5 w-5" /> Add Update / Video
      </button>
      {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : rows.map((r) => (
        <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{r.title}</p>
            <p className="text-xs text-muted-foreground truncate">{r.tag} {r.has_video && "· 🎥"}</p>
          </div>
          <button onClick={() => setEditing(r)} className="text-xs font-bold text-primary px-3 h-9 rounded-lg bg-primary/10">Edit</button>
          <button onClick={async () => { if (confirm("Delete?")) { await del({ data: { id: r.id } }); reload(); }}} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function blankUpdate() {
  return {
    title: "", bn: "", tag: "Announcement", tone: "bg-gradient-hero",
    description: "", youtube_url: "", has_video: false,
    online_label: "", online_url: "",
    offline_where: "", offline_steps: [], offline_docs: [],
    helpline: "", sort_order: 0,
  };
}

function UpdateForm({ initial, onCancel, onSave, onFetchMeta }: any) {
  const [f, setF] = useState<any>(initial);
  const [fetching, setFetching] = useState(false);

  async function pullYT() {
    if (!f.youtube_url) return;
    setFetching(true);
    const r = await onFetchMeta(f.youtube_url);
    setFetching(false);
    if (r.ok) setF({ ...f, title: f.title || r.title, has_video: true });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...f,
      youtube_url: f.youtube_url || null,
      online_label: f.online_label || null,
      online_url: f.online_url || null,
      offline_where: f.offline_where || null,
      helpline: f.helpline || null,
      offline_steps: arr(f.offline_steps),
      offline_docs: arr(f.offline_docs),
      sort_order: Number(f.sort_order) || 0,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-card border border-border rounded-2xl p-4">
      <Field label="YouTube URL (optional)">
        <div className="flex gap-2">
          <input className={inp} value={f.youtube_url || ""} onChange={(e) => setF({ ...f, youtube_url: e.target.value })} placeholder="https://youtu.be/..." />
          <button type="button" onClick={pullYT} disabled={fetching} className="h-11 px-3 rounded-xl bg-secondary font-semibold text-sm flex items-center gap-1">
            {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Youtube className="h-4 w-4" />} Fetch
          </button>
        </div>
      </Field>
      <Toggle label="Has video" value={f.has_video} onChange={(v: boolean) => setF({ ...f, has_video: v })} />
      <Field label="Title"><input required className={inp} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
      <Field label="Bangla title"><input className={inp} value={f.bn} onChange={(e) => setF({ ...f, bn: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Tag"><input className={inp} value={f.tag} onChange={(e) => setF({ ...f, tag: e.target.value })} /></Field>
        <Field label="Sort order"><input type="number" className={inp} value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} /></Field>
      </div>
      <Field label="Tone (gradient class)">
        <select className={inp} value={f.tone} onChange={(e) => setF({ ...f, tone: e.target.value })}>
          <option value="bg-gradient-hero">Hero (blue)</option>
          <option value="bg-gradient-warm">Warm (orange)</option>
          <option value="bg-gradient-info">Info (cyan)</option>
        </select>
      </Field>
      <Field label="Description"><textarea rows={4} className={inp} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <Field label="Online apply label"><input className={inp} value={f.online_label || ""} onChange={(e) => setF({ ...f, online_label: e.target.value })} /></Field>
      <Field label="Online apply URL"><input className={inp} value={f.online_url || ""} onChange={(e) => setF({ ...f, online_url: e.target.value })} /></Field>
      <Field label="Offline — where to go"><input className={inp} value={f.offline_where || ""} onChange={(e) => setF({ ...f, offline_where: e.target.value })} /></Field>
      <Field label="Offline steps (one per line)"><textarea rows={4} className={inp} value={Array.isArray(f.offline_steps) ? f.offline_steps.join("\n") : f.offline_steps} onChange={(e) => setF({ ...f, offline_steps: e.target.value.split("\n") })} /></Field>
      <Field label="Documents needed (one per line)"><textarea rows={3} className={inp} value={Array.isArray(f.offline_docs) ? f.offline_docs.join("\n") : f.offline_docs} onChange={(e) => setF({ ...f, offline_docs: e.target.value.split("\n") })} /></Field>
      <Field label="Helpline"><input className={inp} value={f.helpline || ""} onChange={(e) => setF({ ...f, helpline: e.target.value })} /></Field>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 h-12 rounded-xl bg-secondary font-bold flex items-center justify-center gap-2"><X className="h-4 w-4" /> Cancel</button>
        <button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center gap-2"><Save className="h-4 w-4" /> Save</button>
      </div>
    </form>
  );
}

// ---------------- Benefits ----------------
function BenefitsTab() {
  const list = useServerFn(listBenefits);
  const save = useServerFn(saveBenefit);
  const del = useServerFn(deleteBenefit);
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  async function reload() { setRows((await list()).benefits); }
  useEffect(() => { reload(); }, []);

  if (editing) {
    return <BenefitForm initial={editing} onCancel={() => setEditing(null)} onSave={async (d: any) => { await save({ data: d }); setEditing(null); reload(); }} />;
  }
  return (
    <div className="space-y-3">
      <button onClick={() => setEditing({ name: "", bn: "", category: "All", amount: "", eligibility: [], docs: [], process: "", apply_url: "", tone: "bg-rose-50 text-rose-600 border-rose-200", icon: "Gift" })} className="w-full h-12 rounded-2xl bg-gradient-warm text-primary-foreground font-bold flex items-center justify-center gap-2"><Plus className="h-5 w-5" /> Add Benefit</button>
      {rows.map((r) => (
        <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.category} · {r.amount}</p>
          </div>
          <button onClick={() => setEditing(r)} className="text-xs font-bold text-primary px-3 h-9 rounded-lg bg-primary/10">Edit</button>
          <button onClick={async () => { if (confirm("Delete?")) { await del({ data: { id: r.id } }); reload(); }}} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function BenefitForm({ initial, onCancel, onSave }: any) {
  const [f, setF] = useState<any>(initial);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...f, apply_url: f.apply_url || null, eligibility: arr(f.eligibility), docs: arr(f.docs) });
  }
  return (
    <form onSubmit={submit} className="space-y-3 bg-card border border-border rounded-2xl p-4">
      <Field label="Name"><input required className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Bangla"><input className={inp} value={f.bn} onChange={(e) => setF({ ...f, bn: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Category">
          <select className={inp} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            {["All","Women","Education","Student","Farmer","Senior"].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Amount"><input className={inp} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></Field>
      </div>
      <Field label="Eligibility (one per line)"><textarea rows={3} className={inp} value={Array.isArray(f.eligibility) ? f.eligibility.join("\n") : f.eligibility} onChange={(e) => setF({ ...f, eligibility: e.target.value.split("\n") })} /></Field>
      <Field label="Documents (one per line)"><textarea rows={3} className={inp} value={Array.isArray(f.docs) ? f.docs.join("\n") : f.docs} onChange={(e) => setF({ ...f, docs: e.target.value.split("\n") })} /></Field>
      <Field label="How to apply"><textarea rows={2} className={inp} value={f.process} onChange={(e) => setF({ ...f, process: e.target.value })} /></Field>
      <Field label="Apply URL"><input className={inp} value={f.apply_url || ""} onChange={(e) => setF({ ...f, apply_url: e.target.value })} /></Field>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 h-12 rounded-xl bg-secondary font-bold">Cancel</button>
        <button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold">Save</button>
      </div>
    </form>
  );
}

// ---------------- Services ----------------
function ServicesTab() {
  const list = useServerFn(listServices);
  const save = useServerFn(saveService);
  const del = useServerFn(deleteService);
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  async function reload() { setRows((await list()).services); }
  useEffect(() => { reload(); }, []);

  if (editing) {
    return (
      <form onSubmit={async (e) => { e.preventDefault(); await save({ data: { ...editing, link: editing.link || null, sort_order: Number(editing.sort_order) || 0 } }); setEditing(null); reload(); }} className="space-y-3 bg-card border border-border rounded-2xl p-4">
        <Field label="Name"><input required className={inp} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
        <Field label="Bangla"><input className={inp} value={editing.bn} onChange={(e) => setEditing({ ...editing, bn: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Kind">
            <select className={inp} value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value })}>
              <option value="office">Office</option>
              <option value="document">Document</option>
              <option value="event">Event / Near You</option>
              <option value="emergency">Emergency</option>
            </select>
          </Field>
          <Field label="Sort"><input type="number" className={inp} value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} /></Field>
        </div>
        <Field label="Meta (timing / details)"><input className={inp} value={editing.meta} onChange={(e) => setEditing({ ...editing, meta: e.target.value })} /></Field>
        <Field label="Link (optional)"><input className={inp} value={editing.link || ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} /></Field>
        <div className="flex gap-2"><button type="button" onClick={() => setEditing(null)} className="flex-1 h-12 rounded-xl bg-secondary font-bold">Cancel</button><button className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold">Save</button></div>
      </form>
    );
  }

  return (
    <div className="space-y-3">
      <button onClick={() => setEditing({ name: "", bn: "", kind: "office", meta: "", link: "", icon: "Building2", tone: "bg-primary", sort_order: 0 })} className="w-full h-12 rounded-2xl bg-gradient-info text-primary-foreground font-bold flex items-center justify-center gap-2"><Plus className="h-5 w-5" /> Add Service / Event</button>
      {rows.map((r) => (
        <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{r.name} <span className="text-xs text-muted-foreground">· {r.kind}</span></p>
            <p className="text-xs text-muted-foreground truncate">{r.meta}</p>
          </div>
          <button onClick={() => setEditing(r)} className="text-xs font-bold text-primary px-3 h-9 rounded-lg bg-primary/10">Edit</button>
          <button onClick={async () => { if (confirm("Delete?")) { await del({ data: { id: r.id } }); reload(); }}} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

// ---------------- Reports ----------------
function ReportsTab() {
  const list = useServerFn(listReports);
  const upd = useServerFn(updateReportStatus);
  const [rows, setRows] = useState<any[]>([]);
  async function reload() { setRows((await list()).reports); }
  useEffect(() => { reload(); }, []);
  return (
    <div className="space-y-3">
      {rows.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No reports yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-bold text-sm">{r.issue_type} <span className="text-xs text-muted-foreground font-mono">· {r.track_id}</span></p>
              <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()} · {r.location || "—"}</p>
            </div>
            <select value={r.status} onChange={async (e) => { await upd({ data: { id: r.id, status: e.target.value as any } }); reload(); }} className="h-9 px-2 rounded-lg bg-secondary text-xs font-bold">
              <option value="submitted">Submitted</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          {r.description && <p className="text-sm">{r.description}</p>}
          {r.phone && <p className="text-xs text-muted-foreground mt-1">📞 {r.phone}</p>}
        </div>
      ))}
    </div>
  );
}

// ---------------- Settings ----------------
function SettingsTab() {
  const change = useServerFn(changeAdminPassword);
  const [cur, setCur] = useState("");
  const [nxt, setNxt] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); const r = await change({ data: { current: cur, next: nxt } }); setMsg(r.ok ? "Password updated ✓" : r.error || "Failed"); if (r.ok) { setCur(""); setNxt(""); } }} className="space-y-3 bg-card border border-border rounded-2xl p-4">
      <h3 className="font-bold">Change admin password</h3>
      <Field label="Current password"><input type="password" required className={inp} value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
      <Field label="New password (min 6 chars)"><input type="password" required minLength={6} className={inp} value={nxt} onChange={(e) => setNxt(e.target.value)} /></Field>
      {msg && <p className="text-sm font-semibold flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> {msg}</p>}
      <button className="w-full h-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold">Update password</button>
    </form>
  );
}

// helpers
const inp = "w-full h-11 rounded-xl border-2 border-input bg-background px-3 text-sm focus:border-primary focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function Toggle({ label, value, onChange }: any) {
  return (
    <label className="flex items-center justify-between bg-secondary rounded-xl px-3 h-11">
      <span className="text-sm font-semibold">{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />
    </label>
  );
}
function arr(v: any): string[] {
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  return String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);
}
