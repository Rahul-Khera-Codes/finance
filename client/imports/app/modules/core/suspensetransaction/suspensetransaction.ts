// this component is used to show list of suspense transaction month wise

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
import * as _ from 'lodash';
import * as moment from 'moment';
import {
	Csvdata,
	Head,
	Productcategory
} from '../../../../../../both/collections/csvdata.collection';
import {
	accounting
} from 'meteor/iain:accounting';
import template from './suspensetransaction.html';
import * as AppConst from '../../../app.constant';

@Component({
	selector: 'suspensetrans',
	template
})

export class SuspenseTransComponent implements OnInit, OnDestroy {
	csvdata1: Observable < any[] > ;
	csvdata: any;
	csvSub: Subscription;

	date: any;
	monthvalue: any;
	yearvalue: any;

	selectedFinYear: any;
	current_year: any;
	next_year: any;

	categoryfound: any;
	categoryobservable: Observable < any[] > ;
	categorylist: any;
	categorySub: Subscription;

	monthwiselist: any;
	// monthwisetotal: any;

	loading: boolean = true;
	expense_id: any;
	// expense: Observable < any[] > ;
	// headSub: Subscription;
	constructor(private _router: Router) {

	}

	ngOnInit() {
		// this.loading = true;
		this.date = moment();
		this.monthvalue = this.date.month() + 1;
		this.yearvalue = this.date.year();
		var sort_order = {};
		sort_order["Txn_Posted_Date"] = -1;
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
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

		this.categoryobservable = Productcategory.find({}).zone();
		this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
		this.categoryobservable.subscribe((data) => {
			this.categorylist = data;
		});

		// this.expense = Head.find({
		//     "head": "Income"
		// });

		// this.headSub = MeteorObservable.subscribe('headlist').subscribe();
		// this.expense.subscribe((data) => {
		// this.expense_id = data[0] ? data[0]._id : '';
		// if (this.expense_id) {
		this.csvdata1 = Csvdata.find({
			"suspensetransaction": true
		}, {
			sort: sort_order
		}).zone();
		this.csvdata1.subscribe((data1) => {
			this.csvdata = data1;
			var monthlist = {};
			// var monthtotal = {};
			for (let i = 0; i < this.csvdata.length; i++) {
				var item = this.csvdata[i];
				var d = new Date(item["Txn_Posted_Date"]);
				var year = d.getFullYear();
				var month_value = d.getMonth();
				this.categoryfound = _.filter(this.categorylist, {
					"_id": item["Assigned_parent_id"]
				});
				item["Assigned_Category"] = this.categoryfound[0] ? this.categoryfound[0].category : 'Not Assigned';
				var key = month[month_value] + '-' + year;
				//	only show current financial year data*************
				var selectedFinYear = new Date(localStorage.getItem('Selected_financial_year'));
				var current_year = selectedFinYear.getFullYear();
				var next_year = selectedFinYear.getFullYear() + 1;
				if ((year == current_year && month_value >= AppConst.startingMonth) || (year == next_year && month_value <= AppConst.endingMonth)) {
					if (!monthlist[key]) {
						monthlist[key] = [];
					}
					// if(!monthtotal[key]){
					//   monthtotal[key]=0;
					// }
					monthlist[key].push(item);
				}
				// monthtotal[key]+= Math.round(accounting.unformat(item["Transaction_Amount(INR)"])*100)/100;
			}
			var list = [];
			_.forEach(monthlist, function (value, key) {
				list.push({
					"key": key,
					"value": value
				})
			})
			this.loading = false;
			// this.monthwisetotal=monthtotal;
			this.monthwiselist = list;
		});
		// }
		// });
	}
	// monthtotalformat(month) {
	//     return accounting.formatNumber(this.monthwisetotal[month], " ");
	// }

	printfunction() {
		window.print();
	}

	ngOnDestroy() {
		this.csvSub.unsubscribe();
		this.categorySub.unsubscribe();
		// this.headSub.unsubscribe();
	}
}
