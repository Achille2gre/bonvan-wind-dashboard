import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { cn } from "@/lib/utils";

interface FranceMapProps {
  /** Macro-région sélectionnée : "france" | "nord-ouest" | "nord-est" | "centre" | "sud-ouest" | "sud-est" */
  activeMacro: string;
  /** Code INSEE de la région réelle cliquée (ex: "84" pour AURA). Null si vue France. */
  activeRegionCode: string | null;
  /** Callback quand l’utilisateur clique une région réelle */
  onSelect: (regionCode: string, macroId: string, regionName: string) => void;
}

// Chemin robuste (fonctionne même si BASE_URL change)
const GEO_URL = `${import.meta.env.BASE_URL}maps/france-regions.geojson`;

/**
 * Mapping "vraies régions" -> tes 5 macro-régions actuelles.
 * Codes INSEE :
 * 11 IDF, 24 CVL, 27 BFC, 28 Normandie, 32 HDF, 44 Grand Est, 52 Pays de la Loire,
 * 53 Bretagne, 75 Nouvelle-Aquitaine, 76 Occitanie, 84 AURA, 93 PACA, 94 Corse
 */
const REGION_CODE_TO_MACRO: Record<string, string> = {
  "53": "nord-ouest", // Bretagne
  "28": "nord-ouest", // Normandie
  "52": "nord-ouest", // Pays de la Loire

  "32": "nord-est", // Hauts-de-France
  "44": "nord-est", // Grand Est
  "11": "nord-est", // Île-de-France

  "24": "centre", // Centre-Val de Loire
  "27": "centre", // Bourgogne-Franche-Comté

  "75": "sud-ouest", // Nouvelle-Aquitaine
  "76": "sud-ouest", // Occitanie

  "84": "sud-est", // Auvergne-Rhône-Alpes
  "93": "sud-est", // PACA
  "94": "sud-est", // Corse
};

function extractRegionCode(props: any, geoId: any): string {
  const rawCode =
    props?.code ??
    props?.CODE ??
    props?.code_region ??
    props?.insee_reg ??
    props?.reg_code ??
    props?.REG ??
    geoId;

  return String(rawCode);
}

function extractRegionName(props: any, fallback: string): string {
  // Le nom exact dépend du GeoJSON. On prévoit plusieurs champs courants.
  const rawName =
    props?.nom ??
    props?.NOM ??
    props?.name ??
    props?.NAME ??
    props?.region_name ??
    props?.REGION ??
    props?.libelle ??
    props?.LIBELLE ??
    props?.label ??
    props?.LABEL ??
    "";

  const name = String(rawName || "").trim();
  return name.length > 0 ? name : fallback;
}

export default function FranceMap({ activeMacro, activeRegionCode, onSelect }: FranceMapProps) {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const getFill = (code: string) => {
    const isFranceView = activeMacro === "france";
    const isHovered = hoveredCode === code;
    const isSelected = activeRegionCode === code;

    // Vue France : tout clair, hover un peu plus marqué
    if (isFranceView) {
      return isHovered ? "hsl(var(--primary) / 0.35)" : "hsl(var(--primary-light))";
    }

    // Vue macro : on veut UNE SEULE région colorée (celle cliquée)
    if (activeRegionCode) {
      if (isSelected) {
        return isHovered ? "hsl(var(--primary) / 0.9)" : "hsl(var(--primary))";
      }
      return isHovered ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))";
    }

    // Fallback (si jamais macro sélectionnée mais pas de régionCode)
    const macro = REGION_CODE_TO_MACRO[code];
    const isInMacro = macro === activeMacro;
    if (isInMacro) {
      return isHovered ? "hsl(var(--primary) / 0.85)" : "hsl(var(--primary))";
    }
    return isHovered ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))";
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-md mx-auto">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [2.2, 46.4],
          scale: 2100,
        }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props: any = geo.properties ?? {};
              const code = extractRegionCode(props, geo.id);
              const macro = REGION_CODE_TO_MACRO[code] ?? "france";

              // Fallback lisible si le GeoJSON n'a pas de nom exploitable
              const fallbackName =
                code === "84"
                  ? "Auvergne-Rhône-Alpes"
                  : code === "93"
                    ? "Provence-Alpes-Côte d'Azur"
                    : code === "94"
                      ? "Corse"
                      : `Région ${code}`;

              const regionName = extractRegionName(props, fallbackName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelect(code, macro, regionName)}
                  onMouseEnter={() => setHoveredCode(code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  fill={getFill(code)}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                  className={cn("cursor-pointer transition-colors duration-200")}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {activeMacro !== "france" && (
        <button
          onClick={() => onSelect("", "france", "France")}
          className="absolute top-2 left-2 px-3 py-1.5 text-xs font-medium bg-card rounded-lg shadow-md hover:bg-muted transition-colors border border-border"
        >
          ← France
        </button>
      )}
    </div>
  );
}
