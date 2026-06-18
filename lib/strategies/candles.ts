export type { Candle } from './fast-ema-sma-cross';

export function buildCandlesFromTicks(ticks: { epoch: number; quote: number }[], periodSec: number): Candle[] {
  const buckets = new Map<number, number[]>();
  for (const tick of ticks) {
    const bucket = Math.floor(tick.epoch / periodSec) * periodSec;
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket)!.push(tick.quote);
  }

  const result: Candle[] = [];
  for (const [, prices] of buckets.entries()) {
    const open = prices[0];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const close = prices[prices.length - 1];
    result.push({ open, high, low, close });
  }
  return result.sort((a, b) => a.open - b.open);
}

export function fixtureCandles(): Candle[] {
  return [
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
}