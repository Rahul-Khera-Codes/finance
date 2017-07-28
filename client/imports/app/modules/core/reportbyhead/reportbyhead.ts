// this component is used to generate report by head which we can select from dropdown

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
} from 'rxjs/Observable';
import {
	Subscription
} from 'rxjs/Subscription';
import {
	MeteorObservable
} from 'meteor-rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
	Csvdata,
	Head,
	Productcategory,
	Accounts_no,
	Subcategory
} from '../../../../../../both/collections/csvdata.collection';
import {
	accounting
} from 'meteor/iain:accounting';
import template from './reportbyhead.html';

@Component({
	selector: 'byreporthead',
	template
})

export class ReportByHeadComponent implements OnInit, OnDestroy {
	csvdata1: Observable < any[] > ;
	csvdata: any;
	csvSub: Subscription;


	categoryfound: any;
	subcategoryfound: any;
	categoryobservable: Observable < any[] > ;
	categorylist: any;
	categorySub: Subscription;

	subcategoryobservable: Observable < any[] > ;
	subcategorylist: any;
	subcategorySub: Subscription;

	account_code: any;
	accountlist: Observable < any[] > ;
	accountSub: Subscription;
	accountlistdata: any;

	monthwiselist: any;
	monthwisetotal: any;
	selectedhead: any;

	loading: boolean = false;
	expense_id: any;
	headreport: Observable < any[] > ;
	headlist: any;
	headSub: Subscription;

	date: any;
	monthvalue: any;
	yearvalue: any;
	currentmonth: any;
	nextmonth: any;
	currentyear: any;
	displaymonthyear: string;
	toggleyearmonth: boolean = false;

	filterunassignedboolean: boolean = false;

	// currentyear: any;
	currentyearsearch: any;
	nextyear: any;
	nextyearsearch: any;
	month: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	constructor(private ngZone: NgZone, private _router: Router) {}

