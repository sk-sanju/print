import { db } from '../database';
import { AddressRecord, AddressFormData, FormFilterOptions, PaginatedResult } from '../../types/address.types';

export class FormRepository {
  /**
   * Create a new form record in IndexedDB
   */
  static async createForm(data: AddressFormData, referenceNumber: string): Promise<AddressRecord> {
    const now = new Date().toISOString();
    const record: Omit<AddressRecord, 'id'> = {
      ...data,
      referenceNumber,
      createdAt: now,
      updatedAt: now,
    };

    const id = await db.forms.add(record as AddressRecord);
    return { ...record, id };
  }

  /**
   * Get form by primary key ID or Reference Number
   */
  static async getFormById(id: number): Promise<AddressRecord | undefined> {
    return await db.forms.get(id);
  }

  static async getFormByRef(referenceNumber: string): Promise<AddressRecord | undefined> {
    return await db.forms.where('referenceNumber').equals(referenceNumber).first();
  }

  /**
   * Update an existing form record
   */
  static async updateForm(id: number, data: Partial<AddressFormData>): Promise<AddressRecord> {
    const existing = await db.forms.get(id);
    if (!existing) {
      throw new Error(`Form with ID ${id} not found.`);
    }

    const updatedAt = new Date().toISOString();
    const updatedRecord: AddressRecord = {
      ...existing,
      ...data,
      updatedAt,
    };

    await db.forms.put(updatedRecord);
    return updatedRecord;
  }

  /**
   * Delete a form record
   */
  static async deleteForm(id: number): Promise<void> {
    await db.forms.delete(id);
  }

  /**
   * Get total count of saved forms
   */
  static async getTotalCount(): Promise<number> {
    return await db.forms.count();
  }

  /**
   * Get count of forms saved today (local time)
   */
  static async getTodayCount(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startIso = startOfDay.toISOString();

    return await db.forms.where('createdAt').aboveOrEqual(startIso).count();
  }

  /**
   * Get recent forms (for Dashboard)
   */
  static async getRecentForms(limit: number = 5): Promise<AddressRecord[]> {
    return await db.forms.orderBy('createdAt').reverse().limit(limit).toArray();
  }

  /**
   * Search and filter forms with sorting and pagination
   */
  static async searchForms(options: FormFilterOptions = {}): Promise<PaginatedResult<AddressRecord>> {
    const { searchQuery = '', sortBy = 'newest', page = 1, limit = 10 } = options;

    let collection = db.forms.toCollection();

    // Fetch all array to filter in memory if searchQuery is provided (Dexie multi-field search)
    let records = await collection.toArray();

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      records = records.filter((r) => {
        return (
          r.referenceNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.mobileNumber.includes(q) ||
          (r.city && r.city.toLowerCase().includes(q)) ||
          r.pinCode.includes(q)
        );
      });
    }

    // Sort
    if (sortBy === 'newest') {
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'customerName') {
      records.sort((a, b) => a.customerName.localeCompare(b.customerName));
    }

    const total = records.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * limit;
    const paginatedData = records.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page: safePage,
      limit,
      totalPages,
    };
  }
}
