export enum ScooterStatus {
  AVAILABLE = 'available', // Pronto pra usar
  IN_USE = 'in_use', // Em uso
  LOW_BATTERY = 'low_battery', // Bateria abaixo do limite
  MAINTENANCE = 'maintenance', // Em manutenção/reparo
  DISABLED = 'disabled', // Desativado temporariamente
  RESERVED = 'reserved', // Reservado por um usuário
  OFFLINE = 'offline', // Fora de serviço
}
