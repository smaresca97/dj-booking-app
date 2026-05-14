import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { FirebaseClientService } from './firebase-client.service';

export type AssignmentDjType = 'registered' | 'external';

export interface VenueAssignmentForm {
  id?: string;
  venue: string;
  venueUserId: string;
  venueUserName: string;
  date: string;
  from: string;
  to: string;
  djType: AssignmentDjType;
  djId: string;
  djName: string;
  notes: string;
}

export interface VenueAssignment extends VenueAssignmentForm {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class VenueAssignmentService {
  private readonly localKey = 'venue-assignments';

  constructor(private firebase: FirebaseClientService) {}

  async getAssignments(): Promise<VenueAssignment[]> {
    try {
      const assignmentsQuery = query(collection(this.firebase.db, 'venueAssignments'), orderBy('date', 'desc'));
      const snapshot = await getDocs(assignmentsQuery);

      return snapshot.docs.map((item) => this.toAssignment(item.id, item.data()));
    } catch {
      return this.readLocal();
    }
  }

  async getAssignmentsForVenue(venueUserId: string): Promise<VenueAssignment[]> {
    const assignmentsQuery = query(
      collection(this.firebase.db, 'venueAssignments'),
      where('venueUserId', '==', venueUserId)
    );
    const snapshot = await getDocs(assignmentsQuery);

    return snapshot.docs
      .map((item) => this.toAssignment(item.id, item.data()))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async saveAssignment(form: VenueAssignmentForm): Promise<void> {
    const id = form.id || `${form.date}_${Date.now()}`;
    const assignment: VenueAssignment = {
      ...form,
      id,
      venue: form.venue.trim(),
      venueUserName: form.venueUserName.trim(),
      djName: form.djName.trim(),
      notes: form.notes.trim()
    };

    await setDoc(doc(this.firebase.db, 'venueAssignments', id), {
      ...assignment,
      updatedAt: serverTimestamp()
    }, { merge: true });

    this.writeLocal([assignment, ...this.readLocal().filter((item) => item.id !== id)]);
  }

  async deleteAssignment(id: string): Promise<void> {
    await deleteDoc(doc(this.firebase.db, 'venueAssignments', id));
    this.writeLocal(this.readLocal().filter((item) => item.id !== id));
  }

  private toAssignment(id: string, data: Record<string, unknown>): VenueAssignment {
    return {
      id,
      venue: String(data['venue'] ?? ''),
      venueUserId: String(data['venueUserId'] ?? ''),
      venueUserName: String(data['venueUserName'] ?? ''),
      date: String(data['date'] ?? ''),
      from: String(data['from'] ?? ''),
      to: String(data['to'] ?? ''),
      djType: data['djType'] === 'external' ? 'external' : 'registered',
      djId: String(data['djId'] ?? ''),
      djName: String(data['djName'] ?? ''),
      notes: String(data['notes'] ?? '')
    };
  }

  private readLocal(): VenueAssignment[] {
    try {
      return JSON.parse(localStorage.getItem(this.localKey) || '[]') as VenueAssignment[];
    } catch {
      return [];
    }
  }

  private writeLocal(assignments: VenueAssignment[]): void {
    localStorage.setItem(this.localKey, JSON.stringify(assignments));
  }
}
