import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthServiceService} from './auth-service.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthServiceService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const isAuth = this.authService.getIsAuth();
        if (!isAuth) {
            this.router.navigate(['/login']);
        }
        return true;
    }
}

