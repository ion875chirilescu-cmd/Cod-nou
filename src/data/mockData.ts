import { Barber, Service, User } from '@/types';

export const SERVICES: Service[] = [
  { id: 's1', name: 'Tunsoare clasică', price: 60, duration: 30, icon: 'cut-outline' },
  { id: 's2', name: 'Tuns + barbă', price: 90, duration: 45, icon: 'man-outline' },
  { id: 's3', name: 'Aranjat barbă', price: 40, duration: 20, icon: 'sparkles-outline' },
  { id: 's4', name: 'Tuns copii', price: 45, duration: 30, icon: 'happy-outline' },
  { id: 's5', name: 'Ras cu brici', price: 50, duration: 25, icon: 'flame-outline' },
  { id: 's6', name: 'Styling & coafat', price: 70, duration: 35, icon: 'color-wand-outline' },
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Andrei Popescu',
    specialty: 'Fade & tunsori moderne',
    rating: 4.9,
    reviews: 213,
    emoji: '💈',
    bio: 'Peste 10 ani de experiență în fade-uri și tunsori moderne. Atenție maximă la detalii.',
    serviceIds: ['s1', 's2', 's5', 's6'],
  },
  {
    id: 'b2',
    name: 'Mihai Ionescu',
    specialty: 'Barbă & ras clasic',
    rating: 4.8,
    reviews: 187,
    emoji: '🧔',
    bio: 'Specialist în aranjat barbă și ras tradițional cu briciul. Stil clasic, rezultat impecabil.',
    serviceIds: ['s1', 's3', 's5'],
  },
  {
    id: 'b3',
    name: 'Cristian Dumitru',
    specialty: 'Tunsori copii & familie',
    rating: 4.7,
    reviews: 142,
    emoji: '✂️',
    bio: 'Răbdător și prietenos, perfect pentru cei mici. Toată familia într-un singur loc.',
    serviceIds: ['s1', 's4', 's6'],
  },
  {
    id: 'b4',
    name: 'Alexandru Radu',
    specialty: 'Styling & coafat',
    rating: 4.9,
    reviews: 256,
    emoji: '💇',
    bio: 'Creativ și mereu la curent cu tendințele. Stilul tău, reinventat.',
    serviceIds: ['s1', 's2', 's6'],
  },
];

/** Conturi demo preîncărcate ca să poți testa rapid ambele roluri. */
export const DEMO_USERS: User[] = [
  {
    id: 'u-client',
    name: 'Client Demo',
    email: 'client@demo.com',
    password: '1234',
    role: 'client',
  },
  {
    id: 'u-barber',
    name: 'Andrei Popescu',
    email: 'frizer@demo.com',
    password: '1234',
    role: 'barber',
    barberId: 'b1',
  },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getBarber(id: string): Barber | undefined {
  return BARBERS.find((b) => b.id === id);
}
