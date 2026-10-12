import { PricePeriod } from '../../common/enums/price-period.enum';
import { PropertyType } from '../../common/enums/property-type.enum';
import { Role } from '../../common/enums/role.enum';

const { APARTMENT, VILLA, MOTEL, CABIN, OTHER } = PropertyType;
const { PER_NIGHT, PER_MONTH } = PricePeriod;

export const AMENITIES = [
  { slug: 'wifi', name: 'Wi-Fi' },
  { slug: 'pool', name: 'Pool' },
  { slug: 'parking', name: 'Parking' },
  { slug: 'air-conditioning', name: 'Air conditioning' },
  { slug: 'kitchen', name: 'Kitchen' },
  { slug: 'washer', name: 'Washer' },
  { slug: 'tv', name: 'TV' },
  { slug: 'balcony', name: 'Balcony' },
  { slug: 'pet-friendly', name: 'Pet friendly' },
  { slug: 'gym', name: 'Gym' },
  { slug: 'bbq', name: 'BBQ grill' },
  { slug: 'fireplace', name: 'Fireplace' },
];

// Dev-only accounts. Production gets its admin from a separate script (Task 27).
export const USERS = [
  { email: 'admin@example.com', password: 'Admin12345!', firstName: 'Sam', lastName: 'Admin', role: Role.ADMIN },
  { email: 'owner@example.com', password: 'Owner12345!', firstName: 'Olivia', lastName: 'Owner', role: Role.OWNER },
];

export const CITIES: Record<string, { lat: number; lng: number }> = {
  Lisbon: { lat: 38.7223, lng: -9.1393 },
  Barcelona: { lat: 41.3874, lng: 2.1686 },
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Athens: { lat: 37.9838, lng: 23.7275 },
  Marrakech: { lat: 31.6295, lng: -7.9811 },
};

export type SeedStatus = 'live' | 'draft' | 'deleted';

export interface SeedProperty {
  title: string;
  type: PropertyType;
  city: string;
  price: number;
  period: PricePeriod;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  status: SeedStatus;
}

const prop = (
  title: string, type: PropertyType, city: string, price: number, period: PricePeriod,
  bedrooms: number, bathrooms: number, maxGuests: number, amenities: string[],
  status: SeedStatus = 'live',
): SeedProperty => ({ title, type, city, price, period, bedrooms, bathrooms, maxGuests, amenities, status });

export const PROPERTIES: SeedProperty[] = [
  prop('Sunny Studio near the Old Town', APARTMENT, 'Lisbon', 850, PER_MONTH, 1, 1, 2, ['wifi', 'air-conditioning', 'kitchen', 'washer']),
  prop('Two-Bedroom with River Views', APARTMENT, 'Lisbon', 1400, PER_MONTH, 2, 1, 4, ['wifi', 'balcony', 'kitchen', 'tv', 'washer']),
  prop('Modern Loft in Eixample', APARTMENT, 'Barcelona', 1650, PER_MONTH, 2, 2, 4, ['wifi', 'air-conditioning', 'gym', 'tv']),
  prop('Cozy Flat by the Beach', APARTMENT, 'Barcelona', 1200, PER_MONTH, 1, 1, 3, ['wifi', 'balcony', 'kitchen']),
  prop('Bosphorus View Apartment', APARTMENT, 'Istanbul', 1100, PER_MONTH, 2, 1, 4, ['wifi', 'air-conditioning', 'balcony', 'tv']),
  prop('Downtown Studio Suite', APARTMENT, 'Dubai', 1500, PER_MONTH, 1, 1, 2, ['wifi', 'air-conditioning', 'gym', 'pool', 'parking']),
  prop('Family Apartment near the Acropolis', APARTMENT, 'Athens', 950, PER_MONTH, 3, 2, 6, ['wifi', 'air-conditioning', 'kitchen', 'washer', 'tv']),
  prop('Riad-style Apartment', APARTMENT, 'Marrakech', 700, PER_MONTH, 2, 1, 4, ['wifi', 'air-conditioning', 'kitchen'], 'draft'),
  prop('Hillside Villa with Private Pool', VILLA, 'Lisbon', 520, PER_NIGHT, 4, 3, 8, ['wifi', 'pool', 'parking', 'air-conditioning', 'bbq', 'kitchen']),
  prop('Seaside Villa', VILLA, 'Barcelona', 680, PER_NIGHT, 5, 4, 10, ['wifi', 'pool', 'parking', 'air-conditioning', 'bbq', 'tv']),
  prop('Palm Villa Retreat', VILLA, 'Dubai', 890, PER_NIGHT, 6, 5, 12, ['wifi', 'pool', 'gym', 'parking', 'air-conditioning', 'tv']),
  prop('Garden Villa', VILLA, 'Athens', 340, PER_NIGHT, 3, 2, 6, ['wifi', 'pool', 'parking', 'bbq', 'kitchen']),
  prop('Courtyard Villa with Pool', VILLA, 'Marrakech', 410, PER_NIGHT, 4, 3, 8, ['wifi', 'pool', 'air-conditioning', 'kitchen']),
  prop('Old Town Stone Villa', VILLA, 'Istanbul', 300, PER_NIGHT, 3, 2, 6, ['wifi', 'fireplace', 'kitchen', 'parking'], 'draft'),
  prop('Roadside Motel Room', MOTEL, 'Lisbon', 55, PER_NIGHT, 1, 1, 2, ['wifi', 'parking', 'tv', 'air-conditioning']),
  prop('Highway Inn Double Room', MOTEL, 'Barcelona', 70, PER_NIGHT, 1, 1, 2, ['wifi', 'parking', 'tv']),
  prop('Budget Motel Family Room', MOTEL, 'Istanbul', 60, PER_NIGHT, 2, 1, 4, ['wifi', 'parking', 'tv', 'air-conditioning']),
  prop('Airport Motel Suite', MOTEL, 'Dubai', 90, PER_NIGHT, 1, 1, 3, ['wifi', 'parking', 'air-conditioning', 'tv']),
  prop('Mountain Cabin with Fireplace', CABIN, 'Athens', 140, PER_NIGHT, 2, 1, 4, ['wifi', 'fireplace', 'kitchen', 'bbq']),
  prop('Lakeside Log Cabin', CABIN, 'Lisbon', 120, PER_NIGHT, 2, 1, 5, ['fireplace', 'kitchen', 'pet-friendly', 'parking']),
  prop('Forest Retreat Cabin', CABIN, 'Barcelona', 160, PER_NIGHT, 3, 2, 6, ['wifi', 'fireplace', 'bbq', 'pet-friendly'], 'draft'),
  prop('A-frame Cabin Getaway', CABIN, 'Marrakech', 95, PER_NIGHT, 1, 1, 2, ['wifi', 'fireplace', 'pet-friendly']),
  prop('Desert Cabin', CABIN, 'Dubai', 210, PER_NIGHT, 2, 1, 4, ['air-conditioning', 'bbq', 'parking'], 'deleted'),
  prop('Converted Houseboat', OTHER, 'Lisbon', 130, PER_NIGHT, 1, 1, 3, ['wifi', 'kitchen', 'balcony']),
  prop('Traditional Tent Lodge', OTHER, 'Marrakech', 85, PER_NIGHT, 1, 1, 4, ['wifi', 'bbq', 'pet-friendly']),
];