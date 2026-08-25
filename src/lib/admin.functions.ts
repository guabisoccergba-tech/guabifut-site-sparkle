import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const timeRe = /^\d{2}:\d{2}$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Acesso restrito a administradores.");
}

export const adminGetAll = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [courts, hours, blocks, promotions] = await Promise.all([
      context.supabase.from("courts").select("*").order("sort_order"),
      context.supabase.from("opening_hours").select("*").order("weekday"),
      context.supabase.from("blocks").select("*").order("block_date", { ascending: false }).limit(200),
      context.supabase.from("promotions").select("*").order("created_at", { ascending: false }),
    ]);
    return {
      courts: courts.data ?? [],
      hours: hours.data ?? [],
      blocks: blocks.data ?? [],
      promotions: promotions.data ?? [],
    };
  });

const courtInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  kind: z.string().trim().min(2).max(30),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price_per_hour: z.number().min(0).max(100000),
  slot_minutes: z.number().int().min(15).max(240),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export const adminSaveCourt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => courtInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      name: data.name,
      kind: data.kind,
      description: data.description || null,
      price_per_hour: data.price_per_hour,
      slot_minutes: data.slot_minutes,
      active: data.active,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("courts").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("courts")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const defaults = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
      court_id: inserted.id,
      weekday,
      open_time: weekday === 0 ? "00:00" : weekday === 6 ? "08:00" : "17:30",
      last_start_time: weekday === 0 ? "00:00" : weekday === 6 ? "10:30" : "22:30",
      closed: weekday === 0,
    }));
    await context.supabase.from("opening_hours").insert(defaults);
    return { id: inserted.id };
  });

export const adminDeleteCourt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("courts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const hoursInput = z.object({
  court_id: z.string().uuid(),
  weekday: z.number().int().min(0).max(6),
  open_time: z.string().regex(timeRe),
  last_start_time: z.string().regex(timeRe),
  closed: z.boolean(),
});

export const adminSaveHours = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => hoursInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("opening_hours")
      .upsert(data, { onConflict: "court_id,weekday" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const blockInput = z.object({
  court_id: z.string().uuid(),
  block_date: z.string().regex(dateRe),
  start_time: z.string().regex(timeRe),
  end_time: z.string().regex(timeRe),
  reason: z.string().trim().max(200).optional().or(z.literal("")),
});

export const adminCreateBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => blockInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("blocks")
      .insert({ ...data, reason: data.reason || null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blocks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const promoInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(80),
  court_id: z.string().uuid().nullable(),
  weekday: z.number().int().min(0).max(6).nullable(),
  specific_date: z.string().regex(dateRe).nullable(),
  start_time: z.string().regex(timeRe),
  end_time: z.string().regex(timeRe),
  discount_percent: z.number().min(1).max(100),
  valid_from: z.string().regex(dateRe).nullable(),
  valid_to: z.string().regex(dateRe).nullable(),
  active: z.boolean(),
});

export const adminSavePromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => promoInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...payload } = data;
    if (id) {
      const { error } = await context.supabase.from("promotions").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await context.supabase.from("promotions").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminTogglePromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid(), active: z.boolean() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("promotions")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("promotions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ from: z.string().regex(dateRe), to: z.string().regex(dateRe) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("bookings")
      .select("*, courts(name)")
      .gte("booking_date", data.from)
      .lte("booking_date", data.to)
      .order("booking_date")
      .order("start_time");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSetBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["pendente", "confirmada", "cancelada"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
