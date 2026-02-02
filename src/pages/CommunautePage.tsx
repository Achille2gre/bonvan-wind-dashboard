import { useState } from "react";
import FranceMap from "@/components/FranceMap";
import SummaryPanel from "@/components/ui/SummaryPanel";
import { getRegionData } from "@/data/communityData";

const REGION_NAME_TO_SHORT: Record<string, string> = {
  "Auvergne-Rhône-Alpes": "AURA",
  "Provence-Alpes-Côte d'Azur": "PACA",
  "Bourgogne-Franche-Comté": "Bourgogne-Franche-Comté",
  "Centre-Val de Loire": "Centre-Val de Loire",
  "Île-de-France": "Île-de-France",
  "Hauts-de-France": "Hauts-de-France",
  "Grand Est": "Grand Est",
  "Normandie": "Normandie",
  "Bretagne": "Bretagne",
  "Pays de la Loire": "Pays de la Loire",
  "Nouvelle-Aquitaine": "Nouvelle-Aquitaine",
  "Occitanie": "Occitanie",
  "Corse": "Corse",
};

// ✅ À remplacer par ta vraie “dernière newsletter”
const LATEST_NEWSLETTER = {
  title: "Newsletter Bonvan — Janvier 2026",
  dateLabel: "29 janv. 2026",
  excerpt:
    "Actus produit, avancées terrain, partenaires, et prochaines étapes de déploiement. (Résumé court ici pour donner envie.)",
  url: "https://bonvan-eolienne.com/", // mets ici l’URL exacte de la newsletter (Mailchimp archive / page web)
  tag: "Dernière édition",
};

const CommunautePage = () => {
  // Macro-région pour les stats + textes (france | nord-ouest | nord-est | centre | sud-ouest | sud-est)
  const [activeMacro, setActiveMacro] = useState("france");
  // Région réelle cliquée (code INSEE : "84", "93", etc.) pour la couleur (1 seule région)
  const [activeRegionCode, setActiveRegionCode] = useState<string | null>(null);
  // Nom réel de la région cliquée (ex: "Auvergne-Rhône-Alpes")
  const [activeRegionName, setActiveRegionName] = useState<string | null>(null);

  // Les données restent basées sur la macro
  const regionData = getRegionData(activeMacro);

  const handleSelect = (code: string, macro: string, regionName: string) => {
    // Retour à la vue France
    if (macro === "france") {
      setActiveMacro("france");
      setActiveRegionCode(null);
      setActiveRegionName(null);
      return;
    }

    // Clic sur une région réelle :
    // - couleur = région réelle
    // - stats/texte = macro
    // - affichage = nom réel (AURA, etc.)
    setActiveMacro(macro);
    setActiveRegionCode(code);
    setActiveRegionName(regionName?.trim() ? regionName.trim() : null);
  };

  const displayRegionLabel =
    activeMacro === "france"
      ? "France"
      : activeRegionName
        ? REGION_NAME_TO_SHORT[activeRegionName] ?? activeRegionName
        : regionData.fullName;

  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">
      {/* Titre de la page */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-foreground">La communauté Bonvan</h1>
        <p className="text-sm text-muted-foreground">{`en ${displayRegionLabel}`}</p>
      </div>

      {/* Carte de France interactive */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <FranceMap
          activeMacro={activeMacro}
          activeRegionCode={activeRegionCode}
          onSelect={handleSelect}
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
              {activeMacro === "france"
                ? "Ensemble, nous produisons de l'énergie verte !"
                : `${regionData.name} : une région dynamique !`}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {activeMacro === "france"
                ? `${regionData.turbines.toLocaleString(
                    "fr-FR"
                  )} éoliennes Bonvan participent à la transition énergétique.`
                : `Avec ${regionData.turbines} éoliennes, cette région contribue activement à la production d'énergie renouvelable.`}
            </p>
          </div>
        </div>
      </div>

      {/* Clic hint */}
      {activeMacro === "france" && (
        <p className="text-xs text-muted-foreground text-center">
          👆 Cliquez sur une région pour voir le détail
        </p>
      )}

      {/* ✅ Dernière newsletter (ajout en bas) */}
      <div className="pt-2 space-y-2">
        <div className="flex items-end justify-between">
          <h2 className="text-base font-bold text-foreground">Dernière newsletter</h2>
          <span className="text-xs text-muted-foreground">{LATEST_NEWSLETTER.dateLabel}</span>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {LATEST_NEWSLETTER.tag}
                </span>
              </div>

              <h3 className="mt-2 font-bold text-foreground text-sm truncate">
                {LATEST_NEWSLETTER.title}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                {LATEST_NEWSLETTER.excerpt}
              </p>
            </div>

            <div className="text-2xl shrink-0">📰</div>
          </div>

          <div className="mt-3 flex">
            <a
              href={LATEST_NEWSLETTER.url}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center text-sm font-semibold rounded-lg px-3 py-2 bg-primary text-primary-foreground"
            >
              Lire la newsletter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunautePage;
