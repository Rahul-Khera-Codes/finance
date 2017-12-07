// This component is used upload new csv file into our database

import {
	Component,
	OnInit,
	Input,
	OnDestroy,
	NgZone
} from '@angular/core';
import {
	NgForm
} from '@angular/forms';
import {
	Mongo
} from 'meteor/mongo';
import {
	Meteor
} from 'meteor/meteor';
import {
	Router
} from '@angular/router';
import {
	Csvdata,
	Productcategory,
	Subcategory,
	Head,
	Accounts_no,
	uploadcsvcollection
} from '../../../../../../both/collections/csvdata.collection';
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
// import {
//     Papa
// }from 'meteor/harrison:papa-parse';
import template from './csvjsoncomponent.html';


@Component({
	selector: 'csvjson',
	template
})

export class CsvJsonComponent implements OnInit, OnDestroy {
	// these variable will store income id and expense id
	Income: Observable < any[] > ;
	Incomevalue: any;
	Expense: Observable < any[] > ;
	Expensevalue: any;
	headSub: Subscription;
	// in these variable we will store all our account related values
	accountlistvalue: any;
	accountlist: Observable < any[] > ;
	accountSub: Subscription;
	accountselected: string;
	DateFormatselected: string;

	uploadresult: any;
	addedstring: any;
	uploadstring: any;
	successmessage: string = "checking";
	uploadprocess: boolean = false;
	messageshow: boolean = false;
	// these variables are used to detect repeated transaction id in uploaded csv file
	repeateidarray: any[] = [];
	filecontainduplicate: boolean = false;
	duplicatearraylist: any[];
	originalarraylist: any[];
	foundelement: any;
	csvuploadData:Observable <any[]>;
	csvUploadSub:Subscription;
	latestdata:any;
	lastUpdate:boolean=false;
	filename:any;

	constructor(private ngZone: NgZone, private _router: Router) {}

	ngOnInit() {
		//**** time limit check condition if it excced 1 hrs
		// if login time is more than 1 hr then we should logout the user.
		if (localStorage.getItem("login_time")) {
			var login_time = new Date(localStorage.getItem("login_time"));
			var current_time = new Date();
			var diff = (current_time.getTime() - login_time.getTime()) / 1000;
			if (diff > 3600) {
				console.log("Your session has expired. Please log in again");
				var self = this;
				localStorage.removeItem('login_time'); // removing login time from localstorage
				localStorage.removeItem('Meteor.loginToken'); // rm login tokens
				localStorage.removeItem('Meteor.loginTokenExpires'); // from localstorage
				localStorage.removeItem('Meteor.userId'); // rm user id also from localstorage
				Meteor.logout(function (error) {
					if (error) {
						console.log("ERROR: " + error.reason);
					} else {
						self._router.navigate(['/login']); // we are naviagating user back to login page.
					}
				});
			} else {
				// if login time is less then one hour we increment login time so that user don't face difficulty
				localStorage.setItem("login_time", current_time.toString());
			}
		}
		// code to load account list in csv json component
		this.accountlist = Accounts_no.find({}).zone();
		this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
		this.accountlist.subscribe((data) => {
			this.ngZone.run(() => {
				this.accountlistvalue = data;
			});
		});

		this.Income = Head.find({ //extracting Income head id
			"head": "Income"
		}).zone();
		this.Expense = Head.find({ // extracting Expense head id
			"head": "Expense"
		}).zone();
		this.headSub = MeteorObservable.subscribe('headlist').subscribe();
		this.Income.subscribe((data) => {
			this.ngZone.run(() => {
				this.Incomevalue = data;
			});
		});
		this.Expense.subscribe((data) => {
			this.ngZone.run(() => {
				this.Expensevalue = data;
			});
		});
	 	this.lastupdateddata();
	 }

