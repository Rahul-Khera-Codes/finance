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
, 
    Subscription
} from 'rxjs';
import {
    MeteorObservable
} from 'meteor-rxjs';
import * as _ from 'lodash';
import template from './salarydetails.html';
import { StorageService } from './../../services/storage';
import { RemoveStorageService } from './../../services/removeStorage';

@Component({
    selector: 'salarydetailsupload',
    templateUrl: './salarydetails.html',
    moduleId: module.id
})

export class SalaryDetailsUploadComponent implements OnInit, OnDestroy {
    uploading: boolean = false;
    successmessage: string = "Successfully uploaded";
    uploadprocess: boolean = false; //for showing progress bar
    messageshow: boolean = false; //for allowing to show message on screen

    filecontent: any;
    filecontentobs: Observable<any[]>;
    filecontentSub: Subscription;

    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private _router: Router) { }

    ngOnInit() {
        //**** time limit check condition
        if (this._local.getLocaldata("login_time")) {
            var login_time = new Date(this._local.getLocaldata("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
                console.log("Your session has expired. Please log in again");
                var self = this;
                this._remove.removeData();
                Meteor.logout(function (error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            } else {
                this._local.setLocalData("login_time", current_time.toString());
            }
        }

        this.filecontentobs = Salaryfiles.find({});
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
        var fileSelector: any = document.getElementById('files');
        var files = fileSelector.files;
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
