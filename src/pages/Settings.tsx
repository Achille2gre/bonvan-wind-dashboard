import AppShell from "@/components/layout/AppShell";
import { resetOnboarding } from "@/features/onboarding/storage";
import { logout } from "@/features/auth/storage";

export default function Settings() {
  return (
    <AppShell showBottomNav>
      <div className="p-4">
        <h1 className="text-xl font-semibold">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérer tes préférences et tes infos d’onboarding
        </p>

        <div className="mt-4 space-y-3">
          <button
            className="w-full h-11 rounded-xl border bg-card hover:bg-muted transition"
            onClick={() => {
              resetOnboarding();
              window.location.reload();
            }}
          >
            Refaire le questionnaire onboarding
          </button>

          <button
            className="w-full h-11 rounded-xl border bg-card hover:bg-muted transition"
            onClick={() => {
              logout();
              window.location.reload();
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </AppShell>
  );
}
