// This component is used to generate income report of a year or a month in tabular form.

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
, 
    Subscription
} from 'rxjs';
import {
    MeteorObservable
} from 'meteor-rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    Csvdata,
    Head,
    Productcategory,
    Subcategory
} from '../../../../../../both/collections/csvdata.collection';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './incomereport.html';
import { StorageService } from './../../services/storage';
import { RemoveStorageService } from './../../services/removeStorage';

@Component({
    selector: 'incomereport',
    templateUrl: './incomereport.html',
    moduleId: module.id
})

export class IncomeReportComponent implements OnInit, OnDestroy {
    csvdata1: Observable<any[]>;
    csvdata: any;
    csvSub: Subscription;
    onPrint = false;
    date: any;
    monthvalue: any;
    yearvalue: any;

    categoryfound: any;
    subcategoryfound: any;
    categoryobservable: Observable<any[]>;
    categorylist: any;
    categorySub: Subscription;

    subcategoryobservable: Observable<any[]>;
    subcategorylist: any;
    subcategorySub: Subscription;

    monthwiselist: any;
    monthwisetotal: any;

    loading: boolean = false;
    expense_id: any;
    expense: Observable<any[]>;
    headSub: Subscription;
    constructor(public _remove: RemoveStorageService, public _local: StorageService, private _router: Router) { }

    ngOnInit() {
        this.date = moment();
        this.monthvalue = this.date.month() + 1;
        this.yearvalue = this.date.year();

        this.loading = true;
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
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
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

        this.categoryobservable = Productcategory.find({});
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.categoryobservable.subscribe((data) => {
            this.categorylist = data;
        });

        this.subcategoryobservable = Subcategory.find({});
        this.subcategoryobservable.subscribe((data) => {
            this.subcategorylist = data;
        });

        this.expense = Head.find({
            "head": "Income"
        });
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.expense.subscribe((data) => {
            this.expense_id = data[0] ? data[0]._id : '';
            if (this.expense_id) {
                this.csvdata1 = Csvdata.find({
                    "Assigned_head_id": this.expense_id
                }, {
                    sort: sort_order
                });
                this.csvdata1.subscribe((data1) => {
                    this.csvdata = data1;
                    var monthlist = {};
                    var monthtotal = {};
                    let crTotal = 0;
                    let drTotal = 0;
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
                        var key = month[month_value] + '-' + year;
                        if (!monthlist[key]) {
                            monthlist[key] = [];
                        }
                        if (!monthtotal[key]) {
                            monthtotal[key] = 0;
                        }
                        monthlist[key].push(item);
                        if (item["Cr/Dr"] == "CR") {
                            monthtotal[key] = monthtotal[key] + Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
                        } else {
                            monthtotal[key] = monthtotal[key] - Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
                        }
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
            }
        });
    }
    monthtotalformat(month) {
        return accounting.formatNumber(this.monthwisetotal[month], " ");
    }

    printfunction() {
        this.onPrint = true;
        setTimeout(() => {
            window.print();
            this.onPrint = false;
        }, 100)
    }
    trackByFn(index, item) {
        return item._id || index;
    }
    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.headSub.unsubscribe();
        this.subcategorySub.unsubscribe();
        this.categorySub.unsubscribe();
    }
}
