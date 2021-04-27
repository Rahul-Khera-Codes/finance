// This component is used to show list of all transaction notes whose invoice is attached now

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
, 
	Subscription
} from 'rxjs';
import {
	MeteorObservable
} from 'meteor-rxjs';
import {
	Mongo
} from 'meteor/mongo';
import * as _ from 'lodash';
import * as moment from 'moment';
import template from './completeinvoices.html';

@Component({
	selector: 'completeinvoice',
	templateUrl: './completeinvoices.html',
	moduleId: module.id
})
@InjectUser('user')
export class CompleteInvoices implements OnInit {
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
	constructor(private ngZone: NgZone, private _router: Router) { }

	ngOnInit() {
		this.loading = true;
		this.locationurl = window.location.origin; // getting url from browser
		this.date = moment(localStorage.getItem("Selected_financial_year"));
		this.monthvalue = this.date.month() + 1; // extracting current month value
		this.yearvalue = this.date.year(); // extracting current year value
		this.currentyear = parseInt(this.date.format('YYYY')); // gettting 4 digit year value
		if (parseInt(this.date.format('MM')) > 3) // checking FY using if condition
		{
			this.currentyearsearch = '04-01-' + this.currentyear;
			this.nextyear = this.currentyear + 1;
			this.nextyearsearch = '04-01-' + this.nextyear;
		} else {
			this.nextyear = this.currentyear;
			this.nextyearsearch = '04-01-' + this.nextyear;
			this.currentyearsearch = '04-01-' + --this.currentyear;
		}
		this.loadPendingInvoices(this.currentyearsearch, this.nextyearsearch); // for loading all pending invoice list
	}
	// this function will loading all pending invoice of current year.
	loadPendingInvoices(currentyear, nextyear) {
		this.loading = true;
		MeteorObservable.call("completeinvoiceloading", currentyear, nextyear).subscribe(
			(response) => {
				var self = this;
				self.ngZone.run(() => {
					// console.log(response);
					self.allPendingInvoicesData = response;
					self.extractMonthWiseData(); // after receiving data from about meteor method we call this function to format our data.
					self.loading = false;
				});
			}, (err) => {
				console.log(err);
			});
	}
	// extract month wise data will format our data into a structure which we can easliy use in table format to view
	extractMonthWiseData() {
		let monthlist = {}; // in monthlist we will get our formatted data
		for (var i = 0; i < this.allPendingInvoicesData.length; i++) { // applying forloop to format our data which is stored in allpending invoices
			let item = this.allPendingInvoicesData[i]; // taking out first item from our allpending invoice collection
			let d = new Date(item["Txn_Posted_Date"]);
			let year = d.getFullYear();
			let month_value = d.getMonth();
			let key = this.month[month_value]; // making a key in monthlist with month name
			if (!monthlist[key]) { // if monthlist don't have that key then we will create that key and initialize with empty array.
				monthlist[key] = [];
			}
			monthlist[key].push(item); // adding item into our current month key array
		}

		let list = [];
		_.forEach(monthlist, function (value, key) { // changing our monthlist into a key value pair.
			list.push({
				"key": key,
				"value": value
			})
		})
		this.monthwiselist = list;
		this.loading = false;
		// console.log(this.monthwiselist);
	}

	YearMinus() { // decrementing year value
		this.nextyear = this.currentyear;
		this.nextyearsearch = '04-01-' + this.nextyear;
		this.currentyearsearch = '04-01-' + --this.currentyear;
		this.loading = true;
		this.loadPendingInvoices(this.currentyearsearch, this.nextyearsearch);
	}

	YearPlus() { // incrementing year value
		this.currentyearsearch = '04-01-' + ++this.currentyear;
		this.nextyear = ++this.nextyear;
		this.nextyearsearch = '04-01-' + this.nextyear;
		this.loading = true;
		this.loadPendingInvoices(this.currentyearsearch, this.nextyearsearch);
	}
}
