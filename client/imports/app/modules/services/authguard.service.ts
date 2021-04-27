import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs';
import {
    Meteor
} from 'meteor/meteor';

@Injectable()
export class AuthGuardService implements CanActivate {


    constructor(private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (Meteor.userId()) {
            if (state.url.includes('login')) {
                this.router.navigate(['csvtemplate/dashboard']);
                return false;
            } else {
                return true;
            }
        } else {
            if (!state.url.includes('login')) {
                this.router.navigate(['login']);
                return false;
            } else {
                return true;
            }
        }

    }
}
