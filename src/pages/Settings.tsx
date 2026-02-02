import AppShell from "@/components/layout/AppShell";
import { useEffect, useMemo, useState } from "react";
import { Sun, Moon } from "lucide-react";

import { resetOnboarding } from "@/features/onboarding/storage";
import { logout } from "@/features/auth/storage";

type ThemeMode = "system" | "light" | "dark";
type Language = "fr" | "en";
type NotifyFrequency = "weekly" | "daily";

type SourceStatus = "connected" | "expired" | "unknown";

const KEYS = {
  theme: "bonvan.theme",
  lang: "bonvan.lang",
  notifEnabled: "bonvan.notifications.enabled",
  notifFrequency: "bonvan.notifications.frequency",

  // V1 : vous pourrez remplacer ça par votre vraie logique (token/expiration)
  enedisStatus: "bonvan.source.enedis.status",
  tiersStatus: "bonvan.source.tiers.status",
};

export default function Settings() {
  // --- Apparence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const v = localStorage.getItem(KEYS.theme);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  });

  const [systemDark, setSystemDark] = useState(() => {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
});

useEffect(() => {
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (!mq?.addEventListener) return;

  const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}, []);

const effectiveTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
const isDark = effectiveTheme === "dark";

  // --- Langue
  const [language, setLanguage] = useState<Language>(() => {
    const v = localStorage.getItem(KEYS.lang);
    return v === "fr" || v === "en" ? v : "fr";
  });

  // --- Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const v = localStorage.getItem(KEYS.notifEnabled);
    return v ? v === "true" : true;
  });

  const [notifyFrequency, setNotifyFrequency] = useState<NotifyFrequency>(() => {
    const v = localStorage.getItem(KEYS.notifFrequency);
    return v === "daily" || v === "weekly" ? v : "weekly";
  });

  // --- Sources connectées (V1: statut simple stocké localement)
  const [enedisStatus, setEnedisStatus] = useState<SourceStatus>("unknown");
  const [tiersStatus, setTiersStatus] = useState<SourceStatus>("unknown");

  useEffect(() => {
    localStorage.setItem(KEYS.theme, theme);
    localStorage.setItem(KEYS.lang, language);
    localStorage.setItem(KEYS.notifEnabled, String(notificationsEnabled));
    localStorage.setItem(KEYS.notifFrequency, notifyFrequency);
  }, [theme, language, notificationsEnabled, notifyFrequency]);

  // Appliquer dark mode via class "dark" sur <html>
  useEffect(() => {
    const root = document.documentElement;

    const apply = (m: "light" | "dark") => {
      if (m === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    };

    if (theme === "system") {
      const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
      apply(mq?.matches ? "dark" : "light");

      const listener = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq?.addEventListener?.("change", listener);
      return () => mq?.removeEventListener?.("change", listener);
    }

    apply(theme);
  }, [theme]);

  useEffect(() => {
    const e = localStorage.getItem(KEYS.enedisStatus) as SourceStatus | null;
    const t = localStorage.getItem(KEYS.tiersStatus) as SourceStatus | null;

    setEnedisStatus(e === "connected" || e === "expired" ? e : "unknown");
    setTiersStatus(t === "connected" || t === "expired" ? t : "unknown");
  }, []);

  const themeLabel = useMemo(() => {
    if (theme === "system") return "Automatique";
    if (theme === "light") return "Clair";
    return "Sombre";
  }, [theme]);

  const langLabel = useMemo(() => (language === "fr" ? "Français" : "English"), [language]);

  function statusLabel(s: SourceStatus) {
    if (s === "connected") return "Connecté";
    if (s === "expired") return "Expiré";
    return "Inconnu";
  }

  function reconnect(which: "enedis" | "tiers") {
    // TODO : brancher sur vos flows réels de reconnexion.
    // V1 : on simule juste un “connected”
    const key = which === "enedis" ? KEYS.enedisStatus : KEYS.tiersStatus;
    localStorage.setItem(key, "connected");
    if (which === "enedis") setEnedisStatus("connected");
    else setTiersStatus("connected");
  }

  function exportJSON(filename: string, payload: any) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportProfile() {
    exportJSON(`bonvan-profil-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      preferences: {
        theme,
        language,
        notificationsEnabled,
        notifyFrequency,
      },
      sources: {
        enedis: enedisStatus,
        tiers: tiersStatus,
      },
    });
  }

  function exportActivity() {
    // TODO : brancher sur votre vraie activité (synchros, événements, etc.)
    exportJSON(`bonvan-activite-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      activity: [],
      note: "À brancher : export d’activité réelle (sync, erreurs, etc.)",
    });
  }

  return (
    <AppShell showBottomNav>
      <div className="p-4">
        <h1 className="text-xl font-semibold">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personnalise l’application, gère tes notifications et tes données.
        </p>

        {/* Apparence */}
        <Section title="Apparence">
          <Row
            title="Thème"
            subtitle={`Actuel : ${isDark ? "Sombre" : "Clair"}`}
            right={
              <button
                type="button"
                className="h-10 w-10 rounded-xl border bg-background hover:bg-muted transition inline-flex items-center justify-center"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
                title={isDark ? "Mode sombre" : "Mode clair"}
              >
                {isDark ? <Sun className="h-4 w-4" />: <Moon className="h-4 w-4" />}
              </button>
            }
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Row
            title="Activer les notifications"
            subtitle="Conseils personnalisés et alertes"
            right={<Toggle checked={notificationsEnabled} onChange={setNotificationsEnabled} />}
          />
        </Section>

        {/* Données & confidentialité */}
        <Section title="Données & confidentialité">

          <Row title="Exporter mes données" subtitle="Télécharger un export en JSON." noButton />
          <div className="px-5 pb-4 pt-2 flex gap-2">
            <button
              type="button"
              className="h-10 px-4 rounded-xl border hover:bg-muted text-sm"
              onClick={exportActivity}
            >
              Export activité
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-sm"
              onClick={exportProfile}
            >
              Export profil
            </button>
          </div>
        </Section>

        {/* Compte */}
        <Section title="Compte">
          <Row
            title="Refaire le questionnaire onboarding"
            subtitle="Réinitialise tes réponses et relance le questionnaire."
            onClick={() => {
              resetOnboarding();
              window.location.reload();
            }}
            chevron
          />
          <Row
            title="Se déconnecter"
            subtitle="Changer de compte sur cet appareil."
            onClick={() => {
              logout();
              window.location.reload();
            }}
            chevron
            danger
          />
        </Section>
      </div>
    </AppShell>
  );
}

