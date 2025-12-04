import { useState } from 'react';
import { Wind, Calendar as CalendarIcon } from 'lucide-react';
import CalendarPicker from '@/components/CalendarPicker';
import ChartContainer from '@/components/ui/ChartContainer';
import ForecastBarChart from '@/components/charts/ForecastBarChart';
import { getForecastForDate } from '@/data/forecastData';

const PrevisionsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const forecast = selectedDate ? getForecastForDate(selectedDate) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">
      {/* Titre de la page */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-foreground">Prévisions de production</h1>
        <p className="text-sm text-muted-foreground">Estimations basées sur la météo</p>
      </div>

      {/* Calendrier */}
      <CalendarPicker 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Contenu conditionnel */}
      {!selectedDate ? (
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Sélectionnez une date pour voir les prévisions de production horaire
          </p>
        </div>
      ) : (
        <>
          {/* Date sélectionnée */}
          <div className="bg-primary-light rounded-xl p-3">
            <p className="text-sm font-medium text-primary capitalize">
              {formatDate(selectedDate)}
            </p>
          </div>

          {/* Graphique des prévisions horaires */}
          <ChartContainer
            title="Production horaire prévue"
            subtitle="Basée sur les prévisions météo"
          >
            <ForecastBarChart 
              data={forecast!.hourlyData} 
              height={200}
            />
          </ChartContainer>

          {/* Résumé de la journée */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-light rounded-xl">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Production éolienne sur la journée</p>
                <p className="text-2xl font-bold text-primary">
                  {forecast!.totalProduction} <span className="text-base font-normal text-muted-foreground">kWh</span>
                </p>
              </div>
            </div>
          </div>

          {/* Conseils */}
          <div className="bg-secondary-light rounded-xl p-4">
            <h4 className="font-medium text-foreground text-sm mb-2">💡 Conseil du jour</h4>
            <p className="text-xs text-muted-foreground">
              {forecast!.totalProduction > 20 
                ? "Production élevée prévue ! Idéal pour lancer vos appareils énergivores (lave-linge, lave-vaisselle)."
                : "Production modérée prévue. Privilégiez les appareils essentiels et reportez les gros consommateurs."
              }
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PrevisionsPage;
