import { loadOnboarding } from "./storage";
import { getPersonalizedTips } from "./tips";

export function PersonalizedTipsCard() {
  const state = loadOnboarding();
  const tips = getPersonalizedTips(state.answers);

  if (!tips.length) return null;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Conseils personnalisés</h3>
          <p className="text-sm text-muted-foreground">
            Basé sur tes réponses au questionnaire
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {tips.map((t) => (
          <div key={t.id} className="rounded-xl border p-4">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{t.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
