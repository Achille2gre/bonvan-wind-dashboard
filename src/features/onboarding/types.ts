export type DwellingType = "house" | "apartment" | "farm" | "sme" | "other";
export type ClimateType = "mild" | "temperate" | "cold";

export type HeatingType =
  | "electric"
  | "gas"
  | "heat_pump"
  | "wood"
  | "other"
  | "unknown";

export type WaterHeatingType =
  | "electric"
  | "gas"
  | "heat_pump"
  | "solar"
  | "other"
  | "unknown";

export type EnergyTariff = "base" | "hp_hc" | "tempo" | "unknown";

export type UsagePeak = "morning" | "evening" | "day" | "variable";

export type MainGoal = "save_money" | "reduce_co2" | "autonomy" | "understand";

export type NotifyFrequency = "daily" | "weekly" | "alerts_only" | "none";
export type NotifyTime = "morning" | "midday" | "evening" | "any";

export interface OnboardingAnswers {
  dwellingType: DwellingType | null;
  peopleCount: number | null; // 1..6 (6 = "6+")
  climate: ClimateType | null;

  heatingType: HeatingType | null;
  waterHeatingType: WaterHeatingType | null;

  hasEV: boolean;
  hasPool: boolean;
  hasAC: boolean;

  tariff: EnergyTariff | null;
  usagePeak: UsagePeak | null;

  goal: MainGoal | null;

  allowNotifications: boolean;
  notifyFrequency: NotifyFrequency | null;
  notifyTime: NotifyTime | null;
}
