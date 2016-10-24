import {
    Component,
    OnInit
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import template from './adduser.html';
import {
    MeteorComponent
} from 'angular2-meteor';
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    matchingPasswords
} from './validators';

@Component({
    selector: 'adduser',
    template
})

export class adduserComponent extends MeteorComponent implements OnInit {
    addForm: FormGroup;
    changePassword: FormGroup;
    userlist: Mongo.Cursor < any > ;

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {

        Meteor.subscribe("userData");
        this.userlist = Meteor.users.find({});
        this.changePassword = this.formBuilder.group({
            newPasswords: ['', Validators.required]
        })
        this.addForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            role: ['', Validators.required],
            password: ['', Validators.required],
            password2: ['', Validators.required]
        }, {
            validator: matchingPasswords('password', 'password2')
        })
    };

    resetForm() {
        this.addForm.controls['username']['updateValue']('');
        this.addForm.controls['email']['updateValue']('');
        this.addForm.controls['password']['updateValue']('');
        this.addForm.controls['password2']['updateValue']('');
        this.addForm.controls['role']['updateValue']('');
    }

    resetPasswordForm() {
        this.changePassword.controls['newPasswords']['updateValue']('');
    }

    changePasswords(userId:string) {
        var newPassword = this.changePassword.controls['newPasswords'].value;
        Meteor.call('changePasswordForce', userId, newPassword, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.resetPasswordForm();
    }

    addUser() {
        if (this.addForm.valid) {
            var adduser = {
                username: this.addForm.controls['username'].value,
                email: this.addForm.controls['email'].value,
                password: this.addForm.controls['password'].value,
                profile: {
                    role: this.addForm.controls['role'].value,
                    name: this.addForm.controls['username'].value,
                    email: this.addForm.controls['email'].value
                }
            };
            Meteor.call('addUser', adduser, (error:any, response:any) => {
                if (error) {
                    console.log(error.reason);
                } else {
                    console.log(response);
                }
            });
            this.resetForm();
        }
    }
    removeUser(user:any) {
        Meteor.call('removeUser', user, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });

    }

}