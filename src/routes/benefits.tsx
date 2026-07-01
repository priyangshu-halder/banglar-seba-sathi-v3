import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { listBenefits } from "@/lib/content.functions";
import {
  Heart,
  GraduationCap,
  CreditCard,
  Sprout,
  UserCheck,
  Building2,
  FileText,
  Gift,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Search,
  X,
  PlayCircle,
} from "lucide-react";

const benefitsQuery = queryOptions({
  queryKey: ["benefits"],
  queryFn: () => listBenefits(),
});

export const Route = createFileRoute("/benefits")({
  head: () => ({
    meta: [
      { title: "Benefits — BanglaSathi" },
      { name: "description", content: "Browse 50+ central & West Bengal government schemes with eligibility & apply links." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(benefitsQuery),
  component: BenefitsPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load benefits: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6 text-sm">No benefits found.</div>,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, GraduationCap, CreditCard, Sprout, UserCheck, Building2, FileText, Gift,
};

const CATEGORIES = ["All", "Farmer", "Student", "Women", "Worker", "Senior", "Health", "Insurance", "Housing", "Business", "Energy", "Food", "Land"] as const;
type Category = (typeof CATEGORIES)[number];

function BenefitsPage() {
  const { data } = useSuspenseQuery(benefitsQuery);
  const schemes = data.benefits;

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category>("All");
  const [open, setOpen] = useState<string | null>(null);
  const [form, setForm] = useState({ age: "", gender: "", occupation: "", income: "" });
  const hasFilters = !!form.age || !!form.gender || !!form.occupation || !!form.income;

  const filtered = useMemo(() => {
    const age = form.age ? Number(form.age) : null;
    return schemes.filter((s) => {
      const matchCat = cat === "All" || s.category === cat;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.bn.includes(query) ||
        s.category.toLowerCase().includes(q) ||
        s.eligibility.some((e: string) => e.toLowerCase().includes(q));

      // Personalize
      let matchPersonal = true;
      if (form.occupation === "Farmer" && cat === "All") matchPersonal = matchPersonal && ["Farmer", "All"].includes(s.category) || s.category === "Farmer";
      if (form.occupation && form.occupation !== "Other") {
        const map: Record<string, string[]> = {
          Farmer: ["Farmer", "Insurance", "Land", "Food", "Energy", "Health", "All"],
          Student: ["Student", "Insurance", "All"],
          Worker: ["Worker", "Insurance", "Health", "Housing", "Food", "All"],
          Business: ["Business", "Insurance", "All"],
        };
        const allow = map[form.occupation];
        if (allow) matchPersonal = matchPersonal && allow.includes(s.category);
      }
      if (form.gender === "Female") {
        // boost women but don't exclude general
      }
      if (age !== null && age >= 60 && cat === "All") {
        // keep all but seniors will float
      }
      return matchCat && matchQ && matchPersonal;
    });
  }, [schemes, query, cat, form]);

  return (
    <PageShell title="Benefits" subtitle="সুবিধা · 50+ schemes" back="/">
      <div className="sticky top-[76px] z-30 -mx-5 px-5 pt-1 pb-3 bg-background/95 backdrop-blur-lg space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 50+ schemes…"
            className="w-full h-12 rounded-2xl border-2 border-input bg-card pl-10 pr-9 text-sm font-medium focus:border-primary focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-muted flex items-center justify-center" aria-label="Clear">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`h-9 px-4 rounded-full text-sm font-semibold whitespace-nowrap border-2 transition-colors ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-3 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Personalize results</p>
            {hasFilters && (
              <button onClick={() => setForm({ age: "", gender: "", occupation: "", income: "" })} className="text-xs font-semibold text-primary">
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="h-10 rounded-xl border-2 border-input bg-background px-3 text-sm font-semibold focus:border-primary focus:outline-none" />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="h-10 rounded-xl border-2 border-input bg-background px-3 text-sm font-semibold focus:border-primary focus:outline-none">
              <option value="">Gender</option><option>Female</option><option>Male</option><option>Other</option>
            </select>
            <select value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="h-10 rounded-xl border-2 border-input bg-background px-3 text-sm font-semibold focus:border-primary focus:outline-none">
              <option value="">Occupation</option><option>Farmer</option><option>Student</option><option>Worker</option><option>Business</option><option>Other</option>
            </select>
            <select value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} className="h-10 rounded-xl border-2 border-input bg-background px-3 text-sm font-semibold focus:border-primary focus:outline-none">
              <option value="">Income</option><option>Below ₹10k</option><option>₹10k–25k</option><option>₹25k–50k</option><option>Above ₹50k</option>
            </select>
          </div>
          <p className="text-xs font-semibold text-muted-foreground pt-1 border-t border-border">
            {filtered.length} {filtered.length === 1 ? "scheme" : "schemes"} found
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-semibold">No schemes match your search</p>
            <p className="text-xs mt-1">Try a different keyword or category</p>
          </div>
        ) : (
          filtered.map((s) => {
            const Icon = ICONS[s.icon] ?? Gift;
            const isOpen = open === s.id;
            return (
              <article key={s.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
                <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full p-4 flex items-center gap-4 text-left">
                  <div className={`h-14 w-14 rounded-2xl border-2 flex items-center justify-center shrink-0 ${s.tone}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold leading-tight">{s.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{s.bn}</p>
                    <p className="text-sm font-bold text-primary mt-1">{s.amount}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{s.category}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                    {s.eligibility.length > 0 && (
                      <Section title="Eligibility" icon={CheckCircle2}>
                        <ul className="space-y-1">
                          {s.eligibility.map((e: string) => (
                            <li key={e} className="text-sm flex items-start gap-2">
                              <span className="text-success mt-0.5">✓</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}
                    {s.docs.length > 0 && (
                      <Section title="Documents Required" icon={FileText}>
                        <div className="flex flex-wrap gap-2">
                          {s.docs.map((d: string) => (
                            <span key={d} className="text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">{d}</span>
                          ))}
                        </div>
                      </Section>
                    )}
                    {s.process && (
                      <Section title="How to Apply" icon={FileText}>
                        <p className="text-sm text-muted-foreground">{s.process}</p>
                      </Section>
                    )}

                    {s.apply_url && (
                      <a href={s.apply_url} target="_blank" rel="noreferrer" className="h-12 rounded-2xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-soft">
                        Apply Online <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {s.video_url && (
                      <a href={s.video_url} target="_blank" rel="noreferrer" className="h-12 rounded-2xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-soft hover:bg-rose-700 transition-colors">
                        <PlayCircle className="h-5 w-5" /> Watch Video Tutorial
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </PageShell>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-bold text-sm">{title}</span>
      </div>
      {children}
    </div>
  );
}
