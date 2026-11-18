import { randomUUID } from 'node:crypto'

export interface ChargeInput {
  billId: string
  patronId: string
  amountCents: number
}

export interface ChargeResult {
  ok: boolean
  ref: string
}

/**
 * The seam where a real processor plugs in. Implement `charge` against
 * Stripe (or similar) and return it from `getPaymentProvider`.
 */
export interface PaymentProvider {
  name: string
  charge(input: ChargeInput): Promise<ChargeResult>
}

/** Moves no money. Every charge succeeds instantly. */
const simulated: PaymentProvider = {
  name: 'simulated',
  async charge() {
    return { ok: true, ref: `sim_${randomUUID()}` }
  },
}

export function getPaymentProvider(): PaymentProvider {
  return simulated
}
