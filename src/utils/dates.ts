const ZILE = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
const LUNI = [
  'ian', 'feb', 'mar', 'apr', 'mai', 'iun',
  'iul', 'aug', 'sep', 'oct', 'noi', 'dec',
];

export interface DayOption {
  iso: string; // yyyy-mm-dd
  weekday: string;
  day: number;
  month: string;
  isToday: boolean;
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Următoarele `count` zile începând de azi. */
export function nextDays(count = 14): DayOption[] {
  const out: DayOption[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: toIso(d),
      weekday: ZILE[d.getDay()],
      day: d.getDate(),
      month: LUNI[d.getMonth()],
      isToday: i === 0,
    });
  }
  return out;
}

/** Sloturi orare fixe pentru program (09:00 - 18:30, la 30 min). */
export function timeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${ZILE[date.getDay()]}, ${d} ${LUNI[m - 1]} ${y}`;
}
