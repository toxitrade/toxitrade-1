import { optimizeStrategy } from '@/lib/strategies/optimizer';
import { fixtureCandles } from '@/lib/strategies/candles';

describe('optimizer', () => {
  test('sorts candidates by win rate', () => {
    const candidates = [
      { smaPeriod: 2, emaPeriod: 2 },
      { smaPeriod: 3, emaPeriod: 3 },
    ];
    const result = optimizeStrategy({
      strategyId: 'fast-ema-sma-cross',
      baseParams: candidates[0],
      candidates,
      candles: fixtureCandles(),
    });
    expect(result.length).toBe(2);
    expect(result[0].result.winRate).toBeGreaterThanOrEqual(result[1].result.winRate);
  });
});