import { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import PerformancesPage from '@/pages/PerformancesPage';
import PrevisionsPage from '@/pages/PrevisionsPage';
import HistoriquePage from '@/pages/HistoriquePage';
import CommunautePage from '@/pages/CommunautePage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('performances');

  const renderPage = () => {
    switch (activeTab) {
      case 'performances':
        return <PerformancesPage />;
      case 'previsions':
        return <PrevisionsPage />;
      case 'historique':
        return <HistoriquePage />;
      case 'communaute':
        return <CommunautePage />;
      default:
        return <PerformancesPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header fixe */}
      <Header />
      
      {/* Contenu principal avec scroll */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>
      
      {/* Navigation bottom fixe */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
