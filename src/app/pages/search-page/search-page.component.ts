import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DjService } from '../../services/dj.service';
import { AvailabilityService } from '../../services/availability.service';
import { DjCardComponent, DjCardViewModel } from '../../components/dj-card/dj-card.component';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { BookingRequestService } from '../../services/booking-request.service';
import { ManagedUser } from '../../services/auth.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, DjCardComponent],
  template: `
    <main class="app-page search-page">
      <section class="app-container">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('search') }}</p>
            <h1 class="page-title">{{ t('bookingsTitle') }}</h1>
            <p class="page-copy">{{ t('bookingsSubtitle') }}</p>
          </div>

          <div class="header-actions">
            <a *ngIf="isAdmin" routerLink="/admin" class="top-admin-link">{{ t('adminNav') }}</a>
            <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
          </div>
        </header>

        <section class="search-date-panel mt-7">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('searchPanelTitle') }}</p>
            <p class="mt-2 text-sm text-slate-300">{{ t('searchPanelCopy') }}</p>
          </div>

          <label class="block">
            <span class="field-label">{{ t('eventDate') }}</span>
            <input id="search-date" [(ngModel)]="selectedDate" (ngModelChange)="loadResults()" type="date" class="field-input" />
          </label>
        </section>

        <div class="results-heading mt-7">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('availableDjsForDate') }}</p>
            <h2 class="status-text mt-1 text-2xl font-black">{{ formattedSelectedDate }}</h2>
          </div>
          <span class="results-count">{{ results.length }}</span>
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <app-dj-card *ngFor="let dj of results" [dj]="dj" (selected)="openDetails($event)" />
        </div>

        <section *ngIf="results.length === 0" class="empty-state mt-4">
          <div class="empty-state-icon">0</div>
          <div class="min-w-0">
            <h3>{{ t('noAvailableDjs') }}</h3>
            <p>{{ t('changeDateHint') }}</p>
          </div>
        </section>
      </section>

      <nav class="bottom-nav" aria-label="Main navigation">
        <a *ngIf="isAdmin" routerLink="/assignments" routerLinkActive="active" data-nav="venues"><span>{{ t('artDirectionNav') }}</span></a>
        <a *ngIf="isDj" routerLink="/dashboard" routerLinkActive="active" data-nav="home"><span>{{ t('dashboardNav') }}</span></a>
        <a *ngIf="isDj" routerLink="/calendar" routerLinkActive="active" data-nav="calendar" [attr.aria-label]="t('calendar')">
          <svg class="calendar-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
          </svg>
          <span class="sr-only">{{ t('calendar') }}</span>
        </a>
        <a routerLink="/search" routerLinkActive="active" data-nav="search"><span>{{ t('search') }}</span></a>
        <button type="button" (click)="logout()" data-nav="exit"><span>{{ t('logout') }}</span></button>
      </nav>

      <div class="modal-backdrop" *ngIf="selectedDj" (click)="closeDetails()">
        <section class="modal-panel surface-strong" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="booking-modal-body">
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div class="dj-result-photo">
                  <img *ngIf="selectedDj.photoUrl" [src]="selectedDj.photoUrl" alt="" />
                  <span *ngIf="!selectedDj.photoUrl">{{ selectedDj.avatar }}</span>
                </div>
                <div class="min-w-0">
                  <p class="page-kicker">{{ t('contactDj') }}</p>
                  <h2 class="status-text mt-2 text-2xl font-black">{{ selectedDj.stageName }}</h2>
                  <p class="mt-2 text-sm text-slate-300">{{ selectedDj.city }}</p>
                </div>
              </div>
              <button type="button" class="icon-pill" (click)="closeDetails()" [attr.aria-label]="t('close')">×</button>
            </div>

            <div class="booking-modal-grid mt-6">
              <aside class="dj-info-panel">
                <p *ngIf="selectedDj.genres"><strong class="text-white">{{ t('genres') }}:</strong> {{ selectedDj.genres }}</p>
                <p *ngIf="selectedDj.bio"><strong class="text-white">{{ t('bio') }}:</strong> {{ selectedDj.bio }}</p>
                <p><strong class="text-white">{{ t('phone') }}:</strong> {{ selectedDj.phone }}</p>
              </aside>

              <section class="booking-request-panel">
                <div>
                  <p class="page-kicker">{{ t('bookingRequest') }}</p>
                  <p class="mt-2 text-sm text-slate-300">{{ t('bookingRequestSubtitle') }}</p>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <label class="block">
                    <span class="field-label">{{ t('eventDate') }}</span>
                    <input [(ngModel)]="booking.date" name="bookingDate" type="date" class="field-input" />
                  </label>

                  <label class="block">
                    <span class="field-label">{{ t('eventType') }}</span>
                    <select [(ngModel)]="booking.type" name="bookingType" class="field-input">
                      <option *ngFor="let type of eventTypes" [value]="type">{{ type }}</option>
                    </select>
                  </label>

                  <label class="block">
                    <span class="field-label">{{ t('fromTime') }}</span>
                    <input [(ngModel)]="booking.from" name="bookingFrom" type="time" class="field-input" />
                  </label>

                  <label class="block">
                    <span class="field-label">{{ t('toTime') }}</span>
                    <input [(ngModel)]="booking.to" name="bookingTo" type="time" class="field-input" />
                  </label>
                </div>

                <label class="mt-3 block">
                  <span class="field-label">{{ t('eventPlace') }}</span>
                  <div class="assignment-type-switch mt-2" *ngIf="isAdmin">
                    <button type="button" [class.admin-filter-active]="placeMode === 'registered'" (click)="setPlaceMode('registered')">
                      {{ t('registeredVenue') }}
                    </button>
                    <button type="button" [class.admin-filter-active]="placeMode === 'manual'" (click)="setPlaceMode('manual')">
                      {{ t('manualPlace') }}
                    </button>
                  </div>

                  <select
                    *ngIf="isAdmin && placeMode === 'registered'"
                    [(ngModel)]="booking.venueUserId"
                    name="bookingVenueUserId"
                    class="field-input mt-3"
                    (ngModelChange)="syncVenuePlace()"
                  >
                    <option value="">{{ venues.length ? t('selectVenue') : t('noRegisteredVenues') }}</option>
                    <option *ngFor="let venue of venues" [value]="venue.id">{{ venue.name || venue.email }}</option>
                  </select>

                  <input
                    *ngIf="!isAdmin || placeMode === 'manual'"
                    [(ngModel)]="booking.place"
                    name="bookingPlace"
                    class="field-input mt-3"
                    autocomplete="street-address"
                  />
                </label>

                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  <label class="block">
                    <span class="field-label">{{ t('clientName') }}</span>
                    <input [(ngModel)]="booking.clientName" name="bookingClientName" class="field-input" autocomplete="name" />
                  </label>

                  <label class="block">
                    <span class="field-label">{{ t('clientPhone') }}</span>
                    <input [(ngModel)]="booking.clientPhone" name="bookingClientPhone" class="field-input" autocomplete="tel" inputmode="tel" />
                  </label>
                </div>
              </section>
            </div>
          </div>

          <div class="booking-modal-actions">
            <button type="button" class="primary-action" (click)="sendInAppRequest(selectedDj)">
              {{ t('sendBookingRequest') }}
            </button>
            <a class="secondary-action grid place-items-center no-underline" [href]="whatsappUrl(selectedDj)" target="_blank" rel="noopener">
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
  venues: ManagedUser[] = [];
  placeMode: 'registered' | 'manual' = 'manual';
  booking = this.createBooking();

  constructor(
    private djService: DjService,
    private availability: AvailabilityService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private bookingRequests: BookingRequestService,
    public i18n: I18nService
  ) {
    this.djService.registerCurrentUser(this.auth.getCurrentUser());
    if (this.auth.isDj() && !this.auth.isAdmin()) {
      this.router.navigateByUrl('/dashboard');
      return;
    }

    this.loadResults();
    this.loadVenues();
  }

  async loadResults(): Promise<void> {
    const djs = await this.djService.getDjs();
    const availableDjIds = new Set(await this.availability.getAvailableDjs(this.selectedDate, djs.map((dj) => dj.id)));
    const results = djs
      .filter((dj) => availableDjIds.has(dj.id))
      .map((dj) => ({
        ...dj,
        status: 'AVAILABLE' as const
      }))
      .filter((dj) => dj.status === 'AVAILABLE');

    this.results = results.sort((a, b) => this.statusWeight(a.status) - this.statusWeight(b.status));
  }

  get isDj(): boolean {
    return this.auth.isDj();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get eventTypes(): string[] {
    return [
      this.t('eventTypeBirthday'),
      this.t('eventTypeParty'),
      this.t('eventTypeWedding'),
      this.t('eventTypeClub'),
      this.t('eventTypeCorporate'),
      this.t('eventTypeOther')
    ];
  }

  get formattedSelectedDate(): string {
    return this.formatDate(this.selectedDate);
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
    this.booking = this.createBooking();
    this.placeMode = this.isAdmin && this.venues.length ? 'registered' : 'manual';
  }

  setPlaceMode(mode: 'registered' | 'manual'): void {
    this.placeMode = mode;
    this.booking.venueUserId = '';
    this.booking.venueUserName = '';
    this.booking.place = '';
  }

  syncVenuePlace(): void {
    const venue = this.venues.find((item) => item.id === this.booking.venueUserId);
    this.booking.venueUserName = venue?.name || venue?.email || '';
    this.booking.place = this.booking.venueUserName;
  }

  closeDetails(): void {
    this.selectedDj = null;
  }

  whatsappUrl(dj: DjCardViewModel): string {
    const phone = dj.phone.replace(/[^\d+]/g, '');
    const message = [
      `Ciao ${dj.stageName}, vorrei prenotarti per questa data.`,
      `Data: ${this.formatDate(this.booking.date)}`,
      `Orario: ${this.booking.from || '-'} - ${this.booking.to || '-'}`,
      `Tipo evento: ${this.booking.type || '-'}`,
      `Luogo: ${this.booking.place || '-'}`,
      '',
      'Sei disponibile?'
    ].join('\n');

    return `https://wa.me/${phone.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`;
  }

  copyPhone(phone: string): void {
    navigator.clipboard?.writeText(phone);
    this.copied = true;
    this.toast.success(this.t('toastCopied'));
  }

  async sendInAppRequest(dj: DjCardViewModel): Promise<void> {
    if (!this.booking.clientName.trim() || !this.booking.clientPhone.trim() || !this.booking.place.trim()) {
      this.toast.error(this.t('bookingRequestError'));
      return;
    }

    try {
      await this.bookingRequests.createRequest({
        djId: dj.id,
        djName: dj.stageName,
        venueUserId: this.booking.venueUserId,
        venueUserName: this.booking.venueUserName,
        clientName: this.booking.clientName.trim(),
        clientPhone: this.booking.clientPhone.trim(),
        date: this.booking.date,
        from: this.booking.from,
        to: this.booking.to,
        type: this.booking.type,
        place: this.booking.place.trim()
      });
      this.toast.success(this.t('toastBookingRequestSent'));
      this.closeDetails();
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }

  private createBooking() {
    return {
      date: this.selectedDate,
      from: '',
      to: '',
      type: this.t('eventTypeBirthday'),
      place: '',
      venueUserId: '',
      venueUserName: '',
      clientName: '',
      clientPhone: ''
    };
  }

  private async loadVenues(): Promise<void> {
    if (!this.auth.isAdmin()) {
      return;
    }

    this.venues = (await this.auth.getUsers('approved')).filter((user) => user.role === 'venue');
  }

  private formatDate(date: string): string {
    if (!date) {
      return '-';
    }

    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(`${date}T12:00:00`));
  }
}
