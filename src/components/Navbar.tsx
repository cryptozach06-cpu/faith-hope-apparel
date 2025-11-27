import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTheme } from "next-themes";
import logoPrimary from "@/assets/logo-primary.svg";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/collections", label: "Collections" },
    { to: "/prayer", label: "Prayer" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logoPrimary} alt="RedeemWear Clothing" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground hover:text-accent transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as any)}
              className="border rounded px-2 py-1 bg-background text-foreground"
            >
              <option value="USD">USD</option>
              <option value="PHP">PHP</option>
              <option value="EUR">EUR</option>
            </select>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-accent transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-foreground hover:text-accent transition-colors font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/cart" onClick={() => setIsOpen(false)} className="block py-2">
              <Button variant="outline" className="w-full">
                Cart ({cartCount})
              </Button>
            </Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2">
              <Button variant="outline" className="w-full">Admin</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
