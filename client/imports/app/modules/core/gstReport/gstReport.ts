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
    Gst
} from '../../../../../../both/collections/csvdata.collection';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './gstReport.html';

import { StorageService } from './../../services/storage';
import { RemoveStorageService } from './../../services/removeStorage';

@Component({
    selector: 'reportbycategory',
    templateUrl: './gstReport.html',
    moduleId: module.id
})

export class GstReportComponent implements OnInit, OnDestroy {
    csvdata1: Observable<any[]>;
    csvdata: any;
    csvSub: Subscription;
    date: any;
    monthvalue: any;
    yearvalue: any;
    monthwiselist: any;
    monthwisetotal: any;
    loading: boolean = false;
    gstSub: Subscription;
    month = new Array();
    limitLength = 100;
    constructor(public _remove: RemoveStorageService, public _local: StorageService, private zone: NgZone, private _router: Router) { }

    ngOnInit() {
        this.date = moment(this._local.getLocaldata("Selected_financial_year"));
        this.yearvalue = moment(this._local.getLocaldata("Selected_financial_year")).format('YYYY');
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = -1;
        this.month[0] = "January";
        this.month[1] = "February";
        this.month[2] = "March";
        this.month[3] = "April";
        this.month[4] = "May";
        this.month[5] = "June";
        this.month[6] = "July";
        this.month[7] = "August";
        this.month[8] = "September";
        this.month[9] = "October";
        this.month[10] = "November";
        this.month[11] = "December";
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.gstSub = MeteorObservable.subscribe('gst').subscribe();

        //**** time limit check condition
        if (this._local.getLocaldata("login_time")) {
            var login_time = new Date(this._local.getLocaldata("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
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
    }
    ngAfterViewInit() {
        this.createDataForCsv_GST(this.limitLength);
    }
    createDataForCsv_GST(limitLength?) {
        this.loading = true;
        this.monthwiselist = null;
        return new Promise((resolve, reject) => {
            var count = 0;
            var index = 0;
            this.csvdata1 = Csvdata.find({
                "Txn_Posted_Date": {
                    $gte: new Date(`04-01-${this.yearvalue}`),
                    $lt: new Date(`04-01-${((this.yearvalue) * 1) + 1}`)
                }
            });

            this.csvdata1.subscribe((csvdata) => {
                this.csvdata = JSON.parse(JSON.stringify(csvdata));
                var monthlist = {};
                var monthtotal = {};
                if (csvdata && csvdata.length) {
                    let manageData = (dataForCsv, callback) => {
                        let first_data = dataForCsv.splice(0, 1)[0];
                        this.gstCalculate(first_data).then((data) => {
                            if (this.csvdata[index] != undefined) {
                                this.csvdata[index]['CGST'] = (data && (data != false) && data['CGST']) ? data['CGST'] : 0;
                                this.csvdata[index]['SGST'] = (data && (data != false) && data['SGST']) ? data['SGST'] : 0;
                                this.csvdata[index]['IGST'] = (data && (data != false) && data['IGST']) ? data['IGST'] : 0;
                                this.csvdata[index]['UTGST'] = (data && (data != false) && data['UTGST']) ? data['UTGST'] : 0;
                                this.csvdata[index]['gstNumber'] = (data && (data != false)) ? data['gstNumber'] : '-';
                                var item = this.csvdata[index];
                                var d = new Date(item["Txn_Posted_Date"]);
                                var year = d.getFullYear();
                                var month_value = d.getMonth();
                                var key = this.month[month_value] + '-' + year;
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
                        }).then(() => {
                            if (dataForCsv.length) {
                                index++;
                                manageData(dataForCsv, callback);
                            } else {
                                callback(true)
                            }
                        })
                    }

                    manageData(csvdata, (response) => {
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
                        resolve(true);
                    })
                }
            }, (err) => {
                console.log(err)
            });
        });
    }
    onScroll() {
    }
    trackByFn(index, item) {
        return item._id || index;
    }
    // code to decrement year value.
    YearMinus() {
        this.yearvalue--;
        this.createDataForCsv_GST();
    }
    // code to incremnt year value.
    YearPlus() {
        if (moment().year() > this.yearvalue) {
            this.yearvalue++;
            this.createDataForCsv_GST();
        }
    }
    gstCalculate(first_data: any) {
        return new Promise((resolve, reject) => {
            if (first_data && first_data._id) {
                resolve(Gst.findOne({ transaction_id: first_data._id }))
            }
            else {
                resolve(false);
            }
        })
    }
    monthtotalformat(month) {
        return accounting.formatNumber(this.monthwisetotal[month], " ");
    }

    printfunction() {
        window.print();
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.gstSub.unsubscribe();
    }
}
