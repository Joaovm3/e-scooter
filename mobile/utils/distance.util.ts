import { Geolocation } from '@/types/geolocation';

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula
 * @param lat1 Initial latitude
 * @param lon1 Initial longitude
 * @param lat2 Final latitude
 * @param lon2 Final longitude
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(2)); // Return with 2 decimal places
}

export function calculateDistanceToScooter(
  userLocation: Geolocation,
  scooterLocation: Geolocation,
): { value: number; unit: 'm' | 'km' } {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (userLocation.latitude * Math.PI) / 180;
  const φ2 = (scooterLocation.latitude * Math.PI) / 180;
  const Δφ =
    ((scooterLocation.latitude - userLocation.latitude) * Math.PI) / 180;
  const Δλ =
    ((scooterLocation.longitude - userLocation.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Return in km if distance > 1000m
  if (distance > 1000) {
    return { value: Number((distance / 1000).toFixed(1)), unit: 'km' };
  }

  return { value: Math.round(distance), unit: 'm' };
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
