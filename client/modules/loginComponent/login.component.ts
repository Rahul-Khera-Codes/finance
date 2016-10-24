import {
    Component,
    OnInit,
    OnChanges
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
    MeteorComponent
} from 'angular2-meteor';

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

export class LoginComponent extends MeteorComponent implements OnInit {
    addForm: FormGroup;
    email: string;
    password: string;
    message: string;
    showmessage: boolean = false;
    loginprocess: boolean;
    constructor(private formBuilder: FormBuilder, private _router: Router) {
        super();
    }

    ngOnInit() {
        //  *** checking if user is already login ***
       if (Meteor.userId()) {
           this._router.navigate(['/csvtemplate']);
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
            this.email = this.addForm.controls['email'].value;
            this.password = this.addForm.controls['password'].value;
            Meteor.loginWithPassword(this.email, this.password, function(error:any) {
                if (Meteor.user()) {
                    self._router.navigate(['/csvtemplate']);
                } else {
                    self.loginprocess = false;
                    self.showmessage = true;
                    self.message = error.reason;
                }
            });
        }
    }
}