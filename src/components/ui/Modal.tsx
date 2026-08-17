import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto no-print">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-white border border-slate-200 p-6 text-left shadow-2xl transition-all my-8 z-[10000]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="py-2 text-slate-800 max-h-[70vh] overflow-y-auto pr-1">{children}</div>

          {footer && <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