/* ---------------- UI helpers ---------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="rounded-2xl border bg-card overflow-hidden">{children}</div>
    </div>
  );
}

function Row({
  title,
  subtitle,
  right,
  onClick,
  chevron,
  danger,
  noButton,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  chevron?: boolean;
  danger?: boolean;
  noButton?: boolean;
}) {
  const clickable = Boolean(onClick) && !noButton;
  const Tag: any = clickable ? "button" : "div";

  return (
    <Tag
      type={clickable ? "button" : undefined}
      onClick={clickable ? onClick : undefined}
      className={[
        "w-full text-left px-5 py-4 flex items-center justify-between gap-4 border-b last:border-b-0",
        clickable ? "hover:bg-muted/40 cursor-pointer" : "cursor-default",
        danger ? "text-destructive" : "",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {subtitle && (
          <div className={["text-sm mt-1 leading-snug", danger ? "text-destructive/70" : "text-muted-foreground"].join(" ")}>
            {subtitle}
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {right}
        {chevron && <span className={["text-muted-foreground", danger ? "text-destructive/70" : ""].join(" ")}>›</span>}
      </div>
    </Tag>
  );
}

function SubRow({
  title,
  status,
  onReconnect,
}: {
  title: string;
  status: string;
  onReconnect: () => void;
}) {
  return (
    <div className="px-5 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground mt-1">Statut : {status}</div>
      </div>

      <button
        type="button"
        className="h-10 px-4 rounded-xl border hover:bg-muted text-sm"
        onClick={onReconnect}
      >
        Reconnecter
      </button>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={[
        "h-9 w-16 rounded-full border relative transition",
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
  );
}
