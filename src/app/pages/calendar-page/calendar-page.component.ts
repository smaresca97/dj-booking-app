import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvailabilityService, Availability } from '../../services/availability.service';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { BookingRequest, BookingRequestService } from '../../services/booking-request.service';

interface CalendarDay {
  date: string;
  day: number;
  inMonth: boolean;
  status: Availability | null;
}

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <main class="app-page">
      <section class="app-container-narrow">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('calendar') }}</p>
            <h1 class="page-title">{{ t('availability') }}</h1>
            <p class="page-copy">{{ t('availabilitySubtitle') }}</p>
          </div>

          <div class="header-actions">
            <a *ngIf="isAdmin" routerLink="/admin" class="top-admin-link">{{ t('adminNav') }}</a>
            <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
          </div>
        </header>

        <section class="calendar-help-panel mt-7">
          <div>
            <p class="page-kicker">{{ t('calendarHowToTitle') }}</p>
            <p class="mt-2 text-sm text-slate-300">{{ t('calendarHowToCopy') }}</p>
          </div>
        </section>

        <section class="surface mt-5 card-pad">
          <div class="flex items-center justify-between gap-3">
            <button type="button" class="secondary-action px-3" (click)="moveMonth(-1)" [attr.aria-label]="t('previousMonth')">
              ‹
            </button>
            <div class="min-w-0 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{{ t('thisMonth') }}</p>
              <h2 class="status-text mt-1 text-xl font-black">{{ monthTitle }}</h2>
            </div>
            <button type="button" class="secondary-action px-3" (click)="moveMonth(1)" [attr.aria-label]="t('nextMonth')">
              ›
            </button>
          </div>

          <div class="calendar-control-panel mt-4">
            <div class="calendar-status-row">
              <div class="calendar-selected-info">
                <div class="selected-day-heading">
                <p class="field-label">{{ t('selectedDay') }}</p>
                  <span
                    class="selected-day-status"
                    [class.selected-day-status-available]="currentStatus === 'AVAILABLE'"
                    [class.selected-day-status-busy]="currentStatus === 'NOT_AVAILABLE'"
                  >
                    {{ statusLabel(currentStatus) }}
                  </span>
                </div>
                <p class="selected-day-date">{{ selectedDateLabel }}</p>
              </div>
            </div>

            <div class="calendar-button-row mt-3">
              <button type="button" (click)="setStatus('AVAILABLE')" class="primary-action px-3">
                {{ t('available') }}
              </button>
              <button type="button" (click)="setStatus('NOT_AVAILABLE')" class="secondary-action px-3">
                {{ t('notAvailable') }}
              </button>
            </div>

            <button
              type="button"
              class="month-quick-button"
              (click)="setWholeMonthAvailable()"
              [disabled]="isSavingMonth"
            >
              {{ isSavingMonth ? t('savingMonth') : t('availableWholeMonth') }}
            </button>

            <p *ngIf="saveError" class="mt-3 text-sm font-bold text-pink-300">
              {{ t('availabilitySaveError') }}
            </p>
          </div>

          <section class="day-bookings-panel mt-4" *ngIf="acceptedBookings.length">
            <p class="page-kicker">{{ t('dayBookings') }}</p>
            <article class="day-booking-row" *ngFor="let booking of acceptedBookings">
              <div class="min-w-0" *ngIf="editingBookingId !== booking.id; else editBookingForm">
                <h3 class="status-text text-base font-black">{{ booking.clientName }}</h3>
                <p class="mt-1 text-sm text-slate-300">{{ booking.type }} · {{ booking.from || '-' }} - {{ booking.to || '-' }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ booking.place }}</p>
              </div>

              <ng-template #editBookingForm>
                <div class="booking-edit-grid">
                  <label>
                    <span class="field-label">{{ t('clientName') }}</span>
                    <input class="field-input" [(ngModel)]="bookingEdit.clientName" name="bookingClientName" />
                  </label>
                  <label>
                    <span class="field-label">{{ t('clientPhone') }}</span>
                    <input class="field-input" [(ngModel)]="bookingEdit.clientPhone" name="bookingClientPhone" />
                  </label>
                  <label>
                    <span class="field-label">{{ t('fromTime') }}</span>
                    <input class="field-input" type="time" [(ngModel)]="bookingEdit.from" name="bookingFrom" />
                  </label>
                  <label>
                    <span class="field-label">{{ t('toTime') }}</span>
                    <input class="field-input" type="time" [(ngModel)]="bookingEdit.to" name="bookingTo" />
                  </label>
                  <label>
                    <span class="field-label">{{ t('eventType') }}</span>
                    <input class="field-input" [(ngModel)]="bookingEdit.type" name="bookingType" />
                  </label>
                  <label>
                    <span class="field-label">{{ t('eventPlace') }}</span>
                    <input class="field-input" [(ngModel)]="bookingEdit.place" name="bookingPlace" />
                  </label>
                </div>
              </ng-template>

              <div class="booking-request-actions">
                <ng-container *ngIf="editingBookingId === booking.id; else bookingViewActions">
                  <button type="button" class="primary-action" (click)="saveBookingEdit(booking)">{{ t('saveChanges') }}</button>
                  <button type="button" class="secondary-action" (click)="cancelBookingEdit()">{{ t('cancelEdit') }}</button>
                </ng-container>
                <ng-template #bookingViewActions>
                  <button type="button" class="secondary-action" (click)="startBookingEdit(booking)">{{ t('editAssignment') }}</button>
                  <button type="button" class="secondary-action" (click)="cancelAcceptedBooking(booking)">{{ t('cancelBooking') }}</button>
                </ng-template>
              </div>
            </article>
          </section>

          <div class="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-slate-400">
            <span *ngFor="let dayName of weekDays">{{ dayName }}</span>
          </div>

          <div class="mt-2 grid grid-cols-7 gap-1">
            <button
              type="button"
              *ngFor="let day of days"
              class="calendar-day"
              [class.calendar-muted]="!day.inMonth"
              [class.calendar-selected]="day.date === selectedDate"
              [class.calendar-available]="day.status === 'AVAILABLE'"
              [class.calendar-busy]="day.status === 'NOT_AVAILABLE'"
              (click)="selectDate(day.date)"
            >
              <span>{{ day.day }}</span>
            </button>
          </div>

          <div class="calendar-legend mt-5">
            <span><i class="legend-dot legend-dot-available"></i>{{ t('calendarLegendAvailable') }}</span>
            <span><i class="legend-dot legend-dot-busy"></i>{{ t('calendarLegendBusy') }}</span>
            <span><i class="legend-dot legend-dot-empty"></i>{{ t('calendarLegendEmpty') }}</span>
          </div>
        </section>
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
export class CalendarPageComponent {
  selectedDate = new Date().toISOString().slice(0, 10);
  status: Availability = 'AVAILABLE';
  visibleMonth = new Date();
  currentStatus: Availability | null = null;
  days: CalendarDay[] = [];
  saveError = false;
  isSavingMonth = false;
  acceptedBookings: BookingRequest[] = [];
  editingBookingId = '';
  bookingEdit = this.createBookingEdit();

