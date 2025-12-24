import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const location = useLocation();

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-lg transition-colors hover:text-primary"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">М</span>
          </div>
          <span className="hidden sm:inline">Маркет</span>
        </Link>

        {/* Search - Desktop */}
        {location.pathname === "/" && (
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Маҳсулот қидириш..."
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Асосий
          </Link>
          <Link 
            to="/cart" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/cart" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Саватча
          </Link>
        </nav>

        {/* Cart Button */}
        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button variant="icon" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <div className="container py-4 space-y-4">
            {location.pathname === "/" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Маҳсулот қидириш..."
                  value={localSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-secondary/50 border-0"
                />
              </div>
            )}
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/" ? "bg-accent text-accent-foreground" : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Асосий
              </Link>
              <Link 
                to="/cart" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/cart" ? "bg-accent text-accent-foreground" : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Саватча ({totalItems})
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
