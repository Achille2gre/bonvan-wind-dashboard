import { useEffect, useState } from "react";
import { loadSession, logout } from "./storage";
import { AuthScreen } from "./AuthScreen";

const FORCE_AUTH_EVERY_TIME = true; // ✅ DEV MODE

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (FORCE_AUTH_EVERY_TIME) {
      logout();
      setLoggedIn(false);
      setReady(true);
      return;
    }

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
