export interface VoucherDefinition {
  type: 'percent' | 'flat';
  value: number;
}

// Single source of truth for appointment voucher codes, shared between the
// main booking flow (AppointmentsView), the in-chat booking card
// (ChatBookingCard), and the patient's Rewards Catalog (loyaltyRewards in
// mockData.ts) so a reward's code always applies the discount it advertises.
export const APPOINTMENT_VOUCHERS: Record<string, VoucherDefinition> = {
  GLOW10: { type: 'percent', value: 10 },
  REVEAL50: { type: 'flat', value: 50 },
  WELCOME100: { type: 'flat', value: 100 },
  REVEAL200OFF: { type: 'flat', value: 200 },
  'REVEAL-LED-FREE': { type: 'flat', value: 350 },
  'REVEAL-RIYADH-500': { type: 'flat', value: 500 }
};

export function calculateVoucherDiscount(code: string, baseFee: number): number | null {
  const voucher = APPOINTMENT_VOUCHERS[code.trim().toUpperCase()];
  if (!voucher) return null;
  return voucher.type === 'percent' ? Math.round((baseFee * voucher.value) / 100) : voucher.value;
}
