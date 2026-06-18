import { buildCandlesFromTicks, fixtureCandles } from '@/lib/strategies/candles';

describe('candles', () => {
  test('build candles groups ticks by period', () => {
    const ticks = [
      { epoch: 100, quote: 100 },
      { epoch: 101, quote: 101 },
      { epoch: 110, quote: 102 },
      { epoch: 111, quote: 103 },
    ];
    const candles = buildCandlesFromTicks(ticks, 10);
    expect(candles.length).toBeGreaterThan(0);
    expect(candles[0]).toHaveProperty('open');
    expect(candles[0]).toHaveProperty('high');
    expect(candles[0]).toHaveProperty('low');
    expect(candles[0]).toHaveProperty('close');
  });

  test('fixtureCandles returns non-empty array', () => {
    const candles = fixtureCandles();
    expect(candles.length).toBe(10);
  });
});