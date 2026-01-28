import { useEffect, useState } from "react";
import { loadSession } from "./storage";
import { AuthScreen } from "./AuthScreen";

// ✅ Toggle runtime (persistant) : pas besoin de redémarrer le serveur
const AUTH_BYPASS_KEY = "bonvan:dev:disable_auth";

// ✅ Par défaut : auth désactivée en dev tant que tu n’as pas explicitement mis "false"
function isAuthBypassed(): boolean {
  try {
    const v = localStorage.getItem(AUTH_BYPASS_KEY);
    if (v === null) {
      localStorage.setItem(AUTH_BYPASS_KEY, "true");
      return true;
    }
    return v === "true";
  } catch {
    return true;
  }
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  // ✅ Si bypass activé : on ne montre jamais l'écran d'auth
  if (isAuthBypassed()) {
    return <>{children}</>;
  }

  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setLoggedIn(Boolean(session));
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!loggedIn) {
    return <AuthScreen onSuccess={() => setLoggedIn(true)} />;
  }

  return <>{children}</>;
}
