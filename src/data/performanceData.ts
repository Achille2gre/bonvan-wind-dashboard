// Données mockées pour les performances de l'éolienne
// Pour brancher des vraies données, remplacer ces exports par des appels API

export interface MonthlyData {
  month: string;
  production: number; // kWh
  consumption: number; // kWh
}

export interface DailyData {
  day: number;
  production: number;
  consumption: number;
}

export interface HourlyData {
  hour: string;
  production: number;
  consumption: number;
}

// Données annuelles (12 mois)
export const annualData: MonthlyData[] = [
  { month: 'Jan', production: 420, consumption: 380 },
  { month: 'Fév', production: 380, consumption: 350 },
  { month: 'Mar', production: 450, consumption: 320 },
  { month: 'Avr', production: 520, consumption: 280 },
  { month: 'Mai', production: 580, consumption: 250 },
  { month: 'Jun', production: 540, consumption: 240 },
  { month: 'Jul', production: 480, consumption: 260 },
  { month: 'Aoû', production: 510, consumption: 270 },
  { month: 'Sep', production: 490, consumption: 300 },
  { month: 'Oct', production: 440, consumption: 340 },
  { month: 'Nov', production: 400, consumption: 370 },
  { month: 'Déc', production: 350, consumption: 400 },
];

// Données mensuelles (décembre 2025 - 31 jours)
export const monthlyData: DailyData[] = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  production: Math.round(10 + Math.random() * 20),
  consumption: Math.round(8 + Math.random() * 15),
}));

// Données journalières (24 heures)
export const dailyData: HourlyData[] = [
  { hour: '00h', production: 2.1, consumption: 1.8 },
  { hour: '01h', production: 2.3, consumption: 1.5 },
  { hour: '02h', production: 2.5, consumption: 1.2 },
  { hour: '03h', production: 2.8, consumption: 1.0 },
  { hour: '04h', production: 3.2, consumption: 1.1 },
  { hour: '05h', production: 3.5, consumption: 1.5 },
  { hour: '06h', production: 3.8, consumption: 2.2 },
  { hour: '07h', production: 4.2, consumption: 3.5 },
  { hour: '08h', production: 4.8, consumption: 4.2 },
  { hour: '09h', production: 5.1, consumption: 3.8 },
  { hour: '10h', production: 5.5, consumption: 3.2 },
  { hour: '11h', production: 5.8, consumption: 3.0 },
  { hour: '12h', production: 6.2, consumption: 3.5 },
  { hour: '13h', production: 5.9, consumption: 3.2 },
  { hour: '14h', production: 5.5, consumption: 2.8 },
  { hour: '15h', production: 5.0, consumption: 2.5 },
  { hour: '16h', production: 4.5, consumption: 2.8 },
  { hour: '17h', production: 4.0, consumption: 3.5 },
  { hour: '18h', production: 3.5, consumption: 4.2 },
  { hour: '19h', production: 3.0, consumption: 4.5 },
  { hour: '20h', production: 2.8, consumption: 4.0 },
  { hour: '21h', production: 2.5, consumption: 3.5 },
  { hour: '22h', production: 2.3, consumption: 2.8 },
  { hour: '23h', production: 2.1, consumption: 2.2 },
];

// Statistiques calculées
export const getAnnualStats = () => {
  const totalProduction = annualData.reduce((sum, d) => sum + d.production, 0);
  const totalConsumption = annualData.reduce((sum, d) => sum + d.consumption, 0);
  const autoconsumption = Math.min(totalProduction, totalConsumption) * 0.7;
  const savings = autoconsumption * 0.18; // 0.18€/kWh économisé

  return {
    production: totalProduction,
    consumption: totalConsumption,
    autoconsumption: Math.round(autoconsumption),
    savings: Math.round(savings),
  };
};

export const getMonthlyStats = () => {
  const totalProduction = monthlyData.reduce((sum, d) => sum + d.production, 0);
  const totalConsumption = monthlyData.reduce((sum, d) => sum + d.consumption, 0);
  const autoconsumption = Math.min(totalProduction, totalConsumption) * 0.65;
  const savings = autoconsumption * 0.18;

  return {
    production: Math.round(totalProduction),
    consumption: Math.round(totalConsumption),
    autoconsumption: Math.round(autoconsumption),
    savings: Math.round(savings),
  };
};

export const getDailyStats = () => {
  const totalProduction = dailyData.reduce((sum, d) => sum + d.production, 0);
  const totalConsumption = dailyData.reduce((sum, d) => sum + d.consumption, 0);
  const autoconsumption = Math.min(totalProduction, totalConsumption) * 0.6;
  const savings = autoconsumption * 0.18;

  return {
    production: totalProduction.toFixed(1),
    consumption: totalConsumption.toFixed(1),
    autoconsumption: autoconsumption.toFixed(1),
    savings: savings.toFixed(2),
  };
};
