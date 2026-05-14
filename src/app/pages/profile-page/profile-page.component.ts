import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DjProfileForm, DjService } from '../../services/dj.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <main class="app-page">
      <section class="app-container-narrow">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('profileEyebrow') }}</p>
            <h1 class="page-title">{{ t('profileTitle') }}</h1>
            <p class="page-copy">{{ t('profileSubtitle') }}</p>
          </div>

          <div class="header-actions">
            <a *ngIf="isAdmin" routerLink="/admin" class="top-admin-link">{{ t('adminNav') }}</a>
            <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
          </div>
        </header>

        <form class="surface-strong mt-7 card-pad" (ngSubmit)="save()">
          <section class="profile-photo-panel">
            <div class="profile-photo-preview">
              <img *ngIf="form.photoUrl" [src]="form.photoUrl" alt="" />
              <span *ngIf="!form.photoUrl">🎧</span>
            </div>

            <div class="min-w-0">
              <span class="field-label">{{ t('profilePhoto') }}</span>
              <div class="mt-2 flex flex-wrap gap-2">
                <label class="secondary-action grid cursor-pointer place-items-center px-4">
                  {{ t('changePhoto') }}
                  <input type="file" class="sr-only" accept="image/*" (change)="selectPhoto($event)" />
                </label>
                <button *ngIf="form.photoUrl" type="button" class="secondary-action px-4" (click)="removePhoto()">
                  {{ t('removePhoto') }}
                </button>
              </div>
              <p class="mt-2 text-xs text-slate-400">{{ t('photoHelp') }}</p>
              <p class="mt-2 text-sm text-pink-300" *ngIf="photoError()">{{ t('photoError') }}</p>
            </div>
          </section>

          <div class="form-section-heading mb-4">
            <div class="min-w-0">
              <p class="page-kicker">{{ t('publicInfo') }}</p>
              <p class="mt-2 text-sm text-slate-300">{{ t('publicInfoCopy') }}</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="field-label">{{ t('stageName') }}</span>
              <input [(ngModel)]="form.stageName" name="stageName" class="field-input" autocomplete="nickname" />
            </label>

            <label class="block">
              <span class="field-label">{{ t('phone') }}</span>
              <input [(ngModel)]="form.phone" name="phone" class="field-input" inputmode="tel" autocomplete="tel" />
            </label>

            <label class="block">
              <span class="field-label">{{ t('city') }}</span>
              <input [(ngModel)]="form.city" name="city" class="field-input" autocomplete="address-level2" />
            </label>

            <label class="block">
              <span class="field-label">{{ t('genres') }}</span>
              <input [(ngModel)]="form.genres" name="genres" class="field-input" />
            </label>
          </div>

          <label class="mt-4 block">
            <span class="field-label">{{ t('bio') }}</span>
            <textarea [(ngModel)]="form.bio" name="bio" class="field-input min-h-32 resize-y"></textarea>
          </label>

          <p class="mt-4 text-sm text-pink-300" *ngIf="error()">{{ t('profileError') }}</p>

          <button type="submit" class="primary-action mt-5 w-full">{{ t('saveProfile') }}</button>
        </form>
      </section>

      <nav class="bottom-nav" aria-label="Main navigation">
        <a *ngIf="isAdmin" routerLink="/assignments" routerLinkActive="active" data-nav="venues"><span>{{ t('artDirectionNav') }}</span></a>
        <a routerLink="/dashboard" routerLinkActive="active" data-nav="home"><span>{{ t('dashboardNav') }}</span></a>
        <a routerLink="/calendar" routerLinkActive="active" data-nav="calendar" [attr.aria-label]="t('calendar')">
          <svg class="calendar-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
          </svg>
          <span class="sr-only">{{ t('calendar') }}</span>
        </a>
        <a *ngIf="isAdmin" routerLink="/search" routerLinkActive="active" data-nav="search"><span>{{ t('search') }}</span></a>
        <button type="button" (click)="logout()" data-nav="exit"><span>{{ t('logout') }}</span></button>
      </nav>
    </main>
  `
})
export class ProfilePageComponent {
  form: DjProfileForm = {
    stageName: '',
    phone: '',
    city: '',
    genres: '',
    bio: '',
    photoUrl: ''
  };
  error = signal(false);
  photoError = signal(false);

  constructor(
    private auth: AuthService,
    private djService: DjService,
    private router: Router,
    private toast: ToastService,
    public i18n: I18nService
  ) {
    this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    const profile = await this.djService.getProfile(this.auth.getCurrentDj());

    if (profile) {
      this.form = {
        stageName: profile.stageName || '',
        phone: profile.phone || '',
        city: profile.city || '',
        genres: profile.genres || '',
        bio: profile.bio || '',
        photoUrl: profile.photoUrl || ''
      };
    }
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  async save(): Promise<void> {
    const user = this.auth.getCurrentUser();
    this.error.set(false);

    if (!user || !this.form.stageName.trim() || !this.form.phone.trim()) {
      this.error.set(true);
      this.toast.error(this.t('profileError'));
      return;
    }

    try {
      await this.djService.saveProfile(user, this.form);
      this.toast.success(this.t('toastProfileSaved'));
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async selectPhoto(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.photoError.set(false);

    if (!file) {
      return;
    }

    try {
      this.form.photoUrl = await this.resizePhoto(file);
    } catch {
      this.photoError.set(true);
      this.toast.error(this.t('photoError'));
    } finally {
      input.value = '';
    }
  }

  removePhoto(): void {
    this.form.photoUrl = '';
    this.photoError.set(false);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }

  private resizePhoto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error('Could not load image.'));
        image.onload = () => {
          const maxSize = 900;
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Canvas is unavailable.'));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        image.src = String(reader.result ?? '');
      };

      reader.readAsDataURL(file);
    });
  }
}
