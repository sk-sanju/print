import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Download } from 'lucide-react';
import { PWAInstallModal } from '../pwa/PWAInstallModal';

export const Footer: React.FC = () => {
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);

  return (
    <footer className="bg-white text-slate-600 text-xs py-6 border-t border-slate-200 no-print mt-auto shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy Guaranteed: 100% Client-Side Storage in IndexedDB</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <button
            onClick={() => setIsPwaModalOpen(true)}
            className="flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download App</span>
          </button>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>XenoPrint v1.0.0</span>
          </span>
        </div>
      </div>

      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </footer>
  );
};
