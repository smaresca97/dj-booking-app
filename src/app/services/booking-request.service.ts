import { Injectable } from '@angular/core';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { FirebaseClientService } from './firebase-client.service';

export type BookingRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface BookingRequestInput {
  djId: string;
  djName: string;
  venueUserId?: string;
  venueUserName?: string;
  clientName: string;
  clientPhone: string;
  date: string;
  from: string;
  to: string;
  type: string;
  place: string;
}

export interface BookingRequest extends BookingRequestInput {
  id: string;
  status: BookingRequestStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  cancelledAt?: Timestamp;
}

export type BookingRequestUpdate = Pick<BookingRequestInput, 'clientName' | 'clientPhone' | 'date' | 'from' | 'to' | 'type' | 'place'>;

@Injectable({ providedIn: 'root' })
export class BookingRequestService {
  constructor(private firebase: FirebaseClientService) {}

  async createRequest(input: BookingRequestInput): Promise<void> {
    await addDoc(collection(this.firebase.db, 'bookingRequests'), {
      ...input,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async getRequestsForDj(djId: string): Promise<BookingRequest[]> {
    const requestQuery = query(
      collection(this.firebase.db, 'bookingRequests'),
      where('djId', '==', djId)
    );
    const snapshot = await getDocs(requestQuery);

    return snapshot.docs
      .map((item) => this.toBookingRequest(item.id, item.data()))
      .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
  }

  async getAllRequests(): Promise<BookingRequest[]> {
    const snapshot = await getDocs(collection(this.firebase.db, 'bookingRequests'));

    return snapshot.docs
      .map((item) => this.toBookingRequest(item.id, item.data()))
      .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
  }

  async getAcceptedRequestsForDate(djId: string, date: string): Promise<BookingRequest[]> {
    const requestQuery = query(
      collection(this.firebase.db, 'bookingRequests'),
      where('djId', '==', djId),
      where('date', '==', date),
      where('status', '==', 'accepted')
    );
    const snapshot = await getDocs(requestQuery);

    return snapshot.docs.map((item) => this.toBookingRequest(item.id, item.data()));
  }

  async acceptRequest(requestId: string): Promise<void> {
    await updateDoc(doc(this.firebase.db, 'bookingRequests', requestId), {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async rejectRequest(requestId: string): Promise<void> {
    await updateDoc(doc(this.firebase.db, 'bookingRequests', requestId), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async cancelRequest(requestId: string): Promise<void> {
    await updateDoc(doc(this.firebase.db, 'bookingRequests', requestId), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async updateRequest(requestId: string, input: BookingRequestUpdate): Promise<void> {
    await updateDoc(doc(this.firebase.db, 'bookingRequests', requestId), {
      ...input,
      updatedAt: serverTimestamp()
    });
  }

  private toBookingRequest(id: string, data: Record<string, unknown>): BookingRequest {
    return {
      id,
      djId: String(data['djId'] ?? ''),
      djName: String(data['djName'] ?? ''),
      venueUserId: String(data['venueUserId'] ?? ''),
      venueUserName: String(data['venueUserName'] ?? ''),
      clientName: String(data['clientName'] ?? ''),
      clientPhone: String(data['clientPhone'] ?? ''),
      date: String(data['date'] ?? ''),
      from: String(data['from'] ?? ''),
      to: String(data['to'] ?? ''),
      type: String(data['type'] ?? ''),
      place: String(data['place'] ?? ''),
      status: (data['status'] as BookingRequestStatus) ?? 'pending',
      createdAt: data['createdAt'] as Timestamp | undefined,
      updatedAt: data['updatedAt'] as Timestamp | undefined,
      acceptedAt: data['acceptedAt'] as Timestamp | undefined,
      rejectedAt: data['rejectedAt'] as Timestamp | undefined,
      cancelledAt: data['cancelledAt'] as Timestamp | undefined
    };
  }
}
