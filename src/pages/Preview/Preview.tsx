import React, { useEffect, useState } from 'react';
import { FormService } from '../../services/form.service';
import { AddressRecord } from '../../types/address.types';
import { DocumentPreview } from '../../components/preview/DocumentPreview';
import { PrintService } from '../../services/print.service';
import { Button } from '../../components/ui/Button';
import { Printer, Edit2, ArrowLeft, PlusCircle, CheckCircle2, Layers, Copy } from 'lucide-react';

interface PreviewProps {
  id?: number;
  refNo?: string;
  autoPrint?: boolean;
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const Preview: React.FC<PreviewProps> = ({ id, refNo, autoPrint = false, onNavigate }) => {
  const [record, setRecord] = useState<AddressRecord | null>(null);
  const [allSavedRecords, setAllSavedRecords] = useState<AddressRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printedNotice, setPrintedNotice] = useState<boolean>(false);

  // Slot position on A4 page: 1 (Top), 2 (Middle), 3 (Bottom)
  const [slotPosition, setSlotPosition] = useState<1 | 2 | 3>(1);

  // Additional records to stack on the same page (Slot 2, Slot 3)
  const [slot2Record, setSlot2Record] = useState<AddressRecord | null>(null);
  const [slot3Record, setSlot3Record] = useState<AddressRecord | null>(null);

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

        const listRes = await FormService.searchForms({ limit: 50 });
        setAllSavedRecords(listRes.data);

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

  const handleFill3Copies = () => {
    if (!record) return;
    setSlotPosition(1);
    setSlot2Record(record);
    setSlot3Record(record);
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

  const otherRecords = allSavedRecords.filter((r) => r.id !== record.id);

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
            {isPrinting ? 'Preparing Print...' : 'Print 1 Page Sheet'}
          </Button>
        </div>
      </div>

      {/* 3 Labels Per A4 Page Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">3 Labels Per A4 Page Layout</h3>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleFill3Copies}
            icon={<Copy className="w-3.5 h-3.5" />}
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold"
          >
            Fill 3 Copies on 1 Page
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {/* Position Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Start Position on A4 Page:
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setSlotPosition(1)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  slotPosition === 1 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Slot 1 (Top)
              </button>
              <button
                onClick={() => setSlotPosition(2)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  slotPosition === 2 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Slot 2 (Middle)
              </button>
              <button
                onClick={() => setSlotPosition(3)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  slotPosition === 3 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Slot 3 (Bottom)
              </button>
            </div>
          </div>

          {/* Slot 2 Next Address selector */}
          {slotPosition <= 2 && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                + Slot 2 Address:
              </label>
              <select
                value={slot2Record ? slot2Record.id : ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  if (selectedId === record.id) {
                    setSlot2Record(record);
                  } else {
                    const found = otherRecords.find((r) => r.id === selectedId) || null;
                    setSlot2Record(found);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- None (Keep Empty) --</option>
                <option value={record.id}>Same Address ({record.customerName})</option>
                {otherRecords.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.referenceNumber} - {r.customerName} ({r.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Slot 3 Next Address selector */}
          {slotPosition === 1 && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                + Slot 3 Address:
              </label>
              <select
                value={slot3Record ? slot3Record.id : ''}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  if (selectedId === record.id) {
                    setSlot3Record(record);
                  } else {
                    const found = otherRecords.find((r) => r.id === selectedId) || null;
                    setSlot3Record(found);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- None (Keep Empty) --</option>
                <option value={record.id}>Same Address ({record.customerName})</option>
                {otherRecords.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.referenceNumber} - {r.customerName} ({r.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {printedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-sm no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Print dialog initiated for <strong>{record.referenceNumber}</strong>.</span>
        </div>
      )}

      {/* Actual Document Sheet */}
      <DocumentPreview
        record={record}
        slotPosition={slotPosition}
        additionalRecords={[slot2Record, slot3Record].filter(Boolean)}
      />
    </div>
  );
};
