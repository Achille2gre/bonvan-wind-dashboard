import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon?: LucideIcon;
  variant?: 'production' | 'consumption' | 'savings' | 'autoconsumption' | 'default';
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const variantStyles = {
  production: {
    bg: 'bg-primary-light',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    accent: 'text-primary',
  },
  consumption: {
    bg: 'bg-accent-light',
    iconBg: 'bg-accent/20',
    iconColor: 'text-accent',
    accent: 'text-accent',
  },
  savings: {
    bg: 'bg-secondary-light',
    iconBg: 'bg-secondary/20',
    iconColor: 'text-secondary',
    accent: 'text-secondary',
  },
  autoconsumption: {
    bg: 'bg-accent2-light',
    iconBg: 'bg-accent2/20',
    iconColor: 'text-accent2',
    accent: 'text-accent2',
  },
  default: {
    bg: 'bg-muted',
    iconBg: 'bg-muted-foreground/20',
    iconColor: 'text-muted-foreground',
    accent: 'text-foreground',
  },
};

const StatsCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  variant = 'default',
  trend,
  className 
}: StatsCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "p-4 rounded-xl",
      styles.bg,
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {Icon && (
          <div className={cn("p-1.5 rounded-lg", styles.iconBg)}>
            <Icon className={cn("h-4 w-4", styles.iconColor)} />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", styles.accent)}>
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>

      {trend && (
        <div className={cn(
          "mt-2 text-xs font-medium",
          trend.positive ? "text-primary" : "text-destructive"
        )}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs période précédente
        </div>
      )}
    </div>
  );
};

export default StatsCard;
