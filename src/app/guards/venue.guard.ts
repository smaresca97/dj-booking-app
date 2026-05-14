import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const venueGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authReady.then(() => {
    if (auth.isApprovedVenue()) {
      return true;
    }

    if (auth.isVenue()) {
      return router.createUrlTree(['/pending']);
    }

    return router.createUrlTree(['/']);
  });
};
