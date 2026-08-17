import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('pwa_banner_dismissed') === 'true';
  });

  // Never render banner if app is already installed or banner is dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 no-print">
      <div className="flex items-start gap-3">
        <img
          src="/logo.png"
          alt="XenoPrint Logo"
          className="w-10 h-10 rounded-xl shrink-0 mt-0.5 shadow-md shadow-indigo-900/30 object-cover"
        />
        <div>
          <h4 className="font-extrabold text-sm sm:text-base text-white">Install XenoPrint App</h4>
          <p className="text-xs text-blue-100 mt-0.5">
            Install this application for faster desktop access and 100% offline reliability.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button variant="secondary" size="sm" onClick={installPWA} className="bg-white text-indigo-900 hover:bg-slate-100 font-bold">
          Download App
        </Button>
        <button
          onClick={handleDismiss}
          className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
