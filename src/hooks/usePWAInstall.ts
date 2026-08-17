import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALLED_STORAGE_KEY = 'pwa_app_installed_status';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    // Check localStorage first
    if (localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true') {
      return true;
    }
    // Check window standalone media query
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true)
    ) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Check standalone mode on mount
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone || localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true') {
      setIsInstalled(true);
      setIsInstallable(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      // Mark as downloaded/installed if user initiates manual install trigger
      localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
      setIsInstalled(true);
      setIsInstallable(false);
      return true;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
        return true;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
    return false;
  };

  const markAsInstalled = () => {
    localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
    setIsInstalled(true);
    setIsInstallable(false);
  };

  return { isInstallable, isInstalled, installPWA, markAsInstalled };
}