	// code to handle csv file upload in our system
	handleFiles(form: NgForm) {
		
		// Check for the various File API support.
		this.accountselected = form.value.account;
		this.DateFormatselected = form.value.DateFormat;
		this.repeateidarray.length = 0;
		console.log("Selected Account Number " + this.accountselected);
		console.log("Selected Date format" + this.DateFormatselected);
		var self = this;
		 // self.uploadprocess = true;
		self.messageshow = false;
		self.filecontainduplicate = false;
		var files = document.getElementById('files').files;
		self.filename=files[0].name;
		console.log(">>>>>>>>>>>>>>>>>>>files are",self.filename);
		//for using papa-parse type " meteor add harrison:papa-parse " in console
		Papa.parse(files[0], {
			header: true,
			complete(results, file) {
				self.checkduplicatetransaction(results.data)
			}
		});
	}
	// function to check if there is any duplicate transaction id in our system
	checkduplicatetransaction(transactionlist: any) {
		console.log(transactionlist);
		for (var i = 0; i < transactionlist.length; i++) {
			for (var j = 0; j < transactionlist.length; j++) {
				if (transactionlist[i]["Transaction ID"] == transactionlist[j]["Transaction ID"] && transactionlist[i]["Cr/Dr"] == transactionlist[j]["Cr/Dr"] && transactionlist[i]["ChequeNo."] == transactionlist[j]["ChequeNo."] && transactionlist[i]["No."] != transactionlist[j]["No."]) {
					// console.log("this data is repeated");
					this.repeatarrayid(transactionlist[i]);
				}
			}
		}
		console.log(this.repeateidarray);
		if (this.repeateidarray.length > 0) { // running this code if our csv file have duplicate transaction id's
			this.originalarraylist = transactionlist;
			this.duplicatearraylist = _.cloneDeep(transactionlist);
			this.ngZone.run(() => {
				this.filecontainduplicate = true;
			});
		} else { // if there is no duplicate transaction id then we will upload our csv file
			this.originalarraylist = transactionlist;
			this.duplicatearraylist = transactionlist;
			this.finalupload(); // main function to upload csv file
		}
	}

	repeatarrayid(id) {
		// console.log("repeatearrayis called");
		// if (this.repeateidarray.indexOf(id) == -1) {
		//     this.repeateidarray.push(id);
		// }
		this.foundelement = null;
		this.foundelement = _.find(this.repeateidarray, {
			'Transaction ID': id['Transaction ID'],
			'Cr/Dr': id['Cr/Dr'],
			'ChequeNo.': id['ChequeNo.']
		});
		if (!this.foundelement) {
			 this.repeateidarray.push(id);
		} else {
			console.log(this.foundelement);
		}
	}

	matchtransaction(id, cr_dr, chequeno) {

		this.foundelement = _.find(this.repeateidarray, {
			'Transaction ID': id,
			'Cr/Dr': cr_dr,
			'ChequeNo.': chequeno
		});
		if (!this.foundelement) {
			return false;
		} else {
			return true;
		}
	}

