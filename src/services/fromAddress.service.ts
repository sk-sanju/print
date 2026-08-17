import { FromAddress } from '../types/address.types';

const FROM_ADDRESS_KEY = 'address_print_from_address_v1';

export class FromAddressService {
  static getFromAddress(): FromAddress | null {
    try {
      const raw = localStorage.getItem(FROM_ADDRESS_KEY);
      if (raw) {
        return JSON.parse(raw) as FromAddress;
      }
    } catch (e) {
      console.error('Failed to parse From Address:', e);
    }
    return null;
  }

  static saveFromAddress(address: FromAddress): void {
    try {
      localStorage.setItem(FROM_ADDRESS_KEY, JSON.stringify(address));
    } catch (e) {
      console.error('Failed to save From Address:', e);
    }
  }

  static clearFromAddress(): void {
    try {
      localStorage.removeItem(FROM_ADDRESS_KEY);
    } catch (e) {
      console.error('Failed to clear From Address:', e);
    }
  }
}
