import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
import { 
    NgForm 
} from '@angular/forms';
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
import {
    accounting
} from 'meteor/iain:accounting';
import template from './dashboardtemplate.html';
import {
    Graphdata,
    Csvdata,
    Head,
    Graphlist
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

    //*** adding graph related variables ***
    firstStep: boolean= true;
    secondStep: boolean= false;
    thirdStep: boolean= false;
    lastStep: boolean= false;
    showSucessMessageForNewGraph: boolean= false;
    graphdeletedmessage: boolean= false;
    headAdd: Array<any>=[];
    newGraph: Observable <any[]>;
    newGraphSub: Subscription;
    newGraphdata: any;// use for sending data to genrate function
    graphsize: boolean=false;
    selectedgraph: any;

    income: any;
    expense: any;
    Selected: any;

    headCompleteList: Observable < any[] >;
    Income: Observable < any[] > ;
    Expense: Observable < any[] > ;
    head_list: any;
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
    
    public charData: any;
    public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    ngOnInit() {
     if(localStorage.getItem("login_time")){
        var login_time=new Date(localStorage.getItem("login_time"));
        var current_time=new Date();
        var diff=(current_time.getTime() - login_time.getTime())/1000;
        if(diff > 3600){
            console.log("Your session has expired. Please log in again");
            var self = this;
            localStorage.removeItem('login_time');
            localStorage.removeItem('Meteor.loginToken');
            localStorage.removeItem('Meteor.loginTokenExpires');
            localStorage.removeItem('Meteor.userId');
              Meteor.logout(function(error) {
                  if (error) {
                        console.log("ERROR: " + error.reason);
                     } else {
                  self._router.navigate(['/login']);
                    }
               });
           }
       }
        
        this.processingYearStart = true;
        this.date = moment();
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);

     if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline/'+this.date.format('MM')+'/'+this.current_year_header]);
        }

        this.charData = [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Expense'
        }, {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Income'
        }];

        this.headCompleteList = Head.find({}).zone();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.headCompleteList.subscribe((data)=>{
                this.head_list=data;
        });
        
        this.newGraph = Graphlist.find({}).zone();
        this.newGraphSub = MeteorObservable.subscribe('graphlist').subscribe();
        this.newGraph.subscribe((data)=> {
            this.newGraphdata=data;
            console.log(this.newGraphdata);
            this.graphsize = this.newGraphdata.length != 0 ? true: false;
        });

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
                    if(!!datayear){
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
                    var expense_label="Total Expense : " + accounting.formatNumber(total_expense," ");
                    var income_label="Total Income : " + accounting.formatNumber(total_income," ");
                    console.log(expense_label);
                    console.log(income_label);

                    this.barChartLabels = label;
                    this.charData = [{
                        data: DR,
                        label: expense_label
                    }, {
                        data: CR,
                        label: income_label
                    }];
                }
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
    }
    // ***** this function we will call on every year change *****
    year_data_sub(newdate: number) {
        // var self = this;
        var datayear = this.yearlyData['FY'+newdate];
        if(!!datayear){
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
                    var expense_label="Total Expense : " + accounting.formatNumber(total_expense," ");
                    var income_label="Total Income : " + accounting.formatNumber(total_income," ");

        this.barChartLabels = label;
        this.charData = [{
                        data: DR,
                        label: expense_label
                    }, {
                        data: CR,
                        label: income_label
                    }];
       }
       else{
            this.charData = [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Expense'
        }, {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Income'
        }];
       }             
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
            Meteor.call('refresh_graph_list', self.all_csvdata, self.newGraphdata, (error, response) => {
                // Meteor.call('refresh_graph_data', self.all_csvdata, self.income._id, self.expense._id, (error, response) => {
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

     // ***  code for graph delete
    Selected(graph){
            this.selectedgraph=graph;
        }
    DeleteSelected(){
       if(this.selectedgraph){
           Graphlist.remove({_id: this.selectedgraph._id}).zone();
           this.selectedgraph='';
           this.graphdeletedmessage=true;
           setTimeout(()=> { this.graphdeletedmessage=false;}, 3000);
       }
    }
    // *** new graph adding functions and code ***
    HeadSelected(){
        console.log("headSelected called");
        this.firstStep=false;
        this.secondStep=true;
    }
    pushpophead(value){
        if ((<HTMLInputElement>document.getElementById(value)).checked === true) {
            this.headAdd.push(value);
        }
        else if ((<HTMLInputElement>document.getElementById(value)).checked === false) {
            let indexx = this.headAdd.indexOf(value);
            this.headAdd.splice(indexx,1);
        }
    }
    processSecondStep(){
       this.secondStep=false;
       this.lastStep=true;
    }
    insertNewGraph(form: NgForm){
        if(form.value.graphname !== '')
        {
        Graphlist.insert({
                "graph_name": form.value.graphname,
                "graph_head_list": this.headAdd
            }).zone();
        this.showSucessMessageForNewGraph=true;
        setTimeout(()=> { this.showSucessMessageForNewGraph=false;}, 3000);
        }
        this.headAdd=[];
        this.lastStep=false;
        this.firstStep=true;
        this.generate_graph_data();
    }
    clearNewGraphEntry(){
        this.headAdd=[];
        this.secondStep=false;
        this.lastStep=false;
        this.firstStep=true;
    }
    ngOnDestroy() {
        this.graphDataSub.unsubscribe();
        this.complete_csvSub.unsubscribe();
        this.newGraphSub.unsubscribe();
    }
}