import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DjService } from '../../services/dj.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="auth-page">
      <section class="surface-strong w-full max-w-md card-pad">
        <div class="page-header mb-8">
          <div class="min-w-0">
            <p class="page-kicker">{{ t('loginEyebrow') }}</p>
            <h1 class="page-title">{{ t('appName') }}</h1>
          </div>

          <button type="button" class="icon-pill" (click)="i18n.toggleLanguage()" [attr.aria-label]="t('language')">
            {{ i18n.language().toUpperCase() }}
          </button>
        </div>

        <h2 class="text-2xl font-black leading-tight">{{ t('googleLoginTitle') }}</h2>
        <p class="page-copy">{{ t('googleLoginSubtitle') }}</p>

        <button type="button" class="primary-action mt-7 w-full" [disabled]="loading()" (click)="signInWithGoogle()">
          {{ loading() ? t('accessing') : t('signInWithGoogle') }}
        </button>

        <button type="button" class="secondary-action mt-3 w-full" (click)="backToChoice()">
          {{ t('changeAccessType') }}
        </button>

        <p class="mt-4 text-sm text-pink-300" *ngIf="error()">{{ t('googleLoginError') }}</p>
        <p class="mt-5 text-xs text-slate-400">{{ t('approvalHint') }}</p>
      </section>
    </main>
  `
})
export class LoginPageComponent {
  error = signal(false);
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private djService: DjService,
    private router: Router,
    public i18n: I18nService
  ) {}

  async signInWithGoogle(): Promise<void> {
    this.error.set(false);
    this.loading.set(true);

    try {
      const user = await this.auth.signInWithGoogle();

      if (user?.role === 'admin') {
        await this.router.navigateByUrl('/admin');
        return;
      }

      if (user?.status !== 'approved') {
        await this.router.navigateByUrl('/pending');
        return;
      }

      const destination = await this.djService.hasCompleteProfile(this.auth.getCurrentDj()) ? '/dashboard' : '/profile';
      await this.router.navigateByUrl(destination);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  backToChoice(): void {
    this.router.navigateByUrl('/');
  }

  t(key: Parameters<I18nService['t']>[0]): string {
    return this.i18n.t(key);
  }
}
