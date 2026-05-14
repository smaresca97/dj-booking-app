import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  template: `
    <main class="auth-page">
      <section class="surface-strong welcome-panel w-full max-w-2xl card-pad">
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

        <div class="welcome-choice-grid welcome-choice-grid-3 mt-7">
          <button type="button" class="welcome-choice welcome-choice-primary" (click)="goToDjLogin()">
            <span class="welcome-choice-icon">DJ</span>
            <span class="welcome-choice-text">
              <strong>{{ t('welcomeDjTitle') }}</strong>
              <small>{{ t('welcomeDjCopy') }}</small>
            </span>
            <span class="welcome-choice-action">{{ t('iAmDj') }}</span>
          </button>

          <button type="button" class="welcome-choice" (click)="goToVenueLogin()">
            <span class="welcome-choice-icon">LC</span>
            <span class="welcome-choice-text">
              <strong>{{ t('welcomeVenueTitle') }}</strong>
              <small>{{ t('welcomeVenueCopy') }}</small>
            </span>
            <span class="welcome-choice-action">{{ t('iAmVenue') }}</span>
          </button>

          <button type="button" class="welcome-choice" (click)="enterAsGuest()">
            <span class="welcome-choice-icon">+</span>
            <span class="welcome-choice-text">
              <strong>{{ t('welcomeClientTitle') }}</strong>
              <small>{{ t('welcomeClientCopy') }}</small>
            </span>
            <span class="welcome-choice-action">{{ t('findDj') }}</span>
          </button>
        </div>
      </section>
    </main>
  `
})
export class WelcomePageComponent {
  constructor(private auth: AuthService, private router: Router, public i18n: I18nService) {}

  goToDjLogin(): void {
    this.auth.setPreferredRole('dj');
    this.router.navigateByUrl('/login');
  }

  goToVenueLogin(): void {
    this.auth.setPreferredRole('venue');
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
