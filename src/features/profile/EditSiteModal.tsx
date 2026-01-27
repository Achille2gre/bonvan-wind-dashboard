import { useEffect, useState } from "react";
import type { ConsumptionPattern, Heating, SiteProfile, SiteType, TariffType } from "./types";

type Props = {
  variant: "site" | "usage";
  open: boolean;
  onClose: () => void;
  value: SiteProfile;
  onSave: (next: SiteProfile) => void;
};

function OptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`h-10 rounded-xl border transition px-3 text-sm ${
        active ? "bg-primary-light" : "bg-card hover:bg-muted"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function EditSiteModal({ variant, open, onClose, value, onSave }: Props) {
  const [draft, setDraft] = useState<SiteProfile>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop plein écran */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fermer"
        type="button"
      />

      {/* Sheet centrée + limitée à max-w-lg (format mobile) */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="w-full max-w-lg rounded-t-2xl bg-card border p-4 max-h-[85vh] overflow-auto">
          <div className="text-base font-semibold">
            {variant === "site" ? "Modifier mon site" : "Modifier mes équipements & usages"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Modifie tes réponses sans relancer le questionnaire
          </div>

          {/* ---------------- VARIANT: SITE ---------------- */}
          {variant === "site" ? (
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Type de site</div>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton
                    active={draft.siteType === "house"}
                    onClick={() => setDraft((d) => ({ ...d, siteType: "house" as SiteType }))}
                  >
                    Maison
                  </OptionButton>

                  <OptionButton
                    active={draft.siteType === "apartment"}
                    onClick={() => setDraft((d) => ({ ...d, siteType: "apartment" as SiteType }))}
                  >
                    Appartement
                  </OptionButton>

                  <OptionButton
                    active={draft.siteType === "farm"}
                    onClick={() => setDraft((d) => ({ ...d, siteType: "farm" as SiteType }))}
                  >
                    Exploitation
                  </OptionButton>

                  <OptionButton
                    active={draft.siteType === "sme"}
                    onClick={() => setDraft((d) => ({ ...d, siteType: "sme" as SiteType }))}
                  >
                    PME
                  </OptionButton>
                </div>
              </div>
            </div>
          ) : null}

          {/* ---------------- VARIANT: USAGE ---------------- */}
          {variant === "usage" ? (
            <div className="mt-5 space-y-6">
              {/* Chauffage */}
              <div>
                <div className="text-sm font-medium">Chauffage</div>
                <div className="text-xs text-muted-foreground mt-1">Choisis ton mode principal</div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <OptionButton
                    active={draft.heating === "electric"}
                    onClick={() => setDraft((d) => ({ ...d, heating: "electric" as Heating }))}
                  >
                    Électrique
                  </OptionButton>
                  <OptionButton
                    active={draft.heating === "gas"}
                    onClick={() => setDraft((d) => ({ ...d, heating: "gas" as Heating }))}
                  >
                    Gaz
                  </OptionButton>
                  <OptionButton
                    active={draft.heating === "heat_pump"}
                    onClick={() => setDraft((d) => ({ ...d, heating: "heat_pump" as Heating }))}
                  >
                    PAC
                  </OptionButton>
                  <OptionButton
                    active={draft.heating === "wood"}
                    onClick={() => setDraft((d) => ({ ...d, heating: "wood" as Heating }))}
                  >
                    Bois
                  </OptionButton>
                </div>
              </div>

              {/* Équipements */}
              <div>
                <div className="text-sm font-medium">Équipements</div>
                <div className="text-xs text-muted-foreground mt-1">
                  On cible les postes de conso qui comptent vraiment
                </div>

                <div className="mt-3 space-y-2">
                  {[
                    { k: "electricCar", label: "Voiture électrique" },
                    { k: "pool", label: "Piscine" },
                    { k: "airConditioning", label: "Climatisation" },
                  ].map((it) => {
                    const checked = Boolean(
                      draft.equipments?.[it.k as keyof NonNullable<SiteProfile["equipments"]>]
                    );

                    return (
                      <label
                        key={it.k}
                        className="flex items-center justify-between rounded-xl border bg-background p-3"
                      >
                        <div className="text-sm font-medium">{it.label}</div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              equipments: { ...(d.equipments ?? {}), [it.k]: e.target.checked },
                            }))
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Contrat & habitudes */}
              <div>
                <div className="text-sm font-medium">Contrat & habitudes</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Pour proposer les bons créneaux d’usage
                </div>

                <div className="mt-3 space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Type de tarif</div>
                    <div className="grid grid-cols-2 gap-2">
                      <OptionButton
                        active={draft.tariffType === "base"}
                        onClick={() => setDraft((d) => ({ ...d, tariffType: "base" as TariffType }))}
                      >
                        Base
                      </OptionButton>
                      <OptionButton
                        active={draft.tariffType === "hphc"}
                        onClick={() => setDraft((d) => ({ ...d, tariffType: "hphc" as TariffType }))}
                      >
                        HP/HC
                      </OptionButton>
                      <OptionButton
                        active={draft.tariffType === "tempo"}
                        onClick={() => setDraft((d) => ({ ...d, tariffType: "tempo" as TariffType }))}
                      >
                        Tempo
                      </OptionButton>
                      <OptionButton
                        active={draft.tariffType === "unknown"}
                        onClick={() => setDraft((d) => ({ ...d, tariffType: "unknown" as TariffType }))}
                      >
                        Je ne sais pas
                      </OptionButton>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Je consomme plutôt</div>
                    <div className="grid grid-cols-2 gap-2">
                      <OptionButton
                        active={draft.consumptionPattern === "morning"}
                        onClick={() =>
                          setDraft((d) => ({ ...d, consumptionPattern: "morning" as ConsumptionPattern }))
                        }
                      >
                        Le matin
                      </OptionButton>
                      <OptionButton
                        active={draft.consumptionPattern === "evening"}
                        onClick={() =>
                          setDraft((d) => ({ ...d, consumptionPattern: "evening" as ConsumptionPattern }))
                        }
                      >
                        Le soir
                      </OptionButton>
                      <OptionButton
                        active={draft.consumptionPattern === "day"}
                        onClick={() =>
                          setDraft((d) => ({ ...d, consumptionPattern: "day" as ConsumptionPattern }))
                        }
                      >
                        La journée
                      </OptionButton>
                      <OptionButton
                        active={draft.consumptionPattern === "variable"}
                        onClick={() =>
                          setDraft((d) => ({ ...d, consumptionPattern: "variable" as ConsumptionPattern }))
                        }
                      >
                        Variable
                      </OptionButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <button
              className="flex-1 h-11 rounded-xl border bg-card hover:bg-muted transition"
              onClick={onClose}
              type="button"
            >
              Annuler
            </button>

            <button
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition"
              onClick={() => {
                if (variant === "site") {
                  onSave({ siteType: draft.siteType });
                } else {
                  onSave({
                    heating: draft.heating,
                    equipments: draft.equipments,
                    tariffType: draft.tariffType,
                    consumptionPattern: draft.consumptionPattern,
                  });
                }
                onClose();
              }}
              type="button"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
