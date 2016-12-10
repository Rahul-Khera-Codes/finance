import {
    Component,
    OnInit,
    OnDestroy
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
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
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
} from '../../../../both/collections/csvdata.collection';
import template from './accountstemplate.html';

@Component({
    selector: 'accounts',
    template
})

export class AccountComponent implements OnInit, OnDestroy {
    accountlist: Observable < any[] > ;
    selectedAccount: any;
    accountSub: Subscription;
    addForm: FormGroup;
    changevalue: string;
    constructor(private formBuilder: FormBuilder, private _router: Router) {}

    onSelect(accountselect: any): void {
        this.selectedAccount = accountselect;
    }

        ngOnInit() {
        //**** time limit check condition
        if (localStorage.getItem("login_time")) {
            var login_time = new Date(localStorage.getItem("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
                console.log("Your session has expired. Please log in again");
                var self = this;
                localStorage.removeItem('login_time');
                localStorage.removeItem('Meteor.loginToken');
                localStorage.removeItem('Meteor.loginTokenExpires');
                localStorage.removeItem('Meteor.userId');
                Meteor.logout(function(error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            }
        }

        this.accountlist = Accounts_no.find({}).zone();
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();

        this.addForm = this.formBuilder.group({
            Account_no: ['', Validators.required],
        });
    }

        addAccount() {
        if (this.addForm.valid) {
            Accounts_no.insert(this.addForm.value).zone();
            this.addForm.reset();
        }
    }

        updateAccount() {
        this.changevalue = this.addForm.controls['Account_no'].value;

        if (this.changevalue != null) {
            Accounts_no.update({
                _id: this.selectedAccount._id
            }, {
                $set: {
                    "Account_no": this.changevalue
                }
            }).zone();
            this.addForm.reset();
            this.selectedAccount = undefined;
        } else {
            this.addForm.reset();
            this.selectedAccount = undefined;
        }
    }

        removeAccount(category_id) {
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

        ngOnDestroy() {
        this.accountSub.unsubscribe();
    }

}