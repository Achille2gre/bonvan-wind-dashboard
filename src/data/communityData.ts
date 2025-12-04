// Données mockées pour la communauté Bonvan par région
// Pour brancher des vraies données, connecter à l'API Bonvan

export interface RegionData {
  id: string;
  name: string;
  fullName: string;
  turbines: number;
  annualProduction: number; // kWh
  co2Avoided: number; // tonnes CO2e
}

export const regionsData: Record<string, RegionData> = {
  france: {
    id: 'france',
    name: 'France',
    fullName: 'France',
    turbines: 2847,
    annualProduction: 14235000,
    co2Avoided: 5694,
  },
  'nord-ouest': {
    id: 'nord-ouest',
    name: 'Nord-Ouest',
    fullName: 'Nord-Ouest (Bretagne, Normandie, Pays de la Loire)',
    turbines: 756,
    annualProduction: 3780000,
    co2Avoided: 1512,
  },
  'nord-est': {
    id: 'nord-est',
    name: 'Nord-Est',
    fullName: 'Nord-Est (Hauts-de-France, Grand Est, Île-de-France)',
    turbines: 612,
    annualProduction: 3060000,
    co2Avoided: 1224,
  },
  centre: {
    id: 'centre',
    name: 'Centre',
    fullName: 'Centre (Centre-Val de Loire, Bourgogne-Franche-Comté)',
    turbines: 432,
    annualProduction: 2160000,
    co2Avoided: 864,
  },
  'sud-ouest': {
    id: 'sud-ouest',
    name: 'Sud-Ouest',
    fullName: 'Sud-Ouest (Nouvelle-Aquitaine, Occitanie Ouest)',
    turbines: 523,
    annualProduction: 2615000,
    co2Avoided: 1046,
  },
  'sud-est': {
    id: 'sud-est',
    name: 'Sud-Est',
    fullName: 'Sud-Est (Auvergne-Rhône-Alpes, PACA, Occitanie Est)',
    turbines: 524,
    annualProduction: 2620000,
    co2Avoided: 1048,
  },
};

export const getRegionData = (regionId: string): RegionData => {
  return regionsData[regionId] || regionsData.france;
};

export const getAllRegions = (): RegionData[] => {
  return Object.values(regionsData).filter(r => r.id !== 'france');
};

// Formater les grands nombres
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k';
  }
  return num.toString();
};
