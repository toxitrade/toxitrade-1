'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/custom/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-is-mobile';
import type {
  AuthState,
  DerivAccount,
  ActiveSymbol,
  DerivWS,
} from '@deriv/core';
import type { SmartChartChartData } from '@/hooks/use-smartchart-chart-data';
import type { UseSmartChartsApiReturn } from '@/hooks/use-smartcharts-api';
import { TradeTypeSelector, StrategySelector } from '@/components/strategy/trade-type-selector';
import { StrategyConfigPanel } from '@/components/strategy/strategy-config-panel';
import { useStrategySettings } from '@/hooks/use-strategy-settings';

const StrategyChart = dynamic(() => import('./rise-fall-chart').then(m => m.RiseFallChart), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-md border border-border/50 dark:border-white/[0.08] bg-muted/30" />
  ),
});

export interface StrategyViewProps {
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;
  ws: DerivWS | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  chartData: SmartChartChartData | undefined;
  getQuotes: UseSmartChartsApiReturn['getQuotes'];
  subscribeQuotes: UseSmartChartsApiReturn['subscribeQuotes'];
  unsubscribeQuotes: UseSmartChartsApiReturn['unsubscribeQuotes'];
  isLive?: boolean;
  endEpoch?: number;
  logoSrc?: string;
  appName?: string;
}

export function StrategyView({
  authState,
  accounts,
  activeAccount,
  onLogin,
  onSignUp,
  onLogout,
  onSwitchAccount,
  ws,
  isConnected,
  isLoading,
  error,
  activeSymbol,
  selectSymbol,
  chartData,
  getQuotes,
  subscribeQuotes,
  unsubscribeQuotes,
  isLive,
  endEpoch,
  logoSrc,
  appName,
}: StrategyViewProps) {
  const isMobile = useIsMobile();
  const { tradeType, strategyId, enabledIndicators, setTradeType, setStrategyId, setIndicatorEnabled } = useStrategySettings();

  if (error) {
    return (
      <main className="flex flex-col bg-background items-center justify-center px-4 min-h-dvh">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col bg-background max-lg:h-dvh lg:overflow-visible">
      <div className="flex w-full max-w-7xl mx-auto flex-col max-lg:px-0 max-lg:py-0 px-3 py-2 sm:px-4 sm:py-4 gap-2 sm:gap-3 max-lg:flex-1 max-lg:min-h-0 max-lg:overflow-hidden lg:flex-none lg:overflow-visible">
        <div className="max-lg:flex max-lg:flex-col max-lg:flex-1 max-lg:min-h-0 lg:grid lg:grid-cols-[2.1fr_0.9fr] lg:gap-3">
          {/* Column 1: Chart */}
          <div className="max-lg:shrink-0 flex flex-col gap-2 max-lg:px-3 max-lg:pb-2 pt-2 lg:py-0">
            <div className="max-lg:h-[45dvh] lg:h-[min(33.6rem,66vh)] lg:min-h-[384px]">
              {chartData ? (
                <StrategyChart
                  symbolKey="strategy-chart"
                  symbol={activeSymbol?.underlying_symbol}
                  isConnectionOpened={isConnected}
                  isMobile={isMobile}
                  chartData={chartData}
                  getQuotes={getQuotes}
                  subscribeQuotes={subscribeQuotes}
                  unsubscribeQuotes={unsubscribeQuotes}
                  onSymbolChange={selectSymbol}
                  isLive={isLive}
                  endEpoch={endEpoch}
                  contractsArray={[]}
                />
              ) : (
                <Skeleton className="h-full w-full rounded-md" />
              )}
            </div>
          </div>

          {/* Column 2: Strategy controls */}
          <div className="max-lg:flex-1 max-lg:min-h-0 max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:px-2 max-lg:border-t max-lg:border-border max-lg:pt-2 max-lg:pb-20 lg:pt-0 flex flex-col gap-2">
            {isLoading ? (
              <Skeleton className="lg:h-[min(33.6rem,66vh)] lg:min-h-[384px] max-lg:h-48 w-full rounded-md" />
            ) : (
              <Card className="lg:h-[min(33.6rem,66vh)] lg:min-h-[384px] lg:overflow-y-auto border-shadow">
                <CardContent className="pt-3 space-y-3">
                  <TradeTypeSelector value={tradeType} onChange={setTradeType} />
                  {tradeType === 'bot' && (
                    <>
                      <StrategySelector value={strategyId} onChange={setStrategyId} />
                      <StrategyConfigPanel
                        strategyId={strategyId}
                        enabledIndicators={enabledIndicators[strategyId]}
                        onIndicatorToggle={(indicator, enabled) => setIndicatorEnabled(strategyId, indicator, enabled)}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}