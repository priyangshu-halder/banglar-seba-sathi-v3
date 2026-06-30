import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Gift,
  Building2,
  Bell,
  AlertTriangle,
  Phone,
  Ambulance,
  Mic,
  Search,
  ChevronRight,
  MapPin,
  Sparkles,
  Languages,
  Flame,
  Megaphone,
  Heart,
  Calendar,
  // MessageIcon
} from "lucide-react";
import ashokaEmblem from "@/assets/ashoka-emblem.png";
import wbHero from "@/assets/wb-hero.jpg";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BanglaSathi — Government Services Made Simple" },
      {
        name: "description",
        content:
          "All West Bengal government benefits, services and alerts — one tap, in Bangla or English.",
      },
    ],
  }),
  component: Home,
});

type Lang = "en" | "bn";

const T = {
  en: {
    seal: "Government Seba Sathi",
    motto: "सत्यमेव जयते",
    banner: "All benefits & newly launched West Bengal government schemes — your one-stop solution.",
    title1: "How can we",
    title2: "help today?",
    sub: "আপনার সরকারি সাথী",
    search: "Ask anything in Bangla or English…",
    voice: "Your Voice, Your Area",
    report: "Report a Problem",
    reportSub: "অভিযোগ জানান",
    near: "Near You",
    nearSub: "আপনার এলাকার খবর",
    benefits: "Benefits",
    benefitsSub: "সুবিধা · Schemes & money help",
    services: "Services",
    servicesSub: "পরিষেবা · Appointments & documents",
    emergency: "Emergency",
    ambulance: "Ambulance",
    police: "Police",
    fire: "Fire",
  },
  bn: {
    seal: "সরকারি সেবা সাথী",
    motto: "সত্যমেব জয়তে",
    banner: "পশ্চিমবঙ্গ সরকারের সব সুবিধা ও নতুন প্রকল্প — এক জায়গায় সমাধান।",
    title1: "আজ কীভাবে",
    title2: "সাহায্য করব?",
    sub: "Your Government Companion",
    search: "বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করুন…",
    voice: "আপনার কণ্ঠ, আপনার এলাকা",
    report: "অভিযোগ জানান",
    reportSub: "Report a Problem",
    near: "আপনার কাছে",
    nearSub: "Local updates near you",
    benefits: "সুবিধা",
    benefitsSub: "Benefits · প্রকল্প ও আর্থিক সহায়তা",
    services: "পরিষেবা",
    servicesSub: "Services · অ্যাপয়েন্টমেন্ট ও নথি",
    emergency: "জরুরি সাহায্য",
    ambulance: "অ্যাম্বুলেন্স",
    police: "পুলিশ",
    fire: "দমকল",
  },
} as const;

