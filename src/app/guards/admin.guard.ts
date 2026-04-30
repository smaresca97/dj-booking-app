import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authReady.then(() => {
    if (auth.isAdmin()) {
      return true;
    }

    if (auth.isDj()) {
      return router.createUrlTree(['/pending']);
    }

    return router.createUrlTree(['/']);
  });
};
