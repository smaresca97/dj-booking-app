import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase';

@Injectable({ providedIn: 'root' })
export class FirebaseClientService {
  private readonly app = initializeApp(firebaseConfig);
  readonly auth = getAuth(this.app);
  readonly db = getFirestore(this.app);
}
