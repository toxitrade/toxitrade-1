export type StrategyId = 'fast-ema-sma-cross' | 'multi-momentum' | 'adaptive-confluence' | 'doji';

export type SignalDirection = 'call' | 'put';

export type IndicatorKey = 'rsi' | 'stoch' | 'macd' | 'sma' | 'ema' | 'bb';

export type StrategyEnabledFlags = Record<IndicatorKey, boolean>;

export type StrategySignal = SignalDirection | null;

export interface StrategyResultBase {
  signal: StrategySignal;
  reason: string;
}

export interface FastEmaSmaCrossParams {
  smaPeriod: number;
  emaPeriod: number;
}

export interface MultiMomentumParams {
  minConfirmations: number;
  rsiPeriod: number;
  rsiHigh: number;
  rsiLow: number;
  stochPeriod: number;
  smaFast: number;
  smaSlow: number;
  bbPeriod: number;
  bbStdDev: number;
}

export interface AdaptiveConfluenceParams {
  emaFast: number;
  emaSlow: number;
  rsiPeriod: number;
  rsiBullMin: number;
  rsiBullMax: number;
  rsiBearMin: number;
  rsiBearMax: number;
  macdFast: number;
  macdSlow: number;
  macdSignal: number;
  bbPeriod: number;
  bbStdDev: number;
  minScore: number;
  coolDownCandles: number;
}

export interface DojiParams {
  rsiPeriod: number;
  rsiLow: number;
  rsiHigh: number;
  useBB: boolean;
  bbPeriod: number;
}

export type StrategyParams =
  | FastEmaSmaCrossParams
  | MultiMomentumParams
  | AdaptiveConfluenceParams
  | DojiParams;

export interface StrategyConfig {
  id: StrategyId;
  enabled: StrategyEnabledFlags;
  params: StrategyParams;
}

export const STRATEGY_NAMES: Record<StrategyId, string> = {
  'fast-ema-sma-cross': 'EMA/SMA Cross Fast',
  'multi-momentum': 'Multi Momentum',
  'adaptive-confluence': 'Adaptive Confluence',
  doji: 'Doji',
};

export const STRATEGY_IDS = Object.keys(STRATEGY_NAMES) as StrategyId[];
