import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {

  const authService = inject(AuthService)

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus())

  console.log('isAuthenticated', isAuthenticated)

  return !isAuthenticated;
}
