import type { FastEmaSmaCrossParams, StrategyResultBase, SignalDirection } from './types';

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

function sma(values: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const slice = values.slice(0, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

function ema(values: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  let prevEma = values[0];
  result.push(values[0]);
  for (let i = 1; i < values.length; i++) {
    const currEma = (values[i] - prevEma) * multiplier + prevEma;
    result.push(currEma);
    prevEma = currEma;
  }
  return result;
}

export function analyzeFastEmaSmaCross(
  candles: Candle[],
  params: FastEmaSmaCrossParams
): StrategyResultBase {
  if (candles.length < Math.max(params.smaPeriod, params.emaPeriod) + 1) {
    return { signal: null, reason: 'Insufficient data' };
  }

  const closes = candles.map(c => c.close);
  const smaSeries = sma(closes);
  const emaSeries = ema(closes, params.emaPeriod);

  const lastSma = smaSeries[smaSeries.length - 1];
  const prevSma = smaSeries[smaSeries.length - 2];
  const lastEma = emaSeries[emaSeries.length - 1];
  const prevEma = emaSeries[emaSeries.length - 2];

  const emaCrossedAbove = prevEma <= prevSma && lastEma > lastSma;
  const emaCrossedBelow = prevEma >= prevSma && lastEma < lastSma;

  if (emaCrossedAbove) {
    return { signal: 'call', reason: 'EMA crossed above SMA' };
  }
  if (emaCrossedBelow) {
    return { signal: 'put', reason: 'EMA crossed below SMA' };
  }

  return { signal: null, reason: 'No crossover detected' };
}