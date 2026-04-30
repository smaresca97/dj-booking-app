import { Injectable } from '@angular/core';
import { doc, getDoc, getDocs, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FirebaseClientService } from './firebase-client.service';
import type { CurrentUser } from './auth.service';

export interface DjProfile {
  id: string;
  email: string;
  stageName: string;
  phone: string;
  city: string;
  genres: string;
  bio: string;
  avatar: string;
}

export interface DjProfileForm {
  stageName: string;
  phone: string;
  city: string;
  genres: string;
  bio: string;
}

type StoredDjProfile = Partial<DjProfile> & {
  name?: string;
};

@Injectable({ providedIn: 'root' })
export class DjService {
  private readonly localKey = 'dj-booking-roster';

  constructor(private firebase: FirebaseClientService) {}

  async getDjs(): Promise<DjProfile[]> {
    try {
      const snapshot = await getDocs(collection(this.firebase.db, 'djProfiles'));

      return snapshot.docs
        .map((item) => this.toProfile(item.id, item.data()))
        .filter((dj) => this.isProfileComplete(dj))
        .filter((dj, index, roster) => roster.findIndex((item) => item.id === dj.id) === index);
    } catch {
      return this.readLocalProfiles().filter((dj) => this.isProfileComplete(dj));
    }
  }

  async getProfile(djId: string | null): Promise<DjProfile | null> {
    if (!djId) {
      return null;
    }

    try {
      const snapshot = await getDoc(doc(this.firebase.db, 'djProfiles', djId));
      const localProfile = this.getLocalProfile(djId);

      if (!snapshot.exists()) {
        return localProfile;
      }

      const remoteProfile = this.toProfile(snapshot.id, snapshot.data());
      return !this.isProfileComplete(remoteProfile) && this.isProfileComplete(localProfile) ? localProfile : remoteProfile;
    } catch {
      return this.getLocalProfile(djId);
    }
  }

  async hasCompleteProfile(djId: string | null): Promise<boolean> {
    return this.isProfileComplete(await this.getProfile(djId));
  }

  async saveProfile(user: CurrentUser, form: DjProfileForm): Promise<void> {
    const profile: DjProfile = {
      id: user.id,
      email: user.email ?? '',
      stageName: form.stageName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      genres: form.genres.trim(),
      bio: form.bio.trim(),
      avatar: '🎧'
    };

    this.saveLocalProfile(profile);
    await setDoc(doc(this.firebase.db, 'djProfiles', user.id), {
      ...profile,
      updatedAt: serverTimestamp()
    });
  }

  async registerCurrentUser(user: CurrentUser | null): Promise<void> {
    if (!user || (user.role !== 'dj' && user.role !== 'admin')) {
      return;
    }

    const localProfile = this.getLocalProfile(user.id);

    if (!localProfile) {
      this.saveLocalProfile({
        id: user.id,
        email: user.email ?? '',
        stageName: '',
        phone: '',
        city: '',
        genres: '',
        bio: '',
        avatar: '🎧'
      });
    }

    try {
      const profileRef = doc(this.firebase.db, 'djProfiles', user.id);
      const snapshot = await getDoc(profileRef);

      if (!snapshot.exists()) {
        await setDoc(profileRef, {
          id: user.id,
          email: user.email ?? '',
          stageName: '',
          phone: '',
          city: '',
          genres: '',
          bio: '',
          avatar: '🎧',
          updatedAt: serverTimestamp()
        });
        return;
      }

      if (localProfile && this.isProfileComplete(localProfile) && !this.isProfileComplete(this.toProfile(snapshot.id, snapshot.data()))) {
        await setDoc(profileRef, {
          ...localProfile,
          updatedAt: serverTimestamp()
        });
      }
    } catch {
      // Local cache already contains the draft profile.
    }
  }

  isProfileComplete(profile: DjProfile | null): boolean {
    return !!profile?.stageName?.trim() && !!profile?.phone?.trim();
  }

  private toProfile(id: string, data: Record<string, unknown>): DjProfile {
    return {
      id,
      email: String(data['email'] ?? ''),
      stageName: String(data['stageName'] ?? data['name'] ?? ''),
      phone: String(data['phone'] ?? ''),
      city: String(data['city'] ?? ''),
      genres: String(data['genres'] ?? ''),
      bio: String(data['bio'] ?? ''),
      avatar: String(data['avatar'] ?? '🎧')
    };
  }

  private getLocalProfile(djId: string): DjProfile | null {
    return this.readLocalProfiles().find((dj) => dj.id === djId) ?? null;
  }

  private saveLocalProfile(profile: DjProfile): void {
    const profiles = this.readLocalProfiles();
    const existingIndex = profiles.findIndex((dj) => dj.id === profile.id);

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    localStorage.setItem(this.localKey, JSON.stringify(profiles));
  }

  private readLocalProfiles(): DjProfile[] {
    try {
      const rawProfiles = JSON.parse(localStorage.getItem(this.localKey) || '[]') as StoredDjProfile[];

      return rawProfiles
        .filter((profile) => !!profile.id)
        .map((profile) => ({
          id: profile.id ?? '',
          email: profile.email ?? '',
          stageName: profile.stageName ?? profile.name ?? '',
          phone: profile.phone ?? '',
          city: profile.city ?? '',
          genres: profile.genres ?? '',
          bio: profile.bio ?? '',
          avatar: profile.avatar ?? '🎧'
        }));
    } catch {
      return [];
    }
  }
}
