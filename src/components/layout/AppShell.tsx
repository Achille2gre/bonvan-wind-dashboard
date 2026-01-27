import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useLocation, useNavigate } from "react-router-dom";

export default function AppShell({
  children,
  activeTab = "performances",
  onTabChange,
  showBottomNav = true,
}: {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showBottomNav?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    // Si on n'est pas sur "/", on redirige vers l'accueil en forçant le tab
    if (location.pathname !== "/") {
      navigate(`/?tab=${encodeURIComponent(tab)}`);
      return;
    }
    // Si on est déjà sur "/", on laisse Index gérer state + URL
    onTabChange?.(tab);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <Header />

      <main className={`flex-1 overflow-y-auto ${showBottomNav ? "pb-20" : ""}`}>
        {children}
      </main>

      {showBottomNav ? (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      ) : null}
    </div>
  );
}
