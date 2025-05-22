import { ScooterStatus } from '../enums/scooter-status.enum';

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export class ScooterDto {
  id: string;
  name: string;
  status: ScooterStatus;
  locked: boolean;
  batteryLevel: number;
  geolocation: Geolocation;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TrackingScooter {
  id: string;
  geolocation: Geolocation;
  batteryLevel: number;
}
