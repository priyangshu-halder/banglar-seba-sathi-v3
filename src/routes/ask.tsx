import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Mic, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask AI — BanglaSathi" },
      { name: "description", content: "Ask any government-related question in Bangla or English." },
    ],
  }),
  component: AskPage,
});

const suggestions = [
  "How do I apply for women's support grant?",
  "Nearest government hospital?",
  "Documents for income certificate?",
  "Senior pension eligibility?",
];

function AskPage() {
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "নমস্কার! I can answer any question about government schemes, services and documents. Ask in Bangla or English.",
    },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "ai",
        text: "I'll guide you step by step. (Connect AI to get real-time answers — let me know if you'd like me to wire this up.)",
      },
    ]);
    setQ("");
  }

  return (
    <PageShell title="Ask AI" subtitle="সহায়ক · Your smart assistant" back="/">
      <div className="space-y-3 mb-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}
            >
              {m.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> BanglaSathi AI
                </div>
              )}
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 1 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Try asking
          </p>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left p-3 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-soft transition-all text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-5">
        <div className="mx-auto max-w-md flex items-center gap-2 bg-card border-2 border-border rounded-2xl p-2 shadow-lift">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(q)}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent px-3 h-11 focus:outline-none text-sm"
          />
          <button className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
            <Mic className="h-5 w-5 text-secondary-foreground" />
          </button>
          <button
            onClick={() => send(q)}
            className="h-11 w-11 rounded-xl bg-gradient-hero text-primary-foreground flex items-center justify-center shadow-soft"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
