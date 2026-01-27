import { useEffect, useState } from "react";
import { loadOnboarding, ONBOARDING_CHANGED_EVENT } from "./storage";
import { OnboardingWizard } from "./OnboardingWizard";
import type { OnboardingAnswers } from "./types";

// ✅ DEV MODE : si true, on affiche l’onboarding à chaque lancement
// (mais SANS resetOnboarding automatique, sinon tu casses l’état à chaque reload)
const FORCE_ONBOARDING_EVERY_TIME = false;

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);

  function refreshFromStorage() {
    const state = loadOnboarding();
    setCompleted(state.completed);
    setReady(true);
  }

  useEffect(() => {
    // 1) init
    refreshFromStorage();

    // 2) écouter les changements (reset/save/patch/skip)
    const onChanged = () => refreshFromStorage();
    window.addEventListener(ONBOARDING_CHANGED_EVENT, onChanged);

    return () => {
      window.removeEventListener(ONBOARDING_CHANGED_EVENT, onChanged);
    };
  }, []);

  if (!ready) return null;

  const shouldShowWizard = FORCE_ONBOARDING_EVERY_TIME || !completed;

  if (shouldShowWizard) {
    return (
      <OnboardingWizard
        onDone={(answers?: OnboardingAnswers) => {
          // saveOnboarding() est déjà fait dans le wizard
          // on se contente de refléter l’état
          setCompleted(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
