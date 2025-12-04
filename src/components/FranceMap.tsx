import { cn } from '@/lib/utils';

interface FranceMapProps {
  activeRegion: string;
  onRegionSelect: (regionId: string) => void;
}

// SVG simplifié des régions françaises
const regions = [
  { id: 'hauts-de-france', name: 'Hauts-de-France', path: 'M 180 30 L 220 25 L 250 40 L 245 70 L 220 90 L 185 85 L 175 55 Z' },
  { id: 'normandie', name: 'Normandie', path: 'M 100 50 L 170 45 L 175 85 L 155 100 L 110 95 L 95 70 Z' },
  { id: 'bretagne', name: 'Bretagne', path: 'M 30 85 L 95 80 L 105 100 L 95 130 L 50 135 L 25 115 Z' },
  { id: 'ile-de-france', name: 'Île-de-France', path: 'M 180 90 L 215 95 L 210 125 L 185 130 L 175 110 Z' },
  { id: 'grand-est', name: 'Grand Est', path: 'M 225 70 L 280 55 L 300 95 L 285 140 L 245 145 L 220 120 L 225 90 Z' },
  { id: 'pays-de-la-loire', name: 'Pays de la Loire', path: 'M 65 130 L 110 125 L 140 145 L 130 185 L 85 190 L 55 165 Z' },
  { id: 'centre-val-de-loire', name: 'Centre-Val de Loire', path: 'M 115 125 L 175 120 L 185 155 L 175 195 L 135 195 L 115 160 Z' },
  { id: 'bourgogne-franche-comte', name: 'Bourgogne-F-C', path: 'M 190 130 L 245 140 L 260 185 L 235 220 L 195 210 L 180 165 Z' },
  { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine', path: 'M 70 195 L 130 190 L 170 210 L 165 280 L 120 310 L 65 290 L 55 240 Z' },
  { id: 'auvergne-rhone-alpes', name: 'AURA', path: 'M 175 200 L 235 215 L 270 260 L 250 305 L 195 295 L 175 250 Z' },
  { id: 'occitanie', name: 'Occitanie', path: 'M 95 310 L 165 295 L 195 320 L 195 365 L 145 380 L 95 365 L 85 335 Z' },
  { id: 'provence-alpes-cote-d-azur', name: 'PACA', path: 'M 200 305 L 255 295 L 290 330 L 275 365 L 225 375 L 200 345 Z' },
  { id: 'corse', name: 'Corse', path: 'M 310 340 L 325 335 L 335 370 L 325 400 L 310 395 L 305 365 Z' },
];

const FranceMap = ({ activeRegion, onRegionSelect }: FranceMapProps) => {
  return (
    <div className="relative w-full aspect-[1/1.1] max-w-sm mx-auto">
      <svg 
        viewBox="0 0 350 420" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Fond de la France */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted))" />
            <stop offset="100%" stopColor="hsl(var(--border))" />
          </linearGradient>
        </defs>

        {/* Régions */}
        {regions.map((region) => {
          const isActive = activeRegion === region.id;
          const isFranceSelected = activeRegion === 'france';
          
          return (
            <path
              key={region.id}
              d={region.path}
              className={cn(
                "cursor-pointer transition-all duration-300",
                "stroke-card stroke-[1.5]",
                isActive && "stroke-primary stroke-2"
              )}
              fill={isActive ? 'hsl(var(--primary))' : isFranceSelected ? 'hsl(var(--primary-light))' : 'hsl(var(--muted))'}
              onClick={() => onRegionSelect(region.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.fill = 'hsl(var(--primary-light))';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.fill = isFranceSelected ? 'hsl(var(--primary-light))' : 'hsl(var(--muted))';
                }
              }}
            />
          );
        })}
      </svg>

      {/* Bouton pour revenir à la vue France */}
      {activeRegion !== 'france' && (
        <button
          onClick={() => onRegionSelect('france')}
          className="absolute top-2 left-2 px-3 py-1.5 text-xs font-medium bg-card rounded-lg shadow-md hover:bg-muted transition-colors"
        >
          ← Vue France
        </button>
      )}
    </div>
  );
};

export default FranceMap;
