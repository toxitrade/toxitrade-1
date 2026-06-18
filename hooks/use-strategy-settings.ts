'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_STRATEGIES, type StrategyId } from '@/store/strategies';

const STORAGE_KEY = 'strategy-panel-preferences';

type StrategyTradeType = 'manual' | 'bot';

interface PersistedStrategySettings {
  tradeType: StrategyTradeType;
  strategyId: StrategyId;
}

const defaultSettings: PersistedStrategySettings = {
  tradeType: 'manual',
  strategyId: 'fast-ema-sma-cross',
};

function isStrategyTradeType(value: unknown): value is StrategyTradeType {
  return value === 'manual' || value === 'bot';
}

function isStrategyId(value: unknown): value is StrategyId {
  return typeof value === 'string' && value in DEFAULT_STRATEGIES;
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

  return {
    tradeType: settings.tradeType,
    strategyId: settings.strategyId,
    setTradeType,
    setStrategyId,
  };
}
