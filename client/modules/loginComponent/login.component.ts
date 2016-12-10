import {
    Component,
    OnInit,
    NgZone
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import template from './login.html';

@Component({
    selector: 'login',
    template
})

export class LoginComponent implements OnInit {
    addForm: FormGroup;
    email: string;
    password: string;
    message: string;
    showmessage: boolean = false;
    loginprocess: boolean;
    logintime: any;
    constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) {

    }

    ngOnInit() {
        //  *** checking if user is already login ***
        if (Meteor.userId()) {
            this._router.navigate(['csvtemplate']);
        }
        this.addForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.loginprocess = false;
    }

    login() {
        var self = this;
        self.loginprocess = true;
        if (this.addForm.valid) {
            self.logintime = new Date();
            console.log(self.logintime);
            this.email = this.addForm.controls['email'].value;
            this.password = this.addForm.controls['password'].value;
            Meteor.loginWithPassword(this.email, this.password, function(error) {
                if (Meteor.user()) {
                    localStorage.setItem("login_time", self.logintime);
                    self._router.navigate(['/csvtemplate']);
                } else {
                    self.ngZone.run(() => {
                        self.loginprocess = false;
                        self.showmessage = true;
                        self.message = error.reason;
                    });
                }
            });
        }
    }
}