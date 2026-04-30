import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, ManagedUser, UserStatus } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

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

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </header>

        <div class="mt-7 flex flex-wrap gap-2">
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
        </div>

        <p class="surface-strong mt-5 card-pad text-sm text-slate-300" *ngIf="loading()">
          {{ t('loadingUsers') }}
        </p>

        <p class="surface-strong mt-5 card-pad text-sm text-slate-300" *ngIf="!loading() && users().length === 0">
          {{ t('noUsersForFilter') }}
        </p>

        <div class="mt-5 grid gap-3">
          <article class="surface card-pad admin-user-row" *ngFor="let user of users()">
            <div class="flex min-w-0 items-center gap-4">
              <img *ngIf="user.photoUrl" [src]="user.photoUrl" alt="" class="h-12 w-12 rounded-lg" />
              <div *ngIf="!user.photoUrl" class="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-800 text-lg font-black">
                {{ user.name.charAt(0) || '?' }}
              </div>

              <div class="min-w-0">
                <h2 class="status-text text-lg font-black">{{ user.name || user.email }}</h2>
                <p class="truncate text-sm text-slate-400">{{ user.email }}</p>
                <p class="mt-1 text-xs uppercase text-slate-500">{{ user.role }} · {{ user.status }}</p>
              </div>
            </div>

            <div class="grid gap-2 sm:grid-cols-2" *ngIf="user.status === 'pending'">
              <button type="button" class="primary-action px-4" (click)="approve(user)">
                {{ t('approveUser') }}
              </button>
              <button type="button" class="secondary-action px-4" (click)="reject(user)">
                {{ t('rejectUser') }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <nav class="bottom-nav" aria-label="Main navigation">
        <a routerLink="/admin" routerLinkActive="active">{{ t('adminNav') }}</a>
        <a routerLink="/dashboard" routerLinkActive="active">{{ t('dashboardEyebrow') }}</a>
        <a routerLink="/calendar" routerLinkActive="active">{{ t('calendar') }}</a>
        <a routerLink="/search" routerLinkActive="active">{{ t('search') }}</a>
        <button type="button" (click)="logout()">{{ t('logout') }}</button>
      </nav>
    </main>
  `
})
export class AdminUsersPageComponent {
  users = signal<ManagedUser[]>([]);
  loading = signal(false);
  filter = signal<UserStatus>('pending');

  constructor(private auth: AuthService, private router: Router, public i18n: I18nService) {
    this.loadUsers();
  }

  async setFilter(status: UserStatus): Promise<void> {
    this.filter.set(status);
    await this.loadUsers();
  }

  async approve(user: ManagedUser): Promise<void> {
    await this.auth.approveUser(user.id);
    await this.loadUsers();
  }

  async reject(user: ManagedUser): Promise<void> {
    await this.auth.rejectUser(user.id);
    await this.loadUsers();
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
}
