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
  'ile-de-france': {
    id: 'ile-de-france',
    name: 'Île-de-France',
    fullName: 'Île-de-France',
    turbines: 312,
    annualProduction: 1560000,
    co2Avoided: 624,
  },
  'auvergne-rhone-alpes': {
    id: 'auvergne-rhone-alpes',
    name: 'AURA',
    fullName: 'Auvergne-Rhône-Alpes',
    turbines: 428,
    annualProduction: 2140000,
    co2Avoided: 856,
  },
  bretagne: {
    id: 'bretagne',
    name: 'Bretagne',
    fullName: 'Bretagne',
    turbines: 523,
    annualProduction: 2615000,
    co2Avoided: 1046,
  },
  normandie: {
    id: 'normandie',
    name: 'Normandie',
    fullName: 'Normandie',
    turbines: 387,
    annualProduction: 1935000,
    co2Avoided: 774,
  },
  'hauts-de-france': {
    id: 'hauts-de-france',
    name: 'Hauts-de-France',
    fullName: 'Hauts-de-France',
    turbines: 456,
    annualProduction: 2280000,
    co2Avoided: 912,
  },
  'grand-est': {
    id: 'grand-est',
    name: 'Grand Est',
    fullName: 'Grand Est',
    turbines: 298,
    annualProduction: 1490000,
    co2Avoided: 596,
  },
  'pays-de-la-loire': {
    id: 'pays-de-la-loire',
    name: 'Pays de la Loire',
    fullName: 'Pays de la Loire',
    turbines: 267,
    annualProduction: 1335000,
    co2Avoided: 534,
  },
  'nouvelle-aquitaine': {
    id: 'nouvelle-aquitaine',
    name: 'Nouvelle-Aquitaine',
    fullName: 'Nouvelle-Aquitaine',
    turbines: 234,
    annualProduction: 1170000,
    co2Avoided: 468,
  },
  occitanie: {
    id: 'occitanie',
    name: 'Occitanie',
    fullName: 'Occitanie',
    turbines: 312,
    annualProduction: 1560000,
    co2Avoided: 624,
  },
  'provence-alpes-cote-d-azur': {
    id: 'provence-alpes-cote-d-azur',
    name: 'PACA',
    fullName: "Provence-Alpes-Côte d'Azur",
    turbines: 156,
    annualProduction: 780000,
    co2Avoided: 312,
  },
  corse: {
    id: 'corse',
    name: 'Corse',
    fullName: 'Corse',
    turbines: 42,
    annualProduction: 210000,
    co2Avoided: 84,
  },
  'bourgogne-franche-comte': {
    id: 'bourgogne-franche-comte',
    name: 'Bourgogne-F-C',
    fullName: 'Bourgogne-Franche-Comté',
    turbines: 178,
    annualProduction: 890000,
    co2Avoided: 356,
  },
  'centre-val-de-loire': {
    id: 'centre-val-de-loire',
    name: 'Centre-VdL',
    fullName: 'Centre-Val de Loire',
    turbines: 254,
    annualProduction: 1270000,
    co2Avoided: 508,
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
