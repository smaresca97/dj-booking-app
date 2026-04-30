import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  template: `
    <main class="auth-page">
      <section class="surface-strong w-full max-w-md card-pad">
        <div class="page-header mb-8">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('welcomeEyebrow') }}</p>
            <h1 class="page-title">{{ t('appName') }}</h1>
          </div>

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()" [attr.aria-label]="t('language')">
            {{ i18n.language().toUpperCase() }}
          </button>
        </div>

        <h2 class="text-2xl font-black leading-tight">{{ t('welcomeTitle') }}</h2>
        <p class="page-copy">{{ t('welcomeSubtitle') }}</p>

        <div class="mt-7 grid gap-3">
          <button type="button" class="primary-action w-full" (click)="goToDjLogin()">
            {{ t('iAmDj') }}
          </button>
          <button type="button" class="secondary-action w-full" (click)="enterAsGuest()">
            {{ t('findDj') }}
          </button>
        </div>
      </section>
    </main>
  `
})
export class WelcomePageComponent {
  constructor(private auth: AuthService, private router: Router, public i18n: I18nService) {}

  goToDjLogin(): void {
    this.router.navigateByUrl('/login');
  }

  enterAsGuest(): void {
    this.auth.enterAsGuest();
    this.router.navigateByUrl('/search');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }
}
