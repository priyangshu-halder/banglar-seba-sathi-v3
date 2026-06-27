import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/local")({
  head: () => ({
    meta: [
      { title: "Local Announcements — BanglaSathi" },
      { name: "description", content: "Camps, drives and notices happening near you." },
    ],
  }),
  component: LocalPage,
});

const events = [
  { title: "Free Health Camp", bn: "বিনামূল্যে স্বাস্থ্য শিবির", when: "Sun · 9 AM", where: "Community Hall", tone: "bg-rose-500" },
  { title: "Blood Donation Camp", bn: "রক্তদান শিবির", when: "Sat · 10 AM", where: "Town Hall", tone: "bg-red-600" },
  { title: "Vaccination Drive", bn: "টিকাকরণ", when: "Mon · 8 AM", where: "PHC Sonarpur", tone: "bg-emerald-500" },
  { title: "Municipality Notice", bn: "পৌরসভা বিজ্ঞপ্তি", when: "Today", where: "Water supply 2-5 PM", tone: "bg-info" },
];

function LocalPage() {
  return (
    <PageShell title="Near You" subtitle="আপনার এলাকায় · Camps, drives & notices" back="/">
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Showing for</p>
          <p className="font-bold text-sm">📍 Sonarpur, South 24 Pgs</p>
        </div>
        <button className="text-xs font-bold text-primary">Change</button>
      </div>

      <div className="space-y-3">
        {events.map((e) => (
          <article
            key={e.title}
            className="bg-card border border-border rounded-2xl p-4 flex gap-3 shadow-soft"
          >
            <div className={`w-1.5 rounded-full ${e.tone}`} />
            <div className="flex-1">
              <h3 className="font-bold">{e.title}</h3>
              <p className="text-xs text-muted-foreground">{e.bn}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <Calendar className="h-3 w-3" /> {e.when}
                </span>
                <span className="text-muted-foreground">· {e.where}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
