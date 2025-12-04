import { useState } from 'react';
import FranceMap from '@/components/FranceMap';
import SummaryPanel from '@/components/ui/SummaryPanel';
import { getRegionData } from '@/data/communityData';

const CommunautePage = () => {
  const [activeRegion, setActiveRegion] = useState('france');
  
  const regionData = getRegionData(activeRegion);

  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">
      {/* Titre de la page */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-foreground">
          La communauté Bonvan
        </h1>
        <p className="text-sm text-muted-foreground">
          {activeRegion === 'france' 
            ? 'en France' 
            : `en ${regionData.fullName}`
          }
        </p>
      </div>

      {/* Carte de France interactive */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <FranceMap 
          activeRegion={activeRegion}
          onRegionSelect={setActiveRegion}
        />
      </div>

      {/* Panel de résumé */}
      <SummaryPanel
        turbines={regionData.turbines}
        annualProduction={regionData.annualProduction}
        co2Avoided={regionData.co2Avoided}
      />

      {/* Information sur la région */}
      <div className="bg-primary-light rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🌬️</div>
          <div>
            <h4 className="font-bold text-foreground text-sm">
              {activeRegion === 'france' 
                ? 'Ensemble, nous produisons de l\'énergie verte !'
                : `${regionData.name} : une région dynamique !`
              }
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {activeRegion === 'france'
                ? `${regionData.turbines.toLocaleString('fr-FR')} éoliennes Bonvan participent à la transition énergétique.`
                : `Avec ${regionData.turbines} éoliennes, cette région contribue activement à la production d'énergie renouvelable.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Clic hint */}
      {activeRegion === 'france' && (
        <p className="text-xs text-muted-foreground text-center">
          👆 Cliquez sur une région pour voir le détail
        </p>
      )}
    </div>
  );
};

export default CommunautePage;
