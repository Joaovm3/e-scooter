export enum VoucherStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export interface CreateVoucher {
  code: string;
  amount: number;
  status: VoucherStatus;
  expiredAt: Date | null;
  usageLimit: number;
}

export interface Voucher extends CreateVoucher {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}
