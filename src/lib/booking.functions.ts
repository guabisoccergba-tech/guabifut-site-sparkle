import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const availabilityInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  courtId: z.string().uuid().optional(),
  onlyPromotions: z.boolean().optional(),
});

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => availabilityInput.parse(data))
  .handler(async ({ data }) => {
    const { buildAvailability } = await import("./availability.server");
    return buildAvailability(data.date, {
      courtId: data.courtId,
      onlyPromotions: data.onlyPromotions ?? false,
    });
  });

export const listPublicCourts = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicClient } = await import("./availability.server");
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("courts")
    .select("id, name, kind, description, price_per_hour, slot_minutes, active, sort_order")
    .eq("active", true)
    .order("sort_order");
  return data ?? [];
});

const createBookingInput = z.object({
  courtId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createBookingInput.parse(data))
  .handler(async ({ data, context }) => {
    const { buildAvailability } = await import("./availability.server");
    const availability = await buildAvailability(data.date, { courtId: data.courtId });
    const entry = availability[0];
    if (!entry || entry.closed) throw new Error("Quadra fechada nesta data.");
    const slot = entry.slots.find((s) => s.start === data.start);
    if (!slot) throw new Error("Horário indisponível.");
    if (slot.status !== "livre") throw new Error("Este horário já foi reservado.");

    const { data: inserted, error } = await context.supabase
      .from("bookings")
      .insert({
        court_id: data.courtId,
        user_id: context.userId,
        booking_date: data.date,
        start_time: slot.start,
        end_time: slot.end,
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email || null,
        base_price: slot.basePrice,
        discount_percent: slot.discountPercent,
        final_price: slot.finalPrice,
        promotion_id: slot.promotionId,
        notes: data.notes || null,
        status: "pendente",
      })
      .select("id, booking_date, start_time, end_time, base_price, discount_percent, final_price")
      .single();

    if (error) {
      if (error.code === "23505") throw new Error("Este horário acabou de ser reservado por outra pessoa.");
      throw new Error(error.message);
    }

    return { booking: inserted, courtName: entry.court.name };
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("id, booking_date, start_time, end_time, status, base_price, discount_percent, final_price, courts(name)")
      .eq("user_id", context.userId)
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const cancelMyBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: "cancelada" })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { userId: context.userId, isAdmin: data === true };
  });
