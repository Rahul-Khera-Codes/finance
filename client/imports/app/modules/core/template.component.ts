// This is the main template component which is opened when we login
import {
	Component,
	OnInit,
	NgZone
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
import {
	SharedNavigationService
} from '../services/navigationbar.service';

import template from './template.html';

@Component({
	selector: 'csvtemplate',
	template
})
@InjectUser('user')
export class TemplateComponent implements OnInit {
	// list of variables used in our template componenets
	logoutprocess: boolean;
	user: Meteor.User;
	current_date: any;
	current_month: any;
	current_year: any;
	open: boolean = false;
	widthvalue: boolean = false;
	widthvalues: string;
	leftvalues: string;
	constructor(private ngZone: NgZone, private _router: Router, private navvalue: SharedNavigationService) {}

	ngOnInit() {
		// code to run when we are loading template component.
		this.navvalue.changeEmitted$.subscribe((data) => {
			console.log(data);
		});
		this.logoutprocess = false;
		// storing current financial year in current date variable.
		this.current_date = new Date(localStorage.getItem("Selected_financial_year"));
		this.current_month = this.current_date.getMonth() + 1; // storing current month value
		this.current_year = this.current_date.getFullYear(); // storing current year value
		// if user is admin role then redirect user to dashboard component
		if (this.user && this.user.profile.role == 'admin') {
			this._router.navigate(['csvtemplate/dashboard']);
		}
	}
	expend() { // this is the function used to expend side nav menu report list
		var self = this;
		self.ngZone.run(() => {
			this.open = !this.open;
		});
	}
	// this is code to logout user from system.
	logout() {
		var self = this;
		self.logoutprocess = true; // starting loader
		// localStorage.removeItem('login_time');
		// calling meteor logout method to logout user from system.
		Meteor.logout(function (error) {
			if (error) {
				console.log("ERROR: " + error.reason);
			} else { // if logout is succesfull then redirect user to login component.
				self._router.navigate(['/login']);
			}
		});
	}
	// this is code for mobile devices to open side menu
	openMobileMenu() {
		this.ngZone.run(() => {
			this.widthvalue = !this.widthvalue;
			if (this.widthvalue) { // increasing width of side nav component
				this.widthvalues = "200px";
				this.leftvalues = '200px';
			} else { // descresing width of side nav component when we hide side nav
				this.widthvalues = "0px";
				this.leftvalues = '18px';
			}
		});
	}
}
