import Dexie, { type Table } from 'dexie';
import { AddressRecord, DailyCounter } from '../types/address.types';

export class AddressPrintDatabase extends Dexie {
  forms!: Table<AddressRecord, number>;
  counters!: Table<DailyCounter, string>;

  constructor() {
    super('AddressPrintDB');
    this.version(1).stores({
      forms: '++id, &referenceNumber, customerName, mobileNumber, city, pinCode, createdAt',
      counters: '&dateKey',
    });
  }
}

export const db = new AddressPrintDatabase();
