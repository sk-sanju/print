import React, { useState, useEffect } from 'react';
import { AddressRecord, FromAddress } from '../../types/address.types';
import { FromAddressService } from '../../services/fromAddress.service';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  formatAddressForSharing,
  canWebShare,
  triggerNativeShare,
  getWhatsAppShareUrl,
  copyToClipboard,
} from '../../utils/share.utils';
import { Share2, MessageCircle, Copy, Link, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AddressRecord | null;
  fromAddress?: FromAddress | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  record,
  fromAddress: propFromAddress,
}) => {
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeFromAddress, setActiveFromAddress] = useState<FromAddress | null>(propFromAddress || null);

  useEffect(() => {
    if (isOpen) {
      setCopiedText(false);
      setCopiedLink(false);
      if (!propFromAddress) {
        const loaded = FromAddressService.getFromAddress();
        setActiveFromAddress(loaded);
      } else {
        setActiveFromAddress(propFromAddress);
      }
    }
  }, [isOpen, propFromAddress]);

  if (!record) return null;

  const formattedText = formatAddressForSharing(record, activeFromAddress);
  const isNativeShareSupported = canWebShare();

  const handleWhatsAppShare = () => {
    const waUrl = getWhatsAppShareUrl(formattedText);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${record.referenceNumber}`;
    await triggerNativeShare(
      `Address Slip - ${record.referenceNumber}`,
      formattedText,
      shareUrl
    );
  };

  const handleCopyText = async () => {
    const success = await copyToClipboard(formattedText);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${record.referenceNumber}`;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Address Slip">
      <div className="space-y-4">
        {/* Record Header Info */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold text-blue-400 block uppercase">
              Ref: {record.referenceNumber}
            </span>
            <h4 className="text-base font-bold text-white tracking-tight">{record.customerName}</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {record.city ? `${record.city} (${record.pinCode})` : record.pinCode}
          </span>
        </div>

        {/* Copy / Action Notice */}
        {(copiedText || copiedLink) && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {copiedText ? 'Formatted address copied to clipboard!' : 'Direct preview link copied to clipboard!'}
            </span>
          </div>
        )}

        {/* Formatted Address Preview Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Printable Share Preview
          </label>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
            {formattedText}
          </div>
        </div>

        {/* Share Action Grid */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Choose Share Option
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* WhatsApp Share */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleWhatsAppShare}
              icon={<MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold justify-center shadow-xs"
            >
              Share via WhatsApp
            </Button>

            {/* Native OS Share */}
            {isNativeShareSupported ? (
              <Button
                variant="gradient"
                size="md"
                onClick={handleNativeShare}
                icon={<Share2 className="w-4 h-4" />}
                className="justify-center"
              >
                Share via Apps...
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
                onClick={handleCopyLink}
                icon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link className="w-4 h-4" />}
                className="justify-center text-slate-700 hover:bg-slate-50"
              >
                {copiedLink ? 'Link Copied!' : 'Copy Preview Link'}
              </Button>
            )}

            {/* Copy Text Button */}
            <Button
              variant="outline"
              size="md"
              onClick={handleCopyText}
              icon={copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
              className="justify-center text-slate-800 border-slate-300 hover:bg-slate-100 font-semibold"
            >
              {copiedText ? 'Text Copied!' : 'Copy Formatted Text'}
            </Button>

            {/* Copy Link Button (if native share supported) */}
            {isNativeShareSupported && (
              <Button
                variant="outline"
                size="md"
                onClick={handleCopyLink}
                icon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link className="w-4 h-4" />}
                className="justify-center text-slate-700 hover:bg-slate-50"
              >
                {copiedLink ? 'Link Copied!' : 'Copy Preview Link'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
