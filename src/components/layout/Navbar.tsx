import React, { useState } from 'react';
import { PlusCircle, LayoutDashboard, Database, Download, MapPin, CheckCircle2 } from 'lucide-react';
import { NetworkBadge } from '../pwa/NetworkBadge';
import { Button } from '../ui/Button';
import { FromAddressModal } from '../forms/FromAddressModal';
import { PWAInstallModal } from '../pwa/PWAInstallModal';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { isInstalled } = usePWAInstall();
  const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-form', label: 'New Address', icon: PlusCircle },
    { id: 'saved-forms', label: 'Saved Forms', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200 shadow-xs no-print">
      {/* Top Subtle Gradient Bar */}
      <div className="h-0.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('dashboard')}
          >
            <img
              src="/logo.png"
              alt="XenoPrint Logo"
              className="w-9 h-9 rounded-xl shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform object-cover"
            />
            <div>
              <span className="font-black text-lg tracking-tight block leading-tight text-slate-900">
                XenoPrint
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 font-mono block">
                OFFLINE PWA
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Bar (From Address + Download App + Status) */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<MapPin className="w-4 h-4 text-amber-600" />}
              onClick={() => setIsFromModalOpen(true)}
              className="text-slate-700 border-slate-300 hover:bg-slate-100"
              title="Configure Sender Address"
            >
              <span className="hidden sm:inline">From Address</span>
              <span className="sm:hidden">From</span>
            </Button>

            {isInstalled ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Installed</span>
              </span>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => setIsPwaModalOpen(true)}
                className="shadow-sm"
                title="Download & Install App"
              >
                <span className="hidden sm:inline">Download App</span>
                <span className="sm:hidden">Download</span>
              </Button>
            )}

            <NetworkBadge />
          </div>

          {/* Modals */}
          <FromAddressModal
            isOpen={isFromModalOpen}
            onClose={() => setIsFromModalOpen(false)}
          />

          <PWAInstallModal
            isOpen={isPwaModalOpen}
            onClose={() => setIsPwaModalOpen(false)}
          />
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden border-t border-slate-200 py-2 justify-around bg-slate-50/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
