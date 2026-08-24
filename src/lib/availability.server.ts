import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  fromMinutes,
  toMinutes,
  weekdayOf,
  type CourtAvailability,
  type CourtInfo,
  type Slot,
} from "./booking-shared";

export function createPublicClient(): SupabaseClient {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

interface PromotionRow {
  id: string;
  title: string;
  court_id: string | null;
  weekday: number | null;
  specific_date: string | null;
  start_time: string;
  end_time: string;
  discount_percent: number;
  valid_from: string | null;
  valid_to: string | null;
  active: boolean;
}

function promoApplies(promo: PromotionRow, courtId: string, dateStr: string, slotStart: number) {
  if (!promo.active) return false;
  if (promo.court_id && promo.court_id !== courtId) return false;
  if (promo.valid_from && dateStr < promo.valid_from) return false;
  if (promo.valid_to && dateStr > promo.valid_to) return false;
  if (promo.specific_date) {
    if (promo.specific_date !== dateStr) return false;
  } else if (promo.weekday !== null && promo.weekday !== weekdayOf(dateStr)) {
    return false;
  }
  return slotStart >= toMinutes(promo.start_time) && slotStart < toMinutes(promo.end_time);
}

function round2(v: number) {
  return Math.round(v * 100) / 100;
}

export async function buildAvailability(
  dateStr: string,
  options: { courtId?: string; onlyPromotions?: boolean } = {},
): Promise<CourtAvailability[]> {
  const supabase = createPublicClient();
  const weekday = weekdayOf(dateStr);

  const [courtsRes, hoursRes, blocksRes, bookedRes, promosRes] = await Promise.all([
    supabase
      .from("courts")
      .select("id, name, kind, description, price_per_hour, slot_minutes, active, sort_order")
      .eq("active", true)
      .order("sort_order"),
    supabase.from("opening_hours").select("court_id, weekday, open_time, last_start_time, closed").eq("weekday", weekday),
    supabase.from("blocks").select("court_id, start_time, end_time").eq("block_date", dateStr),
    supabase.from("bookings").select("court_id, start_time, end_time, status").eq("booking_date", dateStr),
    supabase.from("promotions").select("*").eq("active", true),
  ]);

  const courts = (courtsRes.data ?? []) as unknown as CourtInfo[];
  const hours = hoursRes.data ?? [];
  const blocks = blocksRes.data ?? [];
  const booked = (bookedRes.data ?? []).filter((b) => b.status !== "cancelada");
  const promos = (promosRes.data ?? []) as unknown as PromotionRow[];

  const result: CourtAvailability[] = [];

  for (const court of courts) {
    if (options.courtId && court.id !== options.courtId) continue;
    const hour = hours.find((h) => h.court_id === court.id);
    if (!hour || hour.closed) {
      result.push({ court, closed: true, slots: [] });
      continue;
    }

    const step = court.slot_minutes || 60;
    const open = toMinutes(hour.open_time);
    const lastStart = toMinutes(hour.last_start_time);
    const basePrice = round2((Number(court.price_per_hour) * step) / 60);
    const slots: Slot[] = [];

    for (let start = open; start <= lastStart; start += step) {
      const end = start + step;
      const isBooked = booked.some(
        (b) => b.court_id === court.id && toMinutes(b.start_time) < end && toMinutes(b.end_time) > start,
      );
      const isBlocked = blocks.some(
        (b) => b.court_id === court.id && toMinutes(b.start_time) < end && toMinutes(b.end_time) > start,
      );

      let best: PromotionRow | null = null;
      for (const promo of promos) {
        if (!promoApplies(promo, court.id, dateStr, start)) continue;
        if (!best || Number(promo.discount_percent) > Number(best.discount_percent)) best = promo;
      }

      const discount = best ? Number(best.discount_percent) : 0;
      const status = isBooked ? "reservado" : isBlocked ? "bloqueado" : "livre";

      if (options.onlyPromotions && (!best || status !== "livre")) continue;

      slots.push({
        start: fromMinutes(start),
        end: fromMinutes(end),
        status,
        basePrice,
        discountPercent: discount,
        finalPrice: round2(basePrice * (1 - discount / 100)),
        promotionId: best?.id ?? null,
        promotionTitle: best?.title ?? null,
      });
    }

    if (options.onlyPromotions && slots.length === 0) continue;
    result.push({ court, closed: false, slots });
  }

  return result;
}
