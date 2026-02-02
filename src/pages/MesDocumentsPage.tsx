import { useEffect, useMemo, useState } from "react";

type DocStatus = "available" | "pending" | "missing";

type UserDocument = {
  id: string;
  type: "contract" | "consent";
  title: string;
  description?: string;
  status: DocStatus;
  signedAt?: string; // ISO
  fileName?: string;
  url?: string; // lien direct / presigned url / route backend
};

function formatDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

const STATUS_UI: Record<
  DocStatus,
  { label: string; className: string; emoji: string }
> = {
  available: {
    label: "Disponible",
    className: "bg-emerald-500/10 text-emerald-700",
    emoji: "✅",
  },
  pending: {
    label: "En attente",
    className: "bg-amber-500/10 text-amber-700",
    emoji: "⏳",
  },
  missing: {
    label: "Indisponible",
    className: "bg-muted text-muted-foreground",
    emoji: "—",
  },
};

export default function MesDocumentsPage() {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<UserDocument[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ MOCK par défaut (tu peux remplacer par un fetch API juste dessous)
  const mockDocs: UserDocument[] = useMemo(
    () => [
      {
        id: "contract-1",
        type: "contract",
        title: "Contrat d’achat / souscription Bonvan",
        description: "Contrat signé lié à votre solution Bonvan.",
        status: "available",
        signedAt: "2026-01-15T10:00:00.000Z",
        fileName: "Contrat_Bonvan.pdf",
        url: "/docs/Contrat_Bonvan.pdf", // placeholder
      },
      {
        id: "consent-1",
        type: "consent",
        title: "Attestation de consentement",
        description: "Attestation de consentement signée.",
        status: "available",
        signedAt: "2026-01-15T10:00:00.000Z",
        fileName: "Consentement_Bonvan.pdf",
        url: "/docs/Consentement_Bonvan.pdf", // placeholder
      },
    ],
    []
  );

  useEffect(() => {
    // 👉 V1 : on affiche le mock
    setDocs(mockDocs);

    // ✅ V2 (quand vous aurez l’API) : décommenter et remplacer l’URL
    /*
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/me/documents", {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Impossible de récupérer vos documents.");
        const data = (await res.json()) as UserDocument[];
        setDocs(data);
      } catch (e: any) {
        setError(e?.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    })();
    */
  }, [mockDocs]);

  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-foreground">Mes documents</h1>
        <p className="text-sm text-muted-foreground">
          Retrouvez ici vos documents importants liés à votre installation Bonvan.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl p-4 shadow-card">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔒</div>
          <div>
            <h4 className="font-bold text-foreground text-sm">
              Documents sécurisés
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Ces fichiers sont personnels. Ne les partagez pas publiquement.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="text-sm text-muted-foreground">Chargement…</div>
        )}

        {!loading && (!docs || docs.length === 0) && (
          <div className="bg-card rounded-xl p-4 shadow-card text-sm text-muted-foreground">
            Aucun document disponible pour le moment.
          </div>
        )}

        {docs?.map((doc) => {
          const ui = STATUS_UI[doc.status];
          const signedLabel = formatDate(doc.signedAt);

          return (
            <div
              key={doc.id}
              className="bg-card rounded-xl p-4 shadow-card space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${ui.className}`}
                    >
                      {ui.emoji} {ui.label}
                    </span>
                    {signedLabel && (
                      <span className="text-xs text-muted-foreground">
                        Signé le {signedLabel}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-bold text-foreground text-sm">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="text-2xl shrink-0">📄</div>
              </div>

              <div className="flex gap-2">
                <a
                  href={doc.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 text-center text-sm font-semibold rounded-lg px-3 py-2 ${
                    doc.status === "available"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                  }`}
                >
                  Ouvrir
                </a>

                <a
                  href={doc.url ?? "#"}
                  download={doc.fileName}
                  className={`flex-1 text-center text-sm font-semibold rounded-lg px-3 py-2 ${
                    doc.status === "available"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                  }`}
                >
                  Télécharger
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-primary-light rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📩</div>
          <div>
            <h4 className="font-bold text-foreground text-sm">
              Un document manque ?
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Contactez-nous via “Aide & Support” et on vous le renverra rapidement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
