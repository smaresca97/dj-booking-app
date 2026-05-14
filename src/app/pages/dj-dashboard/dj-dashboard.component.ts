import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AvailabilityService } from '../../services/availability.service';
import { DjService } from '../../services/dj.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { BookingRequest, BookingRequestService } from '../../services/booking-request.service';
import { VenueAssignmentService } from '../../services/venue-assignment.service';

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

          <div class="header-actions">
            <a *ngIf="isAdmin" routerLink="/admin" class="top-admin-link">{{ t('adminNav') }}</a>
            <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
          </div>
        </header>

        <section class="next-step-panel mt-7">
          <div class="next-step-mark" aria-hidden="true"></div>
          <div class="min-w-0">
            <p class="page-kicker">{{ t('nextStep') }}</p>
            <h2 class="status-text mt-2 text-2xl font-black">{{ todayStatus ? t('availabilityVisible') : t('calendarNeededTitle') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('calendarNeededCopy') }}</p>
          </div>
          <a routerLink="/calendar" class="primary-action grid place-items-center no-underline px-4">
            {{ t('manageCalendar') }}
          </a>
        </section>

        <section class="surface-strong card-pad mt-5" *ngIf="pendingRequests.length || acceptedRequests.length">
          <div class="results-heading">
            <div class="min-w-0">
              <p class="page-kicker">{{ t('bookingRequests') }}</p>
              <h2 class="status-text mt-1 text-2xl font-black">{{ t('bookingRequestsTitle') }}</h2>
            </div>
            <span class="results-count">{{ pendingRequests.length }}</span>
          </div>

          <div class="mt-4 grid gap-3" *ngIf="pendingRequests.length">
            <article class="booking-request-card" *ngFor="let request of pendingRequests">
              <div class="min-w-0">
                <p class="booking-request-date">{{ formatDate(request.date) }}</p>
                <h3 class="status-text mt-1 text-xl font-black">{{ request.clientName }}</h3>
                <p class="mt-1 text-sm text-slate-300">{{ request.type }} · {{ request.from || '-' }} - {{ request.to || '-' }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ request.place }}</p>
              </div>

              <div class="booking-request-actions">
                <button type="button" class="primary-action" (click)="acceptRequest(request)">{{ t('acceptRequest') }}</button>
                <button type="button" class="secondary-action" (click)="rejectRequest(request)">{{ t('rejectRequest') }}</button>
                <a class="secondary-action grid place-items-center no-underline" [href]="requestWhatsappUrl(request)" target="_blank" rel="noopener">
                  {{ t('openWhatsapp') }}
                </a>
              </div>
            </article>
          </div>

          <div class="mt-4 grid gap-3" *ngIf="acceptedRequests.length">
            <p class="page-kicker">{{ t('acceptedRequests') }}</p>
            <article class="booking-request-card booking-request-card-accepted" *ngFor="let request of acceptedRequests">
              <div class="min-w-0">
                <p class="booking-request-date">{{ formatDate(request.date) }}</p>
                <h3 class="status-text mt-1 text-lg font-black">{{ request.clientName }}</h3>
                <p class="mt-1 text-sm text-slate-300">{{ request.type }} · {{ request.from || '-' }} - {{ request.to || '-' }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ request.place }}</p>
              </div>
              <a class="secondary-action grid place-items-center no-underline" [href]="requestWhatsappUrl(request)" target="_blank" rel="noopener">
                {{ t('openWhatsapp') }}
              </a>
            </article>
          </div>
        </section>

        <div class="action-grid mt-5">
          <article class="surface card-pad dashboard-status-card">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm text-slate-400">{{ t('todayStatus') }}</p>
              <span
                class="status-pill"
                [class.status-pill-good]="todayStatus === 'AVAILABLE'"
                [class.status-pill-bad]="todayStatus === 'NOT_AVAILABLE'"
              >
                {{ statusLabel(todayStatus) }}
              </span>
            </div>
            <button type="button" class="primary-action mt-5 w-full" (click)="setTodayAvailable()">
              {{ t('setTodayAvailable') }}
            </button>
          </article>

          <a routerLink="/profile" class="surface card-pad block no-underline hover:border-cyan-300">
            <p class="text-sm text-slate-400">{{ t('quickActions') }}</p>
            <h2 class="status-text mt-3 text-xl font-black text-white sm:text-2xl">{{ t('editProfile') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('profileVisible') }}</p>
          </a>

          <a routerLink="/calendar" class="surface card-pad block no-underline hover:border-cyan-300">
            <p class="text-sm text-slate-400">{{ t('quickActions') }}</p>
            <h2 class="status-text mt-3 text-xl font-black text-white sm:text-2xl">{{ t('manageCalendar') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('availabilitySubtitle') }}</p>
          </a>

          <a *ngIf="isAdmin" routerLink="/search" class="surface card-pad block no-underline hover:border-cyan-300">
            <p class="text-sm text-slate-400">{{ t('quickActions') }}</p>
            <h2 class="status-text mt-3 text-xl font-black text-white sm:text-2xl">{{ t('findArtists') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('bookingsSubtitle') }}</p>
          </a>
        </div>
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
export class DjDashboardComponent {
  private readonly today = new Date().toISOString().slice(0, 10);
  djName = 'DJ';
  todayStatus: 'AVAILABLE' | 'NOT_AVAILABLE' | null = null;
  requests: BookingRequest[] = [];