function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-md">
        {/* Hero — BJP tricolor saffron→green with Howrah Bridge & yellow taxi backdrop */}
        <header className="bg-gradient-hero text-white px-5 pt-6 pb-24 rounded-b-[2rem] shadow-lift relative overflow-hidden">
          {/* WB illustration backdrop */}
          <img
            src={wbHero}
            alt="Howrah Bridge with a yellow Kolkata taxi"
            width={1280}
            height={640}
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-soft p-1">
                  <img
                    src={ashokaEmblem}
                    alt="Ashoka Stambha"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-[0.18em] opacity-90 font-semibold">
                    {t.motto}
                  </p>
                  <p className="font-bold text-sm">{t.seal}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  className="h-10 px-3 rounded-full bg-white/95 text-foreground flex items-center gap-1.5 shadow-soft text-xs font-bold active:scale-95 transition-transform"
                  aria-label="Switch language"
                >
                  <Languages className="h-4 w-4" />
                  {lang === "en" ? "বাং" : "EN"}
                </button>
                <Link
                  to="/help"
                  className="relative h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                  aria-label="Updates"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-300" />
                </Link>
              </div>
            </div>

            {/* One-stop banner */}
            <div className="mb-5 rounded-2xl bg-white/20 backdrop-blur border border-white/30 px-4 py-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-[12px] font-semibold leading-snug">{t.banner}</p>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight mb-1">
              {t.title1} <br />
              {t.title2}
            </h1>
            <p className="text-sm opacity-95">{t.sub}</p>

            {/* Search */}
            <Link
              to="/ask"
              className="mt-5 flex items-center gap-3 bg-white text-foreground rounded-2xl px-4 py-3.5 shadow-lift"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm text-muted-foreground truncate">
                {t.search}
              </span>
              <div className="h-9 w-9 rounded-xl bg-gradient-warm flex items-center justify-center">
                <Mic className="h-4 w-4 text-white" />
              </div>
            </Link>
          </div>
        </header>

        <main className="px-5 -mt-16 relative space-y-5">
          

          {/* TWO main bold actions: Benefits + Services */}
          <section className="grid grid-cols-2 gap-3">
            <BigAction
              to="/benefits"
              icon={Gift}
              title={t.benefits}
              subtitle={t.benefitsSub}
              gradient="bg-gradient-warm"
            />
            <BigAction
              to="/services"
              icon={Building2}
              title={t.services}
              subtitle={t.servicesSub}
              gradient="bg-gradient-hero"
            />
          </section>
          {/* Your voice — moved up */}
                    <h3>Your Voice, Your Area</h3>

          <section className="grid grid-cols-2 gap-3">
            <Link
              to="/report"
              className="relative overflow-hidden rounded-2xl p-4 bg-gradient-warm text-white shadow-lift active:scale-[0.98] transition-transform"
            >
              <div className="absolute -right-4 -bottom-6 h-20 w-20 rounded-full bg-white/15" />
              <div className="h-11 w-11 rounded-xl bg-white/25 backdrop-blur flex items-center justify-center mb-3">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <p className="font-bold leading-tight">{t.report}</p>
              <p className="text-[11px] opacity-90 mt-0.5">{t.reportSub}</p>
            </Link>
            <Link
              to="/local"
              className="relative overflow-hidden rounded-2xl p-4 bg-card border border-border shadow-soft active:scale-[0.98] transition-transform"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="font-bold leading-tight">{t.near}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t.nearSub}</p>
            </Link>
          </section>

          
          {/* Quick Access  */}
          <section className="mt-8">
            <h2 className="text-base font-bold mb-3">Quick Access</h2>
            <div className="grid grid-cols-4 gap-3">
              <QuickTile to="/services" icon={Calendar} label="Book Slot" />
              <QuickTile to="/services" icon={MapPin} label="Nearby" />
              <QuickTile to="/report" icon={AlertTriangle} label="Report" />
              <QuickTile to="/ask" icon={MessageIcon} label="Ask AI" />
            </div>
          </section>

          {/* Emergency — compact tile row */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              {t.emergency}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <Emerg icon={Ambulance} label={t.ambulance} num="102" tone="bg-destructive/10 text-destructive" />
              <Emerg icon={Phone} label={t.police} num="100" tone="bg-info/10 text-info" />
              <Emerg icon={Flame} label={t.fire} num="101" tone="bg-warning/15 text-warning-foreground" />
            </div>
          </section>
          
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Sparkles {...props} />;
}
function BigAction({
  to,
  icon: Icon,
  title,
  subtitle,
  gradient,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Link
      to={to}
      className={`${gradient} text-white rounded-3xl p-5 shadow-lift active:scale-[0.98] transition-transform relative overflow-hidden min-h-[170px] flex flex-col justify-between`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
      <div className="absolute -right-4 -bottom-10 h-24 w-24 rounded-full bg-white/10" />
      <div className="h-14 w-14 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center relative">
        <Icon className="h-7 w-7" />
      </div>
      <div className="relative">
        <h3 className="text-2xl font-extrabold leading-none">{title}</h3>
        <p className="text-[11px] opacity-95 mt-1.5 leading-snug">{subtitle}</p>
        <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold">
          Open <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

function Emerg({
  icon: Icon,
  label,
  num,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  num: string;
  tone: string;
}) {
  return (
    <a
      href={`tel:${num}`}
      className={`${tone} rounded-2xl p-3 flex flex-col items-center gap-1 active:scale-95 transition-transform`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-bold leading-none">{label}</span>
      <span className="text-[10px] opacity-70 font-mono">{num}</span>
    </a>
  );
}

function QuickTile({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-2 hover:shadow-soft hover:border-primary/30 transition-all"
    >
      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="h-5 w-5 text-secondary-foreground" />
      </div>
      <span className="text-[11px] font-semibold text-center leading-tight">{label}</span>
    </Link>
  );
}