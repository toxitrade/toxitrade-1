import type { StrategyId, StrategyParams } from './types';
import { runBacktest, type BacktestResult } from './backtest';
import { fixtureCandles, type Candle } from './candles';

export interface OptimizationCandidate {
  params: StrategyParams;
  result: BacktestResult;
}

export interface OptimizeStrategyParams {
  strategyId: StrategyId;
  baseParams: StrategyParams;
  candidates: StrategyParams[];
  candles?: Candle[];
}

export function optimizeStrategy({
  strategyId,
  baseParams,
  candidates,
  candles = fixtureCandles(),
}: OptimizeStrategyParams): OptimizationCandidate[] {
  const merged = candidates.length > 0 ? candidates : [baseParams];

  return merged
    .map(params => ({
      params,
      result: runBacktest({ candles, strategyId, params }),
    }))
    .sort((a, b) => b.result.winRate - a.result.winRate);
}