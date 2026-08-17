import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 no-print">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-indigo-600 rounded-xl shrink-0 mt-0.5 shadow-md shadow-indigo-600/30">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-sm sm:text-base text-white">Install Address Print App</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Install this application for faster desktop access and 100% offline reliability.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button variant="gradient" size="sm" onClick={installPWA}>
          Download App
        </Button>
        <button
          onClick={handleDismiss}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
