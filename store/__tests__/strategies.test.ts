import { DEFAULT_STRATEGIES, getDefaultStrategyParams, setActiveStrategyId, INITIAL_STRATEGY_CONFIG } from '@/store/strategies';
import type { StrategyId } from '@/lib/strategies/types';

describe('strategies store', () => {
  test('default strategy config returns valid defaults', () => {
    const cfg = getDefaultStrategyParams('fast-ema-sma-cross');
    expect(cfg).toHaveProperty('smaPeriod');
    expect(cfg).toHaveProperty('emaPeriod');
  });

  test('DEFAULT_STRATEGIES contains all strategy ids', () => {
    const ids: StrategyId[] = ['fast-ema-sma-cross', 'multi-momentum', 'adaptive-confluence', 'doji'];
    ids.forEach(id => {
      expect(DEFAULT_STRATEGIES[id]).toBeDefined();
      expect(DEFAULT_STRATEGIES[id].id).toBe(id);
    });
  });

  test('INITIAL_STRATEGY_CONFIG has correct defaults', () => {
    expect(INITIAL_STRATEGY_CONFIG.activeId).toBe('fast-ema-sma-cross');
    expect(INITIAL_STRATEGY_CONFIG.items).toBe(DEFAULT_STRATEGIES);
  });

  test('setActiveStrategyId updates activeId', () => {
    const state = INITIAL_STRATEGY_CONFIG;
    const newState = setActiveStrategyId(state, 'doji');
    expect(newState.activeId).toBe('doji');
  });
});