  constructor(
    private availability: AvailabilityService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private bookingRequests: BookingRequestService,
    public i18n: I18nService
  ) {
    this.loadCalendar();
  }

  async setStatus(status: Availability): Promise<void> {
    this.status = status;
    this.saveError = false;

    try {
      await this.availability.setAvailability(this.djId, this.selectedDate, status);
      await this.loadCalendar();
      this.toast.success(this.t('toastAvailabilitySaved'));
    } catch {
      this.saveError = true;
      this.currentStatus = await this.availability.getAvailability(this.djId, this.selectedDate);
      this.toast.error(this.t('availabilitySaveError'));
    }
  }

  async setWholeMonthAvailable(): Promise<void> {
    this.saveError = false;
    this.isSavingMonth = true;

    try {
      await Promise.all(
        this.currentMonthDates().map((date) => this.availability.setAvailability(this.djId, date, 'AVAILABLE'))
      );
      await this.loadCalendar();
      this.toast.success(this.t('toastMonthAvailabilitySaved'));
    } catch {
      this.saveError = true;
      this.toast.error(this.t('availabilitySaveError'));
    } finally {
      this.isSavingMonth = false;
    }
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get monthTitle(): string {
    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      month: 'long',
      year: 'numeric'
    }).format(this.visibleMonth);
  }

  get weekDays(): string[] {
    return this.i18n.language() === 'it'
      ? ['L', 'M', 'M', 'G', 'V', 'S', 'D']
      : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  }

  get selectedDateLabel(): string {
    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(`${this.selectedDate}T12:00:00`));
  }

  async loadCalendar(): Promise<void> {
    this.currentStatus = await this.availability.getAvailability(this.djId, this.selectedDate);
    this.acceptedBookings = await this.bookingRequests.getAcceptedRequestsForDate(this.djId, this.selectedDate);
    const year = this.visibleMonth.getFullYear();
    const month = this.visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - startOffset);

    this.days = await Promise.all(Array.from({ length: 42 }, async (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const value = this.toDateInputValue(date);

      return {
        date: value,
        day: date.getDate(),
        inMonth: date.getMonth() === month,
        status: await this.availability.getAvailability(this.djId, value)
      };
    }));
  }

  async selectDate(date: string): Promise<void> {
    this.selectedDate = date;
    this.cancelBookingEdit();
    await this.loadCalendar();
  }

  startBookingEdit(booking: BookingRequest): void {
    this.editingBookingId = booking.id;
    this.bookingEdit = {
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      date: booking.date,
      from: booking.from,
      to: booking.to,
      type: booking.type,
      place: booking.place
    };
  }

  cancelBookingEdit(): void {
    this.editingBookingId = '';
    this.bookingEdit = this.createBookingEdit();
  }

  async saveBookingEdit(booking: BookingRequest): Promise<void> {
    try {
      await this.bookingRequests.updateRequest(booking.id, {
        ...this.bookingEdit,
        date: booking.date
      });
      this.cancelBookingEdit();
      await this.loadCalendar();
      this.toast.success(this.t('toastBookingUpdated'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async cancelAcceptedBooking(booking: BookingRequest): Promise<void> {
    try {
      await this.bookingRequests.cancelRequest(booking.id);
      const remainingBookings = (await this.bookingRequests.getAcceptedRequestsForDate(this.djId, booking.date))
        .filter((item) => item.id !== booking.id);

      if (remainingBookings.length === 0) {
        await this.availability.setAvailability(this.djId, booking.date, 'AVAILABLE');
      }

      await this.loadCalendar();
      this.toast.success(this.t('toastBookingCancelled'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async moveMonth(direction: number): Promise<void> {
    this.visibleMonth = new Date(this.visibleMonth.getFullYear(), this.visibleMonth.getMonth() + direction, 1);
    await this.loadCalendar();
  }

  statusLabel(status: Availability | null): string {
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

  private get djId(): string {
    return this.auth.getCurrentDj() || 'guest-dj';
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private currentMonthDates(): string[] {
    const year = this.visibleMonth.getFullYear();
    const month = this.visibleMonth.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => this.toDateInputValue(new Date(year, month, index + 1)));
  }

  private createBookingEdit() {
    return {
      clientName: '',
      clientPhone: '',
      date: '',
      from: '',
      to: '',
      type: '',
      place: ''
    };
  }
}
