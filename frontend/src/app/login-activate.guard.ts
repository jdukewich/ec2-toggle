import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginActivateGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.apiService.getMe().subscribe(
        data => {
          // We have the user here
        },
        error => {
          this.router.navigate(['login']);
        }
      );
    return true;
  }
  
}
