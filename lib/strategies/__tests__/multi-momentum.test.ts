import { analyzeMultiMomentum } from '@/lib/strategies/multi-momentum';
import type { Candle } from '@/lib/strategies/fast-ema-sma-cross';

describe('multi-momentum', () => {
  const candles: Candle[] = [
    { open: 100, high: 102, low: 98, close: 100 },
    { open: 100, high: 103, low: 99, close: 102 },
    { open: 102, high: 105, low: 101, close: 104 },
    { open: 104, high: 108, low: 103, close: 107 },
    { open: 107, high: 110, low: 106, close: 109 },
    { open: 109, high: 113, low: 108, close: 112 },
    { open: 112, high: 115, low: 110, close: 114 },
    { open: 114, high: 118, low: 113, close: 117 },
    { open: 117, high: 120, low: 116, close: 119 },
    { open: 119, high: 122, low: 118, close: 121 },
  ];

  test('returns null when min confirmations not reached', () => {
    const result = analyzeMultiMomentum(candles, {
      minConfirmations: 3,
      rsiPeriod: 5,
      rsiHigh: 70,
      rsiLow: 30,
      smaFast: 3,
      smaSlow: 5,
      bbPeriod: 5,
      bbStdDev: 2,
      enabled: { rsi: true, stoch: false, macd: false, sma: true, bb: false },
    });
    expect(result.signal).toBeNull();
  });
});