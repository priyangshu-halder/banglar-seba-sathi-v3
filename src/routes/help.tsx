import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { listUpdates } from "@/lib/content.functions";
import {
  AlertTriangle, Play, Volume2, X, ExternalLink, MapPin,
  CheckCircle2, FileText, Phone, Megaphone, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Updates & Alerts — BanglaSathi" },
      { name: "description", content: "Latest government announcements, alerts and news." },
    ],
  }),
  component: HelpPage,
});

type Update = {
  id: string; title: string; bn: string; tag: string; tone: string;
  description: string; youtube_url: string | null; has_video: boolean;
  online_label: string | null; online_url: string | null;
  offline_where: string | null; offline_steps: string[]; offline_docs: string[];
  helpline: string | null; cover_image: string | null;
  deadline: string | null; urgent: boolean;
};

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const d = new Date(deadline + "T23:59:59");
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

function ytId(url?: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}


function HelpPage() {
  const list = useServerFn(listUpdates);
  const [rows, setRows] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Update | null>(null);

  useEffect(() => { list().then((r) => { setRows(r.updates as any); setLoading(false); }); }, []);

  return (
    <PageShell title="Updates & Alerts" subtitle="খবর · Government news & warnings" back="/">
      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const vid = ytId(r.youtube_url);
            return (
              <button
                key={r.id}
                onClick={() => setOpen(r)}
                className={`${r.tone} w-full text-left rounded-3xl p-5 text-primary-foreground relative overflow-hidden shadow-lift active:scale-[0.99] transition-transform`}
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
                <div className="flex items-center justify-between mb-4 relative">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-3 py-1 rounded-full">{r.tag}</span>
                  <span className="h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    {r.has_video ? <Volume2 className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
                  </span>
                </div>

                {r.cover_image ? (
                  <div className="aspect-video rounded-2xl mb-4 overflow-hidden relative bg-black/20">
                    <img src={r.cover_image} alt={r.title} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover" />
                    {r.has_video && vid && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="h-16 w-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                          <Play className="h-7 w-7 fill-white text-white" />
                        </span>
                      </span>
                    )}
                  </div>
                ) : r.has_video && vid ? (
                  <div className="aspect-video rounded-2xl mb-4 overflow-hidden relative bg-black/20">
                    <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt="" className="w-full h-full object-cover opacity-80" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-16 w-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                        <Play className="h-7 w-7 fill-white text-white" />
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="aspect-[3/1] rounded-2xl mb-4 bg-white/10 backdrop-blur flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 opacity-80" />
                  </div>
                )}

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    {r.urgent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                        <AlertTriangle className="h-3 w-3" /> Urgent
                      </span>
                    )}
                    {(() => {
                      const d = daysLeft(r.deadline);
                      if (d === null) return null;
                      if (d < 0)
                        return (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/70 text-white px-2 py-0.5 rounded-full">
                            Expired
                          </span>
                        );
                      const tone =
                        d <= 3
                          ? "bg-red-600 text-white"
                          : d <= 7
                            ? "bg-yellow-400 text-black"
                            : "bg-white/25 text-white";
                      return (
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${tone} px-2 py-0.5 rounded-full`}>
                          {d === 0 ? "Last day" : `${d} day${d === 1 ? "" : "s"} left`}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="font-bold leading-snug">{r.title}</h3>
                  {r.bn && <p className="text-xs opacity-90 mt-0.5">{r.bn}</p>}
                  <p className="text-[11px] opacity-80 mt-2 font-semibold">Tap for details →</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && <DetailSheet update={open} onClose={() => setOpen(null)} />}
    </PageShell>
  );
}

function DetailSheet({ update, onClose }: { update: Update; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div className="bg-background w-full max-w-md rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className={`${update.tone} text-primary-foreground p-5 rounded-t-3xl relative`}>
          <div className="mx-auto h-1.5 w-12 bg-white/40 rounded-full mb-4" />
          <button onClick={onClose} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{update.tag}</span>
          <h2 className="text-xl font-bold mt-2 leading-tight">{update.title}</h2>
          {update.bn && <p className="text-xs opacity-90 mt-0.5">{update.bn}</p>}
        </div>

        <div className="p-5 space-y-5">
          {update.cover_image && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
              <img src={update.cover_image} alt={update.title} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-sm leading-relaxed">{update.description}</p>

          {update.online_url && (
            <a href={update.online_url} target="_blank" rel="noreferrer" className="w-full h-14 rounded-2xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lift">
              <ExternalLink className="h-5 w-5" /> {update.online_label || "Apply Online"}
            </a>
          )}

          {update.offline_where && (
            <div className="bg-card border-2 border-border rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><MapPin className="h-4 w-4" /></div>
                <h3 className="font-bold text-sm">Offline Process</h3>
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Where to go</p>
                <p className="text-sm font-semibold">{update.offline_where}</p>
              </div>
              {update.offline_steps?.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Steps</p>
                  <ol className="space-y-2">
                    {update.offline_steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        <span className="pt-0.5">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {update.offline_docs?.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Documents needed</p>
                  <ul className="space-y-1.5">
                    {update.offline_docs.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {update.helpline && (
            <a href={`tel:${update.helpline}`} className="w-full h-14 rounded-2xl bg-card border-2 border-border font-bold flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-primary" /> Helpline · {update.helpline}
            </a>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-xl p-3">
            <FileText className="h-4 w-4 shrink-0" />
            <span>Verify at the official source before applying.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
