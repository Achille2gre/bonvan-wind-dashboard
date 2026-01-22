import type { OnboardingAnswers } from "./types";

export interface Tip {
  id: string;
  title: string;
  description: string;
}

export function getPersonalizedTips(a?: OnboardingAnswers): Tip[] {
  if (!a) return [];

  const tips: Tip[] = [];

  // Tarifs
  if (a.tariff === "hp_hc") {
    tips.push({
      id: "hp_hc_shift",
      title: "Décale tes gros usages en Heures Creuses",
      description:
        "Lave-linge, lave-vaisselle, chauffe-eau et recharge VE : idéalement sur la plage HC pour réduire ta facture.",
    });
  }

  if (a.tariff === "tempo") {
    tips.push({
      id: "tempo_alert",
      title: "Tempo : anticipe les jours rouges",
      description:
        "Réduis les usages électriques forts (chauffage, chauffe-eau) quand c’est rouge, et privilégie les bleus/blancs.",
    });
  }

  // Équipements
  if (a.hasEV) {
    tips.push({
      id: "ev_schedule",
      title: "Recharge VE : programme plutôt la nuit",
      description:
        "Même sans borne intelligente, programmer une recharge décalée peut aider à lisser et réduire tes coûts.",
    });
  }

  if (a.hasPool) {
    tips.push({
      id: "pool_pump",
      title: "Piscine : optimise la filtration",
      description:
        "Programme la filtration aux horaires les plus favorables (et surveille la durée : c’est un poste important).",
    });
  }

  if (a.hasAC) {
    tips.push({
      id: "ac_smart",
      title: "Clim : vise une consigne réaliste",
      description:
        "Une consigne trop basse coûte très cher : 1–2°C de plus peut déjà faire une différence sensible.",
    });
  }

  // Chauffage
  if (a.heatingType === "electric" && a.climate !== "mild") {
    tips.push({
      id: "heating_1c",
      title: "Chauffage électrique : baisse d’1°C",
      description:
        "Un petit ajustement de consigne + une bonne programmation peuvent réduire la consommation sans perdre en confort.",
    });
  }

  // Usage peak
  if (a.usagePeak === "evening") {
    tips.push({
      id: "evening_peak",
      title: "Pic du soir : évite les multi-appareils",
      description:
        "Limiter la cuisson + chauffage + ballon + VE en même temps peut réduire la puissance appelée et améliorer l’efficacité.",
    });
  }

  // Objectif
  if (a.goal === "autonomy") {
    tips.push({
      id: "autonomy",
      title: "Autonomie : commence par mesurer",
      description:
        "On va t’aider à identifier les postes les plus lourds et à déplacer ce qui peut l’être sur les bons créneaux.",
    });
  }

  // Retourne 3 conseils max
  return tips.slice(0, 3);
}
