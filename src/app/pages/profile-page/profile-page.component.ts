import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DjProfileForm, DjService } from '../../services/dj.service';
import { I18nService } from '../../services/i18n.service';

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

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </header>

        <form class="surface-strong mt-7 card-pad" (ngSubmit)="save()">
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
        <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active">{{ t('adminNav') }}</a>
        <a routerLink="/dashboard" routerLinkActive="active">{{ t('dashboardEyebrow') }}</a>
        <a routerLink="/calendar" routerLinkActive="active">{{ t('calendar') }}</a>
        <a routerLink="/search" routerLinkActive="active">{{ t('search') }}</a>
        <button type="button" (click)="logout()">{{ t('logout') }}</button>
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
    bio: ''
  };
  error = signal(false);

  constructor(
    private auth: AuthService,
    private djService: DjService,
    private router: Router,
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
        bio: profile.bio || ''
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
      return;
    }

    await this.djService.saveProfile(user, this.form);
    await this.router.navigateByUrl('/dashboard');
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }
}
