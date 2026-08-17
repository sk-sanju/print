import React, { useEffect, useState } from 'react';
import { FormService } from '../../services/form.service';
import { AddressRecord } from '../../types/address.types';
import { DocumentPreview } from '../../components/preview/DocumentPreview';
import { PrintService } from '../../services/print.service';
import { Button } from '../../components/ui/Button';
import { Printer, Edit2, ArrowLeft, PlusCircle, CheckCircle2 } from 'lucide-react';

interface PreviewProps {
  id?: number;
  refNo?: string;
  autoPrint?: boolean;
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const Preview: React.FC<PreviewProps> = ({ id, refNo, autoPrint = false, onNavigate }) => {
  const [record, setRecord] = useState<AddressRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printedNotice, setPrintedNotice] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRecord() {
      setIsLoading(true);
      try {
        let res: AddressRecord | undefined;
        if (id) {
          res = await FormService.getForm(id);
        } else if (refNo) {
          res = await FormService.getFormByRef(refNo);
        }

        if (res) {
          setRecord(res);
          if (autoPrint) {
            setTimeout(() => {
              handlePrint();
            }, 300);
          }
        }
      } catch (err) {
        console.error('Error fetching preview record:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecord();
  }, [id, refNo]);

  const handlePrint = () => {
    if (!record) return;

    PrintService.triggerPrint(
      () => {
        setIsPrinting(true);
      },
      () => {
        setIsPrinting(false);
        setPrintedNotice(true);
        setTimeout(() => setPrintedNotice(false), 5000);
      }
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 font-medium">Loading document preview...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Form Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">The requested address form record could not be found.</p>
        <Button variant="outline" className="mt-4" onClick={() => onNavigate('dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action & Control Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('saved-forms')}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Saved Forms
          </Button>
          <div>
            <span className="text-xs font-mono text-blue-400 block font-semibold">{record.referenceNumber}</span>
            <h1 className="text-lg font-bold text-white tracking-tight">{record.customerName}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('new-form', { id: record.id })}
            icon={<Edit2 className="w-4 h-4" />}
            className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
          >
            Edit Form
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('new-form')}
            icon={<PlusCircle className="w-4 h-4" />}
            className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
          >
            + New Address
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            isLoading={isPrinting}
            icon={<Printer className="w-5 h-5" />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5"
          >
            {isPrinting ? 'Preparing Print...' : 'Print Document'}
          </Button>
        </div>
      </div>

      {printedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-sm no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Print dialog initiated for <strong>{record.referenceNumber}</strong>.</span>
        </div>
      )}

      {/* Actual Document Sheet */}
      <DocumentPreview record={record} />
    </div>
  );
};
