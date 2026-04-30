import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AvailabilityService } from '../../services/availability.service';
import { DjService } from '../../services/dj.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-dj-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <main class="app-page">
      <section class="app-container">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('dashboardEyebrow') }}</p>
            <h1 class="page-title">{{ t('dashboardTitle') }}, {{ djName }}</h1>
            <p class="page-copy">{{ t('dashboardSubtitle') }}</p>
          </div>

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </header>

        <div class="action-grid mt-7">
          <article class="surface card-pad">
            <p class="text-sm text-slate-400">{{ t('todayStatus') }}</p>
            <p class="status-text mt-3 text-2xl font-black" [class.text-emerald-300]="todayStatus === 'AVAILABLE'">
              {{ statusLabel(todayStatus) }}
            </p>
            <button type="button" class="primary-action mt-5 w-full" (click)="setTodayAvailable()">
              {{ t('setTodayAvailable') }}
            </button>
          </article>

          <a routerLink="/profile" class="surface card-pad block no-underline hover:border-cyan-300">
            <p class="text-sm text-slate-400">{{ t('quickActions') }}</p>
            <h2 class="status-text mt-3 text-xl font-black text-white sm:text-2xl">{{ t('editProfile') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('profileSubtitle') }}</p>
          </a>

          <a routerLink="/calendar" class="surface card-pad block no-underline hover:border-cyan-300">
            <p class="text-sm text-slate-400">{{ t('quickActions') }}</p>
            <h2 class="status-text mt-3 text-xl font-black text-white sm:text-2xl">{{ t('manageCalendar') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('availabilitySubtitle') }}</p>
          </a>

          <a routerLink="/search" class="surface card-pad block no-underline hover:border-cyan-300">
            <p class="text-sm text-slate-400">{{ t('quickActions') }}</p>
            <h2 class="status-text mt-3 text-xl font-black text-white sm:text-2xl">{{ t('findArtists') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('bookingsSubtitle') }}</p>
          </a>
        </div>
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
export class DjDashboardComponent {
  private readonly today = new Date().toISOString().slice(0, 10);
  djName = 'DJ';
  todayStatus: 'AVAILABLE' | 'NOT_AVAILABLE' | null = null;

  constructor(
    private auth: AuthService,
    private availability: AvailabilityService,
    private djService: DjService,
    private router: Router,
    public i18n: I18nService
  ) {
    this.loadDashboard();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  async setTodayAvailable(): Promise<void> {
    await this.availability.setAvailability(this.auth.getCurrentDj() || 'guest-dj', this.today, 'AVAILABLE');
    await this.loadDashboard();
  }

  statusLabel(status: 'AVAILABLE' | 'NOT_AVAILABLE' | null): string {
    if (status === 'AVAILABLE') {
      return this.t('available');
    }

    if (status === 'NOT_AVAILABLE') {
      return this.t('notAvailable');
    }

    return this.t('noStatus');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }

  private async loadDashboard(): Promise<void> {
    const profile = await this.djService.getProfile(this.auth.getCurrentDj());
    this.djName = profile?.stageName || this.auth.getCurrentName() || 'DJ';
    this.todayStatus = await this.availability.getAvailability(this.auth.getCurrentDj() || 'guest-dj', this.today);
  }
}
