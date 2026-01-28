import { useEffect, useMemo, useState } from "react";
import { User, Camera, Trash2, Pencil, MapPin, Wind, PlugZap, Bell, ChevronRight } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

import { loadProfile, saveProfile } from "@/features/profile/storage";
import type { UserProfile, SiteProfile } from "@/features/profile/types";
import { EditSiteModal } from "@/features/profile/EditSiteModal";

import { loadSession } from "@/features/auth/storage";
import { loadOnboarding } from "@/features/onboarding/storage";

/* ---------------- HELPERS ---------------- */

function isEmptyObject(o: any) {
  return !o || (typeof o === "object" && Object.keys(o).length === 0);
}

function normBool(v: any): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (["true", "1", "yes", "oui"].includes(s)) return true;
    if (["false", "0", "no", "non"].includes(s)) return false;
  }
  return undefined;
}

function normalizePeopleCount(v: any): SiteProfile["peopleCount"] | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const s = String(v).trim();
  if (s === "6+") return 6;
  const n = Number(s);
  if ([1, 2, 3, 4, 5, 6].includes(n)) return n as any;
  return undefined;
}

function normalizeSiteType(v: any): SiteProfile["siteType"] | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase().trim();
  if (s.includes("maison") || s === "house") return "house";
  if (s.includes("appart") || s === "apartment") return "apartment";
  if (s.includes("exploit") || s === "farm") return "farm";
  if (s === "pme" || s === "sme") return "sme";
  return undefined;
}

function normalizeClimate(v: any): SiteProfile["climate"] | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase().trim();
  if (s.includes("doux") || s === "mild") return "mild";
  if (s.includes("moyen") || s === "medium") return "medium";
  if (s.includes("froid") || s === "cold") return "cold";
  return undefined;
}

function normalizeHeating(v: any): SiteProfile["heating"] | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase().trim();
  if (s.includes("élect") || s.includes("elect") || s === "electric") return "electric";
  if (s.includes("gaz") || s === "gas") return "gas";
  if (s === "pac" || s.includes("pompe") || s === "heat_pump") return "heat_pump";
  if (s.includes("bois") || s === "wood") return "wood";
  return undefined;
}

function normalizeTariff(v: any): SiteProfile["tariffType"] | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase().trim();
  if (s === "base") return "base";
  if (s.includes("hp") || s.includes("hc") || s === "hphc") return "hphc";
  if (s === "tempo") return "tempo";
  if (s.includes("sais pas") || s === "unknown") return "unknown";
  return undefined;
}

function normalizePattern(v: any): SiteProfile["consumptionPattern"] | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase().trim();
  if (s.includes("matin") || s === "morning") return "morning";
  if (s.includes("soir") || s === "evening") return "evening";
  if (s.includes("journ") || s === "day") return "day";
  if (s.includes("vari") || s === "variable") return "variable";
  return undefined;
}

function onboardingToSite(a: any): SiteProfile {
  if (!a) return {};
  const site: SiteProfile = {};

  site.siteType = normalizeSiteType(a.siteType ?? a.typeSite);
  site.peopleCount = normalizePeopleCount(a.peopleCount ?? a.nombrePersonnes ?? a.nbPeople);
  site.climate = normalizeClimate(a.climate ?? a.climat);
  site.heating = normalizeHeating(a.heating ?? a.chauffage);

  const electricCar = normBool(a.electricCar ?? a.voitureElectrique);
  const pool = normBool(a.pool ?? a.piscine);
  const airConditioning = normBool(a.airConditioning ?? a.climatisation);

  if (
    typeof electricCar === "boolean" ||
    typeof pool === "boolean" ||
    typeof airConditioning === "boolean"
  ) {
    site.equipments = {
      electricCar: typeof electricCar === "boolean" ? electricCar : undefined,
      pool: typeof pool === "boolean" ? pool : undefined,
      airConditioning: typeof airConditioning === "boolean" ? airConditioning : undefined,
    };
  }

  site.tariffType = normalizeTariff(a.tariffType ?? a.tariff ?? a.typeTarif ?? a.optionTarifaire);
  site.consumptionPattern = normalizePattern(a.consumptionPattern ?? a.consommePlutot);

  const allowNotif = normBool(a.allowNotifications ?? a.notifications ?? a.notify);
  if (typeof allowNotif === "boolean") site.allowNotifications = allowNotif;

  return site;
}

