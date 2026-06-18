'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DEFAULT_STRATEGIES, type StrategyId } from '@/store/strategies';
import { INDICATOR_KEYS, type IndicatorKey, type StrategyEnabledFlags } from '@/lib/strategies/types';
import { cn } from '@/lib/utils';

function formatParamValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  return String(value);
}

function getIndicatorLabel(key: IndicatorKey): string {
  return key.toUpperCase();
}

export function StrategyConfigPanel({
  strategyId,
  enabledIndicators,
  onIndicatorToggle,
}: {
  strategyId: StrategyId;
  enabledIndicators: StrategyEnabledFlags;
  onIndicatorToggle: (indicator: IndicatorKey, enabled: boolean) => void;
}) {
  const config = DEFAULT_STRATEGIES[strategyId];

  if (!config) {
    return null;
  }

  const safeIndicators: StrategyEnabledFlags = {
    rsi: enabledIndicators?.rsi ?? false,
    stoch: enabledIndicators?.stoch ?? false,
    macd: enabledIndicators?.macd ?? false,
    sma: enabledIndicators?.sma ?? false,
    ema: enabledIndicators?.ema ?? false,
    bb: enabledIndicators?.bb ?? false,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Strategy values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <section>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Enabled indicators
          </div>
          <div className="flex flex-wrap gap-2">
            {INDICATOR_KEYS.map((indicator) => {
              const isSelected = safeIndicators[indicator];
              return (
                <div
                  key={indicator}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-md border px-3 py-2',
                    isSelected ? 'border-primary/30 bg-primary/5 text-black' : 'border-border bg-muted/20 text-muted-foreground'
                  )}
                >
                  <span className={cn('text-sm font-semibold', isSelected ? 'text-black' : 'text-muted-foreground')}>
                    {getIndicatorLabel(indicator)}
                  </span>
                  <Switch
                    checked={isSelected}
                    onCheckedChange={(checked) => onIndicatorToggle(indicator, checked)}
                    aria-label={`Toggle ${getIndicatorLabel(indicator)} indicator`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Parameters
          </div>
          <div className="grid gap-2 rounded-md border bg-muted/30 p-3">
            {Object.entries(config.params).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="font-medium capitalize text-foreground">{key}</span>
                <span className="font-mono text-muted-foreground">{formatParamValue(value)}</span>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
