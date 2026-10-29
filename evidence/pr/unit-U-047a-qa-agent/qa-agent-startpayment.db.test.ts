import { count, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { holds, orders, paymentAttempts } from '@/server/db/schema';
import { PaymentsError, type PaymentsPort } from '@/server/ports/payments';
import { createFakePaymentsAdapter } from '@/server/ports/payments/fake';
import { formFor, holdFor, ordersFor, publishLegal } from './checkoutFixtures';
import { createFreshDatabase, serveNeonHttp, type FreshDatabase } from './harness';
import { seedBookable } from './holdFixtures';
import { testDevice } from '../deviceFixture';

const gateway = vi.hoisted(() => ({ port: null as null | PaymentsPort }));
vi.mock('@/server/ports/payments/gateway', () => ({
  getFakePayments: () => gateway.port,
}));
vi.mock('next/headers', async () => (await import('../deviceFixture')).nextHeadersMock);

let fresh: FreshDatabase;
let stop: () => Promise<void>;
let client: typeof import('@/server/db/client');
let action: typeof import('@/server/actions/checkout');
let termsId: string;
const fake = createFakePaymentsAdapter({ webhookSecret: 'w'.repeat(32), now: () => new Date() });
const createPayment = vi.fn<PaymentsPort['createPayment']>((i) => fake.createPayment(i));

beforeAll(async () => {
  fresh = await createFreshDatabase(process.env.DATABASE_URL_UNPOOLED ?? '');
  stop = await serveNeonHttp(fresh.url);
  vi.stubEnv('DATABASE_URL', fresh.url);
  client = await import('@/server/db/client');
  action = await import('@/server/actions/checkout');
  await testDevice('qa-a');
  await testDevice('qa-b');
  termsId = (await publishLegal(client.db, 'terms', 1)).id;
  gateway.port = { ...fake, createPayment } as PaymentsPort;
});
afterAll(async () => {
  await client.db.$client.end();
  await stop();
  await fresh.dispose();
});

const go = async (who: 'qa-a' | 'qa-b', holdId: string) => {
  await testDevice(who);
  return action.startPayment(formFor(holdId, termsId));
};
const totals = async () => {
  const [o] = await client.db.select({ n: count() }).from(orders);
  const [a] = await client.db.select({ n: count() }).from(paymentAttempts);
  return { o: o?.n, a: a?.n };
};

describe('qa-agent', () => {
  it('fresh hold', async () => {
    const a = await testDevice('qa-a');
    const hold = await holdFor(client.db, await seedBookable(client.db), a);
    const r = await go('qa-a', hold.id);
    expect(r.status).toBe('requires_payment');
    if (r.status !== 'requires_payment') return;
    expect(r.payment.clientSecret).toMatch(/^pay_/);
    expect(await ordersFor(client.db, hold.id)).toHaveLength(1);
    const [h] = await client.db.select().from(holds).where(eq(holds.id, hold.id));
    expect(h?.status).toBe('paying');
    expect(h?.payingUntil).not.toBeNull();
    const [ord] = await ordersFor(client.db, hold.id);
    const at = await client.db.select().from(paymentAttempts).where(eq(paymentAttempts.orderId, ord!.id));
    expect(at).toHaveLength(1);
  });

  it.each([1, 2, 3])('parallel twin calls (round %i)', async () => {
    const a = await testDevice('qa-a');
    const hold = await holdFor(client.db, await seedBookable(client.db), a);
    // the mocked request is shared, so both calls carry device qa-a
    const [x, y] = await Promise.all([
      action.startPayment(formFor(hold.id, termsId)),
      action.startPayment(formFor(hold.id, termsId)),
    ]);
    if (x.status !== 'requires_payment' || y.status !== 'requires_payment') throw new Error(`${x.status}/${y.status}`);
    expect(y.payment.clientSecret).toBe(x.payment.clientSecret);
    expect(y.orderId).toBe(x.orderId);
    const [ord] = await ordersFor(client.db, hold.id);
    expect(await ordersFor(client.db, hold.id)).toHaveLength(1);
    const at = await client.db.select().from(paymentAttempts).where(eq(paymentAttempts.orderId, ord!.id));
    expect(at).toHaveLength(1);
  });

  it('another device equals a missing hold, nothing written', async () => {
    const a = await testDevice('qa-a');
    const hold = await holdFor(client.db, await seedBookable(client.db), a);
    const before = await totals();
    createPayment.mockClear();
    const other = await go('qa-b', hold.id);
    const missing = await go('qa-b', '00000000-0000-4000-8000-000000000000');
    expect(other).toEqual(missing);
    expect(other).toEqual({ status: 'hold_expired', canRehold: false, spacesLeft: 0 });
    expect(await totals()).toEqual(before);
    expect(createPayment).not.toHaveBeenCalled();
    const [h] = await client.db.select().from(holds).where(eq(holds.id, hold.id));
    expect(h?.status).toBe('active');
  });

  it('expired hold writes nothing', async () => {
    const a = await testDevice('qa-a');
    const hold = await holdFor(client.db, await seedBookable(client.db), a, {
      createdAt: new Date(Date.now() - 60 * 60_000),
    });
    const before = await totals();
    const r = await go('qa-a', hold.id);
    expect(r.status).toBe('hold_expired');
    expect(await totals()).toEqual(before);
    expect(await ordersFor(client.db, hold.id)).toEqual([]);
  });

  it('sixth call', async () => {
    const a = await testDevice('qa-a');
    const hold = await holdFor(client.db, await seedBookable(client.db), a);
    for (let i = 0; i < 5; i++) expect((await go('qa-a', hold.id)).status).toBe('requires_payment');
    const before = await totals();
    expect(await go('qa-a', hold.id)).toEqual({ status: 'too_many_tries' });
    expect(await totals()).toEqual(before);
  });

  it('provider failure then retry', async () => {
    const a = await testDevice('qa-a');
    const hold = await holdFor(client.db, await seedBookable(client.db), a);
    createPayment.mockImplementationOnce(async (input) => {
      await fake.createPayment(input);
      throw new PaymentsError('provider_unavailable');
    });
    await expect(go('qa-a', hold.id)).rejects.toBeInstanceOf(PaymentsError);
    expect(await ordersFor(client.db, hold.id)).toHaveLength(1);
    const calls = createPayment.mock.calls.length;
    const r = await go('qa-a', hold.id);
    expect(r.status).toBe('requires_payment');
    expect(createPayment.mock.calls.length).toBe(calls); // no second provider payment
    const [ord] = await ordersFor(client.db, hold.id);
    const at = await client.db.select().from(paymentAttempts).where(eq(paymentAttempts.orderId, ord!.id));
    expect(at).toHaveLength(1);
    expect(at[0]?.providerPaymentId).toMatch(/^pay_/);
  });
});