	ngOnInit() {
		// code to subscribe to collections.
		this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
		this.headSub = MeteorObservable.subscribe('headlist').subscribe();
		this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
		this.headreport = Head.find({}).zone();
		this.headreport.subscribe((data) => {
			this.ngZone.run(() => {
				this.headlist = data;
			});
		});

		// code to select dates using moment.js
		this.date = moment(localStorage.getItem("Selected_financial_year"));
		this.currentmonth = moment(localStorage.getItem("Selected_financial_year")).date(1);
		this.displaymonthyear = moment(localStorage.getItem("Selected_financial_year")).format('MMMM YYYY');
		this.nextmonth = moment(localStorage.getItem("Selected_financial_year")).date(1).add(1, 'months');

		this.monthvalue = this.date.month() + 1;
		this.yearvalue = this.date.year();
		this.currentyear = parseInt(this.date.format('YYYY'));
		if (parseInt(this.date.format('MM')) > 3) { // code to select financial year.
			this.currentyearsearch = '04-01-' + this.currentyear;
			this.nextyear = this.currentyear + 1;
			this.nextyearsearch = '04-01-' + this.nextyear;
		} else {
			this.nextyear = this.currentyear;
			this.nextyearsearch = '04-01-' + this.nextyear;
			this.currentyearsearch = '04-01-' + --this.currentyear;
		}
		//**** code to log user out if its loggedin time is more then 1 hrs
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
				Meteor.logout(function (error) {
					if (error) {
						console.log("ERROR: " + error.reason);
					} else {
						self._router.navigate(['/login']);
					}
				});
			} else {
				localStorage.setItem("login_time", current_time.toString());
			}
		}
		// code to subscribe to category collections
		this.categoryobservable = Productcategory.find({}).zone();
		this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
		this.categoryobservable.subscribe((data) => {
			this.ngZone.run(() => {
				this.categorylist = data;
			});
		});
		// code to subscribe to subcategory collections
		this.subcategoryobservable = Subcategory.find({}).zone();
		this.subcategoryobservable.subscribe((data) => {
			this.subcategorylist = data;
		});
		// code to subscribe to account collections
		this.accountlist = Accounts_no.find({}).zone();
		this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
		this.accountlist.subscribe((data) => {
			this.ngZone.run(() => {
				this.accountlistdata = data;
			});
		});
	}
	// search on base of selected head.
	searchhead(headselectedbyuser) {
		this.selectedhead = headselectedbyuser;
		if (this.toggleyearmonth) {
			this.startsearchreportbyheadmonth(); // month wise search function
		} else {
			this.startsearchreportbyhead(); // year wise search function.
		}
	}
	// code to search for head
	startsearchreportbyhead() {
		var sort_order = {};
		sort_order["Txn_Posted_Date"] = 1;
		this.loading = true;
		if (this.filterunassignedboolean) {
			// mongod query search based on selected head and year limit and unassigned transaction
			this.csvdata1 = Csvdata.find({
				$and: [{
					"Assigned_head_id": this.selectedhead._id
				}, {
					"Assigned_parent_id": "not assigned"
				}, {
					"Txn_Posted_Date": {
						$gte: new Date(this.currentyearsearch),
						$lt: new Date(this.nextyearsearch)
					}
				}]
			}, {
				sort: sort_order
			}).zone();
		} else {
			// mongod query search based on selected head and year limit.
			this.csvdata1 = Csvdata.find({
				$and: [{
					"Assigned_head_id": this.selectedhead._id
				}, {
					"Txn_Posted_Date": {
						$gte: new Date(this.currentyearsearch),
						$lt: new Date(this.nextyearsearch)
					}
				}]
			}, {
				sort: sort_order
			}).zone();
		}
		// code to format retrieved data to show in tabluar form.
		this.csvdata1.subscribe((data1) => {
			this.csvdata = data1;
			var monthlist = {};
			var monthtotal = {};
			for (let i = 0; i < this.csvdata.length; i++) {
				var item = this.csvdata[i];
				var d = new Date(item["Txn_Posted_Date"]);
				var year = d.getFullYear();
				var month_value = d.getMonth();
				this.categoryfound = _.filter(this.categorylist, {
					"_id": item["Assigned_parent_id"]
				});
				this.subcategoryfound = _.filter(this.subcategorylist, {
					"_id": item["Assigned_category_id"]
				});
				item["Assigned_Category"] = this.categoryfound[0] ? this.categoryfound[0].category : 'Not Assigned';
				item["Assigned_subcategory"] = this.subcategoryfound[0] ? this.subcategoryfound[0].category : 'Not Assigned';
				var key = this.month[month_value];
				if (!monthlist[key]) {
					monthlist[key] = [];
				}
				if (!monthtotal[key]) {
					monthtotal[key] = 0;
				}
				monthlist[key].push(item);
				monthtotal[key] += Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
			}
			var list = [];
			_.forEach(monthlist, function (value, key) {
				list.push({
					"key": key,
					"value": value
				})
			})
			this.loading = false;
			this.monthwisetotal = monthtotal;
			this.monthwiselist = list;
		});
		var self = this;
		setTimeout(function () {
			self.loading = false;
		}, 1000);
		// }
		// });
	}
	// code to retrieve head report month wise.
	startsearchreportbyheadmonth() {
		var sort_order = {};
		sort_order["Txn_Posted_Date"] = 1;
		this.loading = true;
		if (this.filterunassignedboolean) {
			// / mongod query search based on selected head and month limit and not assigned parent id
			this.csvdata1 = Csvdata.find({
				$and: [{
					"Assigned_head_id": this.selectedhead._id
				}, {
					"Assigned_parent_id": "not assigned"
				}, {
					"Txn_Posted_Date": {
						$gte: new Date(this.currentmonth.format('MM-DD-YYYY')),
						$lt: new Date(this.nextmonth.format('MM-DD-YYYY'))
					}
				}]
			}, {
				sort: sort_order
			}).zone();
		} else {
			// mongod query search based on selected head and month limit.
			this.csvdata1 = Csvdata.find({
				$and: [{
					"Assigned_head_id": this.selectedhead._id
				}, {
					"Txn_Posted_Date": {
						$gte: new Date(this.currentmonth.format('MM-DD-YYYY')),
						$lt: new Date(this.nextmonth.format('MM-DD-YYYY'))
					}
				}]
			}, {
				sort: sort_order
			}).zone();
		}

		this.csvdata1.subscribe((data1) => {
			this.csvdata = data1;
			var monthlist = {};
			var monthtotal = {};
			for (let i = 0; i < this.csvdata.length; i++) {
				var item = this.csvdata[i];
				var d = new Date(item["Txn_Posted_Date"]);
				var year = d.getFullYear();
				var month_value = d.getMonth();
				this.categoryfound = _.filter(this.categorylist, {
					"_id": item["Assigned_parent_id"]
				});
				this.subcategoryfound = _.filter(this.subcategorylist, {
					"_id": item["Assigned_category_id"]
				});
				item["Assigned_Category"] = this.categoryfound[0] ? this.categoryfound[0].category : 'Not Assigned';
				item["Assigned_subcategory"] = this.subcategoryfound[0] ? this.subcategoryfound[0].category : 'Not Assigned';
				var key = this.month[month_value];
				if (!monthlist[key]) {
					monthlist[key] = [];
				}
				if (!monthtotal[key]) {
					monthtotal[key] = 0;
				}
				monthlist[key].push(item);
				monthtotal[key] += Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
			}
			var list = [];
			// changing data into key value pair.
			_.forEach(monthlist, function (value, key) {
				list.push({
					"key": key,
					"value": value
				})
			})
			this.loading = false;
			this.monthwisetotal = monthtotal;
			this.monthwiselist = list;
		});
		var self = this;
		setTimeout(function () {
			self.loading = false;
		}, 1000);
		// }
		// });
	}
	// code to format total value using accounting.
	monthtotalformat(months) {
		return accounting.formatNumber(this.monthwisetotal[months], " ");
	}
	// code to print report
	printfunction() {
		window.print();
	}
	// code to show account no if we have its id.
	accountprint(id) {
		this.account_code = _.filter(this.accountlistdata, {
			"_id": id
		});
		return this.account_code[0] ? this.account_code[0].Account_no.slice(-4) : "not Assigned";
	}
	// code to decrement year value.
	YearMinus() {
		this.nextyear = this.currentyear;
		this.nextyearsearch = '04-01-' + this.nextyear;
		this.currentyearsearch = '04-01-' + --this.currentyear;
		if (this.selectedhead) {
			this.startsearchreportbyhead();
		}
	}
	// code to incremnt year value.
	YearPlus() {
		this.currentyearsearch = '04-01-' + ++this.currentyear;
		this.nextyear = ++this.nextyear;
		this.nextyearsearch = '04-01-' + this.nextyear;
		if (this.selectedhead) {
			this.startsearchreportbyhead();
		}
	}
	// code to incremtn month value.
	monthPlus() {
		// console.log("monthplus is called");
		this.currentmonth = this.currentmonth.add(1, 'months');
		this.nextmonth = this.nextmonth.add(1, 'months');
		this.displaymonthyear = this.currentmonth.format('MMMM YYYY');
		this.startsearchreportbyheadmonth();
	}
	// code to increment year value.
	monthMinus() {
		// console.log("month minus is called");
		this.nextmonth = this.nextmonth.subtract(1, 'months');
		this.currentmonth = this.currentmonth.subtract(1, 'months');
		this.displaymonthyear = this.currentmonth.format('MMMM YYYY');
		this.startsearchreportbyheadmonth();
	}
	// code to filter only unassigned transactions
	filterunassigned() {
		this.filterunassignedboolean = !this.filterunassignedboolean;
		if (this.toggleyearmonth && this.selectedhead) {
			this.startsearchreportbyheadmonth();
		} else if (this.selectedhead) {
			this.startsearchreportbyhead();
		}
		// });
	}
	// code to change from year to month and month to year.
	toggleMonthYear() {
		this.ngZone.run(() => {
			this.toggleyearmonth = !this.toggleyearmonth;
			if (this.toggleyearmonth && this.selectedhead) {
				this.startsearchreportbyheadmonth();
			} else if (this.selectedhead) {
				this.startsearchreportbyhead();
			}
		});
	}
	// unsubscribe all collection when component get destroyed.
	ngOnDestroy() {
		this.csvSub.unsubscribe();
		this.headSub.unsubscribe();
		this.categorySub.unsubscribe();
		this.subcategorySub.unsubscribe();
		this.accountSub.unsubscribe();
	}
}
