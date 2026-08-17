import React, { useState, useEffect } from 'react';
import { AddressRecord, FromAddress } from '../../types/address.types';
import { FromAddressService } from '../../services/fromAddress.service';
import { FromAddressModal } from '../forms/FromAddressModal';
import { Button } from '../ui/Button';
import { Edit2, MapPin } from 'lucide-react';

interface DocumentPreviewProps {
  record: AddressRecord;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ record }) => {
  const [fromAddress, setFromAddress] = useState<FromAddress | null>(null);
  const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loaded = FromAddressService.getFromAddress();
    setFromAddress(loaded);
  }, []);

  // Format Delivery Address Lines cleanly
  const deliveryAddressLines: string[] = [];
  const line1 = [record.houseName, record.houseNumber, record.street].filter(Boolean).join(', ');
  if (line1) deliveryAddressLines.push(line1);

  const line2 = [record.locality, record.landmark].filter(Boolean).join(', ');
  if (line2) deliveryAddressLines.push(line2);

  const cityStatePin = [
    record.city,
    record.state,
    record.pinCode ? record.pinCode : '',
  ]
    .filter(Boolean)
    .join(' – ');
  if (cityStatePin) deliveryAddressLines.push(cityStatePin);

  return (
    <div className="space-y-4">
      {/* From Address Settings Bar (Screen only) */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-900 font-medium">
          <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {fromAddress ? (
              <>
                From Address: <strong>{fromAddress.name}</strong> ({fromAddress.city}, {fromAddress.pinCode})
              </>
            ) : (
              <strong>No From Address configured yet! Click to add default sender address.</strong>
            )}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFromModalOpen(true)}
          icon={<Edit2 className="w-3.5 h-3.5" />}
          className="border-amber-300 text-amber-900 hover:bg-amber-100 w-full sm:w-auto justify-center"
        >
          {fromAddress ? 'Edit From Address' : '+ Add From Address'}
        </Button>
      </div>

      {/* Actual Print / Courier Slip Card */}
      <div
        id="printable-document"
        className="bg-[#fcf8f2] text-slate-950 border border-slate-300 shadow-md sm:shadow-lg mx-auto p-4 sm:p-8 md:p-10 max-w-2xl rounded-lg sm:rounded-md print:max-w-none print:shadow-none print:border-none print:p-0 print:bg-transparent font-sans"
      >
        {/* Subtle Ref Tag top right */}
        <div className="flex flex-row justify-between items-center mb-4 sm:mb-6 pb-2 border-b border-slate-200 print:border-none">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Courier Shipping Label
          </span>
          <span className="text-xs sm:text-sm font-mono font-semibold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded print:bg-transparent print:p-0">
            {record.referenceNumber}
          </span>
        </div>

        {/* TO / DELIVERY ADDRESS BLOCK */}
        <div className="mb-6 pb-6 border-b-2 border-slate-300">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
            To / Delivery Address:
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2 break-words">
            {record.customerName}
          </h2>

          <div className="text-sm sm:text-base font-semibold text-slate-800 space-y-1 leading-snug break-words">
            {deliveryAddressLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          <div className="mt-3 text-sm sm:text-base font-bold text-slate-900 font-mono break-all">
            Mobile: {record.mobileNumber}
            {record.alternateMobile && <span className="block sm:inline sm:ml-3">/ {record.alternateMobile}</span>}
          </div>
        </div>

        {/* FROM / SENDER ADDRESS BLOCK */}
        <div>
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
            From / Sender Address:
          </div>

          {fromAddress ? (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1.5 break-words">
                {fromAddress.name}
              </h3>
              <div className="text-sm sm:text-base font-semibold text-slate-800 space-y-1 leading-snug break-words">
                <p>{fromAddress.addressLine1}</p>
                {fromAddress.addressLine2 && <p>{fromAddress.addressLine2}</p>}
                <p>
                  {[fromAddress.city, fromAddress.state, fromAddress.pinCode]
                    .filter(Boolean)
                    .join(' – ')}
                </p>
              </div>
              <div className="mt-3 text-sm sm:text-base font-bold text-slate-900 font-mono break-all">
                Mobile: {fromAddress.mobileNumber}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white/60 border border-dashed border-slate-300 rounded text-center">
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Sender address not set yet.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 no-print w-full sm:w-auto"
                onClick={() => setIsFromModalOpen(true)}
              >
                + Set From Address
              </Button>
            </div>
          )}
        </div>

        {/* Remarks / Delivery Note if any */}
        {record.remarks && (
          <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-700 italic break-words">
            Note: {record.remarks}
          </div>
        )}
      </div>

      {/* From Address Settings Modal */}
      <FromAddressModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        onSaved={(newAddr) => setFromAddress(newAddr)}
      />
    </div>
  );
};
