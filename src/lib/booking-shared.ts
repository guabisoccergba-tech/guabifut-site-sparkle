export type SlotStatus = "livre" | "reservado" | "bloqueado";

export interface CourtInfo {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  price_per_hour: number;
  slot_minutes: number;
  active: boolean;
  sort_order: number;
}

export interface Slot {
  start: string; // HH:MM
  end: string; // HH:MM
  status: SlotStatus;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  promotionId: string | null;
  promotionTitle: string | null;
}

export interface CourtAvailability {
  court: CourtInfo;
  closed: boolean;
  slots: Slot[];
}

export const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export const COURT_KINDS = [
  { value: "society", label: "Campo Society" },
  { value: "areia", label: "Quadra de Areia" },
  { value: "poliesportiva", label: "Quadra Poliesportiva" },
  { value: "outro", label: "Outro" },
];

export function toMinutes(time: string): number {
  const [h, m] = time.slice(0, 5).split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Weekday (0=domingo) of a YYYY-MM-DD string, timezone-safe. */
export function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}

export function formatDateLong(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  return `${WEEKDAY_LABELS[date.getUTCDay()]}, ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDaysISO(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
