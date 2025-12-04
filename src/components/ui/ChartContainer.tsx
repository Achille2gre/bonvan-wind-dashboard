import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  legend?: {
    items: { color: string; label: string }[];
  };
}

const ChartContainer = ({ 
  title, 
  subtitle,
  children, 
  className,
  legend 
}: ChartContainerProps) => {
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 shadow-card",
      className
    )}>
      {(title || legend) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="font-semibold text-foreground">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          
          {legend && (
            <div className="flex items-center gap-3">
              {legend.items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
