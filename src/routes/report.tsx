import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import {
  Camera,
  MapPin,
  Send,
  Droplets,
  Construction,
  Lightbulb,
  Hospital,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Problem — BanglaSathi" },
      { name: "description", content: "Report civic issues like roads, water, drainage, street lights to your local authority." },
    ],
  }),
  component: ReportPage,
});

const issues = [
  { id: "road", label: "Road", bn: "রাস্তা", icon: Construction, color: "bg-amber-500" },
  { id: "drain", label: "Drainage", bn: "নালা", icon: Droplets, color: "bg-blue-500" },
  { id: "water", label: "Water", bn: "জল", icon: Droplets, color: "bg-cyan-500" },
  { id: "hosp", label: "Hospital", bn: "হাসপাতাল", icon: Hospital, color: "bg-rose-500" },
  { id: "light", label: "Street Light", bn: "আলো", icon: Lightbulb, color: "bg-yellow-500" },
];

function ReportPage() {
  const [issue, setIssue] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <PageShell title="Report a Problem" subtitle="অভিযোগ · Raise civic complaints" back="/">
      {sent ? (
        <div className="bg-success/10 border-2 border-success/30 rounded-3xl p-6 text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto text-success mb-3" />
          <h2 className="text-xl font-bold">Complaint Submitted</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track ID: <span className="font-mono font-bold text-foreground">CMP-9281</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            You'll get SMS updates as work progresses
          </p>
          <button
            onClick={() => {
              setSent(false);
              setIssue(null);
            }}
            className="mt-5 w-full h-12 rounded-2xl bg-card border border-border font-bold"
          >
            Report another
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h3 className="font-bold mb-3">What's the problem?</h3>
            <div className="grid grid-cols-3 gap-3">
              {issues.map((i) => {
                const Icon = i.icon;
                const active = issue === i.id;
                return (
                  <button
                    key={i.id}
                    onClick={() => setIssue(i.id)}
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-xl ${i.color} mx-auto flex items-center justify-center mb-2`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-bold text-xs">{i.label}</p>
                    <p className="text-[10px] text-muted-foreground">{i.bn}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {issue && (
            <>
              <div>
                <h3 className="font-bold mb-3">Add Photo</h3>
                <button className="w-full h-32 rounded-2xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Camera className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold">Tap to take photo</span>
                </button>
              </div>

              <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Auto Location</p>
                  <p className="text-xs text-muted-foreground">Sonarpur, South 24 Pgs</p>
                </div>
                <span className="text-xs font-bold text-success">ON</span>
              </div>

              <textarea
                placeholder="Describe the problem (optional)…"
                rows={3}
                className="w-full rounded-2xl border-2 border-input bg-card p-4 text-sm focus:border-primary focus:outline-none"
              />

              <button
                onClick={() => setSent(true)}
                className="w-full h-14 rounded-2xl bg-gradient-hero text-primary-foreground font-bold text-lg shadow-lift flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" /> Submit Complaint
              </button>
            </>
          )}
        </div>
      )}
    </PageShell>
  );
}
