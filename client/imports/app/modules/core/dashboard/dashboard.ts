// Dashboard component contain our all category and head dynamic charts

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
, 
    Subscription
} from 'rxjs';
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
import { StorageService } from './../../services/storage';

import {
    Graphdata,
    Csvdata,
    Head,
    Graphlist,
    Productcategory,
    Subcategory,
    CategoryGraphList
} from '../../../../../../both/collections/csvdata.collection';
import { RemoveStorageService } from '../../services/removeStorage';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboardtemplate.html',
    moduleId: module.id
})
@InjectUser('user')
export class DashboardComponent implements OnInit, OnDestroy {
    //** this is for csv data collection
    complete_csvdata: Observable<any[]>;
    complete_csvSub: Subscription;
    all_csvdata: any;

    //** these variable are used to store parent category and subcategory data.**
    parentcategoryarray: any;
    productcategory: Observable<any[]>;
    productSub: Subscription;
    subcategoryarray: any;
    subcategory: Observable<any[]>;
    subcategorySub: Subscription;

    //*** adding graph related variables ***
    firstStep: boolean = true;
    secondStep: boolean = false;
    thirdStep: boolean = false;
    lastStep: boolean = false;
    secondStepCategory: boolean = false;
    lastStepCategory: boolean = false;
    showSucessMessageForNewGraph: boolean = false;
    graphdeletedmessage: boolean = false;
    headAdd: Array<any> = []; //** array used for creating new graph of head
    categoryAdd: Array<any> = []; //** array used for creating new graph of category

    newGraph: Observable<any[]>;
    newGraphSub: Subscription;
    newGraphdata: any; // use for sending data to genrate function

    newCategory: Observable<any[]>;
    newCategoryGraphSub: Subscription;
    newCategorydata: any;

    graphsize: boolean = false;
    selectedheadgraph: any;
    selectedcategorygraph: any;

    income: any;
    expense: any;
    Selected: any;

    headCompleteList: Observable<any[]>;
    head_list: any;
    headSub: Subscription;

    current_year_header: any;
    date: any;

    chartData: any = [];
    user: Meteor.User;
    processingStart: boolean = false;

