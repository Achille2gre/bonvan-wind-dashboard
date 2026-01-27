import AppShell from "@/components/layout/AppShell";

export default function Support() {
  return (
    <AppShell showBottomNav>
      <div className="p-4">
        <h1 className="text-xl font-semibold">Aide & Support</h1>
        <p className="text-sm text-muted-foreground mt-1">
          FAQ, contact, problèmes techniques…
        </p>

        <div className="mt-4 rounded-2xl border bg-card p-5 space-y-2">
          <div className="text-sm font-medium">Contact</div>
          <div className="text-sm text-muted-foreground">
            support@bonvan.fr (à remplacer)
          </div>
        </div>
      </div>
    </AppShell>
  );
}
