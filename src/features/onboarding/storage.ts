import type { OnboardingAnswers } from "./types";

const STORAGE_KEY = "bonvan:onboarding:v1";
export const ONBOARDING_CHANGED_EVENT = "bonvan:onboarding:changed";

function emitChanged() {
  window.dispatchEvent(new Event(ONBOARDING_CHANGED_EVENT));
}

export interface OnboardingStorage {
  completed: boolean;
  completedAt?: string;
  answers?: OnboardingAnswers;
}

export const defaultAnswers: OnboardingAnswers = {
  dwellingType: null,
  peopleCount: null,

  heatingType: null,
  waterHeatingType: null,

  hasEV: false,
  hasPool: false,
  hasAC: false,

  tariff: null,
  usagePeak: null,

  goal: null,

  turbinesCount: 1,
  ownershipModel: "owner",

  allowNotifications: false,
  notifyFrequency: null,
  notifyTime: null,
};

export function loadOnboarding(): OnboardingStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: false };

    const parsed = JSON.parse(raw) as OnboardingStorage;
    return {
      completed: Boolean(parsed.completed),
      completedAt: parsed.completedAt,
      answers: parsed.answers,
    };
  } catch {
    return { completed: false };
  }
}

export function saveOnboarding(answers: OnboardingAnswers) {
  const payload: OnboardingStorage = {
    completed: true,
    completedAt: new Date().toISOString(),
    answers,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  emitChanged();
}

export function skipOnboarding() {
  const payload: OnboardingStorage = {
    completed: true,
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  emitChanged();
}

// ✅ Nouveau : update partiel (utile pour Profil)
export function patchOnboarding(patch: Partial<OnboardingAnswers>) {
  const current = loadOnboarding();

  const mergedAnswers: OnboardingAnswers = {
    ...defaultAnswers,
    ...(current.answers ?? {}),
    ...patch,
  };

  const payload: OnboardingStorage = {
    completed: true,
    completedAt: current.completedAt ?? new Date().toISOString(),
    answers: mergedAnswers,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  emitChanged();
}

export function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
  emitChanged();
}
