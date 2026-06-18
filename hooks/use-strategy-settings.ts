'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_STRATEGIES, type StrategyId } from '@/store/strategies';
import { INDICATOR_KEYS, type IndicatorKey, type StrategyEnabledFlags } from '@/lib/strategies/types';

const STORAGE_KEY = 'strategy-panel-preferences';

type StrategyTradeType = 'manual' | 'bot';

interface PersistedStrategySettings {
  tradeType: StrategyTradeType;
  strategyId: StrategyId;
  enabledIndicators: Record<StrategyId, StrategyEnabledFlags>;
}

function getDefaultEnabledIndicators(): Record<StrategyId, StrategyEnabledFlags> {
  return (Object.keys(DEFAULT_STRATEGIES) as StrategyId[]).reduce((acc, strategyId) => {
    acc[strategyId] = { ...DEFAULT_STRATEGIES[strategyId].enabled };
    return acc;
  }, {} as Record<StrategyId, StrategyEnabledFlags>);
}

const defaultSettings: PersistedStrategySettings = {
  tradeType: 'manual',
  strategyId: 'fast-ema-sma-cross',
  enabledIndicators: getDefaultEnabledIndicators(),
};

function isStrategyTradeType(value: unknown): value is StrategyTradeType {
  return value === 'manual' || value === 'bot';
}

function isStrategyId(value: unknown): value is StrategyId {
  return typeof value === 'string' && value in DEFAULT_STRATEGIES;
}

function isValidEnabledIndicators(value: unknown): value is Record<StrategyId, StrategyEnabledFlags> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Record<StrategyId, StrategyEnabledFlags>>;

  return (Object.keys(DEFAULT_STRATEGIES) as StrategyId[]).every((strategyId) => {
    const indicators = candidate[strategyId];
    if (!indicators || typeof indicators !== 'object') return false;
    return INDICATOR_KEYS.every((indicator) => typeof indicators[indicator] === 'boolean');
  });
}

function loadStrategySettings(): PersistedStrategySettings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    const parsed = JSON.parse(stored) as Partial<PersistedStrategySettings>;
    return {
      tradeType: isStrategyTradeType(parsed.tradeType) ? parsed.tradeType : defaultSettings.tradeType,
      strategyId: isStrategyId(parsed.strategyId) ? parsed.strategyId : defaultSettings.strategyId,
      enabledIndicators: isValidEnabledIndicators(parsed.enabledIndicators)
        ? (parsed.enabledIndicators as Record<StrategyId, StrategyEnabledFlags>)
        : defaultSettings.enabledIndicators,
    };
  } catch {
    return defaultSettings;
  }
}

function saveStrategySettings(settings: PersistedStrategySettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useStrategySettings() {
  const [settings, setSettings] = useState<PersistedStrategySettings>(() => loadStrategySettings());

  useEffect(() => {
    saveStrategySettings(settings);
  }, [settings]);

  const setTradeType = useCallback((tradeType: StrategyTradeType) => {
    setSettings(prev => ({ ...prev, tradeType }));
  }, []);

  const setStrategyId = useCallback((strategyId: StrategyId) => {
    setSettings(prev => ({ ...prev, strategyId }));
  }, []);

  const setIndicatorEnabled = useCallback((strategyId: StrategyId, indicator: IndicatorKey, enabled: boolean) => {
    setSettings(prev => {
      const current = prev.enabledIndicators[strategyId] ?? DEFAULT_STRATEGIES[strategyId]?.enabled ?? {};
      return {
        ...prev,
        enabledIndicators: {
          ...prev.enabledIndicators,
          [strategyId]: {
            ...current,
            [indicator]: enabled,
          },
        },
      };
    });
  }, []);

  return {
    tradeType: settings.tradeType,
    strategyId: settings.strategyId,
    enabledIndicators: settings.enabledIndicators,
    setTradeType,
    setStrategyId,
    setIndicatorEnabled,
  };
}
