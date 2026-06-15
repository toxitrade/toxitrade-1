'use client';

import { useState, useEffect } from 'react';
import type { DurationSelectUnit } from '@/lib/duration-utils';
import type { DurationLimits } from '@deriv/core';

const STORAGE_KEY = 'rise-fall-preferences';

interface UserPreferences {
  symbol: string | null;
  chartType: string;
  granularity: number;
  stake: string;
  duration: number;
  durationUnit: DurationSelectUnit;
  indicators: string[];
}

const defaultPreferences: UserPreferences = {
  symbol: null,
  chartType: 'line',
  granularity: 0,
  stake: '10',
  duration: 1,
  durationUnit: 't',
  indicators: [],
};

function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPreferences;
    const parsed = JSON.parse(stored) as Partial<UserPreferences>;
    return { ...defaultPreferences, ...parsed };
  } catch {
    return defaultPreferences;
  }
}

function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

interface UseUserPreferencesReturn {
  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;
  chartType: string;
  setChartType: (type: string) => void;
  granularity: number;
  setGranularity: (value: number) => void;
  stake: string;
  setStake: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  durationUnit: DurationSelectUnit;
  setDurationUnit: (value: DurationSelectUnit) => void;
  indicators: string[];
  setIndicators: (value: string[]) => void;
  resetPreferences: () => void;
}

export function useUserPreferences(
  durationLimits?: DurationLimits,
  defaultStake?: number
): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());

  useEffect(() => {
    const defaults: Partial<UserPreferences> = {};

    if (durationLimits && preferences.duration < durationLimits.min) {
      defaults.duration = durationLimits.min;
    }
    if (defaultStake && preferences.stake === '10' && defaultStake !== 10) {
      defaults.stake = String(defaultStake);
    }

    if (Object.keys(defaults).length > 0) {
      const updated = { ...preferences, ...defaults };
      setPreferences(updated);
      savePreferences(updated);
    }
  }, [durationLimits, defaultStake, preferences]);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setPreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    selectedSymbol: preferences.symbol,
    setSelectedSymbol: (symbol) => setPreference('symbol', symbol),
    chartType: preferences.chartType,
    setChartType: (type) => setPreference('chartType', type),
    granularity: preferences.granularity,
    setGranularity: (value) => setPreference('granularity', value),
    stake: preferences.stake,
    setStake: (value) => setPreference('stake', value),
    duration: preferences.duration,
    setDuration: (value) => setPreference('duration', value),
    durationUnit: preferences.durationUnit,
    setDurationUnit: (value) => setPreference('durationUnit', value),
    indicators: preferences.indicators,
    setIndicators: (value) => setPreference('indicators', value),
    resetPreferences,
  };
}