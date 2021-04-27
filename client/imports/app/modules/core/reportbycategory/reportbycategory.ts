// this component is used to genrate report based on category list.
// its a dropdown list where we can select category and subcategory to generate table with total for each month

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
    Accounts_no,
    Subcategory
} from '../../../../../../both/collections/csvdata.collection';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './reportbycategory.html';
import { StorageService } from './../../services/storage';
import { RemoveStorageService } from './../../services/removeStorage';

@Component({
    selector: 'reportbycategory',
    templateUrl: './reportbycategory.html',
    moduleId: module.id
})

export class ReportByCategoryComponent implements OnInit, OnDestroy {
    csvdata1: Observable<any[]>;
    csvdata: any;
    csvSub: Subscription;

    account_code: any; // use for showing last 4 digit of account

    onPrint = false;
    categoryfound: any;
    subcategoryfound: any;
    categoryobservable: Observable<any[]>;
    categorylist: any;
    categorySub: Subscription;

    subcategoryobservable: Observable<any[]>;
    subcategorylist: any;
    subcategorySub: Subscription;
    selectedsubcategorylist: any;
    selectedsubcategory: any;
    callingparent: string;

    monthwiselist: any;
    monthwisetotal: any;
    selectedcategory: any;

    accountlist: Observable<any[]>;
    accountSub: Subscription;
    accountlistdata: any;

    loading: boolean = false;
    expense_id: any;
    headreport: Observable<any[]>;
    headlist: any;
    headSub: Subscription;
    headname: any;
    exporttext: any;

    // data related declaration
    date: any;
    monthvalue: any;
    yearvalue: any;
    currentmonth: any;
    nextmonth: any;
    displaymonthyear: string;
    toggleyearmonth: boolean = false;

