import { CounterRepository } from '../db/repositories/counter.repository';

export class ReferenceService {
  /**
   * Generates a deterministic unique reference number formatted as:
   * ADR-YYYYMMDD-XXXX
   * Example: ADR-20260817-0001
   */
  static async generateReferenceNumber(date: Date = new Date()): Promise<string> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}${month}${day}`;

    const seq = await CounterRepository.getNextSequence(dateKey);
    const paddedSeq = String(seq).padStart(4, '0');

    return `ADR-${dateKey}-${paddedSeq}`;
  }
}
