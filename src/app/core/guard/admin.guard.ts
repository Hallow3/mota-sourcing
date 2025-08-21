import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.userType === 'ADMIN') {
          return true;
        } else if (user) {
          return this.router.createUrlTree(['/mota/dashboard']);
        } else {
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}