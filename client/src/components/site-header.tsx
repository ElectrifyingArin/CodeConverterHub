import { useState } from "react";
import { useTheme } from "@/contexts/theme-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Moon, Sun, Menu } from "lucide-react";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 12L8 7V17L14 12Z" fill="currentColor"/>
            <path d="M16 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <Link href="/" className="text-xl font-bold">
            SourceXchange
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <nav className="hidden sm:flex items-center space-x-6">
            <Link href="/documentation" className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="/examples" className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Examples
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {mobileMenuOpen && (
            <div className="absolute top-full right-0 w-48 mt-2 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50">
              <Link href="/documentation" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                Documentation
              </Link>
              <Link href="/examples" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                Examples
              </Link>
              <Link href="/about" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                About
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
