// Données mockées pour les prévisions de production
// Pour brancher des vraies données, remplacer ces exports par des appels API (météo + modèle éolien)

export interface HourlyForecast {
  hour: number;
  production: number; // kWh prévu
  windSpeed: number; // km/h
}

export interface DayForecast {
  date: Date;
  totalProduction: number;
  hourlyData: HourlyForecast[];
}

// Génère des prévisions horaires pour une journée donnée
export const generateDayForecast = (date: Date): DayForecast => {
  // Simulation basée sur un pattern de vent typique
  const baseProduction = 0.8 + Math.random() * 0.4;
  
  const hourlyData: HourlyForecast[] = Array.from({ length: 24 }, (_, hour) => {
    // Le vent est généralement plus fort le matin et en soirée
    let windMultiplier = 1;
    if (hour >= 6 && hour <= 10) windMultiplier = 1.3;
    else if (hour >= 16 && hour <= 20) windMultiplier = 1.4;
    else if (hour >= 0 && hour <= 5) windMultiplier = 0.8;
    else if (hour >= 11 && hour <= 15) windMultiplier = 0.9;
    
    const windSpeed = Math.round(15 + Math.random() * 20 * windMultiplier);
    const production = Number((baseProduction * windMultiplier * (0.8 + Math.random() * 0.4)).toFixed(2));
    
    return {
      hour,
      production,
      windSpeed,
    };
  });

  const totalProduction = hourlyData.reduce((sum, h) => sum + h.production, 0);

  return {
    date,
    totalProduction: Number(totalProduction.toFixed(1)),
    hourlyData,
  };
};

// Cache des prévisions générées (pour éviter de régénérer à chaque rendu)
const forecastCache = new Map<string, DayForecast>();

export const getForecastForDate = (date: Date): DayForecast => {
  const key = date.toISOString().split('T')[0];
  
  if (!forecastCache.has(key)) {
    forecastCache.set(key, generateDayForecast(date));
  }
  
  return forecastCache.get(key)!;
};

// Prévisions pour le mois en cours
export const getMonthForecasts = (year: number, month: number): DayForecast[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return getForecastForDate(date);
  });
};
