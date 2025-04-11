import { Geolocation } from './geolocation';

export enum ScooterStatus {
  AVAILABLE = 'available', // Ready to use
  IN_USE = 'in_use', // Currently being used
  LOW_BATTERY = 'low_battery', // Battery below threshold
  MAINTENANCE = 'maintenance', // Under maintenance/repair
  DISABLED = 'disabled', // Temporarily disabled
  RESERVED = 'reserved', // Reserved by a user
  OFFLINE = 'offline', // Not responding/out of service
}

export interface CreateScooter {
  name: string;
  status?: ScooterStatus;
  locked?: boolean;
  batteryLevel: number;
  geolocation: Geolocation;
}

export interface Scooter extends CreateScooter {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
