'use client';

import { useAuthStore } from '@/store/auth';
import { useNavigationStore } from '@/store/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Flame,
  Package,
  Layers,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
  User
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Etusivu', icon: LayoutDashboard },
  { id: 'boiling', label: 'Keitto', icon: Flame },
  { id: 'packaging', label: 'Pakkaus', icon: Package },
  { id: 'separation', label: 'Erotus', icon: Layers },
  { id: 'reports', label: 'Raportit', icon: BarChart3 },
];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { currentPage, setCurrentPage } = useNavigationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-orange-400" />
          <span className="text-xl font-bold">Tuotantoraportointi</span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'secondary' : 'ghost'}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-base font-medium transition-colors',
                  currentPage === item.id
                    ? 'bg-white text-slate-900'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                )}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://grafana-reports.sinundomain.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Grafana
          </a>
          <div className="flex items-center gap-2 text-slate-300">
            <User className="h-4 w-4" />
            <span>{user?.username || 'Käyttäjä'}</span>
          </div>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-200 hover:bg-slate-800"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Flame className="h-7 w-7 text-orange-400" />
            <span className="text-lg font-bold">Tuotantoraportointi</span>
          </div>
          <Button
            variant="ghost"
            className="text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-slate-800 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start flex items-center gap-3 px-4 py-3 text-lg',
                    currentPage === item.id
                      ? 'bg-white text-slate-900'
                      : 'text-slate-200 hover:bg-slate-700'
                  )}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon className="h-6 w-6" />
                  {item.label}
                </Button>
              );
            })}
            <div className="pt-4 border-t border-slate-700 mt-4 space-y-2">
              <a
                href="https://grafana-reports.sinundomain.fi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white text-lg"
              >
                <ExternalLink className="h-6 w-6" />
                Grafana
              </a>
              <div className="flex items-center gap-3 px-4 py-2 text-slate-400">
                <User className="h-5 w-5" />
                <span>{user?.username || 'Käyttäjä'}</span>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-200 py-3 text-lg"
                onClick={logout}
              >
                <LogOut className="h-6 w-6 mr-3" />
                Kirjaudu ulos
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
