import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    NgZone
} from '@angular/core';
import { 
    Router,
    ActivatedRoute 
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import * as moment from 'moment';
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
    TransactionComponent
} from './transactionComponent/transaction.component';
import {
    Csvdata,
    Productcategory,
    Subcategory,
    Head
} from '../../../../both/collections/csvdata.collection';
import template from './csvtimeline.html';


@Component({
    selector: 'csvtimeline',
    template
})

export class CsvTimelineComponent implements OnInit, OnDestroy {
    upperlimit: any;
    lowerlimit: any;
    upperlimitstring: any;
    lowerlimitstring: any;
    month_parameter: any;
    year_parameter: any;
    parameterSub: Subscription;

    loading: boolean = false;
    csvdata1: Observable < any[] > ;
    csvdata: any;
    csvSub: Subscription;

    parentcategoryarray: any;
    productcategory: Observable < any[] > ;
    productSub: Subscription;

    subcategoryarray: any;
    subcategory: Observable < any[] > ;
    subcategorySub: Subscription;

    headarraylist: any;
    headarrayobservable: Observable < any[] > ;
    headarraySub: Subscription;

    headvalue: any;
    headobservable: Observable < any[] > ;
    headSub: Subscription;

    loginuser: any;
    loginrole: boolean; // *** will use for hide assigning label****

    sort_order: any;
    month_in_headbar: any;

    income_id: any;
    expense_id: any;
    income: any;
    expense: any;

    constructor(private ngZone: NgZone, private _router: Router,private route: ActivatedRoute) {}

    ngOnInit() {
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
                Meteor.logout(function(error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            }
        }

        //*** getting param values 
       this.parameterSub = this.route.params.subscribe(params => {
          this.month_parameter = +params['month']; // (+) converts string 'id' to a number
          this.year_parameter = +params['year'];

          this.upperlimit = moment().year(this.year_parameter).month(this.month_parameter).date(1);
          this.upperlimitstring=this.upperlimit.format('MM-DD-YYYY');
          this.lowerlimit = moment().year(this.year_parameter).month(this.month_parameter - 1).date(1);
          this.month_in_headbar = this.lowerlimit.format('MMMM YYYY');
          this.lowerlimitstring=this.lowerlimit.format('MM-DD-YYYY');
          this.monthdata(this.lowerlimitstring, this.upperlimitstring)
             // In a real app: dispatch action to load the details here.
         });

        this.headarrayobservable = Head.find({}).zone();
        this.headarraySub = MeteorObservable.subscribe('headlist').subscribe();
        this.headarrayobservable.subscribe((data) => {
            this.headarraylist = data;
        });
        this.income = Head.findOne({
            "head": "Income"
        });
        this.expense = Head.findOne({
            "head": "Expense"
        });

        // *** we are passing parent category and child category object as input to csvtimeline component child transaction ***
        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.parentcategoryarray = data;
        });

        this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.subcategoryarray = data;
        });

        if (this.income) {
            this.income_id = this.income._id;
            this.expense_id = this.expense._id
        }
    }
    //  ******** incremented monthly data *****
    csvDataMonthlyPlus() {
        this._router.navigate(['/csvtemplate/csvtimeline',this.upperlimit.format('MM'),this.upperlimit.format('YYYY')]);
    }

    csvDataMonthlyMinus() {
        this.lowerlimit.subtract(1, 'months');
        this._router.navigate(['/csvtemplate/csvtimeline',this.lowerlimit.format('MM'),this.lowerlimit.format('YYYY')]);
    }

    monthdata(gte, lt) {
        this.loading = true;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = -1;
        this.csvdata1 = Csvdata.find({
            "Txn_Posted_Date": {
                $gte: new Date(gte),
                $lt: new Date(lt)
            }
        }, {
            sort: sort_order
        }).zone();
        var self = this;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 10000);
    }
    filterData() {
        this.loading = true;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = -1;
        this.csvdata1 = Csvdata.find({
            $and: [{
                Assigned_category_id: "not assigned"
            }, {
                "Txn_Posted_Date": {
                    $gte: new Date(this.lowerlimitstring),
                    $lt: new Date(this.upperlimitstring)
                }
            }]
        }, {
            sort: sort_order
        }).zone();
        var self = this;
        self.csvdata = null;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 10000);
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.productSub.unsubscribe();
        this.subcategorySub.unsubscribe();
        this.headarraySub.unsubscribe();
        this.parameterSub.unsubscribe();
    }
}