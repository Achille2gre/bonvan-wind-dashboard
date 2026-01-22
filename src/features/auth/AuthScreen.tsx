import { useState } from "react";
import { signIn, signUp } from "./storage";

export function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card shadow-sm">
        {/* HEADER */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold">
            {mode === "signup" ? "Créer ton compte Bonvan" : "Se connecter"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Accède à ton dashboard et reçois des conseils personnalisés.
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full h-11 px-3 rounded-xl border bg-background"
              placeholder="ex: benjamin@bonvan.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <input
              className="w-full h-11 px-3 rounded-xl border bg-background"
              placeholder="min 6 caractères"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            {loading
              ? "Chargement..."
              : mode === "signup"
              ? "Créer mon compte"
              : "Se connecter"}
          </button>

          <div className="text-sm text-muted-foreground">
            {mode === "signup" ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                setError(null);
                setMode((m) => (m === "signup" ? "login" : "signup"));
              }}
            >
              {mode === "signup" ? "Se connecter" : "Créer un compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
