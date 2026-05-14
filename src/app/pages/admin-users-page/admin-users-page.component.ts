import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, ManagedUser, UserStatus } from '../../services/auth.service';
import { AvailabilityService } from '../../services/availability.service';
import { BookingRequest, BookingRequestService } from '../../services/booking-request.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { VenueAssignmentService } from '../../services/venue-assignment.service';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <main class="app-page">
      <section class="app-container">
        <header class="page-header">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('adminEyebrow') }}</p>
            <h1 class="page-title">{{ t('adminTitle') }}</h1>
            <p class="page-copy">{{ t('adminSubtitle') }}</p>
          </div>

          <div class="header-actions">
            <a routerLink="/admin" class="top-admin-link top-admin-link-active">{{ t('adminNav') }}</a>
            <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
          </div>
        </header>

        <section class="admin-overview-grid mt-7">
          <article class="surface-strong card-pad admin-overview-card admin-overview-card-primary">
            <p class="page-kicker">{{ t('bookingQueue') }}</p>
            <h2 class="status-text mt-2 text-2xl font-black">{{ t('bookingQueueTitle') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('bookingQueueCopy') }}</p>

            <div class="admin-metric-grid mt-5">
              <div class="admin-metric">
                <span>{{ t('pendingRequests') }}</span>
                <strong>{{ pendingRequests.length }}</strong>
              </div>
              <div class="admin-metric">
                <span>{{ t('acceptedRequests') }}</span>
                <strong>{{ acceptedRequests.length }}</strong>
              </div>
              <div class="admin-metric">
                <span>{{ t('rejectedRequests') }}</span>
                <strong>{{ rejectedRequests.length }}</strong>
              </div>
            </div>
          </article>

          <a routerLink="/assignments" class="surface card-pad admin-overview-card admin-overview-link">
            <p class="page-kicker">{{ t('venueOperations') }}</p>
            <h2 class="status-text mt-2 text-xl font-black">{{ t('artDirectionNav') }}</h2>
            <p class="mt-2 text-sm text-slate-300">{{ t('venueOperationsCopy') }}</p>
          </a>
        </section>

        <section class="surface-strong mt-5 card-pad">
          <div class="admin-section-heading">
            <div class="min-w-0">
              <p class="page-kicker">{{ t('bookingRequests') }}</p>
              <h2 class="status-text mt-1 text-2xl font-black">{{ t('bookingRequestsTitle') }}</h2>
              <p class="mt-2 text-sm text-slate-300">{{ t('adminBookingHelp') }}</p>
            </div>
            <span class="admin-count-pill">{{ pendingRequests.length }}</span>
          </div>

          <div class="mt-5 grid gap-3" *ngIf="pendingRequests.length > 0; else noRequests">
            <article class="booking-request-card" *ngFor="let request of pendingRequests">
              <div class="min-w-0">
                <p class="booking-request-date">{{ formatDate(request.date) }} · {{ request.from }} - {{ request.to }}</p>
                <h3 class="status-text mt-1 text-xl font-black">{{ request.clientName }} → {{ request.djName }}</h3>
                <p class="mt-1 text-sm text-slate-300">{{ request.type }} · {{ request.place }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ request.clientPhone }}</p>
              </div>

              <div class="booking-request-actions">
                <a class="secondary-action px-3 text-center" [href]="whatsappUrl(request)" target="_blank" rel="noreferrer">
                  {{ t('openWhatsapp') }}
                </a>
                <button type="button" class="primary-action px-3" (click)="acceptRequest(request)">
                  {{ t('acceptRequest') }}
                </button>
                <button type="button" class="secondary-action px-3" (click)="rejectRequest(request)">
                  {{ t('rejectRequest') }}
                </button>
              </div>
            </article>
          </div>

          <ng-template #noRequests>
            <div class="empty-state mt-5">
              <div class="empty-state-icon">0</div>
              <div class="min-w-0">
                <h3>{{ t('noBookingRequests') }}</h3>
                <p>{{ t('adminBookingHelp') }}</p>
              </div>
            </div>
          </ng-template>

          <div class="mt-5 grid gap-3" *ngIf="acceptedRequests.length > 0">
            <article class="booking-request-card booking-request-card-accepted" *ngFor="let request of acceptedRequests.slice(0, 3)">
              <div class="min-w-0">
                <p class="booking-request-date">{{ formatDate(request.date) }} · {{ request.from }} - {{ request.to }}</p>
                <h3 class="status-text mt-1 text-lg font-black">{{ request.djName }}</h3>
                <p class="mt-1 text-sm text-slate-300">{{ request.clientName }} · {{ request.place }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="surface-strong mt-5 card-pad">
          <p class="page-kicker">{{ t('approvalStatus') }}</p>
          <h2 class="status-text mt-1 text-2xl font-black">{{ t('accessManagement') }}</h2>
          <p class="mt-2 text-sm text-slate-300">{{ t('usersFilterHint') }}</p>

          <div class="admin-filter-tabs mt-5">
          <button
            type="button"
            class="secondary-action px-4"
            [class.admin-filter-active]="filter() === 'pending'"
            (click)="setFilter('pending')"
          >
            {{ t('pendingUsers') }}
          </button>
          <button
            type="button"
            class="secondary-action px-4"
            [class.admin-filter-active]="filter() === 'approved'"
            (click)="setFilter('approved')"
          >
            {{ t('approvedUsers') }}
          </button>
          <button
            type="button"
            class="secondary-action px-4"
            [class.admin-filter-active]="filter() === 'rejected'"
            (click)="setFilter('rejected')"
          >
            {{ t('rejectedUsers') }}
          </button>
          <button
            type="button"
            class="secondary-action px-4"
            [class.admin-filter-active]="filter() === 'deleted'"
            (click)="setFilter('deleted')"
          >
            {{ t('deletedUsers') }}
          </button>
          </div>
        </section>

        <p *ngIf="filter() === 'approved'" class="mt-4 text-sm text-slate-400">
          {{ t('deleteUserHint') }}
        </p>

        <p *ngIf="errorMessage" class="surface-strong mt-5 card-pad text-sm font-bold text-pink-300">
          {{ errorMessage }}
        </p>

        <p class="surface-strong mt-5 card-pad text-sm text-slate-300" *ngIf="loading()">
          {{ t('loadingUsers') }}
        </p>

        <section class="empty-state mt-5" *ngIf="!loading() && users().length === 0">
          <div class="empty-state-icon">0</div>
          <div class="min-w-0">
            <h3>{{ t('noUsersForFilter') }}</h3>
            <p>{{ t('usersFilterHint') }}</p>
          </div>
        </section>

        <div class="mt-5 grid gap-3">
          <div class="admin-swipe-shell" *ngFor="let user of users()">
            <button
              *ngIf="canDelete(user)"
              type="button"
              class="admin-delete-action"
              (click)="deleteUser(user)"
            >
              {{ t('deleteUser') }}
            </button>

            <article
              class="surface card-pad admin-user-row admin-swipe-card"
              [class.admin-swipe-enabled]="canDelete(user)"
              [style.transform]="cardTransform(user)"
              (pointerdown)="startSwipe($event, user)"
              (pointermove)="moveSwipe($event, user)"
              (pointerup)="endSwipe(user)"
              (pointercancel)="endSwipe(user)"
            >
              <div class="flex min-w-0 items-center gap-4">
                <img *ngIf="user.photoUrl" [src]="user.photoUrl" alt="" class="h-12 w-12 rounded-lg" />
                <div *ngIf="!user.photoUrl" class="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-800 text-lg font-black">
                  {{ user.name.charAt(0) || '?' }}
                </div>

                <div class="min-w-0">
                  <h2 class="status-text text-lg font-black">{{ user.name || user.email }}</h2>
                  <p class="truncate text-sm text-slate-400">{{ user.email }}</p>
                  <p class="mt-1 text-xs uppercase text-slate-500">{{ roleLabel(user.role) }} · {{ user.status }}</p>
                </div>
              </div>

              <div class="grid gap-2 sm:grid-cols-2" *ngIf="user.status === 'pending'">
                <button type="button" class="primary-action px-4" (click)="approve(user)">
                  {{ user.role === 'venue' ? t('approveVenue') : t('approveDj') }}
                </button>
                <button type="button" class="secondary-action px-4" (click)="reject(user)">
                  {{ t('rejectUser') }}
                </button>
              </div>

              <div class="hidden sm:block" *ngIf="canDelete(user)">
                <button type="button" class="secondary-action px-4" (click)="deleteUser(user)">
                  {{ t('deleteUser') }}
                </button>
              </div>

              <div *ngIf="user.status === 'deleted'">
                <button type="button" class="primary-action px-4" (click)="restoreUser(user)">
                  {{ t('restoreUser') }}
                </button>
              </div>
            </article>
          </div>
        </div>
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
export class AdminUsersPageComponent {
  users = signal<ManagedUser[]>([]);
  requests = signal<BookingRequest[]>([]);
  loading = signal(false);
  filter = signal<UserStatus>('pending');
  errorMessage = '';
  private swipeStartX: Record<string, number> = {};
  private swipeOffsetX: Record<string, number> = {};

  constructor(
    private auth: AuthService,
    private availability: AvailabilityService,
    private bookingRequests: BookingRequestService,
    private venueAssignments: VenueAssignmentService,
    private router: Router,
    private toast: ToastService,
    public i18n: I18nService
  ) {
    this.loadPage();
  }

  get pendingRequests(): BookingRequest[] {
    return this.requests().filter((request) => request.status === 'pending');
  }

  get acceptedRequests(): BookingRequest[] {
    return this.requests().filter((request) => request.status === 'accepted');
  }

  get rejectedRequests(): BookingRequest[] {
    return this.requests().filter((request) => request.status === 'rejected');
  }

  async setFilter(status: UserStatus): Promise<void> {
    this.errorMessage = '';
    this.swipeOffsetX = {};
    this.filter.set(status);
    await this.loadUsers();
  }

  async approve(user: ManagedUser): Promise<void> {
    try {
      await this.auth.approveUser(user.id);
      await this.loadUsers();
      this.toast.success(this.t('toastUserApproved'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async reject(user: ManagedUser): Promise<void> {
    try {
      await this.auth.rejectUser(user.id);
      await this.loadUsers();
      this.toast.success(this.t('toastUserRejected'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async deleteUser(user: ManagedUser): Promise<void> {
    if (!this.canDelete(user)) {
      return;
    }

    this.errorMessage = '';

    try {
      await this.auth.deleteApprovedUser(user.id);
      this.swipeOffsetX[user.id] = 0;
      await this.loadUsers();
      this.toast.success(this.t('toastUserDeleted'));
    } catch {
      this.errorMessage = this.t('deleteUserError');
      this.toast.error(this.errorMessage);
    }
  }

  async restoreUser(user: ManagedUser): Promise<void> {
    if (user.status !== 'deleted') {
      return;
    }

    this.errorMessage = '';

    try {
      await this.auth.restoreDeletedUser(user.id);
      await this.loadUsers();
      this.toast.success(this.t('toastUserRestored'));
    } catch {
      this.errorMessage = this.t('restoreUserError');
      this.toast.error(this.errorMessage);
    }
  }

  async acceptRequest(request: BookingRequest): Promise<void> {
    try {
      await this.bookingRequests.acceptRequest(request.id);
      await this.availability.setAvailability(request.djId, request.date, 'NOT_AVAILABLE');
      await this.saveVenueAssignmentIfNeeded(request);
      await this.loadRequests();
      this.toast.success(this.t('toastBookingAccepted'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  async rejectRequest(request: BookingRequest): Promise<void> {
    try {
      await this.bookingRequests.rejectRequest(request.id);
      await this.loadRequests();
      this.toast.success(this.t('toastBookingRejected'));
    } catch {
      this.toast.error(this.t('toastGenericError'));
    }
  }

  formatDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat(this.i18n.language() === 'it' ? 'it-IT' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long'
    }).format(date);
  }

  whatsappUrl(request: BookingRequest): string {
    const message = encodeURIComponent(
      `Ciao ${request.clientName}, ho ricevuto la richiesta per ${this.formatDate(request.date)} dalle ${request.from} alle ${request.to} presso ${request.place}.`
    );

    return `https://wa.me/${request.clientPhone.replace(/\D/g, '')}?text=${message}`;
  }

  canDelete(user: ManagedUser): boolean {
    return user.status === 'approved' && user.role !== 'admin';
  }

  roleLabel(role: ManagedUser['role']): string {
    if (role === 'venue') {
      return this.t('venueRole');
    }

    if (role === 'admin') {
      return this.t('adminNav');
    }

    if (role === 'guest') {
      return this.t('guestRole');
    }

    return 'DJ';
  }

  cardTransform(user: ManagedUser): string {
    return this.canDelete(user) ? `translateX(${this.swipeOffsetX[user.id] || 0}px)` : 'none';
  }

  startSwipe(event: PointerEvent, user: ManagedUser): void {
    if (!this.canDelete(user)) {
      return;
    }

    this.swipeStartX[user.id] = event.clientX - (this.swipeOffsetX[user.id] || 0);
  }

  moveSwipe(event: PointerEvent, user: ManagedUser): void {
    if (!this.canDelete(user) || this.swipeStartX[user.id] === undefined) {
      return;
    }

    const offset = Math.min(0, Math.max(-96, event.clientX - this.swipeStartX[user.id]));
    this.swipeOffsetX[user.id] = offset;
  }

  endSwipe(user: ManagedUser): void {
    if (!this.canDelete(user)) {
      return;
    }

    this.swipeOffsetX[user.id] = (this.swipeOffsetX[user.id] || 0) < -48 ? -96 : 0;
    delete this.swipeStartX[user.id];
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }

  private async loadUsers(): Promise<void> {
    this.loading.set(true);
    try {
      this.users.set(await this.auth.getUsers(this.filter()));
    } finally {
      this.loading.set(false);
    }
  }

  private async loadRequests(): Promise<void> {
    this.requests.set(await this.bookingRequests.getAllRequests());
  }

  private async loadPage(): Promise<void> {
    this.loading.set(true);
    try {
      const [users, requests] = await Promise.all([
        this.auth.getUsers(this.filter()),
        this.bookingRequests.getAllRequests()
      ]);
      this.users.set(users);
      this.requests.set(requests);
    } finally {
      this.loading.set(false);
    }
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
