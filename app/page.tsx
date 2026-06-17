'use client';

import { useState } from 'react';
import { useSmartChartsApi } from '@/hooks/use-smartcharts-api';
import { useSmartChartChartData } from '@/hooks/use-smartchart-chart-data';
import { useRiseFallTrading } from '../hooks/use-rise-fall-trading';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { Header } from '@/components/custom/header';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { LogPanel } from '@/components/custom/log-panel';
import { TabValue } from '@/components/custom/header';
import { RiseFallView } from '../components/rise-fall-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StrategyPlaceholder() {
  return (
    <Card className="w-full max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle>Estrategy</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Strategy page - coming soon</p>
      </CardContent>
    </Card>
  );
}

function AnalysisPlaceholder() {
  return (
    <Card className="w-full max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle>Analisys</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Analysis page - coming soon</p>
      </CardContent>
    </Card>
  );
}

function LogPlaceholder() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <LogPanel />
    </div>
  );
}

export default function RiseFallPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;

  const trading = useRiseFallTrading({ ws, isConnected, isExhausted, isAuthenticated: !!auth.wsUrl, onAuthWSFailed: logout });

  const { chartData } = useSmartChartChartData(trading.ws, trading.isConnected, trading.symbols);
  const { getQuotes, subscribeQuotes, unsubscribeQuotes } = useSmartChartsApi(trading.ws);

  const [activeTab, setActiveTab] = useState<TabValue>('trading');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trading':
        return (
          <RiseFallView
            authState={authState}
            accounts={accounts}
            activeAccount={activeAccount}
            onLogin={login}
            onSignUp={signUp}
            onLogout={logout}
            onSwitchAccount={switchAccount}
            logoSrc={logoSrc}
            ws={trading.ws}
            isConnected={trading.isConnected}
            isLoading={trading.isLoading}
            error={trading.error}
            activeSymbol={trading.activeSymbol}
            selectSymbol={trading.selectSymbol}
            direction={trading.direction}
            setDirection={trading.setDirection}
            allowEquals={trading.allowEquals}
            setAllowEquals={trading.setAllowEquals}
            stake={trading.stake}
            setStake={trading.setStake}
            duration={trading.duration}
            setDuration={trading.setDuration}
            durationOptions={trading.durationOptions}
            durationUnit={trading.durationUnit}
            setDurationUnit={trading.setDurationUnit}
            endDate={trading.endDate}
            setEndDate={trading.setEndDate}
            endTime={trading.endTime}
            setEndTime={trading.setEndTime}
            proposal={trading.proposal}
            buyContract={trading.buyContract}
            isBuying={trading.isBuying}
            buyResult={trading.buyResult}
            buyError={trading.buyError}
            clearBuyResult={trading.clearBuyResult}
            openPositions={trading.openPositions}
            sellContract={trading.sellContract}
            sellingId={trading.sellingId}
            chartData={chartData}
            getQuotes={getQuotes}
            subscribeQuotes={subscribeQuotes}
            unsubscribeQuotes={unsubscribeQuotes}
          />
        );
      case 'strategy':
        return <StrategyPlaceholder />;
      case 'analysis':
        return <AnalysisPlaceholder />;
      case 'log':
        return <LogPlaceholder />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={login}
        onSignUp={signUp}
        onLogout={logout}
        onSwitchAccount={switchAccount}
        logoSrc={logoSrc}
        actions={<ThemeToggle />}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="pt-[56px]">
        {renderTabContent()}
      </div>
    </>
  );
}
