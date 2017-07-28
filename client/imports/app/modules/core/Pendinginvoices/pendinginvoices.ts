// This component is to show all the transaction notes whose invoice are not attached till now

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
	Meteor
} from 'meteor/meteor';
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
	Mongo
} from 'meteor/mongo';
import * as _ from 'lodash';
import * as moment from 'moment';
import template from './pendinginvoices.html';

@Component({
	selector: 'pendinginvoice',
	template
})
@InjectUser('user')
export class PendingInvoices implements OnInit {
	user: Meteor.User;
	monthwiselist: any;
	loading: boolean = false;
	locationurl: any;
	date: any;
	currentyear: any;
	currentyearsearch: any;
	nextyear: any;
	nextyearsearch: any;
	allPendingInvoicesData: any;
	monthvalue: any;
	yearvalue: any;
	month: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	// in constructor we are importing ngzone and router services
	constructor(private ngZone: NgZone, private _router: Router) {}

	ngOnInit() {
		// here is the list of things we are doing at the time of component loading
		this.loading = true;
		this.locationurl = window.location.origin;
		this.date = moment(localStorage.getItem("Selected_financial_year")); // taking FY from localstroage
		this.monthvalue = this.date.month() + 1; // we are stroing month value in monthvalue variable
		this.yearvalue = this.date.year(); // stroing year value in yearvalue variable.
		this.currentyear = parseInt(this.date.format('YYYY')); // to get current year from date object.
		if (parseInt(this.date.format('MM')) > 3) // checking which FY > 3 means new FY
		{
			this.currentyearsearch = '04-01-' + this.currentyear;
			this.nextyear = this.currentyear + 1;
			this.nextyearsearch = '04-01-' + this.nextyear;
		} else {
			this.nextyear = this.currentyear;
			this.nextyearsearch = '04-01-' + this.nextyear;
			this.currentyearsearch = '04-01-' + --this.currentyear;
		}
		this.loadPendingInvoices(this.currentyearsearch, this.nextyearsearch);
	}
	// **** loadpending invoices funciton will load list of pending invoice transaction list
	loadPendingInvoices(currentyear, nextyear) {
		this.loading = true;
		MeteorObservable.call("pendinginvoiceloading", currentyear, nextyear).subscribe(
			(response) => {
				var self = this;
				self.ngZone.run(() => {
					// console.log(response);
					self.allPendingInvoicesData = response;
					self.extractMonthWiseData(); // extracting data in monthwise format
					self.loading = false;
				});
			}, (err) => {
				console.log(err);
			});
	}
	// here we are extracting in month wise format to show in tabular form
	extractMonthWiseData() {
		let monthlist = {}; // in month list we store our formatted data.
		for (var i = 0; i < this.allPendingInvoicesData.length; i++) { // for loop on retrieved data.
			let item = this.allPendingInvoicesData[i];
			let d = new Date(item["Txn_Posted_Date"]);
			let year = d.getFullYear();
			let month_value = d.getMonth();
			let key = this.month[month_value];
			if (!monthlist[key]) {
				monthlist[key] = []; // createing key if its not in our monthlist object..
			}
			monthlist[key].push(item); // pushing item in our mothhlist object under a key
		}

		let list = [];
		_.forEach(monthlist, function (value, key) { // formating monthlist data in array format to show using ngfor loop
			list.push({
				"key": key,
				"value": value
			})
		})
		this.monthwiselist = list;
		this.loading = false;
		// console.log(this.monthwiselist);
	}
	// decrementing year
	YearMinus() {
		this.nextyear = this.currentyear;
		this.nextyearsearch = '04-01-' + this.nextyear;
		this.currentyearsearch = '04-01-' + --this.currentyear;
		this.loading = true;
		this.loadPendingInvoices(this.currentyearsearch, this.nextyearsearch);
	}
	// incrementing year
	YearPlus() {
		this.currentyearsearch = '04-01-' + ++this.currentyear;
		this.nextyear = ++this.nextyear;
		this.nextyearsearch = '04-01-' + this.nextyear;
		this.loading = true;
		this.loadPendingInvoices(this.currentyearsearch, this.nextyearsearch);
	}
}
