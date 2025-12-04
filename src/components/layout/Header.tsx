import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu burger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button 
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-2">
              <a href="#" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground">
                Mon profil
              </a>
              <a href="#" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground">
                Paramètres
              </a>
              <a href="#" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground">
                Aide & Support
              </a>
              <a href="#" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground">
                À propos de Bonvan
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo Bonvan */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2C12 2 8 6 8 12C8 14.5 9 17 12 17C15 17 16 14.5 16 12C16 6 12 2 12 2ZM12 4.5C13.5 7 14 9 14 12C14 13.5 13.5 15 12 15C10.5 15 10 13.5 10 12C10 9 10.5 7 12 4.5ZM4 14L8 22H6L2 14H4ZM20 14L16 22H18L22 14H20Z"/>
            </svg>
          </div>
          <span className="font-semibold text-lg text-foreground">Bonvan</span>
        </div>

        {/* Avatar utilisateur */}
        <button 
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Profil"
        >
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