	finalupload() { // main function to upload csv file if there is no issue
		this.lastUpdate=false;
		console.log("finalupload is called");
		for (let i = 0; i < this.repeateidarray.length; i++) {
			console.log("executing loop");
			let duplicate = 0;
			for (let j = 0; j < this.duplicatearraylist.length; j++) {
				if (this.repeateidarray[i]["Transaction ID"] == this.duplicatearraylist[j]["Transaction ID"] && this.repeateidarray[i]["Cr/Dr"] == this.duplicatearraylist[j]["Cr/Dr"] && this.repeateidarray[i]["ChequeNo."] == this.duplicatearraylist[j]["ChequeNo."]) {
					if (duplicate == 0) {
						duplicate++;
					} else {
						this.duplicatearraylist[j]["Transaction ID"] = this.duplicatearraylist[j]["Transaction ID"] + duplicate + duplicate;
						console.log(this.duplicatearraylist[j]["Transaction ID"] + duplicate + duplicate);
						console.log(this.duplicatearraylist[j]["Transaction ID"]);
						duplicate++;
					}
				}
			}
		}
		console.log("finalvalue that we will upload");
		console.log(this.duplicatearraylist);
         this.uploadprocess = true;
      
		var self = this;
		self.uploadprocess = true;
		 self.messageshow = false;

		self.filecontainduplicate = false;
		// Meteor method to upload csv file here we are passing our csv array list, income id, expense id, date format in which we want our data to store
		Meteor.call('parseUpload', self.duplicatearraylist, self.Incomevalue[0]._id, self.Expensevalue[0]._id, self.accountselected, self.DateFormatselected, self.filename ,(error, response) => {
			if (!response) {
				console.log(">>>>>>>>>>>>>>>>>>>>>>>.wefwefwefwefwefwefwefewfwef");
				console.log(error);
				// this.uploadfail();
				self.ngZone.run(() => { // show error when data not uploaded successfully
					self.messageshow = true;
					self.successmessage = "Document not uploaded ";
					self.uploadprocess = false;
					self.lastUpdate = true;
					self.lastupdateddata();
				});
			} else {
				self.ngZone.run(() => { // show success message with formatted data if upload is successfull
					console.log(">>>>>>>>>>>>>>>>>>>>>>>",response);
					self.uploadresult = response;
					self.processdata(response);
					console.log(self.uploadresult);
					self.messageshow = true;
					self.uploadprocess = false;
					self.successmessage = "Document Uploaded Sucessfully";
					self.duplicatearraylist.length = 0;
					self.originalarraylist.length = 0;
					self.filecontainduplicate = false;
					self.lastUpdate = true;
					self.lastupdateddata();
				});
			}
		});
	}
	// function that will removed some transaction if we get any duplicate transaction id when we upload csv file
	transactionremoved(clickvalue, transactionclickeddata) {
		console.log(clickvalue.target.checked)
		// console.log("this transaction is unselected ");
		console.log(transactionclickeddata);
		if (clickvalue.target.checked == false) {
			for (var i = 0; i < this.duplicatearraylist.length; i++) {
				var obj = this.duplicatearraylist[i];
				if (transactionclickeddata["No."] == obj["No."]) {
					this.duplicatearraylist.splice(i, 1);
				}
			}
		} else {
			this.duplicatearraylist.push(transactionclickeddata);
		}
		console.log("arraylist value now ");
		console.log(this.duplicatearraylist);
	}
	// function to show info for which month how many transaction have been uploaded
	// in response we will get all month wise list of transaction added, updated info.
	processdata(response) {
		this.uploadresult["addedstring"] = new Array();
		this.uploadresult["updatedstring"] = new Array();
		var dummyfeed = new Array();
		_.forEach(this.uploadresult.added, function (value, key) { // foreach to change data into key value pair of new added transactions
			var data = {
				"key": key,
				"value": value
			};
			console.log(data);
			dummyfeed.push(data);
		});
		this.uploadresult["addedstring"] = dummyfeed;
		dummyfeed = [];

		_.forEach(this.uploadresult.updated, function (value, key) { // foreach to change data into key value pair of updated transactions
			var data = {
				"key": key,
				"value": value
			};
			console.log(data);
			dummyfeed.push(data);
		});
		this.uploadresult["updatedstring"] = dummyfeed;
	}
	lastupdateddata() {
	this.csvuploadData = uploadcsvcollection.find({}, {
		sort: {
			"lastUpdated": -1
		}
	})
	this.csvUploadSub = MeteorObservable.subscribe('csvuploadfiles').subscribe();
	this.csvuploadData.subscribe((data) => {
		
	this.lastUpdate = true;
	this.latestdata = [data[0]];
	console.log(this.latestdata);
	


	}); //extracting latest data
}
	ngOnDestroy() {
		this.headSub.unsubscribe();
		this.accountSub.unsubscribe();
		this.csvUploadSub.unsubscribe();
	}
}
