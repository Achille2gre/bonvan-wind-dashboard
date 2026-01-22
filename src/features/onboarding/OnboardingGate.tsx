import { useEffect, useState } from "react";
import { loadOnboarding, resetOnboarding } from "./storage";
import { OnboardingWizard } from "./OnboardingWizard";
import type { OnboardingAnswers } from "./types";

const FORCE_ONBOARDING_EVERY_TIME = true; // ✅ DEV MODE

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (FORCE_ONBOARDING_EVERY_TIME) {
      resetOnboarding(); // ✅ 0 argument
      setCompleted(false);
      setReady(true);
      return;
    }

    const state = loadOnboarding(); // ✅ 0 argument
    setCompleted(state.completed);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!completed) {
    return (
      <OnboardingWizard
        onDone={(answers?: OnboardingAnswers) => {
          setCompleted(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
