export type OwnershipModel = "owner" | "third_party";

export type BonvanAssets = {
  turbinesCount: number;          // nb d'éoliennes
  ownershipModel: OwnershipModel; // owner / third_party
};

// --- Onboarding (exhaustif, d'après tes écrans) ---

export type SiteType = "house" | "apartment" | "farm" | "sme";              // Maison/Appartement/Exploitation/PME
export type Climate = "mild" | "medium" | "cold";                          // Doux/Moyen/Froid
export type Heating = "electric" | "gas" | "heat_pump" | "wood";           // Électrique/Gaz/PAC/Bois
export type TariffType = "base" | "hphc" | "tempo" | "unknown";            // Base/HPHC/Tempo/Je ne sais pas
export type ConsumptionPattern = "morning" | "evening" | "day" | "variable"; // Matin/Soir/Journée/Variable

export type SiteEquipments = {
  electricCar?: boolean;
  pool?: boolean;
  airConditioning?: boolean;
};

export type GPSCoords = {
  lat: number;
  lon: number;
};

export type SiteProfile = {
  // Profil énergie (1/5)
  siteType?: SiteType;
  peopleCount?: 1 | 2 | 3 | 4 | 5 | 6; // 6 = "6+"
  climate?: Climate;
  heating?: Heating;
  gps?: GPSCoords;


  // Équipements (3/5)
  equipments?: SiteEquipments;

  // Contrat & habitudes (4/5)
  tariffType?: TariffType;
  consumptionPattern?: ConsumptionPattern;

  // Notifications (5/5)
  allowNotifications?: boolean;

  // Optionnel (si vous avez / ajoutez une étape localisation)
  city?: string;
};

export type UserProfile = {
  avatarDataUrl?: string; // base64 (image)
  assets: BonvanAssets;
  site?: SiteProfile;
  orderNumber?: string;
};
