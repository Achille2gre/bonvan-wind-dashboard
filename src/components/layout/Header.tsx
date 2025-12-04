import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import logoHorizontal from '@/assets/logo-bonvan-horizontal.png';

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

        {/* Logo Bonvan horizontal */}
        <div className="flex items-center justify-center">
          <img 
            src={logoHorizontal} 
            alt="Bonvan - L'éolien à portée de main" 
            className="h-8 w-auto"
          />
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
