// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isValid = auth.validateToken();

  if (isValid) return true;

  auth.logout();
  router.navigate(['/login']);
  return false;
};

