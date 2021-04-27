// This component is to add new Account no into our System

import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    Router
} from '@angular/router';
// *** new pattern***
import {
    Observable
, 
    Subscription
} from 'rxjs';
import {
    MeteorObservable
} from 'meteor-rxjs';
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    Accounts_no
} from '../../../../../../both/collections/csvdata.collection';
import template from './accountstemplate.html';
import { StorageService } from './../../services/storage';
import { RemoveStorageService } from '../../services/removeStorage';

@Component({
    selector: 'accounts',
    templateUrl: './accountstemplate.html',
    moduleId: module.id
})

export class AccountComponent implements OnInit, OnDestroy {
    accountlist: Observable<any[]>; // observalbe that will stroe account list
    selectedAccount: any;
    accountSub: Subscription;
    addForm: FormGroup;
    changevalue: string;
    accountlistvalue: any;
    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) { }

    onSelect(accountselect: any): void {
        this.selectedAccount = accountselect;
    }

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

        this.accountlist = Accounts_no.find({});
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe(); // subscribing account no collection.
        this.accountlist.subscribe((data) => { // getting account list in data params
            this.ngZone.run(() => {
                this.accountlistvalue = data;
            });
        });

        this.addForm = this.formBuilder.group({ // angular form that is used to insert new account no
            Account_no: ['', Validators.required],
        });
    }

    addAccount() { // add account fucntion is used to insert new account in system
        if (this.addForm.valid) {
            Accounts_no.insert(this.addForm.value);
            this.addForm.reset();
        }
    }

    updateAccount() { // this function is used to update any selected account no
        this.changevalue = this.addForm.controls['Account_no'].value;

        if (this.changevalue != null) {
            Accounts_no.update({ // mongodb query to update account no
                _id: this.selectedAccount._id
            }, {
                $set: {
                    "Account_no": this.changevalue
                }
            });
            this.addForm.reset();
            this.selectedAccount = undefined;
        } else {
            this.addForm.reset();
            this.selectedAccount = undefined;
        }
    }

    removeAccount(category_id) { // to remove a account no from system
        Meteor.call('Account_remove', category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.addForm.reset();
        this.selectedAccount = "";
    }

    ngOnDestroy() { // we will unsubscribe account collection susbscription when componen get destoryed.
        this.accountSub.unsubscribe();
    }

}
