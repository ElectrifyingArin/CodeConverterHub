import { useState } from "react";
import { useTheme } from "@/contexts/theme-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Moon, Sun, Menu } from "lucide-react";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-md backdrop-blur-sm bg-white/90 dark:bg-slate-800/90">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary rounded-lg opacity-20 animate-pulse"></div>
            <svg className="w-8 h-8 text-primary relative" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 12L8 7V17L14 12Z" fill="currentColor"/>
              <path d="M16 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            SourceXchange
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full transition-transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <nav className="hidden sm:flex items-center space-x-6">
            <Link href="/examples" className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors relative group">
              Examples
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
          
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden rounded-full transition-transform hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {mobileMenuOpen && (
            <div className="absolute top-full right-0 w-48 mt-2 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-5 duration-300">
              <Link href="/examples" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                Examples
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
