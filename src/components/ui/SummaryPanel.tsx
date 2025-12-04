import { Wind, Zap, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/data/communityData';

interface SummaryPanelProps {
  turbines: number;
  annualProduction: number;
  co2Avoided: number;
  className?: string;
}

const SummaryPanel = ({ 
  turbines, 
  annualProduction, 
  co2Avoided,
  className 
}: SummaryPanelProps) => {
  const stats = [
    {
      icon: Wind,
      value: formatNumber(turbines),
      label: 'Éoliennes installées',
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      icon: Zap,
      value: formatNumber(annualProduction),
      label: 'kWh/an produits',
      color: 'text-secondary',
      bgColor: 'bg-secondary-light',
    },
    {
      icon: Leaf,
      value: formatNumber(co2Avoided),
      label: 'tCO₂e évitées',
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
  ];

  return (
    <div className={cn(
      "bg-card rounded-xl p-4 shadow-card",
      className
    )}>
      <h3 className="font-semibold text-foreground mb-4">Bilan de la communauté</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50"
            >
              <div className={cn("p-2 rounded-lg mb-2", stat.bgColor)}>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <span className={cn("text-xl font-bold", stat.color)}>
                {stat.value}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight mt-1">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryPanel;
