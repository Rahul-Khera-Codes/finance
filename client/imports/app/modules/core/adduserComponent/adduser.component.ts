// We use this component to add new users with different permissions into our system

import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
import {
    Observable
, 
    Subscription
} from 'rxjs';
import {
    MeteorObservable
} from 'meteor-rxjs';
import {
    Mongo
} from 'meteor/mongo';
import {
    Router
} from '@angular/router';
import {
    Meteor
} from 'meteor/meteor';
import template from './adduser.html';
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    InjectUser
} from 'angular2-meteor-accounts-ui';
import {
    NgForm
} from '@angular/forms';
import {
    matchingPasswords
} from './validators';
import {
    Users
} from '../../../../../../both/collections/csvdata.collection';
import {
    User
} from '../../../../../../both/models/user.model';
import { StorageService } from './../../services/storage';
import { RemoveStorageService } from './../../services/removeStorage';

@Component({
    selector: 'adduser',
    templateUrl: './adduser.html',
    moduleId: module.id
})
@InjectUser('user')
export class adduserComponent implements OnInit, OnDestroy {
    user: Meteor.User;
    addForm: FormGroup;
    changePassword: FormGroup;
    userlist: Observable<User[]>;
    usersData: Subscription;
    selectedUser: any;
    userselected: boolean = false;
    constructor(public _remove: RemoveStorageService, public _local: StorageService, private formBuilder: FormBuilder, private _router: Router, private ngZone: NgZone) { }
    ngOnInit() {
        //**** time limit check condition if it excced 1 hrs
        // if login time is more than 1 hr then we should logout the user.
        if (this._local.getLocaldata("login_time")) {
            var login_time = new Date(this._local.getLocaldata("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
                console.log("Your session has expired. Please log in again");
                var self = this;
                this._remove.removeData();
                Meteor.logout(function (error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']); // we are naviagating user back to login page.
                    }
                });
            } else {
                // if login time is less then one hour we increment login time so that user don't face difficulty
                this._local.setLocalData("login_time", current_time.toString());
            }
        }
        // this code is used to get list of all users in our system.
        this.usersData = MeteorObservable.subscribe('userData').subscribe(() => {
            var self = this;
            self.ngZone.run(() => {
                self.userlist = Users.find({});
            });
        });
        // angular form to change password
        this.changePassword = this.formBuilder.group({
            newPasswords: ['', Validators.required]
        })
        // angular form to add new user into our system.
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
    // function to change password of any user in our system.
    changePasswords(userId) {
        var newPassword = this.changePassword.controls['newPasswords'].value;
        Meteor.call('changePasswordForce', userId, newPassword, (error, response) => { // meteor method to change password.
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.changePassword.reset();
        // add code to check if login user is admin or not.
        // var self= this;
        // Meteor.logout(function(error) {
        //     if (error) {
        //         console.log("ERROR: " + error.reason);
        //     } else {
        //         self._router.navigate(['/login']);
        //     }
        // });
    }

    addUser() { // function to add new user
        if (this.addForm.valid) {
            var adduser = { // here we are storing form values in adduser variable which we pass into adduser meteor method
                username: this.addForm.controls['username'].value,
                email: this.addForm.controls['email'].value,
                password: this.addForm.controls['password'].value,
                profile: {
                    role: this.addForm.controls['role'].value,
                    name: this.addForm.controls['username'].value,
                    email: this.addForm.controls['email'].value
                }
            };
            // meteor function to add new user which take adduser variable object as input
            Meteor.call('addUser', adduser, (error, response) => {
                if (error) {
                    console.log(error.reason);
                } else {
                    console.log(response);
                }
            });
            this.addForm.reset(); // to reset add user form.
        }

    }

    edituser(selected) { // to select any user to edit its details
        this.userselected = true;
        this.selectedUser = selected;
    }

    hideselected() {
        this.userselected = false;
        this.selectedUser = null;
    }

    updateUser(form: NgForm) { // function to update any user detials
        console.log(form.value); // meteor method userupdate will update any user details we pass to it.
        Meteor.call('userupdate', this.selectedUser._id, this.selectedUser.emails[0].address, this.selectedUser.username, this.selectedUser.roles[0], (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.userselected = false;
        form.reset();
    }

    removeUser(user) { // remove user is used to remove any user form our system.
        Meteor.call('removeUser', user, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });

    }
    ngOnDestroy() {
        this.usersData.unsubscribe();
    }

}
