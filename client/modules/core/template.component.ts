import {
    Component,
    OnInit
} from '@angular/core';
import { 
    InjectUser 
} from 'angular2-meteor-accounts-ui';
import {
    Router
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

import template from './template.html';


@Component({
    selector: 'csvtemplate',
    template
})
@InjectUser('user')
export class TemplateComponent implements OnInit{
    logoutprocess: boolean;
    user: Meteor.User;
    constructor(private _router: Router) {}

    ngOnInit() {
        this.logoutprocess = false;
        this.user=Meteor.user();
        // if (!Meteor.userId()) {
        //     this._router.navigate(['/login']);
        // }
        //old code using user injection
        //  if (!this.user) {
        //     this._router.navigate(['/login']);
        // }
    }
    logout() {
        var self = this;
        self.logoutprocess = true;
        Meteor.logout(function(error) {
            if (error) {
                console.log("ERROR: " + error.reason);
            } else {
                self._router.navigate(['/login']);
            }
        });
    }
}