import { createServerFn } from "@tanstack/react-start";

export const listUpdates = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("updates")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { updates: data ?? [] };
});

export const listBenefits = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("benefits")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const benefits = (data ?? []).map((b: any) => ({
    ...b,

    eligibility:
      Array.isArray(b.eligibility)
        ? b.eligibility
        : typeof b.eligibility === "string"
          ? JSON.parse(b.eligibility)
          : [],

    docs:
      Array.isArray(b.docs)
        ? b.docs
        : typeof b.docs === "string"
          ? JSON.parse(b.docs)
          : [],
  }));

  return { benefits };
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return { services: data ?? [] };
});
