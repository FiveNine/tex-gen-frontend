import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm, RegisterForm } from '@/components/auth/AuthForms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowLoginDialog(true)}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => setShowRegisterDialog(true)}>
                Sign Up Free
              </Button>
            </>
          )}
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
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLoginDialog(true);
                }}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => {
                  setMobileMenuOpen(false);
                  setShowRegisterDialog(true);
                }}>
                  Sign Up Free
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Dialogs */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In to TexGen</DialogTitle>
          </DialogHeader>
          <LoginForm onClose={() => setShowLoginDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your account</DialogTitle>
          </DialogHeader>
          <RegisterForm onClose={() => setShowRegisterDialog(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
