import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseClientService } from './firebase-client.service';

export type Availability = 'AVAILABLE' | 'NOT_AVAILABLE';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private localKey = 'dj-availability';

  constructor(private firebase: FirebaseClientService) {}

  async setAvailability(djId: string, date: string, value: Availability): Promise<void> {
    const data = this.readLocal();
    data[djId] = data[djId] || {};
    data[djId][date] = value;
    this.writeLocal(data);

    await setDoc(this.availabilityRef(djId, date), {
      djId,
      date,
      status: value,
      updatedAt: serverTimestamp()
    });
  }

  async getAvailability(djId: string, date: string): Promise<Availability | null> {
    try {
      const snapshot = await getDoc(this.availabilityRef(djId, date));
      const status = snapshot.data()?.['status'];

      if (status === 'AVAILABLE' || status === 'NOT_AVAILABLE') {
        return status;
      }
    } catch {
      return this.readLocal()[djId]?.[date] || null;
    }

    return this.readLocal()[djId]?.[date] || null;
  }

  async getAvailableDjs(date: string, djIds: string[]): Promise<string[]> {
    const statuses = await Promise.all(djIds.map(async (id) => [id, await this.getAvailability(id, date)] as const));
    return statuses.filter(([, status]) => status === 'AVAILABLE').map(([id]) => id);
  }

  private availabilityRef(djId: string, date: string) {
    return doc(this.firebase.db, 'availability', `${djId}_${date}`);
  }

  private readLocal(): Record<string, Record<string, Availability>> {
    return JSON.parse(localStorage.getItem(this.localKey) || '{}');
  }

  private writeLocal(data: Record<string, Record<string, Availability>>): void {
    localStorage.setItem(this.localKey, JSON.stringify(data));
  }
}
