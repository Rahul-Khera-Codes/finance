// reset password component is used to reset password of user.
import {
	Component,
	OnInit,
	OnDestroy,
	NgZone
} from '@angular/core';
import {
	Router,
	ActivatedRoute
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
import {
	matchingPasswords
} from '../core/adduserComponent/validators';
import template from './resetPassword.html';

import {
	Subscription
} from 'rxjs';
import {
	MeteorObservable
} from 'meteor-rxjs';
import {
	Users
} from '../../../../../both/collections/csvdata.collection';

@Component({
	selector: 'reset-password',
	templateUrl: './resetPassword.html',
	moduleId: module.id
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
	resetPasswordForm: FormGroup;
	token_id: string;
	tokenQuery: any;
	password: string;
	confirmPassword: string;
	showmessage: boolean;
	message: string;
	usersData: any;
	username: Subscription;
	user_token: any;
	user_name: any
	resetForm: boolean = false;
	wrongToken: boolean = false;

	constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router, private route: ActivatedRoute,) {

	}

	ngOnInit() {
		this.showmessage = false;

		//**get param data from route url
		this.tokenQuery = this.route.params.subscribe(params => {
			this.token_id = params['token'];
		});

		//**verify token to reset password
		this.usersData = MeteorObservable.subscribe('userData').subscribe(() => {
			this.username = Users.find({ 'services.password.reset.token': this.token_id }).subscribe(
				(data) => {
					this.user_token = data[0].services.password.reset.token;
					this.user_name = data[0].profile.name;
				});
			if (this.token_id !== this.user_token) {
				this.wrongToken = true;
			}
			else {
				this.resetForm = true;
			};
		});

		this.resetPasswordForm = this.formBuilder.group({ // this is the form used to reset user account password
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		}, {
			validator: matchingPasswords('password', 'confirmPassword')
		});
	};

	//***function called when user reset password
	setNewPassword() {
		var self = this;
		this.password = this.resetPasswordForm.controls['password'].value; // taking out password value
		this.confirmPassword = this.resetPasswordForm.controls['confirmPassword'].value; // taking out confirmPassword value

		if (this.password != '' && this.confirmPassword != '') {
			this.showmessage = false;
			if (this.password == this.confirmPassword) {
				this.showmessage = false;
				Accounts.resetPassword(this.token_id, this.confirmPassword, function (err) {
					if (err) {
						console.log('We are sorry but something went wrong.', err);
					} else {
						alert('Your password has been successfully changed. Welcome back!');
						Meteor.logout(function (error) {
							if (error) {
								console.log("ERROR: " + error.reason);
							} else {
								self._router.navigate(['/login']); // we are naviagating user back to login page.
							}
						});
					}
				});
			} else {
				this.showmessage = true;
				this.message = 'Password Not Matched';
			}
		} else {
			this.showmessage = true;
			this.message = 'Password field cannot be empty';
		}
	}

	ngOnDestroy() {
		this.username.unsubscribe();
	}
}
