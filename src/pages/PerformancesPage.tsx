import { useState } from 'react';
import { Wind, Plug, Zap, PiggyBank } from 'lucide-react';
import SegmentedTabs from '@/components/ui/SegmentedTabs';
import StatsCard from '@/components/ui/StatsCard';
import ChartContainer from '@/components/ui/ChartContainer';
import ProductionLineChart from '@/components/charts/ProductionLineChart';
import { 
  annualData, 
  monthlyData, 
  dailyData,
  getAnnualStats,
  getMonthlyStats,
  getDailyStats,
} from '@/data/performanceData';

const tabs = [
  { id: 'annual', label: 'Annuelles' },
  { id: 'monthly', label: 'Mensuelles' },
  { id: 'daily', label: 'Journalières' },
];

const PerformancesPage = () => {
  const [activeTab, setActiveTab] = useState('annual');

  // Données et stats selon le tab actif
  const getChartData = () => {
    switch (activeTab) {
      case 'annual':
        return annualData.map(d => ({
          name: d.month,
          production: d.production,
          consumption: d.consumption,
        }));
      case 'monthly':
        return monthlyData.map(d => ({
          name: d.day.toString(),
          production: d.production,
          consumption: d.consumption,
        }));
      case 'daily':
        return dailyData.map(d => ({
          name: d.hour,
          production: d.production,
          consumption: d.consumption,
        }));
      default:
        return [];
    }
  };

  const getStats = () => {
    switch (activeTab) {
      case 'annual':
        return getAnnualStats();
      case 'monthly':
        return getMonthlyStats();
      case 'daily':
        return getDailyStats();
      default:
        return { production: 0, consumption: 0, autoconsumption: 0, savings: 0 };
    }
  };

  const stats = getStats();
  const chartData = getChartData();

  const getUnit = () => activeTab === 'daily' ? 'kWh' : 'kWh';
  const getSavingsUnit = () => activeTab === 'daily' ? '€' : '€';

  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">
      {/* Titre de la page */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-foreground">Performances</h1>
        <p className="text-sm text-muted-foreground">Suivi de votre production éolienne</p>
      </div>

      {/* Tabs segmentés */}
      <SegmentedTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Cartes statistiques - Production & Consommation */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Production"
          value={stats.production}
          unit={getUnit()}
          icon={Wind}
          variant="production"
        />
        <StatsCard
          title="Consommation"
          value={stats.consumption}
          unit={getUnit()}
          icon={Plug}
          variant="consumption"
        />
      </div>

      {/* Graphique Production vs Consommation */}
      <ChartContainer
        title="Production vs Consommation"
        legend={{
          items: [
            { color: 'hsl(var(--chart-production))', label: 'Production' },
            { color: 'hsl(var(--chart-consumption))', label: 'Consommation' },
          ]
        }}
      >
        <ProductionLineChart data={chartData} height={180} />
      </ChartContainer>

      {/* Cartes statistiques - Autoconsommation & Économies */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Autoconsommée"
          value={stats.autoconsumption}
          unit={getUnit()}
          icon={Zap}
          variant="autoconsumption"
        />
        <StatsCard
          title="Économies"
          value={stats.savings}
          unit={getSavingsUnit()}
          icon={PiggyBank}
          variant="savings"
        />
      </div>

      {/* Info supplémentaire */}
      <div className="bg-primary-light rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Wind className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">Votre éolienne fonctionne bien !</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Production {activeTab === 'annual' ? 'annuelle' : activeTab === 'monthly' ? 'mensuelle' : 'journalière'} conforme aux prévisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancesPage;
