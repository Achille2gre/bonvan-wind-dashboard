import type { UserProfile } from "./types";

const KEY = "bonvan_profile_v1";

const defaultProfile: UserProfile = {
  assets: {
    turbinesCount: 0,
    ownershipModel: "owner",
  },
  site: {}, // ✅ NEW
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProfile;

    const parsed = JSON.parse(raw) as UserProfile;

    return {
      ...defaultProfile,
      ...parsed,
      assets: { ...defaultProfile.assets, ...(parsed.assets ?? {}) },
      site: { ...(defaultProfile.site ?? {}), ...(parsed.site ?? {}) }, // ✅ NEW
    };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}
