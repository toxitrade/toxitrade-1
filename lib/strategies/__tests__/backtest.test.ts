import { runBacktest } from '@/lib/strategies/backtest';
import { fixtureCandles } from '@/lib/strategies/candles';

describe('backtest', () => {
  test('runs backtest and records win/loss stats', () => {
    const candles = fixtureCandles();
    const result = runBacktest({
      candles,
      strategyId: 'fast-ema-sma-cross',
      params: { smaPeriod: 2, emaPeriod: 2 },
    });
    expect('win' in result).toBe(true);
    expect('loss' in result).toBe(true);
    expect(typeof result.winRate).toBe('number');
  });
});