import { db } from '../database';

export class CounterRepository {
  /**
   * Atomically gets and increments the next sequence number for a given date key (YYYYMMDD).
   */
  static async getNextSequence(dateKey: string): Promise<number> {
    return await db.transaction('rw', db.counters, async () => {
      const counter = await db.counters.get(dateKey);
      if (counter) {
        const nextSeq = counter.lastSeq + 1;
        await db.counters.update(dateKey, { lastSeq: nextSeq });
        return nextSeq;
      } else {
        await db.counters.add({ dateKey, lastSeq: 1 });
        return 1;
      }
    });
  }
}