  constructor(
    private auth: AuthService,
    private availability: AvailabilityService,
    private djService: DjService,
    private router: Router,
    private toast: ToastService,
    private bookingRequests: BookingRequestService,
    private venueAssignments: VenueAssignmentService,
    public i18n: I18nService
  ) {
    this.loadDashboard();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  async setTodayAvailable(): Promise<void> {
    try {
      await this.availability.setAvailability(this.auth.getCurrentDj() || 'guest-dj', this.today, 'AVAILABLE');
      await this.loadDashboard();
      this.toast.success(this.t('toastAvailabilitySaved'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  get pendingRequests(): BookingRequest[] {
    return this.requests.filter((request) => request.status === 'pending');
  }

  get acceptedRequests(): BookingRequest[] {
    return this.requests.filter((request) => request.status === 'accepted').slice(0, 4);
  }

  async acceptRequest(request: BookingRequest): Promise<void> {
    try {
      await this.bookingRequests.acceptRequest(request.id);
      await this.availability.setAvailability(this.auth.getCurrentDj() || 'guest-dj', request.date, 'NOT_AVAILABLE');
      await this.saveVenueAssignmentIfNeeded(request);
      await this.loadDashboard();
      this.toast.success(this.t('toastBookingAccepted'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async rejectRequest(request: BookingRequest): Promise<void> {
    try {
      await this.bookingRequests.rejectRequest(request.id);
      await this.loadDashboard();
      this.toast.success(this.t('toastBookingRejected'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  requestWhatsappUrl(request: BookingRequest): string {
    const phone = request.clientPhone.replace(/[^\d+]/g, '');
    const message = [
      `Ciao ${request.clientName}, ti scrivo per la richiesta del ${this.formatDate(request.date)}.`,
      `Evento: ${request.type}`,
      `Orario: ${request.from || '-'} - ${request.to || '-'}`,
      `Luogo: ${request.place}`
    ].join('\n');

    return `https://wa.me/${phone.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`;
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(`${date}T12:00:00`));
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
    const djId = this.auth.getCurrentDj();
    const profile = await this.djService.getProfile(djId);
    this.djName = profile?.stageName || this.auth.getCurrentName() || 'DJ';
    this.todayStatus = await this.availability.getAvailability(djId || 'guest-dj', this.today);
    this.requests = djId ? await this.bookingRequests.getRequestsForDj(djId) : [];
  }

  private async saveVenueAssignmentIfNeeded(request: BookingRequest): Promise<void> {
    if (!request.venueUserId) {
      return;
    }

    await this.venueAssignments.saveAssignment({
      id: `booking_${request.id}`,
      venue: request.place,
      venueUserId: request.venueUserId,
      venueUserName: request.venueUserName || request.place,
      date: request.date,
      from: request.from,
      to: request.to,
      djType: 'registered',
      djId: request.djId,
      djName: request.djName,
      notes: `${request.type} · ${request.clientName} · ${request.clientPhone}`
    });
  }
}
