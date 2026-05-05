import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.user()) return true;
  if (auth.loading()) {
    await auth.refresh();
    auth.loading.set(false);
  }
  if (auth.user()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnTo: location.pathname } });
};

export const redirectIfAuthedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user() ? router.createUrlTree(['/dashboard']) : true;
};
