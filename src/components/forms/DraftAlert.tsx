import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface DraftAlertProps {
  onRestore: () => void;
  onDiscard: () => void;
}

export const DraftAlert: React.FC<DraftAlertProps> = ({ onRestore, onDiscard }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Unsaved draft found</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            You have an unfinished address form saved locally. Would you like to restore it?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button variant="outline" size="sm" onClick={onDiscard} className="border-amber-300 text-amber-900 hover:bg-amber-100">
          Discard Draft
        </Button>
        <Button variant="secondary" size="sm" onClick={onRestore} className="bg-amber-600 hover:bg-amber-700">
          Restore Draft
        </Button>
      </div>
    </div>
  );
};
