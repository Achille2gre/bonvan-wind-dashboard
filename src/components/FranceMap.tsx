import { cn } from '@/lib/utils';

interface FranceMapProps {
  activeRegion: string;
  onRegionSelect: (regionId: string) => void;
}

// SVG réaliste de la France métropolitaine avec 5 grandes régions
const regions = [
  {
    id: 'nord-ouest',
    name: 'Nord-Ouest',
    // Bretagne + Normandie + Pays de la Loire
    path: 'M 85 95 L 110 75 L 145 70 L 175 80 L 180 95 L 175 115 L 160 135 L 140 150 L 110 155 L 80 145 L 60 125 L 55 105 Z',
  },
  {
    id: 'nord-est',
    name: 'Nord-Est',
    // Hauts-de-France + Grand Est + Île-de-France
    path: 'M 180 50 L 220 45 L 260 55 L 285 75 L 290 110 L 275 145 L 245 160 L 210 155 L 180 140 L 175 115 L 180 95 L 175 80 Z',
  },
  {
    id: 'centre',
    name: 'Centre',
    // Centre-Val de Loire + Bourgogne-Franche-Comté
    path: 'M 140 150 L 175 140 L 210 155 L 245 160 L 250 190 L 240 220 L 210 235 L 175 240 L 145 225 L 130 195 L 125 165 Z',
  },
  {
    id: 'sud-ouest',
    name: 'Sud-Ouest',
    // Nouvelle-Aquitaine + Occitanie Ouest
    path: 'M 80 145 L 125 165 L 130 195 L 145 225 L 140 260 L 125 295 L 100 320 L 75 310 L 55 285 L 50 245 L 55 200 L 65 165 Z',
  },
  {
    id: 'sud-est',
    name: 'Sud-Est',
    // Auvergne-Rhône-Alpes + PACA + Occitanie Est
    path: 'M 175 240 L 210 235 L 240 220 L 275 225 L 295 250 L 290 285 L 265 315 L 225 330 L 180 320 L 145 300 L 125 295 L 140 260 L 145 225 Z',
  },
];

const FranceMap = ({ activeRegion, onRegionSelect }: FranceMapProps) => {
  return (
    <div className="relative w-full aspect-square max-w-xs mx-auto">
      <svg 
        viewBox="40 30 270 320" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(26, 151, 131, 0.15))' }}
      >
        {/* Contour de la France */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Régions */}
        {regions.map((region) => {
          const isActive = activeRegion === region.id;
          const isFranceSelected = activeRegion === 'france';
          
          return (
            <g key={region.id}>
              <path
                d={region.path}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  "stroke-card stroke-2"
                )}
                fill={isActive ? 'hsl(var(--primary))' : isFranceSelected ? 'hsl(var(--primary-light))' : 'hsl(var(--muted))'}
                onClick={() => onRegionSelect(region.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.fill = 'hsl(var(--primary) / 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.fill = isFranceSelected ? 'hsl(var(--primary-light))' : 'hsl(var(--muted))';
                  }
                }}
                filter="url(#shadow)"
              />
              {/* Nom de la région */}
              {isActive && (
                <text
                  x={region.id === 'nord-ouest' ? 110 : region.id === 'nord-est' ? 220 : region.id === 'centre' ? 185 : region.id === 'sud-ouest' ? 95 : 210}
                  y={region.id === 'nord-ouest' ? 115 : region.id === 'nord-est' ? 105 : region.id === 'centre' ? 195 : region.id === 'sud-ouest' ? 235 : 275}
                  className="text-[10px] font-bold fill-primary-foreground pointer-events-none"
                  textAnchor="middle"
                >
                  {region.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Corse (petite île) */}
        <ellipse
          cx="305"
          cy="310"
          rx="12"
          ry="22"
          className="cursor-pointer transition-all duration-300 stroke-card stroke-2"
          fill={activeRegion === 'france' ? 'hsl(var(--primary-light))' : 'hsl(var(--muted))'}
        />
      </svg>

      {/* Bouton pour revenir à la vue France */}
      {activeRegion !== 'france' && (
        <button
          onClick={() => onRegionSelect('france')}
          className="absolute top-2 left-2 px-3 py-1.5 text-xs font-medium bg-card rounded-lg shadow-md hover:bg-muted transition-colors border border-border"
        >
          ← France
        </button>
      )}
    </div>
  );
};

export default FranceMap;