function mergeMissingSite(current: SiteProfile, incoming: SiteProfile): SiteProfile {
  const next: SiteProfile = { ...current };
  let changed = false;

  for (const [k, v] of Object.entries(incoming)) {
    if (v === undefined) continue;

    if (k === "equipments" && v && typeof v === "object") {
      const curEq = current.equipments ?? {};
      const incEq = v as any;
      const nextEq: any = { ...curEq };
      let eqChanged = false;

      for (const [ek, ev] of Object.entries(incEq)) {
        if (ev === undefined) continue;
        if ((nextEq as any)[ek] === undefined) {
          (nextEq as any)[ek] = ev;
          eqChanged = true;
        }
      }

      if (eqChanged) {
        next.equipments = nextEq;
        changed = true;
      }
      continue;
    }

    if ((next as any)[k] === undefined) {
      (next as any)[k] = v;
      changed = true;
    }
  }

  return changed ? next : current;
}

function SectionCard({
  title,
  subtitle,
  icon,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="h-10 w-10 rounded-2xl bg-primary-light flex items-center justify-center">
              {icon}
            </div>
          ) : null}
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {subtitle ? <div className="text-xs text-muted-foreground mt-1">{subtitle}</div> : null}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [editSiteOpen, setEditSiteOpen] = useState(false);
  const [editUsageOpen, setEditUsageOpen] = useState(false);

  const session = useMemo(() => {
    try {
      return loadSession?.();
    } catch {
      return null;
    }
  }, []);

  const onboarding: any = useMemo(() => {
    try {
      const fn: any = loadOnboarding as any;
      if (session?.userId && typeof fn === "function" && fn.length >= 1) return fn(session.userId);
      if (typeof fn === "function") return fn();
      return null;
    } catch {
      return null;
    }
  }, [session?.userId]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // ✅ Migration onboarding -> profile.site (sans écraser si déjà édité)
  useEffect(() => {
    const a: any = onboarding?.answers ?? onboarding ?? null;
    if (!a) return;

    const incoming = onboardingToSite(a);
    if (isEmptyObject(incoming)) return;

    setProfile((p) => {
      const curSite = p.site ?? {};
      const merged = mergeMissingSite(curSite, incoming);
      if (merged === curSite) return p;
      return { ...p, site: merged };
    });
  }, [onboarding]);

  const siteDetails = useMemo(() => {
    const s = profile.site ?? {};
    const items: Array<{ label: string; value: string }> = [];

    const siteTypeLabel: any = { house: "Maison", apartment: "Appartement", farm: "Exploitation", sme: "PME" };
    const climateLabel: any = { mild: "Doux", medium: "Moyen", cold: "Froid" };
    const heatingLabel: any = { electric: "Électrique", gas: "Gaz", heat_pump: "PAC", wood: "Bois" };
    const tariffLabel: any = { base: "Base", hphc: "HP/HC", tempo: "Tempo", unknown: "Je ne sais pas" };
    const patternLabel: any = { morning: "Le matin", evening: "Le soir", day: "La journée", variable: "Variable" };

    if (s.siteType) items.push({ label: "Type de site", value: siteTypeLabel[s.siteType] ?? String(s.siteType) });
    if (s.peopleCount) items.push({ label: "Nb personnes", value: s.peopleCount === 6 ? "6+" : String(s.peopleCount) });
    if (s.climate) items.push({ label: "Climat", value: climateLabel[s.climate] ?? String(s.climate) });
    if (s.heating) items.push({ label: "Chauffage", value: heatingLabel[s.heating] ?? String(s.heating) });

    if (s.equipments?.electricCar !== undefined) items.push({ label: "Voiture électrique", value: s.equipments.electricCar ? "Oui" : "Non" });
    if (s.equipments?.pool !== undefined) items.push({ label: "Piscine", value: s.equipments.pool ? "Oui" : "Non" });
    if (s.equipments?.airConditioning !== undefined) items.push({ label: "Climatisation", value: s.equipments.airConditioning ? "Oui" : "Non" });

    if (s.tariffType) items.push({ label: "Type de tarif", value: tariffLabel[s.tariffType] ?? String(s.tariffType) });
    if (s.consumptionPattern) items.push({ label: "Je consomme plutôt", value: patternLabel[s.consumptionPattern] ?? String(s.consumptionPattern) });

    if (s.allowNotifications !== undefined) items.push({ label: "Notifications", value: s.allowNotifications ? "Activées" : "Désactivées" });

    if (items.length === 0) items.push({ label: "Infos site", value: "Non renseignées" });

    return items;
  }, [profile.site]);

  const handlePickPhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setProfile((p) => ({ ...p, avatarDataUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const displayName = session?.email ? session.email.split("@")[0] : "Utilisateur Bonvan";
  const email = session?.email ?? "";

const s = profile.site ?? {};

const gpsLabel =
  s.gps?.lat !== undefined && s.gps?.lon !== undefined
    ? `${s.gps.lat.toFixed(6)}, ${s.gps.lon.toFixed(6)}`
    : undefined;

const siteTypeLabel: any = { house: "Maison", apartment: "Appartement", farm: "Exploitation", sme: "PME" };
const climateLabel: any = { mild: "Doux", medium: "Moyen", cold: "Froid" };
const heatingLabel: any = { electric: "Électrique", gas: "Gaz", heat_pump: "PAC", wood: "Bois" };
const tariffLabel: any = { base: "Base", hphc: "HP/HC", tempo: "Tempo", unknown: "Je ne sais pas" };
const patternLabel: any = { morning: "Le matin", evening: "Le soir", day: "La journée", variable: "Variable" };

const strongLoads = [
  { key: "electricCar", label: "Voiture électrique" },
  { key: "pool", label: "Piscine" },
  { key: "airConditioning", label: "Climatisation" },
].filter((x) => (s.equipments as any)?.[x.key] === true);

  return (
    <AppShell showBottomNav>
      <div className="p-4 space-y-4">
        {/* Header profil */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-card border flex items-center justify-center overflow-hidden">
              {profile.avatarDataUrl ? (
                <img src={profile.avatarDataUrl} alt="Photo de profil" className="h-full w-full object-cover" />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-primary-light flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>

            {/* bouton upload */}
            <label className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl border bg-card flex items-center justify-center hover:bg-muted transition cursor-pointer">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePickPhoto(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold">Mon profil</h1>
            <div className="mt-1 flex items-center gap-2">
            <div className="text-sm text-muted-foreground">{displayName}</div>

            <div className="ml-auto text-[11px] px-2 py-1 rounded-full border bg-card text-muted-foreground">
              Cmd: {profile.orderNumber ? profile.orderNumber : "Non renseigné"}
            </div>
          </div>

            {email ? <div className="text-xs text-muted-foreground">{email}</div> : null}
          </div>

          {profile.avatarDataUrl ? (
            <button
              className="h-10 px-3 rounded-xl border bg-card hover:bg-muted transition flex items-center gap-2"
              onClick={() => setProfile((p) => ({ ...p, avatarDataUrl: undefined }))}
              aria-label="Supprimer la photo"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Retirer</span>
            </button>
          ) : null}
        </div>

        {/* SECTION 1 — SITE & BONVAN */}
        <SectionCard
          title="Site & Bonvan"
          subtitle="Localisation, type de site et flotte"
          icon={<MapPin className="h-5 w-5 text-primary" />}
          action={
            <button
              className="h-10 px-3 rounded-xl border bg-card hover:bg-muted transition flex items-center gap-2"
              onClick={() => setEditSiteOpen(true)}
              type="button"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm">Modifier</span>
            </button>
          }
        >
          <div className="space-y-2">
            <InfoRow label="Coordonnées GPS" value="Synchronisées via commande" />
            <InfoRow label="Type de site" value={s.siteType ? siteTypeLabel[s.siteType] : "Non renseigné"} />
          </div>

          <div className="mt-4 rounded-xl border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Ma flotte Bonvan</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Synchronisée automatiquement à partir de vos commandes.
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <InfoRow label="Nombre d’éoliennes" value={String(profile.assets.turbinesCount)} />
              <InfoRow
                label="Statut"
                value={profile.assets.ownershipModel === "owner" ? "Propriétaire" : "Tiers investisseur"}
              />
            </div>
          </div>
        </SectionCard>

        {/* SECTION 2 — ÉQUIPEMENTS & USAGES */}
        <SectionCard
          title="Équipements & usages"
          subtitle="Chauffage et postes de consommation importants"
          icon={<PlugZap className="h-5 w-5 text-primary" />}
          action={
            <button
              className="h-10 px-3 rounded-xl border bg-card hover:bg-muted transition flex items-center gap-2"
              onClick={() => setEditUsageOpen(true)}
              type="button"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm">Modifier</span>
            </button>
          }
        >
          <div className="space-y-2">
            <InfoRow label="Chauffage" value={s.heating ? heatingLabel[s.heating] : "Non renseigné"} />
            <InfoRow label="Type de tarif" value={s.tariffType ? tariffLabel[s.tariffType] : undefined} />
            <InfoRow label="Je consomme plutôt" value={s.consumptionPattern ? patternLabel[s.consumptionPattern] : undefined} />
          </div>

          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Postes forts</div>
            {strongLoads.length === 0 ? (
              <div className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
                Aucun équipement sélectionné
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {strongLoads.map((x) => (
                  <div key={x.key} className="px-3 py-1 rounded-full border bg-background text-sm">
                    {x.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* SECTION 3 — NOTIFICATIONS */}
        <SectionCard
          title="Notifications"
          subtitle="Conseils personnalisés et alertes"
          icon={<Bell className="h-5 w-5 text-primary" />}
          action={
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(s.allowNotifications)}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, site: { ...(p.site ?? {}), allowNotifications: e.target.checked } }))
                }
              />
              <span>Activées</span>
            </label>
          }
        >
          <div className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
            Active les notifications pour recevoir des recommandations adaptées à ton profil de conso.
          </div>
        </SectionCard>

        {/* MODALE 1 — SITE uniquement */}
        <EditSiteModal
          variant="site"
          open={editSiteOpen}
          onClose={() => setEditSiteOpen(false)}
          value={profile.site ?? {}}
          onSave={(nextSite) =>
            setProfile((p) => ({
              ...p,
              site: {
                ...(p.site ?? {}),
                siteType: nextSite.siteType, // ✅ uniquement siteType
              },
            }))
          }
        />

        {/* MODALE 2 — ÉQUIPEMENTS & USAGES uniquement */}
        <EditSiteModal
          variant="usage"
          open={editUsageOpen}
          onClose={() => setEditUsageOpen(false)}
          value={profile.site ?? {}}
          onSave={(nextSite) =>
            setProfile((p) => ({
              ...p,
              site: {
                ...(p.site ?? {}),
                heating: nextSite.heating,
                tariffType: nextSite.tariffType,
                consumptionPattern: nextSite.consumptionPattern,
                // ✅ merge équipements propre
                equipments: {
                  ...(p.site?.equipments ?? {}),
                  ...(nextSite.equipments ?? {}),
                },
              },
            }))
          }
        />
      </div>
    </AppShell>
  );
}
