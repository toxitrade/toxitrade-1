'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { STRATEGY_NAMES, type StrategyId } from '@/lib/strategies/types';

interface TradeTypeSelectorProps {
  value: 'manual' | 'bot';
  onChange: (value: 'manual' | 'bot') => void;
}

export function TradeTypeSelector({ value, onChange }: TradeTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Trade type</label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as 'manual' | 'bot')}
        className="grid grid-cols-2 gap-2"
      >
        <ToggleGroupItem value="manual">Manual</ToggleGroupItem>
        <ToggleGroupItem value="bot">Bot</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

interface StrategySelectorProps {
  value: StrategyId;
  onChange: (value: StrategyId) => void;
}

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  const options = Object.entries(STRATEGY_NAMES) as [StrategyId, string][];
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Strategy</label>
      <div className="p-2 border rounded-md bg-card">
        <span className="text-sm font-semibold">{value ? STRATEGY_NAMES[value] : 'Select strategy'}</span>
      </div>
    </div>
  );
}