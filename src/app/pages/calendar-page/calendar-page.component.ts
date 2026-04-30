import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvailabilityService, Availability } from '../../services/availability.service';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

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

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </header>

        <section class="surface mt-7 card-pad">
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

          <div class="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-slate-400">
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
        </section>

        <section class="surface-strong mt-4 card-pad">
          <label class="block">
            <span class="field-label">{{ t('eventDate') }}</span>
            <input id="date" [(ngModel)]="selectedDate" (ngModelChange)="loadCalendar()" type="date" class="field-input" />
          </label>

          <div class="mt-5 grid grid-cols-2 gap-3">
            <button type="button" (click)="setStatus('AVAILABLE')" class="primary-action px-3">
              {{ t('available') }}
            </button>
            <button type="button" (click)="setStatus('NOT_AVAILABLE')" class="secondary-action px-3">
              {{ t('notAvailable') }}
            </button>
          </div>

          <p class="mt-5 text-sm text-slate-300">
            {{ t('statusSaved') }}:
            <strong class="text-white">{{ statusLabel(currentStatus) }}</strong>
          </p>
        </section>
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
export class CalendarPageComponent {
  selectedDate = new Date().toISOString().slice(0, 10);
  status: Availability = 'AVAILABLE';
  visibleMonth = new Date();
  currentStatus: Availability | null = null;
  days: CalendarDay[] = [];

  constructor(
    private availability: AvailabilityService,
    private auth: AuthService,
    private router: Router,
    public i18n: I18nService
  ) {
    this.loadCalendar();
  }

  async setStatus(status: Availability): Promise<void> {
    this.status = status;
    await this.availability.setAvailability(this.djId, this.selectedDate, status);
    await this.loadCalendar();
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

  async loadCalendar(): Promise<void> {
    this.currentStatus = await this.availability.getAvailability(this.djId, this.selectedDate);
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
    await this.loadCalendar();
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
}
