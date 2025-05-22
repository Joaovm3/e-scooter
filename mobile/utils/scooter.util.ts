import { ScooterStatus } from '@/types/scooter';

export const getBatteryColor = (batteryLevel: number) => {
  const batteryColorLevels = [
    { limit: 10, color: '#FF3131' },
    { limit: 20, color: 'yellow' },
    { limit: 100, color: '#00C853' },
  ];

  const color = batteryColorLevels.find((level) => batteryLevel <= level.limit);
  return color
    ? color.color
    : batteryColorLevels[batteryColorLevels.length - 1].color;
};

export const getScooterStatus = (
  status: ScooterStatus | undefined = undefined,
) => {
  switch (status) {
    case ScooterStatus.AVAILABLE:
      return 'Disponível';
    case ScooterStatus.IN_USE:
      return 'Em uso';
    case ScooterStatus.DISABLED:
      return 'Indisponível';
    case ScooterStatus.LOW_BATTERY:
      return 'Bateria baixa';
    case ScooterStatus.MAINTENANCE:
      return 'Manutenção';
    case ScooterStatus.OFFLINE:
      return 'Offline';
    case ScooterStatus.RESERVED:
      return 'Reservado';
    default:
      return 'Desconhecido';
  }
};

export const getScooterStatusColor = (status: ScooterStatus) => {
  switch (status) {
    case ScooterStatus.AVAILABLE:
      return '#00C853';
    case ScooterStatus.IN_USE:
      return '#FF9800';
    case ScooterStatus.DISABLED:
      return '#FF3131';
    case ScooterStatus.LOW_BATTERY:
      return 'yellow';
    case ScooterStatus.MAINTENANCE:
      return '#FF9800';
    case ScooterStatus.OFFLINE:
      return '#FF3131';
    case ScooterStatus.RESERVED:
      return '#FF9800';
    default:
      return 'gray';
  }
};