    currentyear: any;
    currentyearsearch: any;
    nextyear: any;
    nextyearsearch: any;
    month: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private _router: Router) { }

    ngOnInit() {
        // code to subscribe all collection that required here.
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        // getting current data into our variables.
        this.date = moment(this._local.getLocaldata("Selected_financial_year"));
        this.currentmonth = moment(this._local.getLocaldata("Selected_financial_year")).date(1);
        this.displaymonthyear = moment(this._local.getLocaldata("Selected_financial_year")).format('MMMM YYYY');
        this.nextmonth = moment(this._local.getLocaldata("Selected_financial_year")).date(1).add(1, 'months');

        this.monthvalue = this.date.month() + 1;
        this.yearvalue = this.date.year();
        // code to check current financial year.
        this.currentyear = parseInt(this.date.format('YYYY'));
        if (parseInt(this.date.format('MM')) > 3) {
            this.currentyearsearch = '04-01-' + this.currentyear;
            this.nextyear = this.currentyear + 1;
            this.nextyearsearch = '04-01-' + this.nextyear;
        } else {
            this.nextyear = this.currentyear;
            this.nextyearsearch = '04-01-' + this.nextyear;
            this.currentyearsearch = '04-01-' + --this.currentyear;
        }

        //**** code to check if we logged a user based on time he login
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
        // loading head report collection.
        this.headreport = Head.find({});
        this.headreport.subscribe((data) => {
            this.ngZone.run(() => {
                this.headlist = data;
            });
        });
        // code to load all account details.
        this.accountlist = Accounts_no.find({});
        this.accountlist.subscribe((data) => {
            this.accountlistdata = data;
        });
        // code to load all categories into our system.
        this.categoryobservable = Productcategory.find({});
        this.categoryobservable.subscribe((data) => {
            this.categorylist = data;
        });
        // code to load all subcategory into our system.
        this.subcategoryobservable = Subcategory.find({});
        this.subcategoryobservable.subscribe((data) => {
            this.subcategorylist = data;
        });
    }
    // code to selecting a parent category & search database on that category base only.
    searchhead(selectedbyuser) {
        this.selectedcategory = selectedbyuser;
        this.selectedsubcategorylist = _.filter(this.subcategorylist, {
            "parent_id": selectedbyuser._id
        });
        this.selectedsubcategory = null;
        this.callingparent = "parentsearch";
        if (this.toggleyearmonth) {
            this.startsearchreportbycategorymonth(); // code to generate report month wise table
        } else {
            this.startsearchreportbycategory(); // code to generate report year wise table
        }
    }
    trackByFn(index, item) {
        return item._id || index;
    }
    // code to selecting a subcategory also & search database on that subcategory base only.
    subcategorySearchHead(selectedsubcategorybyuser) {
        this.selectedsubcategory = selectedsubcategorybyuser;
        this.callingparent = "subcategorysearch";
        if (this.toggleyearmonth) {
            this.startsearchreportbycategorymonth(); // code to generate report month wise table
        } else {
            this.startsearchreportbycategory(); // code to generate report year wise table
        }
    }
    // code to search report by category main
    startsearchreportbycategory() {
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.loading = true;
        if (this.callingparent == "parentsearch" && this.selectedcategory) { // only if parent category is selected
            // mongodb query to search for parent category id with year limit
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_parent_id": this.selectedcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentyearsearch),
                        $lt: new Date(this.nextyearsearch)
                    }
                }]
            }, {
                sort: sort_order
            });
        } else if (this.selectedsubcategory) { // only if subcategory is also selected.
            // mongdb query to search based on subcategory id and year limit.
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_category_id": this.selectedsubcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentyearsearch),
                        $lt: new Date(this.nextyearsearch)
                    }
                }]
            }, {
                sort: sort_order
            });
        }

        this.monthwiselist = null;
        this.csvdata1.subscribe((data1) => { // code to get get from above mongo queries.
            this.csvdata = data1;
            var monthlist = {}; // this will store month wise transaction list
            var monthtotal = {}; // this will store month wise total
            for (let i = 0; i < this.csvdata.length; i++) {
                var item = this.csvdata[i];
                var d = new Date(item["Txn_Posted_Date"]);
                var year = d.getFullYear();
                var month_value = d.getMonth();
                this.categoryfound = _.filter(this.categorylist, {
                    "_id": item["Assigned_parent_id"]
                });
                // code to extract subcategory list.
                this.subcategoryfound = _.filter(this.subcategorylist, {
                    "_id": item["Assigned_category_id"]
                });
                // code to extract category and subcategory name
                item["Assigned_Category"] = this.categoryfound[0] ? this.categoryfound[0].category : 'Not Assigned';
                item["Assigned_subcategory"] = this.subcategoryfound[0] ? this.subcategoryfound[0].category : 'Not Assigned';
                var key = this.month[month_value];
                // code to convert data into format
                if (!monthlist[key]) {
                    monthlist[key] = [];
                }
                if (!monthtotal[key]) {
                    monthtotal[key] = 0;
                }
                monthlist[key].push(item);
                // adding to month total object for key month.
                if (item["Cr/Dr"] == "CR") {
                    monthtotal[key] = monthtotal[key] + Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
                } else {
                    monthtotal[key] = monthtotal[key] - Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
                }
            }
            var list = [];
            // converting data into key value format.
            _.forEach(monthlist, function (value, key) {
                list.push({
                    "key": key,
                    "value": value
                })
            })
            this.loading = false;
            this.monthwisetotal = monthtotal;
            this.monthwiselist = list;
            // console.log(this.monthwiselist);
        });
        var self = this;
        setTimeout(function () {
            self.loading = false;
        }, 2000);
    }
    // code to search for report month wise.
    startsearchreportbycategorymonth() {
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.loading = true;
        if (this.callingparent == "parentsearch" && this.selectedcategory) {
            // mongodb query to search form category id and month limit.
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_parent_id": this.selectedcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentmonth.format('MM-DD-YYYY')),
                        $lt: new Date(this.nextmonth.format('MM-DD-YYYY'))
                    }
                }]
            }, {
                sort: sort_order
            });
        } else if (this.selectedsubcategory) {
            // mongodb query to serach for subcategory and month limit.
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_category_id": this.selectedsubcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentmonth.format('MM-DD-YYYY')),
                        $lt: new Date(this.nextmonth.format('MM-DD-YYYY'))
                    }
                }]
            }, {
                sort: sort_order
            });
        }

        this.monthwiselist = null;
        this.csvdata1.subscribe((data1) => {
            // converting data into showable format from above query.
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
            // console.log(this.monthwiselist);
        });
        var self = this;
        setTimeout(function () {
            self.loading = false;
        }, 2000);
    }
    // code to format month total value using accounting
    monthtotalformat(months) {
        return accounting.formatNumber(this.monthwisetotal[months], " ");
    }
    // code to show account no
    accountprint(id) {
        this.account_code = _.filter(this.accountlistdata, {
            "_id": id
        });
        return this.account_code[0] ? this.account_code[0].Account_no.slice(-4) : "processing";
    }
    // code to show head name if we have head id.
    headnamebyid(id) {
        this.headname = _.filter(this.headlist, {
            "_id": id
        });
        return this.headname[0] ? this.headname[0].head : "not assigned";
    }
    // code to print report.
    printfunction() {
        this.onPrint = true;
        setTimeout(() => {
            window.print();
            this.onPrint = false;
        }, 100)
    }
    // code to toggle month to year & year to month.
    toggleMonthYear() {
        console.log("toggle function is called");
        this.ngZone.run(() => {
            this.toggleyearmonth = !this.toggleyearmonth;
            if (this.selectedcategory || this.selectedsubcategory) {
                if (this.toggleyearmonth) {
                    this.startsearchreportbycategorymonth();
                } else {
                    this.startsearchreportbycategory();
                }
            }
        });
    }
    // incrementing month value.
    monthPlus() {
        // console.log("monthplus is called");
        this.currentmonth = this.currentmonth.add(1, 'months');
        this.nextmonth = this.nextmonth.add(1, 'months');
        this.displaymonthyear = this.currentmonth.format('MMMM YYYY');
        this.startsearchreportbycategorymonth();
    }
    // decremetning month value.
    monthMinus() {
        // console.log("month minus is called");
        this.nextmonth = this.nextmonth.subtract(1, 'months');
        this.currentmonth = this.currentmonth.subtract(1, 'months');
        this.displaymonthyear = this.currentmonth.format('MMMM YYYY');
        this.startsearchreportbycategorymonth();
    }
    // decrementing year value.
    YearMinus() {
        this.nextyear = this.currentyear;
        this.nextyearsearch = '04-01-' + this.nextyear;
        this.currentyearsearch = '04-01-' + --this.currentyear;
        if (this.selectedcategory) {
            this.startsearchreportbycategory();
        }
    }
    // incrementing year value.
    YearPlus() {
        this.currentyearsearch = '04-01-' + ++this.currentyear;
        this.nextyear = ++this.nextyear;
        this.nextyearsearch = '04-01-' + this.nextyear;
        if (this.selectedcategory) {
            this.startsearchreportbycategory();
        }
    }
    // code to exprot our table into csv format.
    exporttextfile() {
        this.exporttext = "";
        if (this.callingparent == "parentsearch") {
            // will run this code to export if only parent category is selected.
            this.exporttext += "Month,Transaction date,Transaction Id,Description,Assigned Category,Assigned Subcategory,Assigned Head,Account Number,CR/DR,Transaction Amount \n";
            var self = this;
            _.forEach(self.monthwiselist, function (value, key) {
                self.exporttext += value["key"] + "\n";
                _.forEach(value["value"], function (value1) {
                    self.exporttext += "," + moment(value1["Txn_Posted_Date"]).format("DD-MM-YY hh:mm:ss a") + "," + value1["Transaction_ID"] + "," + value1["Description"] + "," + value1["Assigned_Category"] + "," + value1["Assigned_subcategory"] + "," + self.headnamebyid(value1["Assigned_head_id"]) +
                        "," + "******" + self.accountprint(value1["AssignedAccountNo"]) + "," + value1["Cr/Dr"] + "," + value1["Transaction_Amount(INR)"] + "\n";
                });
                // console.log(self.exporttext);
            });
        } else {
            // will run this code only if child category is also selected.
            this.exporttext += "Month,Transaction date,Transaction Id,Description,Assigned Category,Assigned Subcategory,Assigned Head,Account Number,CR/DR,Transaction Amount \n";
            var self = this;
            _.forEach(self.monthwiselist, function (value, key) {
                self.exporttext += value["key"] + "\n";
                _.forEach(value["value"], function (value1) {
                    self.exporttext += "," + moment(value1["Txn_Posted_Date"]).format("DD-MM-YY hh:mm:ss a") + "," + value1["Transaction_ID"] + "," + value1["Description"] + "," + value1["Assigned_Category"] + "," + self.selectedsubcategory.category + "," + self.headnamebyid(value1["Assigned_head_id"]) +
                        "," + "******" + self.accountprint(value1["AssignedAccountNo"]) + "," + value1["Cr/Dr"] + "," + value1["Transaction_Amount(INR)"] + "\n";
                });
                // console.log(self.exporttext);
            });
        }
    }
    //unsubscribe all collection when component get destroyed.
    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.headSub.unsubscribe();
        this.categorySub.unsubscribe();
        this.subcategorySub.unsubscribe();
        this.accountSub.unsubscribe();
    }
}
