import type {
  StrategyId,
  StrategyConfig,
  FastEmaSmaCrossParams,
  MultiMomentumParams,
  AdaptiveConfluenceParams,
  DojiParams,
  StrategyEnabledFlags,
} from '@/lib/strategies/types';

export type { StrategyId } from '@/lib/strategies/types';

function boolFlags(partial: Partial<StrategyEnabledFlags> = {}): StrategyEnabledFlags {
  return {
    rsi: partial.rsi ?? false,
    stoch: partial.stoch ?? false,
    macd: partial.macd ?? false,
    sma: partial.sma ?? false,
    ema: partial.ema ?? false,
    bb: partial.bb ?? false,
  };
}

export const DEFAULT_STRATEGIES: Record<StrategyId, StrategyConfig> = {
  'fast-ema-sma-cross': {
    id: 'fast-ema-sma-cross',
    enabled: boolFlags({ ema: true, sma: true }),
    params: {
      smaPeriod: 9,
      emaPeriod: 21,
    } satisfies FastEmaSmaCrossParams,
  },
  'multi-momentum': {
    id: 'multi-momentum',
    enabled: boolFlags({ rsi: true, sma: true, bb: true }),
    params: {
      minConfirmations: 3,
      rsiPeriod: 7,
      rsiHigh: 70,
      rsiLow: 30,
      stochPeriod: 14,
      smaFast: 9,
      smaSlow: 21,
      bbPeriod: 20,
      bbStdDev: 2,
    } satisfies MultiMomentumParams,
  },
  'adaptive-confluence': {
    id: 'adaptive-confluence',
    enabled: boolFlags({ rsi: true, ema: true, macd: true, bb: true }),
    params: {
      emaFast: 20,
      emaSlow: 50,
      rsiPeriod: 14,
      rsiBullMin: 45,
      rsiBullMax: 70,
      rsiBearMin: 30,
      rsiBearMax: 55,
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9,
      bbPeriod: 20,
      bbStdDev: 2,
      minScore: 3,
      coolDownCandles: 8,
    } satisfies AdaptiveConfluenceParams,
  },
  doji: {
    id: 'doji',
    enabled: boolFlags({ rsi: true, bb: true }),
    params: {
      rsiPeriod: 14,
      rsiLow: 30,
      rsiHigh: 70,
      useBB: true,
      bbPeriod: 20,
    } satisfies DojiParams,
  },
};

export type StrategyConfigState = {
  activeId: StrategyId;
  items: Record<StrategyId, StrategyConfig>;
};

export const INITIAL_STRATEGY_CONFIG: StrategyConfigState = {
  activeId: 'fast-ema-sma-cross',
  items: DEFAULT_STRATEGIES,
};

export function getActiveStrategyConfig(state: StrategyConfigState): StrategyConfig {
  return state.items[state.activeId];
}

export function setActiveStrategyId(state: StrategyConfigState, id: StrategyId): StrategyConfigState {
  if (!(id in state.items)) return state;

  return {
    ...state,
    activeId: id,
  };
}

export function getDefaultStrategyParams(id: StrategyId) {
  return DEFAULT_STRATEGIES[id].params;
}