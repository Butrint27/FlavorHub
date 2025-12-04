import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken()) {
    return true; // user is logged in
  }

  router.navigate(['/login']); // redirect if not logged in
  return false;
};
