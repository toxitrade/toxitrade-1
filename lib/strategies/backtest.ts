import type { StrategyId, StrategyConfig, StrategySignal } from './types';
import type { Candle } from './fast-ema-sma-cross';
import { analyzeFastEmaSmaCross } from './fast-ema-sma-cross';
import { analyzeMultiMomentum } from './multi-momentum';
import { fixtureCandles } from './candles';

export interface BacktestResult {
  strategyId: StrategyId;
  win: number;
  loss: number;
  winRate: number;
  signals: { direction: 'call' | 'put'; price: number; index: number }[];
  rawResults: { signal: StrategySignal; index: number }[];
}

type StrategyRunner = (candles: Candle[], params: unknown) => { signal: StrategySignal; reason: string };

const runners: Record<StrategyId, StrategyRunner> = {
  'fast-ema-sma-cross': (c, p) => analyzeFastEmaSmaCross(c, p as Parameters<typeof analyzeFastEmaSmaCross>[1]),
  'multi-momentum': () => ({ signal: null, reason: 'Not implemented yet' }),
  'adaptive-confluence': () => ({ signal: null, reason: 'Not implemented yet' }),
  doji: () => ({ signal: null, reason: 'Not implemented yet' }),
};

export function runBacktest(config: {
  candles: Candle[];
  strategyId: StrategyId;
  params: unknown;
}): BacktestResult {
  const { candles, strategyId, params } = config;
  const runner = runners[strategyId];
  const signals: BacktestResult['signals'] = [];
  const rawResults: BacktestResult['rawResults'] = [];

  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);
    const { signal } = runner(slice, params);
    rawResults.push({ signal, index: i });

    if (signal) {
      signals.push({ direction: signal, price: candles[i].close, index: i });
    }
  }

  const win = signals.filter(s => s.direction === 'call').length;
  const loss = signals.filter(s => s.direction === 'put').length;
  const total = win + loss;

  return {
    strategyId,
    win,
    loss,
    winRate: total > 0 ? win / total : 0,
    signals,
    rawResults,
  };
}