// reset password component is used to reset password of user.
import {
	Component,
	OnInit,
	NgZone
}
from '@angular/core';
import {
	Router,
	ActivatedRoute
}
from '@angular/router';
import {
	Mongo
}
from 'meteor/mongo';
import {
	Meteor
}
from 'meteor/meteor';

import {
	FormGroup,
	FormBuilder,
	Validators
}
from '@angular/forms';
import {
	matchingPasswords
} from '../core/adduserComponent/validators';
import template from './resetPassword.html';

@
Component({
	selector: 'reset-password',
	template
})

export class ResetPasswordComponent implements OnInit {
	resetPasswordForm: FormGroup;
	token_id: string;
	tokenQuery: any;
	password: string;
	confirmPassword: string;
	showmessage: boolean;
	message: string;

	constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router, private route: ActivatedRoute, ) {

	}

	ngOnInit() {
		this.showmessage = false;

		this.tokenQuery = this.route.params.subscribe(params => {
			this.token_id = params['token'];
		});
		this.resetPasswordForm = this.formBuilder.group({ // this is the form used to reset user account password
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		}, {
			validator: matchingPasswords('password', 'confirmPassword')
		});
	};

	//function called when user reset password
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
}
