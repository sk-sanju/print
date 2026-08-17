import { registerSW } from 'virtual:pwa-register';

export class PWAService {
  private static updateSWFn?: (reloadPage?: boolean) => Promise<void>;

  static initPWA(onNeedRefresh?: () => void, onOfflineReady?: () => void) {
    if ('serviceWorker' in navigator) {
      this.updateSWFn = registerSW({
        onNeedRefresh() {
          if (onNeedRefresh) onNeedRefresh();
        },
        onOfflineReady() {
          if (onOfflineReady) onOfflineReady();
        },
      });
    }
  }

  static updateServiceWorker() {
    if (this.updateSWFn) {
      this.updateSWFn(true);
    }
  }
}
