import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-pending-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="auth-page">
      <section class="surface-strong w-full max-w-md card-pad">
        <div class="page-header mb-8">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('approvalStatus') }}</p>
            <h1 class="page-title">{{ statusTitle }}</h1>
          </div>

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()">{{ i18n.language().toUpperCase() }}</button>
        </div>

        <p class="page-copy">{{ statusCopy }}</p>

        <button type="button" class="secondary-action mt-7 w-full" (click)="logout()">
          {{ t('logout') }}
        </button>
      </section>
    </main>
  `
})
export class PendingPageComponent {
  constructor(private auth: AuthService, private router: Router, public i18n: I18nService) {}

  get statusTitle(): string {
    return this.auth.getCurrentUser()?.status === 'rejected' ? this.t('accountRejected') : this.t('accountPending');
  }

  get statusCopy(): string {
    return this.auth.getCurrentUser()?.status === 'rejected' ? this.t('accountRejectedCopy') : this.t('accountPendingCopy');
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }
}
