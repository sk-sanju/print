import { AddressRecord, FromAddress } from '../types/address.types';

/**
 * Format address record details into clean printable plain text suitable for messaging / clipboard
 */
export function formatAddressForSharing(record: AddressRecord, fromAddress?: FromAddress | null): string {
  const deliveryLines: string[] = [];

  // Delivery Address Line 1
  const line1 = [record.houseName, record.houseNumber, record.street].filter(Boolean).join(', ');
  if (line1) deliveryLines.push(line1);

  // Delivery Address Line 2
  const line2 = [record.locality, record.landmark].filter(Boolean).join(', ');
  if (line2) deliveryLines.push(line2);

  // City, State, PIN
  const cityStatePin = [record.city, record.state, record.pinCode ? record.pinCode : ''].filter(Boolean).join(' - ');
  if (cityStatePin) deliveryLines.push(cityStatePin);

  let text = `📦 SHIPPING ADDRESS SLIP\nRef: ${record.referenceNumber || 'N/A'}\n\n`;
  text += `📍 TO / DELIVERY ADDRESS:\n`;
  text += `${record.customerName}\n`;
  if (deliveryLines.length > 0) {
    text += `${deliveryLines.join('\n')}\n`;
  }
  text += `Mobile: ${record.mobileNumber}`;
  if (record.alternateMobile) {
    text += ` / ${record.alternateMobile}`;
  }
  text += `\n`;

  if (record.remarks) {
    text += `Note: ${record.remarks}\n`;
  }

  // Sender / From Address
  if (fromAddress) {
    const fromLines: string[] = [];
    if (fromAddress.addressLine1) fromLines.push(fromAddress.addressLine1);
    if (fromAddress.addressLine2) fromLines.push(fromAddress.addressLine2);
    const fromCityStatePin = [fromAddress.city, fromAddress.state, fromAddress.pinCode].filter(Boolean).join(' - ');
    if (fromCityStatePin) fromLines.push(fromCityStatePin);

    text += `\n📍 FROM / SENDER:\n`;
    text += `${fromAddress.name}\n`;
    if (fromLines.length > 0) {
      text += `${fromLines.join('\n')}\n`;
    }
    text += `Mobile: ${fromAddress.mobileNumber}\n`;
  }

  return text.trim();
}

/**
 * Check if browser supports Web Share API
 */
export function canWebShare(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.share);
}

/**
 * Trigger native Web Share API dialog
 */
export async function triggerNativeShare(title: string, text: string, url?: string): Promise<boolean> {
  if (!canWebShare()) return false;
  try {
    const shareData: ShareData = { title, text };
    if (url) shareData.url = url;
    await navigator.share(shareData);
    return true;
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error('Web Share failed:', err);
    }
    return false;
  }
}

/**
 * Get direct WhatsApp share link
 */
export function getWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Copy text to clipboard with legacy fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}
