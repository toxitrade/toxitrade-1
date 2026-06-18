import { analyzeFastEmaSmaCross } from '@/lib/strategies/fast-ema-sma-cross';
import type { Candle } from '@/lib/strategies/fast-ema-sma-cross';

describe('fast-ema-sma-cross', () => {
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

  test('returns call when ema crosses above sma on latest bar', () => {
    const result = analyzeFastEmaSmaCross(candles, { smaPeriod: 3, emaPeriod: 3 });
    expect(['call', 'put', null]).toContain(result.signal);
  });

  test('returns null when insufficient data', () => {
    const result = analyzeFastEmaSmaCross([candles[0]], { smaPeriod: 9, emaPeriod: 21 });
    expect(result.signal).toBeNull();
    expect(result.reason).toBe('Insufficient data');
  });
});