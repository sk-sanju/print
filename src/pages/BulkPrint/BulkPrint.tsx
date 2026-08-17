import React, { useEffect, useState } from 'react';
import { FormService } from '../../services/form.service';
import { FromAddressService } from '../../services/fromAddress.service';
import { AddressRecord, FromAddress } from '../../types/address.types';
import { PrintService } from '../../services/print.service';
import { Button } from '../../components/ui/Button';
import { Printer, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';

interface BulkPrintProps {
  ids: number[];
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const BulkPrint: React.FC<BulkPrintProps> = ({ ids = [], onNavigate }) => {
  const [records, setRecords] = useState<AddressRecord[]>([]);
  const [fromAddress, setFromAddress] = useState<FromAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printedNotice, setPrintedNotice] = useState<boolean>(false);

  // Stack density option: 2 (vertical stack), 4 (2x2 grid), 6 (2x3 grid)
  const [density, setDensity] = useState<2 | 4 | 6>(2);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedFrom = FromAddressService.getFromAddress();
        setFromAddress(loadedFrom);

        const fetched: AddressRecord[] = [];
        for (const id of ids) {
          const rec = await FormService.getForm(id);
          if (rec) fetched.push(rec);
        }
        setRecords(fetched);
      } catch (err) {
        console.error('Error loading bulk records:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [ids]);

  const handlePrint = () => {
    if (records.length === 0) return;

    PrintService.triggerPrint(
      () => setIsPrinting(true),
      () => {
        setIsPrinting(false);
        setPrintedNotice(true);
        setTimeout(() => setPrintedNotice(false), 5000);
      }
    );
  };

  // Helper to chunk records into pages based on selected density
  const chunkRecords = (arr: AddressRecord[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const recordPages = chunkRecords(records, density);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 font-medium">Preparing bulk shipping labels...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">No Records Selected</h2>
        <p className="text-sm text-slate-500 mt-1">Please select address records from Saved Forms to bulk print.</p>
        <Button variant="outline" className="mt-4" onClick={() => onNavigate('saved-forms')}>
          Return to Saved Forms
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls & Stack Density Selector Bar */}
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
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Bulk Stack Print</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Printing {records.length} label(s) across {recordPages.length} A4 page(s)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Density Selector */}
          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-semibold px-2">Stack:</span>
            <button
              onClick={() => setDensity(2)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                density === 2 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
              title="2 Labels per A4 page (Stacked vertically)"
            >
              2 / Page
            </button>
            <button
              onClick={() => setDensity(4)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                density === 4 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
              title="4 Labels per A4 page (2x2 Grid)"
            >
              4 / Page
            </button>
            <button
              onClick={() => setDensity(6)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                density === 6 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
              title="6 Labels per A4 page (2x3 Grid)"
            >
              6 / Page
            </button>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            isLoading={isPrinting}
            icon={<Printer className="w-5 h-5" />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5"
          >
            {isPrinting ? 'Preparing Print...' : `Print All (${records.length})`}
          </Button>
        </div>
      </div>

      {printedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-sm no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Bulk print dialog initiated for <strong>{records.length} address label(s)</strong>.</span>
        </div>
      )}

      {/* Printable Document Sheets Container */}
      <div id="printable-document" className="space-y-8 print:space-y-0">
        {recordPages.map((pageRecords, pageIdx) => (
          <div
            key={pageIdx}
            className={`bg-white border border-slate-300 p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto print:max-w-none print:shadow-none print:border-none print:p-0 print:m-0 ${
              pageIdx < recordPages.length - 1 ? 'print:page-break-after-always' : ''
            }`}
          >
            {/* Grid layout based on stack density */}
            <div
              className={`grid gap-4 sm:gap-6 ${
                density === 2
                  ? 'grid-cols-1'
                  : density === 4
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {pageRecords.map((record) => {
                const deliveryAddressLines: string[] = [];
                const line1 = [record.houseName, record.houseNumber, record.street].filter(Boolean).join(', ');
                if (line1) deliveryAddressLines.push(line1);
                const line2 = [record.locality, record.landmark].filter(Boolean).join(', ');
                if (line2) deliveryAddressLines.push(line2);
                const cityStatePin = [record.city, record.state, record.pinCode].filter(Boolean).join(' – ');
                if (cityStatePin) deliveryAddressLines.push(cityStatePin);

                return (
                  <div
                    key={record.id}
                    className="border-2 border-slate-800 p-4 sm:p-5 rounded-md bg-white print-avoid-break flex flex-col justify-between"
                  >
                    <div>
                      {/* Ref Tag Header */}
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-300">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 font-mono">
                          Courier Slip
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                          {record.referenceNumber}
                        </span>
                      </div>

                      {/* Delivery Address */}
                      <div className="mb-4 pb-3 border-b border-slate-200">
                        <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                          {record.customerName}
                        </h2>
                        <div className="text-xs font-semibold text-slate-800 mt-1 space-y-0.5 leading-snug">
                          {deliveryAddressLines.map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                        <div className="mt-2 text-xs font-bold text-slate-900 font-mono">
                          Mobile: {record.mobileNumber}
                          {record.alternateMobile && <span className="ml-2">/ {record.alternateMobile}</span>}
                        </div>
                      </div>

                      {/* From Address */}
                      {fromAddress && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {fromAddress.name}
                          </h3>
                          <div className="text-[11px] font-semibold text-slate-700 mt-0.5 leading-tight">
                            <p>{fromAddress.addressLine1}</p>
                            {fromAddress.addressLine2 && <p>{fromAddress.addressLine2}</p>}
                            <p>{[fromAddress.city, fromAddress.state, fromAddress.pinCode].filter(Boolean).join(' – ')}</p>
                          </div>
                          <div className="mt-1 text-[11px] font-bold text-slate-900 font-mono">
                            Mobile: {fromAddress.mobileNumber}
                          </div>
                        </div>
                      )}
                    </div>

                    {record.remarks && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] font-semibold text-slate-700 italic">
                        Note: {record.remarks}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
