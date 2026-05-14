import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';
import { VenueAssignment, VenueAssignmentService } from '../../services/venue-assignment.service';

@Component({
  selector: 'app-venue-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="app-page">
      <section class="app-container">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('venueArea') }}</p>
            <h1 class="page-title">{{ t('venueDashboardTitle') }}</h1>
            <p class="page-copy">{{ t('venueDashboardSubtitle') }}</p>
          </div>

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </header>

        <section class="admin-overview-grid mt-7">
          <article class="surface-strong card-pad admin-overview-card admin-overview-card-primary">
            <p class="page-kicker">{{ t('scheduledAssignments') }}</p>
            <h2 class="status-text mt-2 text-2xl font-black">{{ upcomingAssignments.length }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('venueDashboardCopy') }}</p>
          </article>

          <article class="surface card-pad admin-overview-card">
            <p class="page-kicker">{{ t('nextNight') }}</p>
            <h2 class="status-text mt-2 text-xl font-black">{{ nextAssignment?.venue || '-' }}</h2>
            <p class="mt-2 text-sm text-slate-300" *ngIf="nextAssignment">
              {{ formatDate(nextAssignment.date) }} · {{ nextAssignment.djName }}
            </p>
          </article>
        </section>

        <section class="mt-7">
          <div class="results-heading">
            <div class="min-w-0">
              <p class="page-kicker">{{ t('venueCalendar') }}</p>
              <h2 class="status-text mt-1 text-2xl font-black">{{ t('scheduledAssignments') }}</h2>
              <p class="mt-2 text-sm text-slate-400">{{ t('venueCalendarCopy') }}</p>
            </div>
            <span class="results-count">{{ assignments().length }}</span>
          </div>

          <section class="empty-state mt-4" *ngIf="assignments().length === 0">
            <div class="empty-state-icon">0</div>
            <div class="min-w-0">
              <h3>{{ t('noAssignments') }}</h3>
              <p>{{ t('venueCalendarCopy') }}</p>
            </div>
          </section>

          <div class="mt-4 grid gap-3">
            <article class="surface card-pad assignment-row" *ngFor="let assignment of assignments()">
              <div class="min-w-0">
                <p class="page-kicker">{{ formatDate(assignment.date) }}</p>
                <h3 class="status-text mt-2 text-xl font-black">{{ assignment.djName }}</h3>
                <p class="mt-2 text-sm text-slate-300">{{ assignment.venue }} · {{ assignment.from || '-' }} - {{ assignment.to || '-' }}</p>
                <p class="mt-3 text-sm text-slate-400" *ngIf="assignment.notes">{{ assignment.notes }}</p>
              </div>
            </article>
          </div>
        </section>
      </section>

      <nav class="bottom-nav bottom-nav-venue" aria-label="Venue navigation">
        <a class="active" data-nav="venues"><span>{{ t('venueCalendar') }}</span></a>
        <button type="button" (click)="logout()" data-nav="exit"><span>{{ t('logout') }}</span></button>
      </nav>
    </main>
  `
})
export class VenueDashboardPageComponent {
  assignments = signal<VenueAssignment[]>([]);

  constructor(
    private auth: AuthService,
    private assignmentsService: VenueAssignmentService,
    private router: Router,
    public i18n: I18nService
  ) {
    this.loadAssignments();
  }

  get upcomingAssignments(): VenueAssignment[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.assignments()
      .filter((assignment) => assignment.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  get nextAssignment(): VenueAssignment | null {
    return this.upcomingAssignments[0] ?? null;
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(`${date}T12:00:00`));
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }

  private async loadAssignments(): Promise<void> {
    const venueId = this.auth.getCurrentVenue();
    this.assignments.set(venueId ? await this.assignmentsService.getAssignmentsForVenue(venueId) : []);
  }
}
