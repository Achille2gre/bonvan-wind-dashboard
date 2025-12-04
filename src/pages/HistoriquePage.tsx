import { Clock, FileText, Download } from 'lucide-react';

const HistoriquePage = () => {
  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">
      {/* Titre de la page */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-foreground">Historique</h1>
        <p className="text-sm text-muted-foreground">Consultez vos données passées</p>
      </div>

      {/* Placeholder - Page en construction */}
      <div className="bg-card rounded-xl p-8 shadow-card text-center">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-semibold text-foreground mb-2">Page en construction</h2>
        <p className="text-sm text-muted-foreground mb-6">
          L'historique détaillé de votre production sera bientôt disponible.
        </p>

        {/* Fonctionnalités à venir */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Rapports mensuels</p>
              <p className="text-xs text-muted-foreground">Synthèse de vos performances</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Export de données</p>
              <p className="text-xs text-muted-foreground">Téléchargez vos données en CSV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message informatif */}
      <div className="bg-secondary-light rounded-xl p-4">
        <p className="text-xs text-muted-foreground text-center">
          Cette fonctionnalité sera disponible dans une prochaine mise à jour.
        </p>
      </div>
    </div>
  );
};

export default HistoriquePage;
