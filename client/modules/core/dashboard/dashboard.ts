import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
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
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    Router
} from '@angular/router';
import {
    InjectUser
} from 'angular2-meteor-accounts-ui';
import * as moment from 'moment';
import * as _ from 'lodash';

import template from './dashboardtemplate.html';
import {
    Graphdata,
    Csvdata,
    Head
} from '../../../../both/collections/csvdata.collection';

@Component({
    selector: 'dashboard',
    template
})
@InjectUser('user')
export class DashboardComponent implements OnInit, OnDestroy {
    complete_csvdata: Observable < any[] > ; // this is for csv data collection
    complete_csvSub: Subscription;
    all_csvdata: any;
    yearlyData: any;

    total_expense: number;
    total_income: number;

    income: any;
    expense: any;
    Income: Observable < any[] > ;
    Expense: Observable < any[] > ;
    headSub: Subscription;

    current_year_header: any;
    current_year: number;

    date: any;
    graphData: Observable < any[] > ;
    graphDataSub: Subscription;
    chartData: any = [];
    user: Meteor.User;
    processingStart: boolean = false;
    processingYearStart: boolean = false;
    label: string[];
    fiscalMonths: string[] = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March'];
    constructor(private ngZone: NgZone, private _router: Router) {}

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    ngOnInit() {

        this.charData = [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Expense'
        }, {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Income'
        }];
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.Income = Head.find({
            "head": "Income"
        }).zone();
        this.Expense = Head.find({
            "head": "Expense"
        }).zone();
        this.Income.subscribe((data) => {
            this.income = data[0];
            console.log(this.income);
        });
        this.Expense.subscribe((data) => {
            this.expense = data[0];
            console.log(this.expense);
        });

        this.processingYearStart = true;
        this.date = moment();
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);

        this.graphData = Graphdata.find().zone();
        this.graphDataSub = MeteorObservable.subscribe('csvdata_month').subscribe((data) => {});
        this.graphData.subscribe((data) => {
            if (data) {
                // console.log(data);
                // var self = this;
                console.log(data);
                this.yearlyData = data[0];
                console.log(this.yearlyData);
                if (this.yearlyData) {
                    var  datayear = this.yearlyData['FY'+this.current_year];
                    console.log(datayear);
                    console.log(datayear.Expense);
                    console.log(datayear.Income);
                    var label = [];
                    var CR = [];
                    var DR = [];
                    var total_income=0;
                    var total_expense=0;
                    _.forEach(this.fiscalMonths, function(key){
                          if(datayear.Expense[key] && datayear.Income[key]){
                            label.push(key);
                            DR.push(datayear.Expense[key]);
                            CR.push(datayear.Income[key]);
                            total_expense = total_expense + datayear.Expense[key];
                            total_income = total_income + datayear.Income[key];
                          }
                          if(datayear.Expense[key] && !datayear.Income[key]){
                            label.push(key);
                            DR.push(datayear.Expense[key]);
                            CR.push(0);
                            total_expense = total_expense + datayear.Expense[key];
                          }
                          if(!datayear.Expense[key] && datayear.Income[key]){
                            label.push(key);
                            DR.push(0);
                            CR.push(datayear.Income[key]);
                            total_income = total_income + datayear.Income[key];
                          }
                    });
                    var expense_label="Total Expense : " + total_expense;
                    var income_label="Total Income : " + total_income;

                    this.barChartLabels = label;
                    this.charData = [{
                        data: DR,
                        label: expense_label
                    }, {
                        data: CR,
                        label: income_label
                    }];
                    this.ngZone.run(() => {
                        this.processingYearStart = false;
                    });
                }
            } else {
                console.log("processing");
            }
        });
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;

        this.complete_csvdata = Csvdata.find({},{sort: sort_order}).zone();
        this.complete_csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.complete_csvdata.subscribe((data) => {
            this.all_csvdata = data;
            // console.log(this.all_csvdata);
        });

        if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline']);
        }
    }
    // ***** this function we will call on every year change *****
    year_data_sub(newdate: number) {
        // var self = this;
        var datayear = this.yearlyData['FY'+newdate];
            var label = [];
                    var CR = [];
                    var DR = [];
                    var total_income=0;
                    var total_expense=0;
                      _.forEach(this.fiscalMonths, function(key){
                          if(datayear.Expense[key] && datayear.Income[key]){
                            label.push(key);
                            DR.push(datayear.Expense[key]);
                            CR.push(datayear.Income[key]);
                            total_expense = total_expense + datayear.Expense[key];
                            total_income = total_income + datayear.Income[key];
                          }
                          if(datayear.Expense[key] && !datayear.Income[key]){
                            label.push(key);
                            DR.push(datayear.Expense[key]);
                            CR.push(0);
                            total_expense = total_expense + datayear.Expense[key];
                          }
                          if(!datayear.Expense[key] && datayear.Income[key]){
                            label.push(key);
                            DR.push(0);
                            CR.push(datayear.Income[key]);
                            total_income = total_income + datayear.Income[key];
                          }
                    });
                    var expense_label="Total Expense : " + total_expense;
                    var income_label="Total Income : " + total_income;

        this.barChartLabels = label;
        this.charData = [{
                        data: DR,
                        label: expense_label
                    }, {
                        data: CR,
                        label: income_label
                    }];
    }

    yearMinus() {
        this.date.subtract(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        this.year_data_sub(this.current_year);
    }

    yearPlus() {
        this.date.add(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        this.year_data_sub(this.current_year);
    }

    generate_graph_data() {
        var self = this;
        self.processingStart = true;
        if (this.Income && this.Expense) {
            Meteor.call('refresh_graph_data', self.all_csvdata, this.income._id, this.expense._id, (error, response) => {
                if (error) {
                    console.log(error.reason);
                    self.ngZone.run(() => {
                        self.processingStart = false;
                    });
                } else {
                    self.ngZone.run(() => {
                        self.processingStart = false;
                    });
                    console.log(response);
                }
            });
        } else {
            self.processingStart = false;
        }
    }
    ngOnDestroy() {
        this.graphDataSub.unsubscribe();
        this.complete_csvSub.unsubscribe();
    }
}