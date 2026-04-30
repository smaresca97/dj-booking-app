import { Injectable, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { adminEmails } from '../../environments/firebase';
import { FirebaseClientService } from './firebase-client.service';
import { DjService } from './dj.service';

export type UserRole = 'dj' | 'guest' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface CurrentUser {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  role: UserRole;
  status?: UserStatus;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Timestamp;
  approvedAt?: Timestamp;
  rejectedAt?: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly guestKey = 'dj-auth-guest';
  private readonly provider = new GoogleAuthProvider();
  private readyResolver!: () => void;

  readonly currentUser = signal<CurrentUser | null>(null);
  readonly loading = signal(true);
  readonly authReady = new Promise<void>((resolve) => {
    this.readyResolver = resolve;
  });

  constructor(
    private firebase: FirebaseClientService,
    private djService: DjService
  ) {
    onAuthStateChanged(this.firebase.auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          localStorage.removeItem(this.guestKey);
          const user = await this.syncFirebaseUser(firebaseUser);
          this.currentUser.set(user);
          this.djService.registerCurrentUser(user);
          return;
        }

        this.currentUser.set(this.readGuest());
      } finally {
        this.loading.set(false);
        this.readyResolver();
      }
    });
  }

  async signInWithGoogle(): Promise<CurrentUser | null> {
    const credential = await signInWithPopup(this.firebase.auth, this.provider);
    return this.syncFirebaseUser(credential.user);
  }

  enterAsGuest(): void {
    const user: CurrentUser = {
      id: 'guest',
      name: 'Guest',
      role: 'guest',
      status: 'approved'
    };

    localStorage.setItem(this.guestKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.guestKey);
    await signOut(this.firebase.auth);
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isApproved(): boolean {
    const user = this.currentUser();
    return user?.role === 'guest' || user?.status === 'approved';
  }

  isDj(): boolean {
    const role = this.currentUser()?.role;
    return role === 'dj' || role === 'admin';
  }

  isApprovedDj(): boolean {
    const user = this.currentUser();
    return (user?.role === 'dj' || user?.role === 'admin') && user.status === 'approved';
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin' && user.status === 'approved';
  }

  isGuest(): boolean {
    return this.currentUser()?.role === 'guest';
  }

  getCurrentDj(): string | null {
    const user = this.currentUser();
    return user?.role === 'dj' || user?.role === 'admin' ? user.id : null;
  }

  getCurrentName(): string | null {
    return this.currentUser()?.name ?? null;
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUser();
  }

  async getUsers(status?: UserStatus): Promise<ManagedUser[]> {
    const usersRef = collection(this.firebase.db, 'users');
    const usersQuery = status ? query(usersRef, where('status', '==', status)) : usersRef;
    const snapshot = await getDocs(usersQuery);

    return snapshot.docs
      .map((item) => this.toManagedUser(item.id, item.data()))
      .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
  }

  async approveUser(userId: string): Promise<void> {
    const currentAdmin = this.currentUser();
    await updateDoc(doc(this.firebase.db, 'users', userId), {
      role: 'dj',
      status: 'approved',
      approvedAt: serverTimestamp(),
      approvedBy: currentAdmin?.id ?? null
    });
  }

  async rejectUser(userId: string): Promise<void> {
    const currentAdmin = this.currentUser();
    await updateDoc(doc(this.firebase.db, 'users', userId), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectedBy: currentAdmin?.id ?? null
    });
  }

  private async syncFirebaseUser(firebaseUser: User): Promise<CurrentUser> {
    const userRef = doc(this.firebase.db, 'users', firebaseUser.uid);
    const snapshot = await getDoc(userRef);
    const isConfiguredAdmin = this.isConfiguredAdmin(firebaseUser.email);

    if (!snapshot.exists()) {
      const user: ManagedUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName || this.toDisplayName(firebaseUser.email),
        photoUrl: firebaseUser.photoURL ?? '',
        role: isConfiguredAdmin ? 'admin' : 'dj',
        status: isConfiguredAdmin ? 'approved' : 'pending'
      };

      await setDoc(userRef, {
        ...user,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });

      return user;
    }

    const existingUser = this.toManagedUser(snapshot.id, snapshot.data());
    const userPatch = {
      email: firebaseUser.email ?? existingUser.email,
      name: firebaseUser.displayName || existingUser.name,
      photoUrl: firebaseUser.photoURL ?? existingUser.photoUrl,
      lastLoginAt: serverTimestamp()
    };

    if (isConfiguredAdmin && existingUser.role !== 'admin') {
      await updateDoc(userRef, {
        ...userPatch,
        role: 'admin',
        status: 'approved',
        approvedAt: serverTimestamp()
      });

      return {
        ...existingUser,
        ...userPatch,
        role: 'admin',
        status: 'approved'
      };
    }

    await updateDoc(userRef, userPatch);
    return {
      ...existingUser,
      ...userPatch
    };
  }

  private readGuest(): CurrentUser | null {
    const rawUser = localStorage.getItem(this.guestKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as CurrentUser;
    } catch {
      localStorage.removeItem(this.guestKey);
      return null;
    }
  }

  private toManagedUser(id: string, data: Record<string, unknown>): ManagedUser {
    return {
      id,
      email: String(data['email'] ?? ''),
      name: String(data['name'] ?? ''),
      photoUrl: String(data['photoUrl'] ?? ''),
      role: (data['role'] as UserRole) ?? 'dj',
      status: (data['status'] as UserStatus) ?? 'pending',
      createdAt: data['createdAt'] as Timestamp | undefined,
      approvedAt: data['approvedAt'] as Timestamp | undefined,
      rejectedAt: data['rejectedAt'] as Timestamp | undefined
    };
  }

  private isConfiguredAdmin(email: string | null): boolean {
    if (!email) {
      return false;
    }

    return adminEmails.map((item) => item.toLowerCase()).includes(email.toLowerCase());
  }

  private toDisplayName(email: string | null): string {
    const localPart = email?.split('@')[0] || 'DJ';
    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'DJ';
  }
}
