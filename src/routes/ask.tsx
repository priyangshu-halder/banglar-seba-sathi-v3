import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Mic, Send, Sparkles, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const apiKey = import.meta.env.VITE_GEMINI;

const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are BanglaSathi AI, a helpful assistant specializing in government schemes, public services and official documents. Reply in the same language as the user.",
});

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
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "নমস্কার! I can answer any question about government schemes, services and documents. Ask in Bangla or English.",
    },
  ]);

  async function send(text: string) {
    if (!text.trim() || isLoading) return;

    // Show user message immediately
    setMessages((prev) => [...prev, { role: "user", text }]);
    setQ("");
    setIsLoading(true);

    try {
      // Build conversation history (excluding the welcome message)
      const currentMessages = [...messages];

      const history = currentMessages.slice(1).map((msg) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      // Create chat session
      const chat = model.startChat({
        history,
      });

      // Send current message
      const result = await chat.sendMessage(text);

      const aiResponse = result.response.text();

      // Append AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiResponse,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "দুঃখিত! Something went wrong while connecting to the AI.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border rounded-bl-md"
                }`}
            >
              {m.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> BanglaSathi AI
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {m.text}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                Thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Try asking
          </p>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <button disabled={isLoading}
                key={s}
                onClick={() => send(s)}
                className="w-full text-left p-3 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-soft transition-all text-sm disabled:opacity-50"
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
            disabled={isLoading}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                send(q);
              }
            }}
            placeholder={isLoading ? "Thinking..." : "Ask anything..."}
            className="flex-1 bg-transparent px-3 h-11 focus:outline-none text-sm disabled:opacity-50"
          />
          <button
            type="button"
            disabled={isLoading}
            className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center disabled:opacity-50"
          >
            <Mic className="h-5 w-5 text-secondary-foreground" />
          </button>
          <button
            onClick={() => send(q)}
            disabled={isLoading || !q.trim()}
            className="h-11 w-11 rounded-xl bg-gradient-hero text-primary-foreground flex items-center justify-center shadow-soft disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
