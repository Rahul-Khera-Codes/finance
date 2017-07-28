// This component is transaction note, it will show our transaction note details.

import {
	Component,
	OnInit,
	Input,
	Output,
	OnChanges,
	OnDestroy,
	NgZone
} from '@angular/core';
import {
	UserComponent
} from './userComponent/user.component';
import {
	CategoryComponent
} from './categoryComponent/category.component';
import {
	Row
} from '../../../../../../../both/interfaces/row.model';
import {
	message
} from '../../../../../../../both/interfaces/message.model';
import {
	InvoiceComponent
} from './invoiceComponent/invoice.component';
import {
	suggestionComponent
} from './suggestoptionComponent/suggestoption.component';
import {
	InjectUser
} from 'angular2-meteor-accounts-ui';
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
	Roles
} from 'meteor/alanning:roles';
import {
	Meteor
} from 'meteor/meteor';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
	Productcategory,
	Subcategory,
	Comments
} from '../../../../../../../both/collections/csvdata.collection';
import {
	NgForm
} from '@angular/forms';
import template from './transaction.html';

@Component({
	selector: '[transaction]',
	template
})
@InjectUser('user')
export class TransactionComponent implements OnInit, OnChanges {

	commentlist: Observable < message[] > ;
	commentlistdata: any;
	commentSub: Subscription;

	user: Meteor.User;
	adminuseremail: string;
	Income_id: string;
	Expense_id: string;
	show_head: any;
	change_color: boolean = false;
	asset_transaction: boolean = false;
	transaction_time: any;
	account_code: any;
	locationurl: any;
	transactionassigneduser: any;
	account_codestring: string = "************";
	havesomecomment: boolean = false;

	dateforemail: any;
	dateforemailmonth: any;
	dateforemailyear: any;
	// list of inputs we are getting from parent component
	@Input() transaction_data: Row;
	@Input() parent_category_array: any;
	@Input() sub_category_array: any;
	@Input() head_array_transaction_list: any;
	@Input() income: any;
	@Input() expense: any;
	@Input() assets: any;
	@Input() listofaccounts: any;
	@Input() alluserlist: any;
	@Input() emailpatternlists: any;
	// isCopied1: boolean = false;
	constructor(private ngZone: NgZone) {}
	ngOnInit() { // code to run when our component get created
		this.dateforemail = new Date();
		this.dateforemailmonth = this.dateforemail.getMonth() + 1;
		this.dateforemailyear = this.dateforemail.getFullYear();
		this.locationurl = window.location.origin;
		this.loadcommentdata(this.transaction_data['_id']);
		// this.commentlist = Comments.find({"transactionid":this.transaction_data['_id']}).zone();
		// this.commentSub = MeteorObservable.subscribe('Commentslist', this.transaction_data['_id']).subscribe();
	}
	// ng change here is used to save system from issue when there is delay in loading data from parent component
	ngOnChanges(changes: {
		[propName: string]: any
	}) {
		if (changes["income"]) {
			this.Income_id = changes["income"].currentValue;
		}
		if (changes["expense"]) {
			this.Expense_id = changes["expense"].currentValue;
		}
		if (this.transaction_data['Assigned_head_id'] !== undefined && this.Income_id != undefined && this.Expense_id != undefined) {
			if (this.transaction_data['Assigned_head_id'] !== this.Income_id && this.transaction_data['Assigned_head_id'] !== this.Expense_id && this.transaction_data['Assigned_head_id'] !== this.assets) {
				this.change_color = true;
				this.asset_transaction = false;
			} else if (this.transaction_data['Assigned_head_id'] !== this.Income_id && this.transaction_data['Assigned_head_id'] !== this.Expense_id && this.transaction_data['Assigned_head_id'] == this.assets) {
				this.change_color = true;
				this.asset_transaction = true;
			} else {
				this.change_color = false;
			}
		}

		if (changes["listofaccounts"] && changes["listofaccounts"].currentValue && this.transaction_data["AssignedAccountNo"] !== undefined) {
			this.filteraccount();
		}

		if (changes["alluserlist"] && changes["alluserlist"].currentValue) {
			this.filteradmin();
		}
	}
	// code to load all comment in comment dialog when we load that transaction note component.
	loadcommentdata(id: string) {
		this.commentlist = Comments.find({
			"transactionid": id
		}).zone();
		this.commentSub = MeteorObservable.subscribe('Commentslist', id).subscribe();
		this.commentlist.subscribe((data) => {
			this.ngZone.run(() => {
				this.commentlistdata = data;
				this.havesomecomment = true;
			});
		});
	}

