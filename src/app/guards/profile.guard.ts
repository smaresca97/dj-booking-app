import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DjService } from '../services/dj.service';

export const profileGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const djService = inject(DjService);
  const router = inject(Router);

  return auth.authReady.then(async () => {
    if (!auth.isApprovedDj()) {
      return auth.isDj() ? router.createUrlTree(['/pending']) : router.createUrlTree(['/search']);
    }

    if (auth.isAdmin()) {
      return true;
    }

    if (await djService.hasCompleteProfile(auth.getCurrentDj())) {
      return true;
    }

    return router.createUrlTree(['/profile']);
  });
};
