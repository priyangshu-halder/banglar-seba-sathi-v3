import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askAI = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ question: z.string().min(1).max(1000) }).parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false as const, error: "AI not configured" };
    try {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "raw",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "You are BanglaSathi, a friendly helper for West Bengal citizens. Answer briefly (2-4 sentences) in the language the user used (Bangla or English). Focus on government schemes, services, documents, eligibility, and where to apply. If unsure, suggest visiting the nearest Duare Sarkar camp or BDO office. Use a warm, respectful tone.",
            },
            { role: "user", content: data.question },
          ],
        }),
      });
      if (r.status === 429) return { ok: false as const, error: "Too many requests. Try again in a minute." };
      if (r.status === 402) return { ok: false as const, error: "AI credits exhausted. Please contact admin." };
      if (!r.ok) return { ok: false as const, error: `AI error (${r.status})` };
      const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
      const text = j.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate an answer.";
      return { ok: true as const, text };
    } catch (e) {
      return { ok: false as const, error: "Network error. Please try again." };
    }
  });