    barGraph: string = "bar";
    lineGraph: string = "line";

    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private _router: Router) { }
    trackByFn(index, item) {
        return item._id || index;
    }
    ngOnInit() {

        // here we are loading initial data in dashboard
        this.date = moment(this._local.getLocaldata("Selected_financial_year"));
        this.current_year_header = this.date.format('YYYY');

        if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline/', this.date.format('MM'), this.current_year_header]);
        }
        this.processingStart = true;
        //**** time limit check condition if it excced 1 hrs
        // if login time is more than 1 hr then we should logout the user.
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
                        self._router.navigate(['/login']); // we are naviagating user back to login page.
                    }
                });
            } else {
                // if login time is less then one hour we increment login time so that user don't face difficulty
                this._local.setLocalData("login_time", current_time.toString());
            }
        }
        // *** code to get list of all head collection data
        this.headCompleteList = Head.find({});
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.headCompleteList.subscribe((data) => {
            this.head_list = data;
        });
        // *** cod to get list of all main category collection data
        this.productcategory = Productcategory.find({});
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.parentcategoryarray = data;
        });
        // *** code to get list of all subcategory collection data
        this.subcategory = Subcategory.find({});
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.subcategoryarray = data;
        });
        // *** code to get all graphlist collection data
        this.newGraph = Graphlist.find({});
        this.newGraphSub = MeteorObservable.subscribe('graphlist').subscribe();
        this.newGraph.subscribe((data) => {
            this.newGraphdata = data;
            this.graphsize = this.newGraphdata.length != 0 ? true : false;
            this.processingStart = false;
        });
        // *** code to get all catgory graph list collection data
        this.newCategory = CategoryGraphList.find({});
        this.newCategoryGraphSub = MeteorObservable.subscribe('categorygraphlist').subscribe();
        this.newCategory.subscribe((data) => {
            this.ngZone.run(() => {
                this.newCategorydata = data;
                this.processingStart = false;
            });
        });

        // ** code to extract all csv data from data base according to order which we set in sort_order
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.complete_csvdata = Csvdata.find({}, {
            sort: sort_order
        });
        this.complete_csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.complete_csvdata.subscribe((data) => {
            this.ngZone.run(() => {
                this.all_csvdata = data;
            });
        });
    }

    // this.ngZone.run(() => {
    //            self.csvdata = data;
    //            self.loading = false;
    //        });

    //**** when we click generate button it will call this generate graph function ****
    generate_graph_data() {
        this.processingStart = true;
        this.generate_head_list_data();
        this.generate_category_list_data();
        // this.storeemailfunction();
    }

    // *********** email store function code ************
    // storeemailfunction(){
    //     Meteor.call('emailliststore', (error, response) => {
    //            if(error){
    //                console.log(error);
    //            }
    //            else {
    //                console.log(response);
    //            }
    //     });
    // }

    // **** his function is used to generate all head related graphs ****
    generate_head_list_data() {
        var self = this;
        self.processingStart = true;
        Meteor.call('refresh_graph_list', self.all_csvdata, self.newGraphdata, (error, response) => {
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
    }

    // **** this function is used to generate all category related graphs ****
    generate_category_list_data() {
        var self = this;
        self.processingStart = true;
        Meteor.call('refresh_category_graph_list', self.all_csvdata, self.newCategorydata, self.subcategoryarray, (error, response) => {
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
    }
    // *** this is code of first step selecting category in adding new graph in dashboard
    CategorySelected() {
        console.log("category selected");
        this.firstStep = false;
        this.secondStepCategory = true;
    }
    // *** this is second step in adding new graph data
    processSecondStepCategory() {
        this.secondStepCategory = false;
        this.lastStepCategory = true;
    }
    //*** used for adding category in array of new graph of category.
    pushpopcategory(value) {
        if ((<HTMLInputElement>document.getElementById(value)).checked === true) {
            this.categoryAdd.push(value);
        } else if ((<HTMLInputElement>document.getElementById(value)).checked === false) {
            let indexx = this.categoryAdd.indexOf(value);
            this.categoryAdd.splice(indexx, 1);
        }
    }
    // *** code to create a new graph ***
    insertCategoryGraph(form: NgForm) {
        if (form.value.graphname !== '') {
            CategoryGraphList.insert({
                "graph_name": form.value.graphname,
                "graph_head_list": this.categoryAdd // categoryAdd have all id of either category list or head list
            });
            this.showSucessMessageForNewGraph = true;
            setTimeout(() => { // code to remove successfully added new graph after 3 sec
                this.showSucessMessageForNewGraph = false;
            }, 3000);
        }
        this.categoryAdd = [];
        this.lastStepCategory = false;
        this.firstStep = true;
        this.generate_category_list_data();
    }
    // ***  code for graph delete
    SelectedHead(graph) {
        this.selectedheadgraph = graph;
    }
    // code to select category graph for delete operation
    Selectedcategory(graph) {
        this.selectedcategorygraph = graph;
    }
    // code to delete head graph from head graph list
    DeleteSelected() {
        if (this.selectedheadgraph) {
            Graphlist.remove({
                _id: this.selectedheadgraph._id
            });
            this.selectedheadgraph = '';
            this.graphdeletedmessage = true;
            setTimeout(() => {
                this.graphdeletedmessage = false;
            }, 3000);
        }
    }
    // code to delete category graph from category graph list
    DeleteSelectedCategoryGraph() {
        if (this.selectedcategorygraph) {
            CategoryGraphList.remove({
                _id: this.selectedcategorygraph._id
            });
            this.selectedcategorygraph = '';
            this.graphdeletedmessage = true;
            setTimeout(() => {
                this.graphdeletedmessage = false;
            }, 3000);
        }
    }
    // *** new graph adding functions and code ***
    HeadSelected() {
        console.log("headSelected called");
        this.firstStep = false;
        this.secondStep = true;
    }
    //*** used for adding head in array of new graph of head.
    pushpophead(value) {
        if ((<HTMLInputElement>document.getElementById(value)).checked === true) {
            this.headAdd.push(value);
        } else if ((<HTMLInputElement>document.getElementById(value)).checked === false) {
            let indexx = this.headAdd.indexOf(value);
            this.headAdd.splice(indexx, 1);
        }
    }
    //*** Used for Hiding first window and opening second window to select some category or header when we add new graph
    processSecondStep() {
        this.secondStep = false;
        this.lastStep = true;
    }
    // code below is used to add new Head graph in our system.
    insertNewGraph(form: NgForm) {
        if (form.value.graphname !== '') {
            Graphlist.insert({
                "graph_name": form.value.graphname,
                "graph_head_list": this.headAdd
            });
            this.showSucessMessageForNewGraph = true;
            setTimeout(() => {
                this.showSucessMessageForNewGraph = false;
            }, 3000);
        }
        this.headAdd = [];
        this.lastStep = false;
        this.firstStep = true;
        // this.generate_graph_data();
        this.generate_head_list_data();
    }
    // This function is to flush boolean & array which are used to create new graph.
    clearNewGraphEntry() {
        this.headAdd = [];
        this.secondStep = false;
        this.lastStep = false;
        this.lastStepCategory = false;
        this.secondStepCategory = false;
        this.firstStep = true;
    }
    // To save system from memory leak unsubscribe from all collections
    ngOnDestroy() {
        // this.graphDataSub.unsubscribe();
        this.complete_csvSub.unsubscribe();
        this.newGraphSub.unsubscribe();
        this.newCategoryGraphSub.unsubscribe();
    }
}
