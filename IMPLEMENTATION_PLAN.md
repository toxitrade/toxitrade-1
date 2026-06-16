# Trading Bot Implementation Plan

## Core Architecture
```
Signal Flow: dataHistory → useIndicatorCalculator → useSignalEngine → useSignalExecution
```

### 1. Types & Models (`lib/types.ts`)
- `Candle`: { time, open, high, low, close }
- `IndicatorPoint`: { time, value }
- `BBResult`: upper/middle/lower bands arrays
- `MACDPoint`: { time, macd, signal, histogram }
- `StochasticPoint`: { time, k, d }
- `IndicatorConfig`: all indicator params with enable flags

### 2. Indicator Calculations (`lib/indicators.ts`)
Pure functions (no dependencies):
- `calculateSMA(data, period)` - Simple Moving Average
- `calculateEMA(data, period)` - Exponential Moving Average
- `calculateRSI(data, period)` - Relative Strength Index
- `calculateBB(data, period, stdDev)` - Bollinger Bands
- `calculateMACD(data, fast, slow, signal)` - MACD oscillator
- `calculateStochastic(data, period)` - Stochastic oscillator

### 3. Strategy System (`lib/strategies/`)
Registry pattern with pure strategy functions:
- `strategy-base.ts`: `StrategyDefinition` interface, `SignalResult` type
- `index.ts`: Strategy registry with `getStrategy(id)`, `getAllStrategies()`
- `fast-ema-sma-cross.ts`: EMA/SMA crossover signals (uses `technicalindicators`)
- `multi-momentum.ts`: Multi-indicator confluence (RSI, Stoch, MACD, SMA, BB)
- `adaptive-confluence.ts`: Complex strategy with trend/RSI/MACD/BB/candle analysis

### 4. Hooks
- `useCandleHistory`: Fetch/subscribe OHLC from WS, manage 5000 candle buffer
- `useIndicatorCalculator`: Memoized indicator calculations
- `useSignalEngine`: Select strategy, orchestrate analysis
- `useSignalExecution`: Mock trade execution with 60s verify delay
- `useBotState`: Main orchestrator combining all hooks

### 5. UI Components (`components/bot/`)
- `trade-tab.tsx`: Settings, indicators, chart, results (340px sidebar + chart)
- `strategy-tab.tsx`: Strategy selector, indicator toggles, JSON import/export
- `analysis-tab.tsx`: Backtesting UI, signal display
- `bot-chart.tsx`: SmartCharts integration
- `indicator-display.tsx`: Latest indicator values
- `signal-status.tsx`: Position state
- `results-panel.tsx`: Win/loss history
- `connection-panel.tsx`: Symbol/granularity selector

### 6. WebSocket (`hooks/use-bot-ws.ts`)
- Connect to `wss://ws.binaryws.com/websockets/v3?app_id={appId}`
- Authorize with API token
- Expose connection state and `send()` method

### 7. Dependencies Required
```json
"technicalindicators": "^3.1.0"  // for crossUp/crossDown
"@deriv/core": "from packages/core"
"@deriv-com/smartcharts-champion": "^1.9.13"
```

### 8. File Structure
```
lib/
  types.ts
  indicators.ts
  multi-indicators.ts
  strategies/
    index.ts
    strategy-base.ts
    fast-ema-sma-cross.ts
    multi-momentum.ts
    adaptive-confluence.ts
hooks/
  use-candle-history.ts
  use-indicator-calculator.ts
  use-signal-engine.ts
  use-signal-execution.ts
  use-bot-state.ts
  use-bot-ws.ts
  use-backtest.ts
  use-signal-markers.ts
components/bot/
  trade-tab.tsx
  strategy-tab.tsx
  analysis-tab.tsx
  bot-chart.tsx
  indicator-display.tsx
  signal-status.tsx
  results-panel.tsx
  connection-panel.tsx
```

### 9. Key Implementation Notes
- All indicators are pure functions - testable independent of UI
- Strategy analyze functions are pure - easy to port/logic separate
- WS connection uses DerivWS from @deriv/core
- Chart uses SmartCharts via @deriv-com/smartcharts-champion
- Signal execution is simulated (not real trades) with price direction check