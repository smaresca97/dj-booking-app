import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { FirebaseClientService } from './firebase-client.service';

export type Availability = 'AVAILABLE' | 'NOT_AVAILABLE';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private localKey = 'dj-availability';

  constructor(private firebase: FirebaseClientService) {}

  async setAvailability(djId: string, date: string, value: Availability): Promise<void> {
    await setDoc(this.availabilityRef(djId, date), {
      djId,
      date,
      status: value,
      updatedAt: serverTimestamp()
    });

    const data = this.readLocal();
    data[djId] = data[djId] || {};
    data[djId][date] = value;
    this.writeLocal(data);
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

    return null;
  }

  async getAvailableDjs(date: string, djIds: string[]): Promise<string[]> {
    try {
      const availabilityQuery = query(
        collection(this.firebase.db, 'availability'),
        where('date', '==', date)
      );
      const snapshot = await getDocs(availabilityQuery);
      const requestedIds = new Set(djIds);

      return snapshot.docs
        .filter((item) => item.data()['status'] === 'AVAILABLE')
        .map((item) => String(item.data()['djId'] ?? ''))
        .filter((id) => requestedIds.has(id));
    } catch {
      const statuses = await Promise.all(djIds.map(async (id) => [id, await this.getAvailability(id, date)] as const));
      return statuses.filter(([, status]) => status === 'AVAILABLE').map(([id]) => id);
    }
  }

  private availabilityRef(djId: string, date: string) {
    return doc(this.firebase.db, 'availability', `${djId}_${date}`);
  }

  private readLocal(): Record<string, Record<string, Availability>> {
    try {
      return JSON.parse(localStorage.getItem(this.localKey) || '{}');
    } catch {
      return {};
    }
  }

  private writeLocal(data: Record<string, Record<string, Availability>>): void {
    localStorage.setItem(this.localKey, JSON.stringify(data));
  }
}
