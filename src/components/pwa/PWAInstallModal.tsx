import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Download, Monitor, Smartphone, CheckCircle2, ShieldCheck, Share } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await installPWA();
      if (res) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download & Install Address Print App"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-5 text-slate-800">
        {/* Top Status */}
        {isInstalled ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">Application Already Installed!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Address Print is running in desktop application mode with 100% offline support.
              </p>
            </div>
          </div>
        ) : isInstallable ? (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-indigo-950 text-sm">Ready for One-Click Install</h4>
              <p className="text-xs text-indigo-700 mt-0.5">
                Click below to install as a fast, standalone desktop or mobile application.
              </p>
            </div>
            <Button
              variant="gradient"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleInstallClick}
              className="shrink-0 w-full sm:w-auto"
            >
              Install App Now
            </Button>
          </div>
        ) : null}

        {/* Benefits */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Why Install the PWA?</h4>
          <ul className="text-xs space-y-1.5 text-slate-700">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>100% Offline:</strong> Works even when your internet connection is down.</span>
            </li>
            <li className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-600 shrink-0" />
              <span><strong>Desktop Launcher:</strong> Opens in its own window like Word or Excel.</span>
            </li>
            <li className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
              <span><strong>Zero Storage Cost:</strong> Fast, lightweight, and automatically updated.</span>
            </li>
          </ul>
        </div>

        {/* Browser Specific Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Manual Installation Instructions</h4>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-600" />
                <span>Chrome / Edge on Desktop (Windows / Mac)</span>
              </div>
              <p className="text-slate-600 mt-1">
                Click the <strong>Install / Download Icon</strong> (<span><Download className="w-3 h-3 inline" /></span>) on the right end of your browser's address bar, or click menu <strong>(⋮) &gt; Save and share &gt; Install Address Print</strong>.
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-600" />
                <span>Android (Chrome / Edge / Brave)</span>
              </div>
              <p className="text-slate-600 mt-1">
                Tap menu <strong>(⋮)</strong> at the top right &gt; select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Share className="w-4 h-4 text-slate-600" />
                <span>iPhone / iPad (Safari)</span>
              </div>
              <p className="text-slate-600 mt-1">
                Tap the <strong>Share</strong> button at the bottom of Safari &gt; scroll down and tap <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
