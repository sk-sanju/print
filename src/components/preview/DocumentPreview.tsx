import React, { useState, useEffect } from 'react';
import { AddressRecord, FromAddress } from '../../types/address.types';
import { FromAddressService } from '../../services/fromAddress.service';
import { FromAddressModal } from '../forms/FromAddressModal';
import { Button } from '../ui/Button';
import { Edit2, MapPin } from 'lucide-react';

interface DocumentPreviewProps {
  record: AddressRecord;
  slotPosition?: 1 | 2 | 3;
  additionalRecords?: (AddressRecord | null)[];
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  record,
  slotPosition = 1,
  additionalRecords = [],
}) => {
  const [fromAddress, setFromAddress] = useState<FromAddress | null>(null);
  const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loaded = FromAddressService.getFromAddress();
    setFromAddress(loaded);
  }, []);

  const renderSingleLabelCard = (rec: AddressRecord, slotIndex: number) => {
    const deliveryAddressLines: string[] = [];
    const line1 = [rec.houseName, rec.houseNumber, rec.street].filter(Boolean).join(', ');
    if (line1) deliveryAddressLines.push(line1);

    const line2 = [rec.locality, rec.landmark].filter(Boolean).join(', ');
    if (line2) deliveryAddressLines.push(line2);

    const cityStatePin = [
      rec.city,
      rec.state,
      rec.pinCode ? rec.pinCode : '',
    ]
      .filter(Boolean)
      .join(' – ');
    if (cityStatePin) deliveryAddressLines.push(cityStatePin);

    return (
      <div
        key={`${rec.id || 'rec'}-${slotIndex}`}
        className="bg-white text-slate-950 border border-slate-300 shadow-md sm:shadow-lg mx-auto p-3.5 sm:p-5 max-w-2xl rounded-lg sm:rounded-md print:max-w-none print:shadow-none print:border-slate-800 print:border-2 print:p-4 print:bg-white font-sans print-avoid-break mb-3 last:mb-0"
      >
        {/* Ref Tag top right */}
        <div className="flex flex-row justify-between items-center mb-2 pb-1.5 border-b border-slate-200 print:border-slate-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Courier Shipping Label (Slot {slotIndex})
          </span>
          <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded print:bg-transparent print:p-0">
            {rec.referenceNumber}
          </span>
        </div>

        {/* TO / DELIVERY ADDRESS BLOCK */}
        <div className="mb-3 pb-3 border-b-2 border-slate-300">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1 break-words">
            {rec.customerName}
          </h2>

          <div className="text-xs sm:text-sm font-semibold text-slate-800 space-y-0.5 leading-snug break-words">
            {deliveryAddressLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          <div className="mt-2 text-xs sm:text-sm font-bold text-slate-900 font-mono break-all">
            Mobile: {rec.mobileNumber}
            {rec.alternateMobile && <span className="block sm:inline sm:ml-3">/ {rec.alternateMobile}</span>}
          </div>
        </div>

        {/* FROM / SENDER ADDRESS BLOCK */}
        <div>
          {fromAddress ? (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-0.5 break-words">
                {fromAddress.name}
              </h3>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 space-y-0.5 leading-snug break-words">
                <p>{fromAddress.addressLine1}</p>
                {fromAddress.addressLine2 && <p>{fromAddress.addressLine2}</p>}
                <p>
                  {[fromAddress.city, fromAddress.state, fromAddress.pinCode]
                    .filter(Boolean)
                    .join(' – ')}
                </p>
              </div>
              <div className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 font-mono break-all">
                Mobile: {fromAddress.mobileNumber}
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded text-center">
              <p className="text-xs font-medium text-slate-600">
                Sender address not set yet.
              </p>
            </div>
          )}
        </div>

        {/* Remarks / Delivery Note if any */}
        {rec.remarks && (
          <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-700 italic break-words">
            Note: {rec.remarks}
          </div>
        )}
      </div>
    );
  };

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

      {/* Main Printable Document Sheet Container - 3 Labels on 1 A4 Page */}
      <div
        id="printable-document"
        className="max-w-2xl mx-auto space-y-3 print:space-y-2 print:max-w-none print:p-0 print:m-0"
      >
        {/* Spacer for Slot 1 if starting at Slot 2 or Slot 3 */}
        {slotPosition >= 2 && (
          <div className="h-[250px] border-2 border-dashed border-slate-300/60 rounded-md flex items-center justify-center text-slate-400 text-xs font-mono no-print">
            [ Slot 1 Empty Spacer - Paper Saved / Used Sticker ]
          </div>
        )}

        {/* Spacer for Slot 2 if starting at Slot 3 */}
        {slotPosition === 3 && (
          <div className="h-[250px] border-2 border-dashed border-slate-300/60 rounded-md flex items-center justify-center text-slate-400 text-xs font-mono no-print">
            [ Slot 2 Empty Spacer - Paper Saved / Used Sticker ]
          </div>
        )}

        {/* Printable spacers in @media print */}
        {slotPosition >= 2 && (
          <div className="hidden print:block h-[250px] w-full" aria-hidden="true" />
        )}
        {slotPosition === 3 && (
          <div className="hidden print:block h-[250px] w-full" aria-hidden="true" />
        )}

        {/* Render Primary Record in Selected Slot Position */}
        {renderSingleLabelCard(record, slotPosition)}

        {/* Render Additional Records if stacked on same page */}
        {additionalRecords.map((addRec, idx) => {
          if (!addRec) return null;
          const nextSlot = slotPosition + idx + 1;
          if (nextSlot > 3) return null;
          return renderSingleLabelCard(addRec, nextSlot);
        })}
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
