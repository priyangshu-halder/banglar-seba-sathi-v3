import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const reportSchema = z.object({
  issue_type: z.string().min(1).max(40),
  description: z.string().max(2000).default(""),
  location: z.string().max(200).default(""),
  phone: z.string().max(20).optional().nullable(),
});

export const submitReport = createServerFn({ method: "POST" })
  .inputValidator((d) => reportSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reports")
      .insert(data)
      .select("track_id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, track_id: row.track_id };
  });

export const myReports = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ phone: z.string().min(4).max(20) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("reports")
      .select("track_id,issue_type,status,created_at,location")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false });
    return { reports: rows ?? [] };
  });
