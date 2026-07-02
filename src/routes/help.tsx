import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listUpdates } from "@/lib/content.functions";
import {
  AlertTriangle, Play, ExternalLink, MapPin, CheckCircle2, FileText, Phone,
  ChevronLeft, Share2, Clock, Loader2, ChevronUp,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/help")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Updates & Alerts — BanglaSathi" },
      { name: "description", content: "Swipe through the latest government scheme news, Inshorts-style." },
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
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function ytId(url?: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function fmtDate(deadline: string | null) {
  if (!deadline) return null;
  const d = new Date(deadline + "T23:59:59");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function UrgencyBadge({ deadline, urgent }: { deadline: string | null; urgent: boolean }) {
  const d = daysLeft(deadline);
  if (urgent) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2.5 py-1 rounded-full animate-pulse shadow-sm">
        <AlertTriangle className="h-3 w-3" /> Urgent
      </span>
    );
  }
  if (d === null) return null;
  if (d < 0)
    return <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-full">Expired</span>;
  const tone = d <= 3 ? "bg-red-600 text-white" : d <= 7 ? "bg-yellow-400 text-black" : "bg-emerald-600 text-white";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider ${tone} px-2.5 py-1 rounded-full`}>
      <Clock className="h-3 w-3" /> {d === 0 ? "Last day" : `${d} day${d === 1 ? "" : "s"} left`}
    </span>
  );
}

function HelpPage() {
  const list = useServerFn(listUpdates);
  const [rows, setRows] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Update | null>(null);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list().then((r) => { setRows(r.updates as any); setLoading(false); });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollTop / el.clientHeight);
      setActive(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [rows.length]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 inset-x-0 z-40 bg-black/70 backdrop-blur-lg border-b border-white/10">
        <div className="mx-auto max-w-md px-4 h-14 flex items-center gap-3">
          <Link to="/" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold leading-tight">Updates & Alerts</h1>
            <p className="text-[10px] text-white/60 leading-tight">Swipe up for next · খবর</p>
          </div>
          {rows.length > 0 && (
            <span className="text-[11px] font-semibold bg-white/10 px-2 py-1 rounded-full">
              {active + 1}/{rows.length}
            </span>
          )}
        </div>
      </header>


      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/70" />
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="overflow-y-scroll snap-y snap-proximity overscroll-contain scrollbar-none"
          style={{
            scrollbarWidth: "none",
            height: "100svh",
            paddingTop: "3.5rem",
            paddingBottom: "calc(5rem + env(safe-area-inset-bottom))",
          }}
        >
          {rows.map((r) => (
            <ShortCard key={r.id} update={r} onOpen={() => setOpen(r)} />
          ))}
        </div>
      )}


      {open && <DetailSheet update={open} onClose={() => setOpen(null)} />}
      <BottomNav />
    </div>
  );
}

function ShortCard({ update, onOpen }: { update: Update; onOpen: () => void }) {
  const vid = ytId(update.youtube_url);
  const cover = update.cover_image || (vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null);
  const dateStr = fmtDate(update.deadline);

  return (
    <article
      className="snap-start mx-auto max-w-md flex flex-col bg-neutral-950"
      style={{ minHeight: "calc(100svh - 3.5rem - 5rem - env(safe-area-inset-bottom))" }}
    >

      <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden shrink-0">
        {cover ? (
          <img src={cover} alt={update.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className={`${update.tone} w-full h-full flex items-center justify-center`}>
            <AlertTriangle className="h-14 w-14 text-white/70" />
          </div>
        )}
        {update.has_video && vid && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="h-16 w-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
              <Play className="h-7 w-7 fill-white text-white" />
            </span>
          </span>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded-full">
            {update.tag}
          </span>
          <UrgencyBadge deadline={update.deadline} urgent={update.urgent} />
        </div>
      </div>

      <div className="flex-1 min-h-0 px-5 pt-4 pb-3 flex flex-col bg-white text-neutral-900 rounded-t-3xl -mt-4 relative shadow-lift">
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1" style={{ WebkitOverflowScrolling: "touch" }}>
          <h2 className="text-xl font-extrabold leading-snug tracking-tight">{update.title}</h2>
          {update.bn && <p className="text-xs text-neutral-500 mt-1">{update.bn}</p>}
          <p className="text-[13.5px] leading-relaxed text-neutral-700 mt-3">
            {update.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between gap-2 shrink-0">

          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 min-w-0">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {dateStr ? `Deadline: ${dateStr}` : "Ongoing scheme"}
            </span>
          </div>
          <button
            onClick={onOpen}
            className="text-[11px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-2 rounded-full shadow-soft flex items-center gap-1"
          >
            Read more <ChevronUp className="h-3.5 w-3.5 rotate-90" />
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailSheet({ update, onClose }: { update: Update; onClose: () => void }) {
  const share = async () => {
    const url = update.online_url || window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: update.title, text: update.description, url }); } catch {}
    } else {
      navigator.clipboard?.writeText(`${update.title} — ${url}`);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div className="bg-background text-foreground w-full max-w-md rounded-t-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className={`${update.tone} text-primary-foreground p-5 rounded-t-3xl relative`}>
          <div className="mx-auto h-1.5 w-12 bg-white/40 rounded-full mb-4" />
          <button onClick={onClose} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 flex items-center justify-center" aria-label="Close">
            <ChevronLeft className="h-5 w-5 rotate-90" />
          </button>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{update.tag}</span>
            <UrgencyBadge deadline={update.deadline} urgent={update.urgent} />
          </div>
          <h2 className="text-xl font-bold leading-tight">{update.title}</h2>
          {update.bn && <p className="text-xs opacity-90 mt-0.5">{update.bn}</p>}
        </div>

        <div className="p-5 space-y-5">
          {update.cover_image && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
              <img src={update.cover_image} alt={update.title} loading="lazy" className="w-full h-full object-cover" />
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

          <button onClick={share} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-bold flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" /> Share this update
          </button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-xl p-3">
            <FileText className="h-4 w-4 shrink-0" />
            <span>Verify at the official source before applying.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
