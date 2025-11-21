import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import logoSecondary from "@/assets/logo-secondary.svg";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src={logoSecondary} alt="RedeemWear" className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-bold mb-4 font-montserrat">RedeemWear Clothing</h3>
            <p className="text-primary-foreground/80 font-inter">
              Modern Christian streetwear designed with purpose.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/collections" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li className="text-primary-foreground/80">Shipping Info</li>
              <li className="text-primary-foreground/80">Returns & Exchanges</li>
              <li className="text-primary-foreground/80">FAQs</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p className="font-inter">&copy; {new Date().getFullYear()} RedeemWear Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
