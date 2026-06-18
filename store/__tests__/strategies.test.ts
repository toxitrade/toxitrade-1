import { DEFAULT_STRATEGIES, getDefaultStrategyParams, setActiveStrategyId, StrategyId } from '@/store/strategies';

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
});