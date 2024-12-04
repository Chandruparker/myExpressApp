// import { CanActivateFn } from '@angular/router';

// export const roleGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Fetch the expected role from route data
    const expectedRole = route.data['role'];

    // Fetch the actual user role from localStorage (or any other storage)
    const userRole = localStorage.getItem('userRole');

    if (userRole === expectedRole) {
      return true; // Allow access if roles match
    } else {
      this.router.navigate(['/permission']); // Redirect to an error page
      return false; // Deny access
    }
  }
}