	filteradmin() {
		for (var i = 0; i < this.alluserlist.length; i++) {
			if (Roles.userIsInRole(this.alluserlist[i]["_id"], 'admin')) {
				this.adminuseremail = this.alluserlist[i]["emails"][0]["address"];
			}
			if (this.alluserlist[i]["_id"] == this.transaction_data["Assigned_user_id"]) {
				this.transactionassigneduser = this.alluserlist[i];
				// console.log(this.transactionassigneduser.emails[0].address);
			}
		}
	}

	filteraccount() {
		this.account_code = _.filter(this.listofaccounts, {
			"_id": this.transaction_data["AssignedAccountNo"]
		});
		this.account_codestring = this.account_code[0] ? this.account_code[0].Account_no.slice(-4) : "not assigned";
	}
	// code to add new commment into any transaction note
	addcomment(form: NgForm) {
		console.log("add comment function is called successfully");
		if (form.value.comment != '') {
			Comments.insert({ // mongo query to insert new comment into our system.
				"transactionid": this.transaction_data["_id"],
				"ownerid": Meteor.userId(),
				"ownername": this.user.username,
				"messagecontent": form.value.comment,
				"createdat": new Date()
			});
			// http://link/csvtemplate/csvtimeline/2/2017?comment_id=S2878923908
			// code to send email to user who is assigned to that transaction from admin
			if (Roles.userIsInRole(Meteor.userId(), 'admin') && this.transactionassigneduser && this.transactionassigneduser.emails) {
				Meteor.call('sendEmail', this.transactionassigneduser.emails[0].address, 'admin@excellencetechnologies.com', 'You have a new comment on transaction ' + this.transaction_data['Transaction_ID'],
					'Hi,<br><br>You have a new comment on transaction ' + this.transaction_data['Transaction_ID'] +
					'<br>comment: ' + form.value.comment + '<br>' +
					'<a href="' + this.locationurl + '/csvtemplate/csvtimeline/' + this.dateforemailmonth + '/' + this.dateforemailyear + '?comment_id=' + this.transaction_data["_id"] + '">Click here to check</a><br/><br/> ' + 'Thanks<br>',
					(error, response) => {
						if (error) {
							console.log(error.reason);
						} else {
							console.log("An email sent to assigned user successfully");
						}
					});
				// code to send email to admin when assigned user reply to that transaction
			} else if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Meteor.call('sendEmail', this.adminuseremail, 'admin@excellencetechnologies.com', 'You have a new comment on transaction ' + this.transaction_data['Transaction_ID'],
					'Hi,<br><br>You have a new comment on transaction ' + this.transaction_data['Transaction_ID'] +
					'<br>comment: ' + form.value.comment + '<br>' +
					'<a href="' + this.locationurl + '/csvtemplate/csvtimeline/' + this.dateforemailmonth + '/' + this.dateforemailyear + '?comment_id=' + this.transaction_data["_id"] + '">Click here to check</a><br/><br/> ' + 'Thanks<br>',
					(error, response) => {
						if (error) {
							console.log(error.reason);
						} else {
							console.log("An email sent to admin successfully");
						}
					});
			}
			form.reset();
		}
	}
	// code to delete transaction note comments. here id is comment _id and owner id is assigned user id or admin id
	deletecomment(id, ownerid) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin') || Meteor.userId() == ownerid) {
			Comments.remove({
				"_id": id
			});
			console.log("message deleted successfully");
		}
	}
	// code to add any transaction note into suspense transaction list.
	addtosuspenselist(id) {
		Meteor.call('addtosuspenselist', id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
	}
	// code to remove any transaction note from suspense transaction list.
	removefromsuspenselist(id) {
		Meteor.call('removefromsuspenselist', id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
	}
	// code to remove any transaction note from transaction list.
	removeTransactionNote(transaction_id) {
		Meteor.call('removeTransaction', transaction_id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
	}
	// here we are unsubscribing from comment collection to save system from memory leak.
	ngOnDestroy() {
		this.commentSub.unsubscribe();
	}

}
