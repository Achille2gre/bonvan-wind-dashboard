import { useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? "support@bonvan.fr";
declare const __APP_VERSION__: string | undefined;

type StepId = "type" | "context" | "details";
type IssueType = "bug" | "data" | "question" | "other";

const steps: { id: StepId; title: string; subtitle: string }[] = [
  {
    id: "type",
    title: "Type de problème",
    subtitle: "On qualifie ton signalement en quelques secondes",
  },
  {
    id: "context",
    title: "Contexte",
    subtitle: "Dans quel écran et avec quel symptôme ?",
  },
  {
    id: "details",
    title: "Détails",
    subtitle: "Observation, attendu et étapes pour reproduire",
  },
];

export default function HelpSupportPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell showBottomNav>
      <div className="p-4">
        <h1 className="text-xl font-semibold">Aide & Support</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Un problème ? Utilise le formulaire guidé pour qu’on puisse t’aider efficacement.
        </p>

        {/* Bloc principal */}
        <div className="mt-4 rounded-2xl border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-medium">Signaler un problème</div>
              <div className="text-sm text-muted-foreground mt-1 leading-snug">
                Formulaire structuré pour les bugs, incohérences de données ou questions d’usage.
              </div>

              <div className="mt-4">
                <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="h-10 w-full px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                    >
                      Démarrer le formulaire
                    </button>
                  </DialogTrigger>

                  <DialogContent className="w-[calc(100vw-2rem)] max-w-xl p-0 border-none bg-transparent shadow-none [&>button]:hidden">
                    <IssueReportWizard onClose={() => setOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-3 rounded-2xl border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium">Contact</div>
              <div className="text-sm text-muted-foreground mt-1 truncate">{SUPPORT_EMAIL}</div>
              <div className="text-xs text-muted-foreground mt-2">
                À utiliser si le formulaire ne suffit pas.
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                className="h-10 px-4 rounded-xl border hover:bg-muted"
                onClick={() => {
                  navigator.clipboard.writeText(SUPPORT_EMAIL);
                  toast({ title: "Email copié ✅" });
                }}
              >
                Copier
              </button>

              <button
                type="button"
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                onClick={() => {
                  window.location.href = `mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent(
                    "Bonvan – Support"
                  )}`;
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/* Wizard — design calqué sur OnboardingWizard (header/progress/footer) */
/* ------------------------------------------------------------------ */

function IssueReportWizard({ onClose }: { onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [screen, setScreen] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [whatHappened, setWhatHappened] = useState<string>("");
  const [expected, setExpected] = useState<string>("");
  const [stepsToRepro, setStepsToRepro] = useState<string>("");

  const step = steps[stepIndex];

  const progress = useMemo(
    () => ((stepIndex + 1) / steps.length) * 100,
    [stepIndex]
  );

  const diagnostics = useMemo(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return {
      appVersion: typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "unknown",
      mode: import.meta.env.MODE,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      timezone: tz,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
    };
  }, []);

  const payloadText = useMemo(() => {
    const payload = {
      issueType,
      screen,
      title,
      whatHappened,
      expected,
      stepsToRepro,
      diagnostics,
    };
    return JSON.stringify(payload, null, 2);
  }, [issueType, screen, title, whatHappened, expected, stepsToRepro, diagnostics]);

  function next() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  function prev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const canGoNext = useMemo(() => {
    if (step.id === "type") return issueType !== null;
    if (step.id === "context") return screen.trim().length >= 2 && title.trim().length >= 5;
    return true;
  }, [step.id, issueType, screen, title]);

  const canSubmit = useMemo(() => {
    return (
      issueType !== null &&
      screen.trim().length >= 2 &&
      title.trim().length >= 5 &&
      whatHappened.trim().length >= 10 &&
      expected.trim().length >= 5 &&
      stepsToRepro.trim().length >= 5
    );
  }, [issueType, screen, title, whatHappened, expected, stepsToRepro]);

  function submit() {
    if (!canSubmit) {
      toast({
        title: "Il manque des informations",
        description: "Complète observation, attendu et étapes pour reproduire.",
      });
      return;
    }

    const subject = `Bonvan – ${issueType} – ${title}`;

    const body = [
      "Bonjour l’équipe Bonvan,",
      "",
      `Type : ${issueType}`,
      `Écran : ${screen}`,
      "",
      "Résumé :",
      title,
      "",
      "Observation :",
      whatHappened,
      "",
      "Attendu :",
      expected,
      "",
      "Étapes pour reproduire :",
      stepsToRepro,
      "",
      "—",
      "Contexte technique :",
      payloadText,
      "",
      "Merci !",
    ].join("\n");

    window.location.href = `mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border bg-card shadow-sm max-h-[85vh] overflow-hidden">
      {/* Header */}
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

      {/* Body */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[55vh]">
        {step.id === "type" && (
          <div className="space-y-4">
            <FieldLabel label="Quel est le sujet ?" />
            <div className="grid grid-cols-2 gap-2">
              <ChoiceButton
                active={issueType === "bug"}
                onClick={() => setIssueType("bug")}
                label="Bug"
              />
              <ChoiceButton
                active={issueType === "data"}
                onClick={() => setIssueType("data")}
                label="Données"
              />
              <ChoiceButton
                active={issueType === "question"}
                onClick={() => setIssueType("question")}
                label="Question"
              />
              <ChoiceButton
                active={issueType === "other"}
                onClick={() => setIssueType("other")}
                label="Autre"
              />
            </div>
          </div>
        )}

        {step.id === "context" && (
          <div className="space-y-4">
            <FieldLabel label="Écran concerné" />
            <div className="grid grid-cols-2 gap-2">
              {["Performances", "Prévisions", "Historique", "Communauté"].map((s) => (
                <ChoiceButton
                  key={s}
                  active={screen === s}
                  onClick={() => setScreen(s)}
                  label={s}
                />
              ))}
            </div>

            <Input
              value={screen}
              onChange={(e) => setScreen(e.target.value)}
              placeholder="Autre (ex : Profil)"
              className="rounded-xl"
            />

            <FieldLabel label="Résumé" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : courbe vide sur la période sélectionnée"
              className="rounded-xl"
            />
          </div>
        )}

        {step.id === "details" && (
          <div className="space-y-4">
            <FieldLabel label="Observation" />
            <Textarea
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Décris ce que tu observes (message, valeur, comportement…)."
              className="min-h-24 rounded-xl"
            />

            <FieldLabel label="Attendu" />
            <Textarea
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              placeholder="Décris ce qui devrait se passer."
              className="min-h-20 rounded-xl"
            />

            <FieldLabel label="Étapes pour reproduire" />
            <Textarea
              value={stepsToRepro}
              onChange={(e) => setStepsToRepro(e.target.value)}
              placeholder={"1) Aller sur …\n2) Sélectionner …\n3) Observer …"}
              className="min-h-24 rounded-xl"
            />

            <div className="text-sm text-muted-foreground leading-snug">
              Astuce : si tu peux, ajoute une capture d’écran dans l’email.
            </div>

            <button
              type="button"
              className="text-sm text-muted-foreground hover:underline"
              onClick={() => {
                navigator.clipboard.writeText(payloadText);
                toast({ title: "Contexte copié ✅" });
              }}
            >
              Copier le contexte technique
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex items-center justify-between gap-3">
        <button
          className="text-sm text-muted-foreground hover:underline"
          onClick={onClose}
          type="button"
        >
          Annuler
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
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
              onClick={() => {
                if (!canGoNext) {
                  toast({
                    title: "Informations requises",
                    description:
                      step.id === "type"
                        ? "Choisis un type de problème."
                        : "Renseigne l’écran et un résumé.",
                  });
                  return;
                }
                next();
              }}
              disabled={!canGoNext}
              type="button"
            >
              Suivant
            </button>
          ) : (
            <button
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
              onClick={submit}
              disabled={!canSubmit}
              type="button"
            >
              Envoyer
            </button>
          )}
        </div>
      </div>
    </div>
  );

}

/** Helpers UI (mêmes que OnboardingWizard) */
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
