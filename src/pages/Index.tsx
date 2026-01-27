import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import PerformancesPage from "@/pages/PerformancesPage";
import PrevisionsPage from "@/pages/PrevisionsPage";
import HistoriquePage from "@/pages/HistoriquePage";
import CommunautePage from "@/pages/CommunautePage";

const ALLOWED_TABS = ["performances", "previsions", "historique", "communaute"] as const;
type Tab = (typeof ALLOWED_TABS)[number];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get("tab") as Tab) || "performances";
  const safeInitialTab: Tab = (ALLOWED_TABS.includes(initialTab) ? initialTab : "performances");

  const [activeTab, setActiveTab] = useState<Tab>(safeInitialTab);

  useEffect(() => {
    const tab = (searchParams.get("tab") as Tab) || "performances";
    if (ALLOWED_TABS.includes(tab) && tab !== activeTab) setActiveTab(tab);
    if (!ALLOWED_TABS.includes(tab) && activeTab !== "performances") setActiveTab("performances");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onTabChange = (tab: string) => {
    const t = tab as Tab;
    setActiveTab(t);
    setSearchParams({ tab: t });
  };

  const renderPage = () => {
    switch (activeTab) {
      case "performances":
        return <PerformancesPage />;
      case "previsions":
        return <PrevisionsPage />;
      case "historique":
        return <HistoriquePage />;
      case "communaute":
        return <CommunautePage />;
      default:
        return <PerformancesPage />;
    }
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={onTabChange} showBottomNav>
      {renderPage()}
    </AppShell>
  );
};

export default Index;
