
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 animate-pulse-glow"></div>
            <span className="text-xl font-bold">TexGen</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/gallery' ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            Gallery
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/pricing' ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">Sign In</Button>
          <Button size="sm">Sign Up Free</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/gallery' ? 'text-primary' : 'hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/pricing' ? 'text-primary' : 'hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Sign Up Free</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
