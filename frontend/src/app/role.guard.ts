import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Fetch the expected role from route data
    const expectedRole = route.data['role'];

    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Fetch the actual user role from localStorage (or any other storage)
      const userRole = localStorage.getItem('userRole');
      
      if (userRole === expectedRole) {
        return true; // Allow access if roles match
      } else {
        this.router.navigate(['/permission']); // Redirect to an error page
        return false; // Deny access
      }
    } else {
      // In SSR, deny access since localStorage is not available
      this.router.navigate(['/permission']);
      return false;
    }
  }
}

