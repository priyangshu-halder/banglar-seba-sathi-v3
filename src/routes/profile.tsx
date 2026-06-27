import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import {
  Settings,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — BanglaSathi" },
      { name: "description", content: "Manage your profile and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <PageShell title="" hero={<ProfileHero />}>
      <section className="mt-4 grid grid-cols-3 gap-3 mb-6">
        <Stat label="Applied" value="3" />
        <Stat label="Pending" value="1" />
        <Stat label="Approved" value="2" />
      </section>

      <section className="space-y-2 mb-6">
        <Row icon={FileText} label="My Applications" bn="আমার আবেদন" />
        <Row icon={Bell} label="Notifications" bn="বিজ্ঞপ্তি" badge="3" to="/help" />
        <Row icon={Globe} label="Language" bn="ভাষা" value="বাংলা · English" />
        <Row icon={Shield} label="Privacy & Security" bn="গোপনীয়তা" />
        <Row icon={Settings} label="Settings · Admin Console" bn="অ্যাডমিন প্যানেল" to="/admin/login" />
        <Row icon={HelpCircle} label="Help & FAQ" bn="সাহায্য" />
      </section>

      <button className="w-full h-14 rounded-2xl bg-destructive/10 text-destructive font-bold flex items-center justify-center gap-2">
        <LogOut className="h-5 w-5" /> Sign Out
      </button>
    </PageShell>
  );
}

function ProfileHero() {
  return (
    <header className="bg-gradient-hero text-primary-foreground px-5 pt-8 pb-10 rounded-b-[2rem] shadow-lift">
      <h1 className="text-xl font-bold mb-5">Profile</h1>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
          S
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Subrata Das</h2>
          <p className="text-sm opacity-90">+91 98••• ••321</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
            <Award className="h-3.5 w-3.5" /> Verified Citizen
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  bn,
  value,
  badge,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  bn: string;
  value?: string;
  badge?: string;
  to?: string;
}) {
  const inner = (
    <>
      <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="h-5 w-5 text-secondary-foreground" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{bn}</p>
      </div>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      {badge && (
        <span className="h-6 min-w-6 px-2 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  const cls = "w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-3 hover:border-primary/40 transition-colors text-left";
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button className={cls}>{inner}</button>;
}
