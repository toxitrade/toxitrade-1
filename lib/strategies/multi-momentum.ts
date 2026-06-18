import type { MultiMomentumParams, StrategyResultBase } from './types';
import { Candle } from './fast-ema-sma-cross';

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

function rsi(values: number[], period: number): number[] {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      result.push(50);
      gains.push(0);
      losses.push(0);
    } else {
      const diff = values[i] - values[i - 1];
      gains.push(Math.max(diff, 0));
      losses.push(Math.abs(Math.min(diff, 0)));
    }
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < values.length; i++) {
    if (i < period) {
      result.push(50);
    } else {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - rs / (1 + rs));
    }
  }
  return result;
}

export function analyzeMultiMomentum(
  candles: Candle[],
  params: MultiMomentumParams & { enabled: { rsi: boolean; stoch: boolean; macd: boolean; sma: boolean; bb: boolean } }
): StrategyResultBase {
  const { enabled, minConfirmations, rsiPeriod, rsiHigh, rsiLow, smaFast, smaSlow, bbPeriod, bbStdDev } = params;
  const closes = candles.map(c => c.close);
  let score = 0;

  if (enabled.rsi && candles.length > rsiPeriod) {
    const rsiVals = rsi(closes, rsiPeriod);
    const last = rsiVals[rsiVals.length - 1];
    if (last < rsiLow) score++;
    else if (last > rsiHigh) score--;
  }

  if (enabled.sma && candles.length > Math.max(smaFast, smaSlow)) {
    const smaF = sma(closes);
    const smaS = sma(closes);
    const price = closes[closes.length - 1];
    if (price > smaF[smaF.length - 1] && smaF[smaF.length - 1] > smaS[smaS.length - 1]) score++;
    else if (price < smaF[smaF.length - 1] && smaF[smaF.length - 1] < smaS[smaS.length - 1]) score--;
  }

  if (score >= minConfirmations) return { signal: 'call', reason: 'Multi confirmation bullish' };
  if (score <= -minConfirmations) return { signal: 'put', reason: 'Multi confirmation bearish' };
  return { signal: null, reason: 'Insufficient confirmations' };
}