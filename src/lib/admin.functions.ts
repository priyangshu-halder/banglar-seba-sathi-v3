import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type AdminSession = { admin_id?: string };

// --- Middleware ---
const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { ADMIN_SESSION_CONFIG } = await import("./admin.server");
  const session = await useSession<AdminSession>(ADMIN_SESSION_CONFIG);
  if (!session.data.admin_id) {
    throw new Error("Unauthorized");
  }
  return next({ context: { adminId: session.data.admin_id } });
});

// --- Auth fns ---
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().min(1).max(64), password: z.string().min(1).max(128) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ADMIN_SESSION_CONFIG, verifyPassword } = await import("./admin.server");
    const { data: row, error } = await supabaseAdmin
      .from("admin_credentials")
      .select("admin_id,password_hash,salt,iterations")
      .eq("admin_id", data.id)
      .maybeSingle();
    if (error || !row) return { ok: false as const, error: "Invalid ID or password" };
    const ok = verifyPassword(data.password, row.salt, row.password_hash, row.iterations);
    if (!ok) return { ok: false as const, error: "Invalid ID or password" };
    const session = await useSession<AdminSession>(ADMIN_SESSION_CONFIG);
    await session.update({ admin_id: row.admin_id });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { ADMIN_SESSION_CONFIG } = await import("./admin.server");
  const session = await useSession<AdminSession>(ADMIN_SESSION_CONFIG);
  await session.clear();
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { ADMIN_SESSION_CONFIG } = await import("./admin.server");
  const session = await useSession<AdminSession>(ADMIN_SESSION_CONFIG);
  return { admin_id: session.data.admin_id ?? null };
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ current: z.string().min(1), next: z.string().min(6).max(128) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyPassword, hashPassword } = await import("./admin.server");
    const { data: row } = await supabaseAdmin
      .from("admin_credentials")
      .select("password_hash,salt,iterations")
      .eq("admin_id", context.adminId)
      .single();
    if (!row || !verifyPassword(data.current, row.salt, row.password_hash, row.iterations)) {
      return { ok: false as const, error: "Current password incorrect" };
    }
    const next = hashPassword(data.next);
    await supabaseAdmin
      .from("admin_credentials")
      .update({ password_hash: next.hash, salt: next.salt, iterations: next.iterations, updated_at: new Date().toISOString() })
      .eq("admin_id", context.adminId);
    return { ok: true as const };
  });

// --- YouTube oEmbed fetch ---
export const fetchYoutubeMeta = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ url: z.string().url() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(data.url)}&format=json`);
      if (!r.ok) return { ok: false as const };
      const j = (await r.json()) as { title?: string; author_name?: string };
      return { ok: true as const, title: j.title ?? "", author: j.author_name ?? "" };
    } catch {
      return { ok: false as const };
    }
  });

// --- Updates CRUD ---
const updatePayload = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  bn: z.string().max(200).default(""),
  tag: z.string().min(1).max(60),
  tone: z.string().min(1).max(80),
  description: z.string().max(4000).default(""),
  youtube_url: z.string().url().nullable().optional(),
  has_video: z.boolean(),
  online_label: z.string().max(80).nullable().optional(),
  online_url: z.string().url().nullable().optional(),
  offline_where: z.string().max(300).nullable().optional(),
  offline_steps: z.array(z.string().min(1).max(500)).max(20).default([]),
  offline_docs: z.array(z.string().min(1).max(200)).max(20).default([]),
  helpline: z.string().max(40).nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const saveUpdate = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => updatePayload.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("updates").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: row, error } = await supabaseAdmin.from("updates").insert(rest).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const deleteUpdate = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("updates").delete().eq("id", data.id);
    return { ok: true };
  });

// --- Benefits CRUD ---
const benefitPayload = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  bn: z.string().max(200).default(""),
  category: z.string().min(1).max(40),
  amount: z.string().max(120).default(""),
  eligibility: z.array(z.string().min(1).max(300)).max(20).default([]),
  docs: z.array(z.string().min(1).max(200)).max(20).default([]),
  process: z.string().max(1000).default(""),
  apply_url: z.string().url().nullable().optional(),
  tone: z.string().min(1).max(120),
  icon: z.string().min(1).max(40),
});

export const saveBenefit = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => benefitPayload.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("benefits").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: row, error } = await supabaseAdmin.from("benefits").insert(rest).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const deleteBenefit = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("benefits").delete().eq("id", data.id);
    return { ok: true };
  });

// --- Services CRUD ---
const servicePayload = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  bn: z.string().max(200).default(""),
  kind: z.enum(["office", "document", "event", "emergency"]),
  meta: z.string().max(300).default(""),
  link: z.string().url().nullable().optional(),
  icon: z.string().min(1).max(40),
  tone: z.string().min(1).max(120),
  sort_order: z.number().int().default(0),
});

export const saveService = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => servicePayload.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("services").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: row, error } = await supabaseAdmin.from("services").insert(rest).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("services").delete().eq("id", data.id);
    return { ok: true };
  });

// --- Reports (admin) ---
export const listReports = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { reports: data ?? [] };
  });

export const updateReportStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d) => z.object({ id: z.string().uuid(), status: z.enum(["submitted", "in_progress", "resolved"]) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("reports").update({ status: data.status }).eq("id", data.id);
    return { ok: true };
  });
