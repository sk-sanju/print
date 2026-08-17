import { FormRepository } from '../db/repositories/form.repository';
import { ReferenceService } from './reference.service';
import { AddressFormData, AddressRecord, FormFilterOptions, PaginatedResult } from '../types/address.types';

export class FormService {
  /**
   * Save a new address form with generated reference number
   */
  static async saveNewForm(data: AddressFormData): Promise<AddressRecord> {
    const referenceNumber = await ReferenceService.generateReferenceNumber();
    return await FormRepository.createForm(data, referenceNumber);
  }

  /**
   * Update an existing address form
   */
  static async updateForm(id: number, data: AddressFormData): Promise<AddressRecord> {
    return await FormRepository.updateForm(id, data);
  }

  /**
   * Get form by ID
   */
  static async getForm(id: number): Promise<AddressRecord | undefined> {
    return await FormRepository.getFormById(id);
  }

  /**
   * Get form by Ref Number
   */
  static async getFormByRef(ref: string): Promise<AddressRecord | undefined> {
    return await FormRepository.getFormByRef(ref);
  }

  /**
   * Delete form by ID
   */
  static async deleteForm(id: number): Promise<void> {
    await FormRepository.deleteForm(id);
  }

  /**
   * Search and filter saved forms
   */
  static async searchForms(options?: FormFilterOptions): Promise<PaginatedResult<AddressRecord>> {
    return await FormRepository.searchForms(options);
  }

  /**
   * Get Dashboard Metrics (Total count, today's count, recent list)
   */
  static async getDashboardMetrics() {
    const [totalSaved, todayCount, recentForms] = await Promise.all([
      FormRepository.getTotalCount(),
      FormRepository.getTodayCount(),
      FormRepository.getRecentForms(5),
    ]);

    return {
      totalSaved,
      todayCount,
      recentForms,
    };
  }
}
