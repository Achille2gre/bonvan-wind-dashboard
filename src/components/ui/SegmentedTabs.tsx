import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SegmentedTabs = ({ tabs, activeTab, onTabChange }: SegmentedTabsProps) => {
  return (
    <div className="flex bg-muted p-1 rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200",
              isActive 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedTabs;
