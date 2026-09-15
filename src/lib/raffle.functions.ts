import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const timeRe = /^\d{2}:\d{2}$/;

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Acesso restrito a administradores.");
}

/** Próxima data (YYYY-MM-DD) que cai no dia da semana informado, no fuso de São Paulo. */
function nextDateForWeekday(weekday: number): string {
  const nowSp = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
  );
  const diff = (weekday - nowSp.getDay() + 7) % 7;
  const target = new Date(nowSp.getTime());
  target.setDate(target.getDate() + diff);
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, "0");
  const d = String(target.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export const adminListMonthly = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [monthly, courts] = await Promise.all([
      context.supabase
        .from("bookings")
        .select(
          "id, court_id, customer_name, customer_phone, monthly_weekday, start_time, end_time, monthly_active, final_price, courts(name)",
        )
        .eq("is_monthly", true)
        .order("monthly_weekday")
        .order("start_time"),
      context.supabase.from("courts").select("id, name, slot_minutes, price_per_hour").order("sort_order"),
    ]);
    if (monthly.error) throw new Error(monthly.error.message);
    return {
      monthly: (monthly.data ?? []) as any[],
      courts: (courts.data ?? []) as any[],
    };
  });

const monthlyInput = z.object({
  id: z.string().uuid().optional(),
  court_id: z.string().uuid(),
  customer_name: z.string().trim().min(2).max(80),
  customer_phone: z.string().trim().min(8).max(20),
  monthly_weekday: z.number().int().min(0).max(6),
  start_time: z.string().regex(timeRe),
  monthly_active: z.boolean(),
});

export const adminSaveMonthly = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => monthlyInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { data: court, error: courtError } = await context.supabase
      .from("courts")
      .select("slot_minutes, price_per_hour")
      .eq("id", data.court_id)
      .single();
    if (courtError) throw new Error(courtError.message);

    const slot = court?.slot_minutes ?? 60;
    const price = Number(court?.price_per_hour ?? 0) * (slot / 60);

    const payload = {
      court_id: data.court_id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      monthly_weekday: data.monthly_weekday,
      start_time: data.start_time,
      end_time: addMinutes(data.start_time, slot),
      monthly_active: data.monthly_active,
      is_monthly: true,
      status: "confirmada" as const,
      booking_date: nextDateForWeekday(data.monthly_weekday),
      base_price: price,
      final_price: price,
    };

    if (data.id) {
      const { error } = await context.supabase.from("bookings").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await context.supabase.from("bookings").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteMonthly = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("bookings")
      .delete()
      .eq("id", data.id)
      .eq("is_monthly", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminRunRaffle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        prize: z.string().trim().min(2).max(80),
        entryIds: z.array(z.string().uuid()).min(2).max(500),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { data: rows, error } = await context.supabase
      .from("bookings")
      .select("id, customer_name, customer_phone, monthly_weekday, start_time, courts(name)")
      .eq("is_monthly", true)
      .eq("monthly_active", true)
      .in("id", data.entryIds);
    if (error) throw new Error(error.message);

    const participants = (rows ?? []) as any[];
    if (participants.length < 2) throw new Error("É preciso ao menos 2 participantes.");

    // Sorteio no servidor, com gerador criptográfico e correção de viés.
    const pick = (max: number) => {
      const limit = Math.floor(0xffffffff / max) * max;
      const buf = new Uint32Array(1);
      let value: number;
      do {
        crypto.getRandomValues(buf);
        value = buf[0] ?? 0;
      } while (value >= limit);
      return value % max;
    };
    const winner = participants[pick(participants.length)]!;
    const detailOf = (p: any) =>
      `${p.courts?.name ?? ""} · ${p.start_time?.slice(0, 5) ?? ""}`.trim();

    const { data: raffle, error: raffleError } = await context.supabase
      .from("raffles")
      .insert({
        prize: data.prize,
        winner_name: winner.customer_name,
        winner_phone: winner.customer_phone,
        winner_detail: detailOf(winner),
        entries_count: participants.length,
        created_by: context.userId,
      })
      .select("id, prize, raffle_date, winner_name, winner_detail, entries_count")
      .single();
    if (raffleError) throw new Error(raffleError.message);

    const entries = participants.map((p) => ({
      raffle_id: raffle.id,
      name: p.customer_name,
      phone: p.customer_phone,
      detail: detailOf(p),
      is_winner: p.id === winner.id,
    }));
    const { error: entriesError } = await context.supabase.from("raffle_entries").insert(entries);
    if (entriesError) {
      await context.supabase.from("raffles").delete().eq("id", raffle.id);
      throw new Error(entriesError.message);
    }

    return {
      raffle,
      winner: {
        name: winner.customer_name as string,
        detail: detailOf(winner),
      },
      participants: participants.map((p) => p.customer_name as string),
    };
  });

export const adminListRaffles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("raffles")
      .select("id, prize, raffle_date, winner_name, winner_detail, entries_count, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });
