import { useMemo, useState } from "react";
import type { OnboardingAnswers } from "./types";
import { defaultAnswers, saveOnboarding, skipOnboarding } from "./storage";

type StepId = "profile" | "equipments" | "contract" | "notifications";

const steps: { id: StepId; title: string; subtitle: string }[] = [
  {
    id: "profile",
    title: "Ton profil énergie",
    subtitle: "Quelques infos pour personnaliser tes conseils",
  },
  {
    id: "equipments",
    title: "Équipements",
    subtitle: "On cible les postes de conso qui comptent vraiment",
  },
  {
    id: "contract",
    title: "Contrat & habitudes",
    subtitle: "Pour proposer les bons créneaux d’usage",
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Active-les pour recevoir des conseils personnalisés",
  },
];

export function OnboardingWizard({
  onDone,
}: {
  onDone: (answers?: OnboardingAnswers) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);

  const step = steps[stepIndex];
  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);

  function next() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function prev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function finish() {
    saveOnboarding(answers);
    onDone(answers);
  }

  function skip() {
    skipOnboarding();
    onDone();
  }

  const canFinish = useMemo(() => {
    // On force juste 2-3 champs minimum pour une V1 “propre”
    return (
      answers.dwellingType !== null &&
      answers.heatingType !== null &&
      answers.tariff !== null
    );
  }, [answers]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border bg-card shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">{step.title}</h1>
              <p className="text-sm text-muted-foreground">{step.subtitle}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {stepIndex + 1}/{steps.length}
            </div>
          </div>

          <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {step.id === "profile" && (
            <div className="space-y-4">
              <FieldLabel label="Type de site" />
              <div className="grid grid-cols-2 gap-2">
                <ChoiceButton
                  active={answers.dwellingType === "house"}
                  onClick={() => setAnswers((a) => ({ ...a, dwellingType: "house" }))}
                  label="Maison"
                />
                <ChoiceButton
                  active={answers.dwellingType === "apartment"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, dwellingType: "apartment" }))
                  }
                  label="Appartement"
                />
                <ChoiceButton
                  active={answers.dwellingType === "farm"}
                  onClick={() => setAnswers((a) => ({ ...a, dwellingType: "farm" }))}
                  label="Exploitation"
                />
                <ChoiceButton
                  active={answers.dwellingType === "sme"}
                  onClick={() => setAnswers((a) => ({ ...a, dwellingType: "sme" }))}
                  label="PME"
                />
              </div>

              <FieldLabel label="Nombre de personnes" />
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <ChoiceButton
                    key={n}
                    active={answers.peopleCount === n}
                    onClick={() => setAnswers((a) => ({ ...a, peopleCount: n }))}
                    label={n === 6 ? "6+" : String(n)}
                  />
                ))}
              </div>

              <FieldLabel label="Climat (approx.)" />
              <div className="grid grid-cols-3 gap-2">
                <ChoiceButton
                  active={answers.climate === "mild"}
                  onClick={() => setAnswers((a) => ({ ...a, climate: "mild" }))}
                  label="Doux"
                />
                <ChoiceButton
                  active={answers.climate === "temperate"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, climate: "temperate" }))
                  }
                  label="Moyen"
                />
                <ChoiceButton
                  active={answers.climate === "cold"}
                  onClick={() => setAnswers((a) => ({ ...a, climate: "cold" }))}
                  label="Froid"
                />
              </div>

              <FieldLabel label="Chauffage" />
              <div className="grid grid-cols-2 gap-2">
                <ChoiceButton
                  active={answers.heatingType === "electric"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, heatingType: "electric" }))
                  }
                  label="Électrique"
                />
                <ChoiceButton
                  active={answers.heatingType === "gas"}
                  onClick={() => setAnswers((a) => ({ ...a, heatingType: "gas" }))}
                  label="Gaz"
                />
                <ChoiceButton
                  active={answers.heatingType === "heat_pump"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, heatingType: "heat_pump" }))
                  }
                  label="PAC"
                />
                <ChoiceButton
                  active={answers.heatingType === "wood"}
                  onClick={() => setAnswers((a) => ({ ...a, heatingType: "wood" }))}
                  label="Bois"
                />
              </div>
            </div>
          )}

          {step.id === "equipments" && (
            <div className="space-y-4">
              <ToggleRow
                label="Voiture électrique"
                checked={answers.hasEV}
                onChange={(v) => setAnswers((a) => ({ ...a, hasEV: v }))}
              />
              <ToggleRow
                label="Piscine"
                checked={answers.hasPool}
                onChange={(v) => setAnswers((a) => ({ ...a, hasPool: v }))}
              />
              <ToggleRow
                label="Climatisation"
                checked={answers.hasAC}
                onChange={(v) => setAnswers((a) => ({ ...a, hasAC: v }))}
              />
            </div>
          )}

          {step.id === "contract" && (
            <div className="space-y-4">
              <FieldLabel label="Type de tarif" />
              <div className="grid grid-cols-2 gap-2">
                <ChoiceButton
                  active={answers.tariff === "base"}
                  onClick={() => setAnswers((a) => ({ ...a, tariff: "base" }))}
                  label="Base"
                />
                <ChoiceButton
                  active={answers.tariff === "hp_hc"}
                  onClick={() => setAnswers((a) => ({ ...a, tariff: "hp_hc" }))}
                  label="HP/HC"
                />
                <ChoiceButton
                  active={answers.tariff === "tempo"}
                  onClick={() => setAnswers((a) => ({ ...a, tariff: "tempo" }))}
                  label="Tempo"
                />
                <ChoiceButton
                  active={answers.tariff === "unknown"}
                  onClick={() => setAnswers((a) => ({ ...a, tariff: "unknown" }))}
                  label="Je ne sais pas"
                />
              </div>

              <FieldLabel label="Je consomme plutôt" />
              <div className="grid grid-cols-2 gap-2">
                <ChoiceButton
                  active={answers.usagePeak === "morning"}
                  onClick={() => setAnswers((a) => ({ ...a, usagePeak: "morning" }))}
                  label="Le matin"
                />
                <ChoiceButton
                  active={answers.usagePeak === "evening"}
                  onClick={() => setAnswers((a) => ({ ...a, usagePeak: "evening" }))}
                  label="Le soir"
                />
                <ChoiceButton
                  active={answers.usagePeak === "day"}
                  onClick={() => setAnswers((a) => ({ ...a, usagePeak: "day" }))}
                  label="La journée"
                />
                <ChoiceButton
                  active={answers.usagePeak === "variable"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, usagePeak: "variable" }))
                  }
                  label="Variable"
                />
              </div>
            </div>
          )}

          {step.id === "notifications" && (
          <div className="space-y-4">
            <ToggleRow
              label={
                <div className="space-y-1">
                  <div className="text-sm font-medium">Activer les notifications</div>
                  <div className="text-sm text-muted-foreground leading-snug">
                    Cela nous permettra de te transmettre des conseils de consommation personnalisés
                    pour optimiser ton autoconsommation
                  </div>
                </div>
              }
              checked={answers.allowNotifications}
              onChange={(v) =>
                setAnswers((a) => ({
                  ...a,
                  allowNotifications: v,
                  notifyFrequency: v ? "weekly" : "none",
                  notifyTime: v ? "any" : null,
                }))
              }
            />
          </div>
        )}
        </div>

        <div className="p-6 border-t flex items-center justify-between gap-3">
          <button
            className="text-sm text-muted-foreground hover:underline"
            onClick={skip}
            type="button"
          >
            Plus tard
          </button>

          <div className="flex gap-2">
            <button
              className="h-10 px-4 rounded-xl border hover:bg-muted disabled:opacity-40"
              onClick={prev}
              disabled={stepIndex === 0}
              type="button"
            >
              Retour
            </button>

            {stepIndex < steps.length - 1 ? (
              <button
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                onClick={next}
                type="button"
              >
                Suivant
              </button>
            ) : (
              <button
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                onClick={finish}
                disabled={!canFinish}
                type="button"
              >
                Terminer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Helpers UI minimalistes (Tailwind) */
function FieldLabel({ label }: { label: string }) {
  return <div className="text-sm font-medium">{label}</div>;
}

function ChoiceButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 px-3 rounded-xl border text-sm",
        active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode; // ✅ au lieu de string
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
      <div className="flex-1 min-w-0">{label}</div>

      <button
        type="button"
        className={[
          "h-9 w-16 rounded-full border relative transition mt-1",
          checked ? "bg-primary border-primary" : "bg-muted",
        ].join(" ")}
        onClick={() => onChange(!checked)}
      >
        <span
          className={[
            "absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background border transition shadow-sm",
            checked ? "left-8" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
