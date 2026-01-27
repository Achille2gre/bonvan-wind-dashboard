import AppShell from "@/components/layout/AppShell";

export default function About() {
  return (
    <AppShell showBottomNav>
      <div className="p-4">
        <h1 className="text-xl font-semibold">À propos de Bonvan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          L’éolien à portée de main
        </p>

        <div className="mt-4 rounded-2xl border bg-card p-5 space-y-2">
          <div className="text-sm font-medium">Mission</div>
          <div className="text-sm text-muted-foreground">
            Bonvan démocratise l’accès à l’énergie renouvelable grâce à une éolienne
            d’autoconsommation simple à installer.
          </div>
        </div>

        <div className="mt-3 rounded-2xl border bg-card p-5 space-y-2">
          <div className="text-sm font-medium">Version</div>
          <div className="text-sm text-muted-foreground">V1 (prototype)</div>
        </div>
      </div>
    </AppShell>
  );
}
