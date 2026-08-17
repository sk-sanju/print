export class PrintService {
  private static isPrinting = false;

  /**
   * Safely trigger standard browser print dialog with double-click prevention
   */
  static triggerPrint(onStart?: () => void, onComplete?: () => void): boolean {
    if (this.isPrinting) {
      return false;
    }

    try {
      this.isPrinting = true;
      if (onStart) onStart();

      // Trigger native browser print dialog
      window.print();

      // Listen for window focus to detect when print dialog closes or completes
      const handleFocus = () => {
        window.removeEventListener('focus', handleFocus);
        setTimeout(() => {
          this.isPrinting = false;
          if (onComplete) onComplete();
        }, 500);
      };

      window.addEventListener('focus', handleFocus);
      return true;
    } catch (error) {
      this.isPrinting = false;
      if (onComplete) onComplete();
      console.error('Print failure:', error);
      return false;
    }
  }
}
