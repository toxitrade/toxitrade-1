# Project Sitemap

## Directory Structure

```
template-deriv/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (imports TemplateLayout)
│   ├── page.tsx                 # Main page (RiseFallPage)
│   └── reports/                 # Reports route
│       └── page.tsx
├── components/                  # React components
│   ├── custom/                  # Custom/shared components
│   │   ├── deriv-ws-provider.tsx # DerivWS context provider (useDerivWS hook)
│   │   ├── footer.tsx
│   │   ├── header.tsx           # Header component with auth tab navigation (TabValue type)
│   │   ├── log-context.tsx      # LogProvider and useLog (NOT used in main app)
│   │   ├── logo-src-provider.tsx
│   │   ├── providers.tsx        # Theme/provider composition
│   │   ├── template-layout.tsx  # TemplateLayout wrapper (DerivWSProvider only)
│   │   └── ViewportScaler.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── rise-fall-chart.tsx      # Dynamic chart component
│   ├── rise-fall-view.tsx     # Main trading view
│   └── trade-controls.tsx       # Trade controls panel
├── hooks/                       # Custom hooks
│   ├── use-auth.ts              # useAuth hook (authState, login, logout, etc.)
│   ├── use-rise-fall-trading.ts
│   ├── use-smartcharts-api.ts
│   └── use-smartchart-chart-data.ts
├── lib/                         # Utility functions
│   ├── types.ts                 # Direction, DurationSelectUnit, etc.
│   ├── utils.ts
│   └── ...
├── packages/core/                 # Shared @deriv/core package
│   └── src/
│       ├── auth/                # OAuth/auth utilities
│       ├── react/               # React hooks (useDerivWS, useActiveSymbols, etc.)
│       ├── types/               # Type definitions
│       └── ws/                  # WebSocket client
└── ...
```

## Key Exports

### Components
- `components/custom/header.tsx` - `Header`, `TabValue` type
- `components/custom/deriv-ws-provider.tsx` - `DerivWSProvider`, `useDerivWSContext` hook
- `components/custom/template-layout.tsx` - `TemplateLayout` wrapper

### Hooks
- `hooks/use-auth.ts` - `useAuth`, `UseAuthReturn` interface
- `hooks/use-rise-fall-trading.ts` - `useRiseFallTrading` hook
- `packages/core/src/react/useDerivWS.ts` - `useDerivWS`, `UseDerivWSOptions`, `UseDerivWSReturn`

### Types (from @deriv/core)
- `AuthState`, `AuthInfo`, `DerivAccount`, `ActiveSymbol`, `Tick`, `ProposalInfo`, `BuyResult`, `DerivWS`

## Routes
- `/` - Main trading page (RiseFallPage)
- `/reports` - Reports page