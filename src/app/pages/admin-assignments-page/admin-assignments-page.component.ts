import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, ManagedUser } from '../../services/auth.service';
import { AvailabilityService } from '../../services/availability.service';
import { DjProfile, DjService } from '../../services/dj.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { AssignmentDjType, VenueAssignment, VenueAssignmentForm, VenueAssignmentService } from '../../services/venue-assignment.service';

@Component({
  selector: 'app-admin-assignments-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <main class="app-page">
      <section class="app-container">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('artDirection') }}</p>
            <h1 class="page-title">{{ t('venueAssignmentsTitle') }}</h1>
            <p class="page-copy">{{ t('venueAssignmentsSubtitle') }}</p>
          </div>

          <div class="header-actions">
            <a routerLink="/admin" class="top-admin-link">{{ t('adminNav') }}</a>
            <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
          </div>
        </header>

        <section class="admin-overview-grid mt-7">
          <article class="surface-strong card-pad admin-overview-card admin-overview-card-primary">
            <p class="page-kicker">{{ t('venueOperations') }}</p>
            <h2 class="status-text mt-2 text-2xl font-black">{{ t('venueControlRoom') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('venueControlRoomCopy') }}</p>
            <div class="admin-metric-grid mt-5">
              <div class="admin-metric">
                <span>{{ t('scheduledAssignments') }}</span>
                <strong>{{ assignments().length }}</strong>
              </div>
              <div class="admin-metric">
                <span>{{ t('approvedVenues') }}</span>
                <strong>{{ venues().length }}</strong>
              </div>
              <div class="admin-metric">
                <span>{{ t('availableDjs') }}</span>
                <strong>{{ djs().length }}</strong>
              </div>
            </div>
          </article>

          <article class="surface card-pad admin-overview-card">
            <p class="page-kicker">{{ t('selectedDay') }}</p>
            <h2 class="status-text mt-2 text-xl font-black">{{ formatDate(form.date) }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('assignmentDjAvailabilityHint') }}</p>
          </article>
        </section>

        <form class="surface-strong mt-5 card-pad" (ngSubmit)="saveAssignment()">
          <div class="form-section-heading">
            <div class="min-w-0">
              <p class="page-kicker">{{ form.id ? t('editAssignment') : t('assignmentFormTitle') }}</p>
              <p class="mt-2 text-sm text-slate-300">{{ form.id ? t('editAssignmentHint') : t('assignmentSavedHint') }}</p>
            </div>

            <button *ngIf="form.id" type="button" class="secondary-action px-4" (click)="resetForm()">
              {{ t('cancelEdit') }}
            </button>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="field-label">{{ t('venueName') }}</span>
              <input [(ngModel)]="form.venue" name="venue" class="field-input" [placeholder]="t('venueNamePlaceholder')" />
            </label>

            <label class="block">
              <span class="field-label">{{ t('linkedVenueAccount') }}</span>
              <select [(ngModel)]="form.venueUserId" name="venueUserId" class="field-input" (ngModelChange)="syncVenueUserName()">
                <option value="">{{ t('noLinkedVenue') }}</option>
                <option *ngFor="let venue of venues()" [value]="venue.id">{{ venue.name || venue.email }}</option>
              </select>
            </label>

            <label class="block">
              <span class="field-label">{{ t('eventDate') }}</span>
              <input [(ngModel)]="form.date" (ngModelChange)="loadAvailableDjs()" name="date" type="date" class="field-input" />
            </label>

            <label class="block">
              <span class="field-label">{{ t('fromTime') }}</span>
              <input [(ngModel)]="form.from" name="from" type="time" class="field-input" />
            </label>

            <label class="block">
              <span class="field-label">{{ t('toTime') }}</span>
              <input [(ngModel)]="form.to" name="to" type="time" class="field-input" />
            </label>
          </div>

          <div class="assignment-type-switch mt-5">
            <button type="button" [class.admin-filter-active]="form.djType === 'registered'" (click)="setDjType('registered')">
              {{ t('registeredDj') }}
            </button>
            <button type="button" [class.admin-filter-active]="form.djType === 'external'" (click)="setDjType('external')">
              {{ t('externalDj') }}
            </button>
          </div>

          <label class="mt-4 block" *ngIf="form.djType === 'registered'">
            <span class="field-label">{{ t('selectDj') }}</span>
            <select [(ngModel)]="form.djId" name="djId" class="field-input" (ngModelChange)="syncRegisteredDjName()">
              <option value="">{{ t('selectDjPlaceholder') }}</option>
              <option *ngFor="let dj of djs()" [value]="dj.id">{{ dj.stageName }} · {{ dj.city || dj.email }}</option>
            </select>
          </label>

          <label class="mt-4 block" *ngIf="form.djType === 'external'">
            <span class="field-label">{{ t('externalDjName') }}</span>
            <input [(ngModel)]="form.djName" name="externalDjName" class="field-input" />
          </label>

          <label class="mt-4 block">
            <span class="field-label">{{ t('assignmentNotes') }}</span>
            <textarea [(ngModel)]="form.notes" name="notes" class="field-input min-h-24 resize-y"></textarea>
          </label>

          <p class="mt-4 text-sm text-pink-300" *ngIf="error()">{{ t('assignmentError') }}</p>
          <button type="submit" class="primary-action mt-5 w-full">
            {{ form.id ? t('updateAssignment') : t('saveAssignment') }}
          </button>
        </form>

        <section class="mt-7">
          <div class="results-heading">
            <div class="min-w-0">
              <p class="page-kicker">{{ t('scheduledAssignments') }}</p>
              <h2 class="status-text mt-1 text-2xl font-black">{{ t('artDirectionNav') }}</h2>
              <p class="mt-2 text-sm text-slate-400">{{ t('assignmentListCopy') }}</p>
            </div>
            <span class="results-count">{{ assignments().length }}</span>
          </div>

          <section class="empty-state mt-4" *ngIf="assignments().length === 0">
            <div class="empty-state-icon">+</div>
            <div class="min-w-0">
              <h3>{{ t('noAssignments') }}</h3>
              <p>{{ t('venueAssignmentsSubtitle') }}</p>
            </div>
          </section>

          <div class="mt-4 grid gap-3">
            <article class="surface card-pad assignment-row" *ngFor="let assignment of assignments()">
              <div class="min-w-0">
                <p class="page-kicker">{{ assignment.venue }}</p>
                <h3 class="status-text mt-2 text-xl font-black">{{ assignment.djName }}</h3>
                <p class="mt-2 text-sm text-slate-300">{{ formatDate(assignment.date) }} · {{ assignment.from || '-' }} - {{ assignment.to || '-' }}</p>
                <p class="mt-2 text-xs uppercase text-cyan-200" *ngIf="assignment.venueUserName">{{ t('linkedVenueAccount') }} · {{ assignment.venueUserName }}</p>
                <p class="mt-2 text-xs uppercase text-slate-500">{{ assignment.djType === 'registered' ? t('registeredDj') : t('externalDj') }}</p>
                <p class="mt-3 text-sm text-slate-400" *ngIf="assignment.notes">{{ assignment.notes }}</p>
              </div>

              <div class="grid gap-2">
                <button type="button" class="primary-action px-4" (click)="editAssignment(assignment)">
                  {{ t('editAssignment') }}
                </button>
                <button type="button" class="secondary-action px-4" (click)="deleteAssignment(assignment)">
                  {{ t('deleteUser') }}
                </button>
              </div>
            </article>
          </div>
        </section>
      </section>

      <nav class="bottom-nav" aria-label="Main navigation">
        <a routerLink="/assignments" routerLinkActive="active" data-nav="venues"><span>{{ t('artDirectionNav') }}</span></a>
        <a routerLink="/dashboard" routerLinkActive="active" data-nav="home"><span>{{ t('dashboardNav') }}</span></a>
        <a routerLink="/calendar" routerLinkActive="active" data-nav="calendar" [attr.aria-label]="t('calendar')">
          <svg class="calendar-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
          </svg>
          <span class="sr-only">{{ t('calendar') }}</span>
        </a>
        <a routerLink="/search" routerLinkActive="active" data-nav="search"><span>{{ t('search') }}</span></a>
        <button type="button" (click)="logout()" data-nav="exit"><span>{{ t('logout') }}</span></button>
      </nav>
    </main>
  `
})
export class AdminAssignmentsPageComponent {
  djs = signal<DjProfile[]>([]);
  venues = signal<ManagedUser[]>([]);
  assignments = signal<VenueAssignment[]>([]);
  error = signal(false);
  form = this.createForm();
  private approvedDjs: DjProfile[] = [];

  constructor(
    private auth: AuthService,
    private availability: AvailabilityService,
    private djService: DjService,
    private assignmentsService: VenueAssignmentService,
    private router: Router,
    private toast: ToastService,
    public i18n: I18nService
  ) {
    this.loadPage();
  }

  async saveAssignment(): Promise<void> {
    this.error.set(false);
    this.syncRegisteredDjName();
    this.syncVenueUserName();

    if (!this.form.venue.trim() || !this.form.date || !this.form.djName.trim()) {
      this.error.set(true);
      this.toast.error(this.t('assignmentError'));
      return;
    }

    try {
      await this.assignmentsService.saveAssignment(this.form);
      this.toast.success(this.form.id ? this.t('toastAssignmentUpdated') : this.t('toastAssignmentSaved'));
      this.resetForm();
      await Promise.all([
        this.loadAssignments(),
        this.loadAvailableDjs()
      ]);
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async deleteAssignment(assignment: VenueAssignment): Promise<void> {
    try {
      await this.assignmentsService.deleteAssignment(assignment.id);
      await this.loadAssignments();
      this.toast.success(this.t('toastAssignmentDeleted'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async editAssignment(assignment: VenueAssignment): Promise<void> {
    this.error.set(false);
    this.form = {
      id: assignment.id,
      venue: assignment.venue,
      venueUserId: assignment.venueUserId,
      venueUserName: assignment.venueUserName,
      date: assignment.date,
      from: assignment.from,
      to: assignment.to,
      djType: assignment.djType,
      djId: assignment.djId,
      djName: assignment.djName,
      notes: assignment.notes
    };
    await this.loadAvailableDjs(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  resetForm(): void {
    this.form = this.createForm();
    this.loadAvailableDjs();
  }

  setDjType(type: AssignmentDjType): void {
    this.form.djType = type;
    this.form.djId = '';
    this.form.djName = '';
  }

  syncRegisteredDjName(): void {
    if (this.form.djType !== 'registered') {
      return;
    }

    const dj = this.djs().find((item) => item.id === this.form.djId);
    this.form.djName = dj?.stageName ?? '';
  }

  syncVenueUserName(): void {
    const venue = this.venues().find((item) => item.id === this.form.venueUserId);
    this.form.venueUserName = venue?.name || venue?.email || '';
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(`${date}T12:00:00`));
  }

  private async loadPage(): Promise<void> {
    const [djs, approvedUsers] = await Promise.all([
      this.djService.getDjs(),
      this.auth.getUsers('approved'),
      this.loadAssignments()
    ]);

    const approvedDjIds = new Set(
      approvedUsers
        .filter((user) => user.role === 'dj' || user.role === 'admin')
        .map((user) => user.id)
    );

    this.venues.set(approvedUsers.filter((user) => user.role === 'venue'));

    this.approvedDjs = djs.filter((dj) => approvedDjIds.has(dj.id));
    await this.loadAvailableDjs();
  }

  async loadAvailableDjs(clearUnavailableSelection = true): Promise<void> {
    if (!this.form.date) {
      this.djs.set([]);
      this.form.djId = '';
      this.form.djName = '';
      return;
    }

    const availableDjIds = new Set(
      await this.availability.getAvailableDjs(this.form.date, this.approvedDjs.map((dj) => dj.id))
    );
    const availableDjs = this.approvedDjs.filter((dj) => availableDjIds.has(dj.id));

    this.djs.set(availableDjs);

    if (clearUnavailableSelection && this.form.djId && !availableDjIds.has(this.form.djId)) {
      this.form.djId = '';
      this.form.djName = '';
    }
  }

  private async loadAssignments(): Promise<void> {
    this.assignments.set(await this.assignmentsService.getAssignments());
  }

  private createForm(): VenueAssignmentForm {
    return {
      venue: '',
      venueUserId: '',
      venueUserName: '',
      date: new Date().toISOString().slice(0, 10),
      from: '',
      to: '',
      djType: 'registered',
      djId: '',
      djName: '',
      notes: ''
    };
  }
}
