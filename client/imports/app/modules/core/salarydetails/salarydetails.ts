// this component is used to upload salary detail of month list

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
	Salaryfiles
} from '../../../../../../both/collections/csvdata.collection';
import {
	upload
} from '../../../../../../both/methods/fileuploadmethods';
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
import template from './salarydetails.html';


@Component({
	selector: 'salarydetailsupload',
	template
})

export class SalaryDetailsUploadComponent implements OnInit, OnDestroy {
	uploading: boolean = false;
	successmessage: string = "Successfully uploaded";
	uploadprocess: boolean = false; //for showing progress bar
	messageshow: boolean = false; //for allowing to show message on screen

	filecontent: any;
	filecontentobs: Observable < any[] > ;
	filecontentSub: Subscription;

	constructor(private ngZone: NgZone, private _router: Router) {}

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

		this.filecontentobs = Salaryfiles.find({}).zone();
		this.filecontentSub = MeteorObservable.subscribe('Salaryfiles').subscribe();
		this.filecontentobs.subscribe((data) => {
			this.ngZone.run(() => {
				this.filecontent = data;
			});
		});
	}

	handleFiles(form: NgForm) {
		this.messageshow = false;
		// Check for the various File API support.
		// this.accountselected = form.value.account;
		// this.DateFormatselected = form.value.DateFormat;
		// console.log(form.value);
		var files = document.getElementById('files').files;
		// console.log(files);
		this.uploading = true;
		// var r = new FileReader();
		// Meteor.call('upload', files, form.value.monthfile,(err,response)=>{
		//   if(err){
		//     console.log(err);
		//   }
		//   else{
		//     console.log(response);
		//   }
		// });

		upload(files[0], form.value.monthfile)
			.then(() => {
				this.ngZone.run(() => {
					this.uploading = false;
					this.messageshow = true;
					this.successmessage = "File Uploaded Sucessfully";
				});
			})
			.catch((error) => {
				this.ngZone.run(() => {
					this.uploading = false;
					this.messageshow = true;
					this.successmessage = `Something went wrong!` + error;
				});
			});
	}

	ngOnDestroy() {
		this.filecontentSub.unsubscribe();
	}
}
