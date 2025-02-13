import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];
    if (isPlatformBrowser(this.platformId)) {
      const userRole = localStorage.getItem('userRole');   
      if (userRole === expectedRole) {
        return true;
      } else {
        this.router.navigate(['/permission']); 
        return false; 
      }
    } else {
      this.router.navigate(['/permission']);
      return false;
    }
  }
}

