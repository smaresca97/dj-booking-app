import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DjService } from '../../services/dj.service';
import { AvailabilityService } from '../../services/availability.service';
import { DjCardComponent, DjCardViewModel } from '../../components/dj-card/dj-card.component';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, DjCardComponent],
  template: `
    <main class="app-page">
      <section class="app-container">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('search') }}</p>
            <h1 class="page-title">{{ t('bookingsTitle') }}</h1>
            <p class="page-copy">{{ t('bookingsSubtitle') }}</p>
          </div>

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </header>

        <section class="surface-strong mt-7 card-pad">
          <label class="block max-w-md">
            <span class="field-label">{{ t('eventDate') }}</span>
            <input id="search-date" [(ngModel)]="selectedDate" (ngModelChange)="loadResults()" type="date" class="field-input" />
          </label>
        </section>

        <h2 class="mt-7 text-lg font-black">{{ t('availableDjs') }}</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <app-dj-card *ngFor="let dj of results" [dj]="dj" (selected)="openDetails($event)" />
        </div>

        <p *ngIf="results.length === 0" class="surface-strong mt-4 card-pad text-sm text-slate-300">
          {{ t('noAvailableDjs') }}
        </p>
      </section>

      <nav class="bottom-nav" aria-label="Main navigation">
        <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active">{{ t('adminNav') }}</a>
        <a *ngIf="isDj" routerLink="/dashboard" routerLinkActive="active">{{ t('dashboardEyebrow') }}</a>
        <a *ngIf="isDj" routerLink="/calendar" routerLinkActive="active">{{ t('calendar') }}</a>
        <a routerLink="/search" routerLinkActive="active">{{ t('search') }}</a>
        <button type="button" (click)="logout()">{{ t('logout') }}</button>
      </nav>

      <div class="modal-backdrop" *ngIf="selectedDj" (click)="closeDetails()">
        <section class="modal-panel surface-strong card-pad" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="page-kicker">{{ t('contactDj') }}</p>
              <h2 class="status-text mt-2 text-2xl font-black">{{ selectedDj.stageName }}</h2>
              <p class="mt-2 text-sm text-slate-300">{{ selectedDj.city }}</p>
            </div>
            <button type="button" class="icon-pill" (click)="closeDetails()" [attr.aria-label]="t('close')">×</button>
          </div>

          <div class="mt-5 grid gap-3 text-sm text-slate-300">
            <p *ngIf="selectedDj.genres"><strong class="text-white">{{ t('genres') }}:</strong> {{ selectedDj.genres }}</p>
            <p *ngIf="selectedDj.bio"><strong class="text-white">{{ t('bio') }}:</strong> {{ selectedDj.bio }}</p>
            <p><strong class="text-white">{{ t('phone') }}:</strong> {{ selectedDj.phone }}</p>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            <a class="primary-action grid place-items-center no-underline" [href]="whatsappUrl(selectedDj)" target="_blank" rel="noopener">
              {{ t('openWhatsapp') }}
            </a>
            <a class="secondary-action grid place-items-center no-underline" [href]="'tel:' + selectedDj.phone">
              {{ t('call') }}
            </a>
            <button type="button" class="secondary-action" (click)="copyPhone(selectedDj.phone)">
              {{ copied ? t('phoneCopied') : t('copyPhone') }}
            </button>
          </div>
        </section>
      </div>
    </main>
  `
})
export class SearchPageComponent {
  selectedDate = new Date().toISOString().slice(0, 10);
  selectedDj: DjCardViewModel | null = null;
  copied = false;
  results: DjCardViewModel[] = [];

  constructor(
    private djService: DjService,
    private availability: AvailabilityService,
    private auth: AuthService,
    private router: Router,
    public i18n: I18nService
  ) {
    this.djService.registerCurrentUser(this.auth.getCurrentUser());
    this.loadResults();
  }

  async loadResults(): Promise<void> {
    const djs = await this.djService.getDjs();
    const results = await Promise.all(
      djs.map(async (dj) => ({
        ...dj,
        status: await this.availability.getAvailability(dj.id, this.selectedDate)
      }))
    );

    this.results = results.sort((a, b) => this.statusWeight(a.status) - this.statusWeight(b.status));
  }

  get isDj(): boolean {
    return this.auth.isDj();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  private statusWeight(status: 'AVAILABLE' | 'NOT_AVAILABLE' | null): number {
    if (status === 'AVAILABLE') {
      return 0;
    }

    if (!status) {
      return 1;
    }

    return 2;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  openDetails(dj: DjCardViewModel): void {
    this.selectedDj = dj;
    this.copied = false;
  }

  closeDetails(): void {
    this.selectedDj = null;
  }

  whatsappUrl(dj: DjCardViewModel): string {
    const phone = dj.phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${phone.replace(/^\+/, '')}`;
  }

  copyPhone(phone: string): void {
    navigator.clipboard?.writeText(phone);
    this.copied = true;
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }
}
