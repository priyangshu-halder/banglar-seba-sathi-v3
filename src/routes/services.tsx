import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import {
  Calendar,
  MapPin,
  FileText,
  Ambulance,
  Building2,
  Hospital,
  Landmark,
  Tractor,
  Play,
  ChevronRight,
  CheckCircle2,
  QrCode,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — BanglaSathi" },
      { name: "description", content: "Book appointments, find offices, get documents." },
    ],
  }),
  component: ServicesPage,
});

const offices = [
  { id: "muni", name: "Municipality", bn: "পৌরসভা", icon: Building2 },
  { id: "bdo", name: "BDO Office", bn: "বিডিও", icon: Landmark },
  { id: "land", name: "Land Office", bn: "ভূমি দপ্তর", icon: Tractor },
  { id: "hosp", name: "Hospital", bn: "হাসপাতাল", icon: Hospital },
];

const docs = [
  { name: "Birth Certificate", bn: "জন্ম শংসাপত্র", days: "7 days" },
  { name: "Income Certificate", bn: "আয়ের শংসাপত্র", days: "15 days" },
  { name: "Caste Certificate", bn: "জাতি শংসাপত্র", days: "21 days" },
  { name: "Trade License", bn: "ব্যবসার লাইসেন্স", days: "10 days" },
  { name: "Property Tax", bn: "সম্পত্তি কর", days: "Instant" },
];

function ServicesPage() {
  const [tab, setTab] = useState<"book" | "near" | "docs" | "sos">("book");

  return (
    <PageShell title="Services" subtitle="পরিষেবা · Everything in one place" back="/">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-3 mb-4 sticky top-[88px] bg-background/90 backdrop-blur z-30">
        {[
          { id: "book", label: "Book", icon: Calendar },
          { id: "near", label: "Nearby", icon: MapPin },
          { id: "docs", label: "Documents", icon: FileText },
          { id: "sos", label: "Emergency", icon: Ambulance },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`shrink-0 flex items-center gap-2 px-4 h-11 rounded-2xl font-semibold text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "book" && <BookTab />}
      {tab === "near" && <NearbyTab />}
      {tab === "docs" && <DocsTab />}
      {tab === "sos" && <EmergencyTab />}
    </PageShell>
  );
}

function BookTab() {
  const [office, setOffice] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-6 shadow-lift text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto mb-3" />
        <h2 className="text-2xl font-bold">Booked!</h2>
        <p className="text-sm opacity-90 mb-5">SMS sent to your phone</p>

        <div className="bg-white text-foreground rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Token</span>
            <span className="font-bold text-2xl text-primary">A-247</span>
          </div>
          <div className="aspect-square w-32 mx-auto bg-foreground/5 rounded-2xl flex items-center justify-center">
            <QrCode className="h-20 w-20" />
          </div>
          <p className="text-xs text-muted-foreground">Show this QR at the counter</p>
        </div>

        <button
          onClick={() => {
            setBooked(false);
            setOffice(null);
            setSlot(null);
          }}
          className="mt-5 w-full h-12 rounded-2xl bg-white/20 backdrop-blur font-bold"
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold mb-3">Choose Office</h3>
        <div className="grid grid-cols-2 gap-3">
          {offices.map((o) => {
            const Icon = o.icon;
            const active = office === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setOffice(o.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-bold text-sm">{o.name}</p>
                <p className="text-xs text-muted-foreground">{o.bn}</p>
              </button>
            );
          })}
        </div>
      </div>

      {office && (
        <div>
          <h3 className="font-bold mb-3">Pick a Time Slot</h3>
          <div className="grid grid-cols-3 gap-2">
            {["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={`h-12 rounded-2xl border-2 font-semibold text-sm transition-all ${
                  slot === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {office && slot && (
        <button
          onClick={() => setBooked(true)}
          className="w-full h-14 rounded-2xl bg-gradient-hero text-primary-foreground font-bold text-lg shadow-lift"
        >
          Confirm Booking →
        </button>
      )}
    </div>
  );
}

function NearbyTab() {
  const places = [
    { name: "City Hospital", type: "Hospital", dist: "1.2 km", color: "bg-rose-500" },
    { name: "Sonarpur Police Station", type: "Police", dist: "2.1 km", color: "bg-blue-500" },
    { name: "Municipality Office", type: "Municipality", dist: "0.8 km", color: "bg-emerald-500" },
    { name: "BDO Office", type: "BDO", dist: "3.4 km", color: "bg-amber-500" },
  ];
  return (
    <div className="space-y-4">
      <div className="relative h-56 rounded-3xl overflow-hidden border-2 border-border bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-info/10">
          <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lift animate-pulse">
          <MapPin className="h-7 w-7" />
        </div>
        <div className="absolute top-6 right-6 h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-500/30" />
        <div className="absolute bottom-8 left-10 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/30" />
        <div className="absolute top-12 left-8 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30" />
        <div className="absolute bottom-12 right-12 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-500/30" />

        <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" /> Sonarpur, South 24 Parganas
        </div>
      </div>

      {places.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3"
        >
          <div className={`h-12 w-12 rounded-xl ${p.color} flex items-center justify-center`}>
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.type} · {p.dist}</p>
          </div>
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
            Go
          </button>
        </div>
      ))}
    </div>
  );
}

function DocsTab() {
  return (
    <div className="space-y-3">
      {docs.map((d) => (
        <button
          key={d.name}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/40 hover:shadow-soft transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-gradient-warm flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{d.name}</p>
            <p className="text-xs text-muted-foreground">{d.bn}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold bg-success/10 text-success px-2 py-1 rounded-full">
              {d.days}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      ))}

      <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3 mt-4">
        <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
          <Play className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Watch How-To Videos</p>
          <p className="text-xs text-muted-foreground">Step-by-step in Bangla</p>
        </div>
      </div>
    </div>
  );
}

function EmergencyTab() {
  const services = [
    { name: "Ambulance", bn: "অ্যাম্বুলেন্স", number: "102", icon: Ambulance, tone: "bg-destructive" },
    { name: "Police", bn: "পুলিশ", number: "100", icon: Building2, tone: "bg-info" },
    { name: "Fire Service", bn: "দমকল", number: "101", icon: Building2, tone: "bg-warning" },
    { name: "Women Helpline", bn: "মহিলা হেল্পলাইন", number: "1091", icon: Hospital, tone: "bg-rose-500" },
  ];
  return (
    <div className="space-y-3">
      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4 text-center">
        <p className="text-sm font-bold text-destructive">⚠ In emergency? Tap to call instantly</p>
      </div>
      {services.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.name}
            href={`tel:${s.number}`}
            className={`${s.tone} text-white rounded-2xl p-5 flex items-center gap-4 shadow-lift active:scale-[0.98] transition-transform`}
          >
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{s.name}</p>
              <p className="text-xs opacity-90">{s.bn}</p>
            </div>
            <span className="text-3xl font-bold font-mono">{s.number}</span>
          </a>
        );
      })}
    </div>
  );
}
