import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'dj-auth-user';
  readonly currentUser = signal<string | null>(localStorage.getItem(this.key));

  login(username: string, password: string): boolean {
    if (!username.trim() || !password.trim()) return false;
    localStorage.setItem(this.key, username);
    this.currentUser.set(username);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.key);
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
