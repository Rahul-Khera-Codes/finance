// csvtimeline component is the main component where you can see transaction note month wise,
// it have filter settings, search option in transaction note.

import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    EventEmitter,
    Output,
    NgZone,
    AfterContentInit
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
, 
    Subscription
} from 'rxjs';
import {
    MeteorObservable
} from 'meteor-rxjs';
import {
    TransactionComponent
} from './transactionComponent/transaction.component';
import {
    NgForm
} from '@angular/forms';
import {
    SharedNavigationService
} from '../../services/navigationbar.service';
import { StorageService } from './../../services/storage';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import {
    Csvdata,
    Productcategory,
    Subcategory,
    Head,
    Accounts_no,
    Users,
    Salaryfiles,
    Gst,
    emailpatterncollection
} from '../../../../../../both/collections/csvdata.collection';
import {
    User
} from '../../../../../../both/models/user.model';
import template from './csvtimeline.html';
import { CommonService } from './../../services/common.service';
import { RemoveStorageService } from './../../services/removeStorage';
import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
declare let $: any;
@Component({
    selector: 'csvtimeline',
    templateUrl: './csvtimeline.html',
    moduleId: module.id
})

export class CsvTimelineComponent implements OnInit, AfterContentInit, OnDestroy {
    // *** all time related variables ***
    upperlimit: any; // uppper date limit will be stored in this variable
    lowerlimit: any; // lower date limit will be stored here
    upperlimitstring: any; // date in string format will be stored here
    lowerlimitstring: any; // string fomat of lowerlimit date
    month_parameter: any; // to month value
    year_parameter: any; // to store year value
    parameterSub: Subscription;
    queryparameterSub: Subscription;
    commentid: any;

    // ** loading variable to show loading in csvtimeline
    loading: boolean = false;
    accountlistloading: boolean = false;
    headarrayloading: boolean = false;
    parentcategoryloading: boolean = false;
    subcategoryloading: boolean = false;

    csvdata1: Observable<any[]>; // observalbe that store latest csv transaction note
    csvdata: any; // array of csv transaction note
    csvSub: Subscription;
    // gstSub: Subscription;
    // ******* email pattern list variable declaration *******
    emailpatternlistraw: Observable<any[]>;
    emailpatternlist: any;
    emailpatternSub: Subscription;

    // **** main category list all variable and observable
    parentcategoryarray: any;
    productcategory: Observable<any[]>;
    productSub: Subscription;

    // *** subcategory all list variable and observables
    subcategoryarray: any;
    subcategory: Observable<any[]>;
    subcategorySub: Subscription;

    // *** header list all variables and observalbes
    headarraylist: any;
    headarrayobservable: Observable<any[]>;
    headarraySub: Subscription;

    headvalue: any;
    headobservable: Observable<any[]>;
    headSub: Subscription;

    // *** all user list variables and observables
    userlists: any;
    userlist: Observable<User[]>;
    usersData: Subscription;
    // ********** uploaded file details ********
    filecontent: any;
    filecontentobs: Observable<any[]>;
    filecontentSub: Subscription;

    loginuser: any;
    loginrole: boolean; // *** will use for hide assigning label ****

    sort_order: any;
    month_in_headbar: any;
    // *** to store income id ***
    income_id: any;
    income: Observable<any[]>;
    // *** to store expense id ***
    expense_id: any;
    expense: Observable<any[]>;
    assets_id: any;
    assets: Observable<any[]>;
    // *** list of variable boolean to apply filter to our transaction note list
    apply_filter: boolean = false;
    apply_cr_filter: boolean = false;
    apply_dr_filter: boolean = false;
    invoice_filter: boolean = false;
    apply_category_filter: boolean = false;
    apply_filter_unassign_year: boolean = false;
    // search active is use to check if we are searching for something
    // if we are searching for something then it will hide our next year previous year bar
    searchActive: boolean = false;

    Select_account: any;
    Selected_account_name: string;
    accountlist: Observable<any[]>;
    accountSub: Subscription;
    accountlistdata: any;
    accountselected: string;
    accountfilter: boolean = false;

    // *** to apply pagination in csvtimeline component ***
    limit: number = 5;
    hideit: boolean = false;

    selectedCategory_id: any;
    selectedCategoryName: any;

    currentYearDate: any;
    nextYearDate: any;
    currentYearNumber: number;
    currentFinacialYear: any;

    detectirregular: any = []; // array that store all irregular transaction note id
    lasttransaction: any;
    currenttransaction: any;

    // **** for checking open and close balance ****
    thismonthopenbalance: any;
    // Observable < any[] > ;
    lastmonthclosingbalance: any;
    flagclosingopenbalance: boolean = false;
    // Observable < any[] > ;
    csvFullData: any;
    generateReport: Function;
    finalTotalReportData: any;
    transaction_range = 0;
    transactionType = '';
    transactionCategory = [];
    transaction = {
        'Available_Balance': false,
        'Transaction_ID': false,
        'Transaction_Amount': true,
        'ChequeNo': false,
        'Description': false,
        'Invoice_No': false,
        'Invoice_Description': false,
        'Account_Number': false,
        'Transaction_Number': false,
        'Txn_Posted_Date': false,
        'Cr_Dr': true,
        'Category': true,
        'Sub_Category': false,
        'Assigned_Head': false,
        'File_No': false,
        'Invoice_link': false
    }

    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private _router: Router, private route: ActivatedRoute, private navvalue: SharedNavigationService, public _commonService: CommonService) {
        this.generateReport = _.debounce(this.finalGenerateReport, 1000);
    }
    ngAfterContentInit() {
    }
    ngOnInit() {
        this.accountlistloading = true;
        this.headarrayloading = true;
        this.parentcategoryloading = true;
        this.subcategoryloading = true;
        // this.gstSub = MeteorObservable.subscribe('gst').subscribe();
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.emailpatternSub = MeteorObservable.subscribe('emailpattern').subscribe();
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

        //*** getting param values
        this.parameterSub = this.route.params.subscribe(params => {
            this.month_parameter = +params['month']; // (+) converts string 'id' to a number
            this.year_parameter = +params['year']; // to get year form route parameter

            // current finacialyear we use for searching in our timeline.
            if (this.month_parameter < 4) {
                this.currentYearNumber = --this.year_parameter;
                this.currentYearDate = '04-01-' + this.currentYearNumber;
                this.nextYearDate = '04-01-' + ++this.currentYearNumber;
                --this.currentYearNumber;
                ++this.year_parameter
            } else {
                this.currentYearNumber = this.year_parameter;
                this.currentYearDate = '04-01-' + this.currentYearNumber;
                this.nextYearDate = '04-01-' + ++this.currentYearNumber;
                --this.currentYearNumber;
            }

            this.selectedCategory_id = null;
            this.selectedCategoryName = 'Select Category';
            this.apply_category_filter = false;
            this.flagclosingopenbalance = false;
            this.upperlimit = moment().year(this.year_parameter).month(this.month_parameter).date(1);
            this.upperlimitstring = this.upperlimit.format('MM-DD-YYYY');
            this.lowerlimit = moment().year(this.year_parameter).month(this.month_parameter - 1).date(1);
            this.month_in_headbar = this.lowerlimit.format('MMMM YYYY');
            this.lowerlimitstring = this.lowerlimit.format('MM-DD-YYYY');
            this.limit = 5;
            this.hideit = false;
            this.loaddata();
            this.queryparameterSub = this.route.queryParams.subscribe(params => {
                // Defaults to 0 if no query param provided.
                this.commentid = params['comment_id'] || 0;
            });
            if (this.commentid) {
                this.searchboxcomment(this.commentid);
            } else {
                this.monthdata(this.lowerlimitstring, this.upperlimitstring);
            }
            // ******* this is the function we use to detect changes.
            // In a real app: dispatch action to load the details here.
        });
    }

    loaddata() { // loading data at the time of component creation
        // this is used to load current month salary files
        this.filecontentSub = MeteorObservable.subscribe('Salaryfiles').subscribe();
        Salaryfiles.find({
            "monthdate": {
                $gte: new Date(this.lowerlimitstring),
                $lt: new Date(this.upperlimitstring)
            }
        }).subscribe((data) => {
            this.ngZone.run(() => {
                this.filecontent = data;
            });
        });
        // ****** this is used to load all user list in csvtimeline component *****
        this.usersData = MeteorObservable.subscribe('userData').subscribe(() => {
            this.userlist = Users.find({});
            this.userlist.subscribe((data) => {
                this.ngZone.run(() => {
                    this.userlists = data;
                });
            });
        });
        // **** this is used to load all email pattern list ****
        this.emailpatternlistraw = emailpatterncollection.find({});
        this.emailpatternlistraw.subscribe((data) => {
            this.ngZone.run(() => {
                this.emailpatternlist = data;
            });
        });
        // **** this is used to load all account list in csvtimeline component ****
        this.accountlist = Accounts_no.find({});
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
        this.accountlist.subscribe((data) => {
            this.ngZone.run(() => {
                this.accountlistdata = data;
                this.accountlistloading = false;
            });
        });
        // **** this code is used to load all head list in CsvTimelineComponent ****
        this.headarrayobservable = Head.find({});
        this.headarraySub = MeteorObservable.subscribe('headlist').subscribe();
        this.headarrayobservable.subscribe((data) => {
            this.ngZone.run(() => {
                this.generateReport();
                this.headarraylist = data;
                this.headarrayloading = false;
            });
        });
        // this code is used to get income,expense& assets head id's
        this.income = Head.find({
            "head": "Income"
        });
        this.expense = Head.find({
            "head": "Expense"
        });
        this.assets = Head.find({
            "head": "Assets"
        });

        // *** we are passing parent category and child category object as input to csvtimeline component child transaction ***
        this.productcategory = Productcategory.find({});
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.ngZone.run(() => {
                this.parentcategoryarray = data;
                console.log("list", this.parentcategoryarray)
                this.parentcategoryloading = false;
            });
        });
        // **** code to get list of all subcategory in CsvTimelineComponent ****
        this.subcategory = Subcategory.find({});
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.ngZone.run(() => {
                this.subcategoryarray = data;
                this.subcategoryloading = false;
            });
        });
        // *** here we are assigning income id in income_id variable ***
        this.income.subscribe((data) => {
            this.ngZone.run(() => {
                this.income_id = data[0] ? data[0]._id : '';
            });
        });
        // *** assigning expense id in CsvTimelineComponent ***
        this.expense.subscribe((data) => {
            this.ngZone.run(() => {
                this.expense_id = data[0] ? data[0]._id : '';
            });
        });
        // *** assigning asset id in assets_id in csv timel line component
        this.assets.subscribe((data) => {
            this.ngZone.run(() => {
                this.assets_id = data[0] ? data[0]._id : '';
            });
        });
    }
    filteraccount(data) {
        let account_code: any = _.filter(this.accountlistdata, {
            "_id": data
        });
        return account_code[0] ? account_code[0].Account_no.slice(-4) : "not_assigned";
    }
    filterHead(data) {
        let head = _.filter(this.headarraylist, {
            "_id": data
        });
        return head[0] ? head[0]['head'] : "";
    }
    filterSubCate(data) {
        let subCate = _.filter(this.subcategoryarray, {
            "_id": data
        });
        return subCate[0] ? subCate[0]['subCategory'] : 'not_assigned';
    }
    filterCategory(data) {
        let Category = _.filter(this.subcategoryarray, {
            "_id": data
        });
        return Category[0] ? Category[0]['category'] : 'not_assigned';
    }
    download() {
        var data = [];
        var date;

        _.forEach(this.csvdata, (csvDetails, key) => {
            if (csvDetails.linktodrive != undefined) {
                var Invoice_link = csvDetails.linktodrive[0].linkAddress ? csvDetails.linktodrive[0].linkAddress : ''
            }
            else {
                Invoice_link = 'not_assigned'
            }
            date = moment(csvDetails.Txn_Posted_Date).format('LLL');
            data.push({
                Account_Number: this.filteraccount(csvDetails["AssignedAccountNo"]),
                Transaction_Number: csvDetails.No,
                Transaction_ID: csvDetails.Transaction_ID,
                Txn_Posted_Date: date,
                ChequeNo: csvDetails.ChequeNo,
                Description: csvDetails.Description,
                Cr_Dr: csvDetails['Cr/Dr'],
                Transaction_Amount: csvDetails['Transaction_Amount(INR)'],
                Available_Balance: csvDetails['Available_Balance(INR)'],
                Category: this.filterCategory(csvDetails['Assigned_parent_id']),
                Sub_Category: this.filterSubCate(csvDetails['Assigned_category_id']),
                Assigned_Head: this.filterHead(csvDetails["Assigned_head_id"]),
                Invoice_No: csvDetails.invoice_no,
                File_No: csvDetails.file_no ? csvDetails.file_no : 'not_assigned',
                Invoice_Description: csvDetails.invoice_description,
                Invoice_link: Invoice_link
            })
        })
        let finalData = [];
        var keys;
        _.forEach(data, (csvDetails, key) => {
            var dataJson = {};
            keys = [];
            _.forEach(this.transaction, (val, key) => {
                if (val) {
                    keys.push(key);
                    if (csvDetails[key] == 'not_assigned' || !csvDetails[key]) {
                        csvDetails[key] = '';
                    }
                    if (csvDetails[key] == 'invoice_description') {
                        csvDetails[key] = '';
                    }
                    if (key == 'Transaction_Amount') {
                        if (this.transaction_range >= csvDetails[key] * 1) {
                            dataJson[key] = csvDetails[key];
                        }
                    } else if (key == 'Cr_Dr') {
                        if (this.transactionType == "CR" && csvDetails[key] == "CR") {
                            dataJson[key] = csvDetails[key];
                        } else if (this.transactionType == "DR" && csvDetails[key] == "DR") {
                            dataJson[key] = csvDetails[key];
                        } else if (this.transactionType == '') {
                            dataJson[key] = csvDetails[key];
                        } else {

                        }

                    } else if (key == 'Category') {
                        if (this.transactionCategory.indexOf(csvDetails[key]) == -1) {
                            dataJson[key] = csvDetails[key];
                        }
                    } else {
                        dataJson[key] = csvDetails[key];
                    }
                }
            })
            if (Object.keys(dataJson).length) {
                finalData.push(dataJson)
            }
        })
        let options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: false,
            headers: Object.keys(finalData[0]),
            showTitle: true,
            title: 'csv',
            useBom: false,
            removeNewLines: false,
            keys: Object.keys(finalData[0])
        };
        if (finalData && Object.keys(finalData[0]).length) {
            new Angular2Csv(finalData, 'csvtimeline', options);
        }
    }
    // *** to check last month closeing balance and this month open balance ***
    validateTransactions() {
        // console.log("detect array before start");
        // console.log(this.detectirregular);
        this.detectirregular = [];
        // console.log("array after start");
        // console.log(this.detectirregular);
        // lasttransaction: any;
        // currenttransaction: any; Transaction_Amount(INR)  Available_Balance(INR) Cr/Dr
        // console.log("****************************************************");
        // console.log("calculating valid & invalid amount match start");
        // console.log("******************** Starting ************************");
        this.lasttransaction = 0;
        for (let i = 0; i < this.csvdata.length; i++) {
            // console.log("*************** item compare *********************");
            if (this.csvdata[i + 1]) {
                //***if is used to check for if we reached to end of transaction
                this.lasttransaction = this.csvdata[i];
                this.currenttransaction = this.csvdata[i + 1];
                if (this.currenttransaction["Cr/Dr"] == this.lasttransaction["Cr/Dr"]) {
                    if (this.currenttransaction["Cr/Dr"] == 'CR') {
                        // *** here we are matching each transaction note in current month to check if is there any irregular transaction note
                        if (parseInt(this.lasttransaction["Available_Balance(INR)"]) == parseInt(this.currenttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Transaction_Amount(INR)"])) {
                            continue;
                        } else {

                            if (parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) + parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == 1 || parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) + parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == -1) {
                                // console.log("amount is one greater so skiping this");
                                continue;
                            } else {
                                this.detectirregular.push(this.currenttransaction['_id']); // pushing all irregular transaction note in irregular array
                                continue;
                            }
                        }
                    } else {
                        if (parseInt(this.lasttransaction["Available_Balance(INR)"]) == parseInt(this.currenttransaction["Available_Balance(INR)"]) + parseInt(this.currenttransaction["Transaction_Amount(INR)"])) {
                            continue;
                        } else {

                            if (parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == 1 || parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == -1) {
                                // console.log("amount is one greater so skiping this");
                                continue;
                            } else {
                                this.detectirregular.push(this.currenttransaction['_id']);
                                continue;
                            }
                        }
                    }
                } // *** main else part
                else {
                    if (this.currenttransaction["Cr/Dr"] == 'CR' && this.lasttransaction["Cr/Dr"] == 'DR') {
                        if (parseInt(this.lasttransaction["Available_Balance(INR)"]) == parseInt(this.currenttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Transaction_Amount(INR)"])) {
                            continue;
                        } else {

                            if (parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) + parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == 1 || parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) + parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == -1) {
                                // console.log("amount is one greater so skiping this");
                                continue;
                            } else {
                                this.detectirregular.push(this.currenttransaction['_id']);
                                continue;
                            }
                        }
                    } else {
                        if (parseInt(this.lasttransaction["Available_Balance(INR)"]) == parseInt(this.currenttransaction["Available_Balance(INR)"]) + parseInt(this.currenttransaction["Transaction_Amount(INR)"])) {
                            continue;
                        } else {

                            if (parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == 1 || parseInt(this.lasttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Available_Balance(INR)"]) - parseInt(this.currenttransaction["Transaction_Amount(INR)"]) == -1) {
                                // console.log("amount is one greater so skiping this");
                                continue;
                            } else {
                                this.detectirregular.push(this.currenttransaction['_id']);
                                continue;
                            }
                        }
                    }
                }
            }
        }
        // ****************** end **********************
    }
    IsInErrorList(id) {
        if (this.detectirregular.indexOf(id) != -1) {
            return true;
        } else {
            return false;
        }
    }

    //**** code of our csvtimeline search component
    searchbox(form: NgForm) {
        var sort_order = {};
        this.limit = 5;
        this.hideit = false;
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        this.searchActive = true;
        this.csvdata = null;
        if (!form.value.optionForSearch) {
            form.value.optionForSearch = "Desc";
        }
        if (form.value.optionForSearch == "Id") {
            //*** mongodb query to match any id which is stored in our collection
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Transaction_ID": form.value.searchvalue.trim() // transaction id that we are searching
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentYearDate), // searching in current FY only
                        $lt: new Date(this.nextYearDate)
                    }
                }]
            }, {
                sort: sort_order
            });
        } else if (form.value.optionForSearch == "Amount") { // search for a perticular amount in our csv transaction note.
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Transaction_Amount(INR)": parseFloat(form.value.searchvalue.trim())
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentYearDate),
                        $lt: new Date(this.nextYearDate)
                    }
                }]
            }, {
                sort: sort_order
            });
        } else if (form.value.optionForSearch == "Desc") { // serching for a description in our csv transaction note collection
            this.csvdata1 = Csvdata.find({
                $and: [{
                    'Description': {
                        '$regex': new RegExp(form.value.searchvalue, "i")
                    }
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentYearDate),
                        $lt: new Date(this.nextYearDate)
                    }
                }]
            }, {
                sort: sort_order
            });
        }

        var self = this;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                this.generateReport();
                this.csvFullData = data;
                self.csvdata = data;
                self.detectirregular.length = 0;
                self.loading = false;
                self.limit = 5;
                self.hideit = false;
            });
        });
        setTimeout(function () {
            self.loading = false;
        }, 3000);

    }
    //**** search function for comment extract

    //** url format http://link/csvtemplate/csvtimeline/2/2017?comment_id=S2878923908
    searchboxcomment(id) {
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        this.searchActive = true;
        this.csvdata = null;
        this.csvdata1 = Csvdata.find({
            // $and: [
            // {
            "_id": id
            // }
            //     , {
            //    "Txn_Posted_Date": {
            //       $gte: new Date(this.currentYearDate),
            //       $lt: new Date(this.nextYearDate)
            //    }
            // }]
        }, {
            sort: sort_order
        });
        var self = this;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                this.generateReport();
                this.csvFullData = data;
                self.csvdata = data;
                self.loading = false;
                self.detectirregular.length = 0;
                self.flagclosingopenbalance = false;
            });
        });
        setTimeout(function () {
            self.loading = false;
        }, 3000);

    }
    //  ******** incremented monthly data *****
    csvDataMonthlyPlus() {
        this._router.navigate(['/csvtemplate/csvtimeline', this.upperlimit.format('MM'), this.upperlimit.format('YYYY')]);
    }
    //  ******** decremented monthly data *****
    csvDataMonthlyMinus() {
        this.lowerlimit.subtract(1, 'months');
        this._router.navigate(['/csvtemplate/csvtimeline', this.lowerlimit.format('MM'), this.lowerlimit.format('YYYY')]);
    }

    //*** increament year wise for category and unassigned filter
    csvYearMinus() {
        this.nextYearDate = '01-01-' + this.currentYearNumber;
        this.currentYearDate = '01-01-' + --this.currentYearNumber;
        if (this.apply_category_filter) {
            this.categoryFilterFucntion();
        } else if (this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        }
    }

    // incrementing year value in csvtimeline
    csvYearPlus() {
        this.currentYearDate = '01-01-' + ++this.currentYearNumber;
        this.nextYearDate = '01-01-' + ++this.currentYearNumber;
        --this.currentYearNumber;
        if (this.apply_category_filter) {
            this.categoryFilterFucntion();
        } else if (this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        }
    }

    showExTransaction() {
        this.searchActive = false;
        this.monthdata(this.lowerlimitstring, this.upperlimitstring)
    }
    // code to filter csv transaction based on account no
    AccountSelected(Selected_account) {
        this.accountfilter = true;
        this.Select_account = Selected_account._id;
        this.Selected_account_name = 'Account : ' + Selected_account.Account_no;
        this.filterData();
    }
    // code to show transciton note for all accounts
    selectallaccount() {
        this.accountfilter = false;
        this.Selected_account_name = "All Account List";
        this.filterData();
    }
    // filter to search for a category transaction list only
    categorySelected(selectedCat) {
        this.selectedCategory_id = selectedCat._id;
        this.selectedCategoryName = selectedCat.category;
        this.categoryFilterFucntion();
    }
    // month data function is used to get all transaciton list between date passed as parameter in this
    monthdata(gte, lt) {
        this.loading = true;
        this.invoice_filter = false;

        this.limit = 5;
        this.hideit = false;

        var sort_order = {};
        var filter = {};
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        if (!this.apply_filter) {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    // *** mongodb query to filter selected account no in between lower & upper date
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    // *** mongodb query to filter transaction note based on Credit transaction
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    // *** mongodb query to filter transaction note based on selected account and DR and date limit
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    // query to filter csv transction note based on DR & Date limit
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }

            } else {
                if (this.accountfilter && this.Select_account) {
                    // ** query to filter transction list baed on selected account and date limit
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    // filter based on only date limit
                    this.csvdata1 = Csvdata.find({
                        "Txn_Posted_Date": {
                            $gte: new Date(this.lowerlimitstring),
                            $lt: new Date(this.upperlimitstring)
                        }
                    }, {
                        sort: sort_order
                    });
                }

            }
        } else {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                //*** query filter based on selected account no & CR and date
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    // *** mongodb query filter based on category id "not assigned" & CR & date
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    // *** mongodb query filter based on selected account & whose category not assigned & date limit
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    // mongodb query filter based on DR & whose category not assigned & date limit
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }
            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
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
                    });
                }
            }
        }
        setTimeout(() => { // setting time limit to stop loader after 3 sec if we don't get any result
            this.loading = false;
        }, 3000);
        var self = this;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                this.generateReport();
                this.csvFullData = data;
                self.csvdata = data;
                // we will check for validate tranaction list for open close balance if none of filter is applied in our csvtimeline transactions
                if (self.accountfilter && !self.apply_filter && !self.apply_cr_filter && !self.apply_dr_filter && !self.invoice_filter && !self.apply_category_filter && !self.apply_filter_unassign_year) {
                    self.validateTransactions();
                    self.closeopenbalance();
                } else {
                    self.detectirregular.length = 0; // if any filter is on we will set open close flag
                    self.flagclosingopenbalance = false; // and detec array size equal to zero so we don't get any error.
                }
                self.loading = false;
                // self.limit=5;
                // self.hideit=false;
            });
        });
        setTimeout(function () { // code to stop loader after 3 sec
            self.loading = false;
        }, 3000);
    }
    trackByFn(index, item) {
        return item._id || index;
    }
    // **** code to match closing balance and opening balance. ****
    closeopenbalance() {
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        var previous_month_sort = {};
        previous_month_sort["Txn_Posted_Date"] = -1;
        previous_month_sort["No"] = 1;
        // *** mongodb query to get open balance of this month of transaction notes of a specified account no only
        this.thismonthopenbalance = Csvdata.find({
            $and: [{
                "AssignedAccountNo": this.Select_account
            }, {
                "Txn_Posted_Date": {
                    $gte: new Date(this.lowerlimitstring),
                    $lt: new Date(this.upperlimitstring)
                }
            }]
        }, {
            sort: sort_order,
            limit: 1
        }).fetch();

        // console.log(this.thismonthopenbalance);
        // *** mongodb query to get close balance of this last month of transaction notes of a specified account no only
        this.lastmonthclosingbalance = Csvdata.find({
            $and: [{
                "AssignedAccountNo": this.Select_account
            }, {
                "Txn_Posted_Date": {
                    $lt: new Date(this.lowerlimitstring)
                }
            }]
        }, {
            sort: previous_month_sort,
            limit: 1
        }).fetch();


        if (this.lastmonthclosingbalance.length && this.thismonthopenbalance.length) {
            const lastmonthclosingbalance = this.lastmonthclosingbalance[0]["Available_Balance(INR)"] * 1000000;
            const thisMonthAvailable_Balance = this.thismonthopenbalance[0]["Available_Balance(INR)"] * 1000000;
            const thisMonthTransaction_Amount = this.thismonthopenbalance[0]["Transaction_Amount(INR)"] * 1000000;
            console.log('lastmonthclosingbalance and this.thismonthopenbalance', lastmonthclosingbalance, thisMonthAvailable_Balance - thisMonthTransaction_Amount)
            if (this.thismonthopenbalance[0]["Cr/Dr"] == "CR") {
                if ((lastmonthclosingbalance - (thisMonthAvailable_Balance - thisMonthTransaction_Amount)) < .5) { // *** code to not show any kind of error message in april month
                    if (this.lowerlimitstring.substring(0, 5) != '04-01') {
                        this.flagclosingopenbalance = true;
                    }
                } else {
                    this.flagclosingopenbalance = false;
                }
            } else {
                if ((lastmonthclosingbalance - (thisMonthAvailable_Balance + thisMonthTransaction_Amount)) < .5) {
                    if (this.lowerlimitstring.substring(0, 5) != '04-01') {
                        this.flagclosingopenbalance = true;
                    }
                } else {
                    this.flagclosingopenbalance = false;
                }
            }
        }

    }
    onScroll() {
        if (!this.hideit) {
            this.incrementlimit();
        }
    }
    // **** most of the function with filter substring are to filter transaction note when we choose setting option to filter ***
    filter() {
        this.invoice_filter = false;
        this.apply_category_filter = false;
        this.selectedCategory_id = null;
        this.loading = true;
        this.apply_filter = !this.apply_filter;
        if (!this.apply_filter) {
            this.apply_filter_unassign_year = false;
        }
        this.filterData();
    }
    CategoryFilter() { // category filter function
        // setting all other filter to false
        this.invoice_filter = false;
        this.apply_filter = false;
        this.apply_cr_filter = false;
        this.apply_dr_filter = false;
        this.accountfilter = false;
        this.Select_account = null;
        this.Selected_account_name = "Choose Account";
        this.apply_category_filter = !this.apply_category_filter;
        if (this.apply_category_filter) {
            this.categoryFilterFucntion(); // calling category filter funciton if apply_category_filter is on
        }
        if (!this.apply_category_filter) {
            this.selectedCategory_id = null;
            this.selectedCategoryName = 'Select Category';
            this.filterData();
        }
    }
    categoryFilterFucntion() {
        var sort_order = {};
        this.limit = 5;
        this.hideit = false;
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        if (this.apply_category_filter && this.selectedCategory_id) {
            this.loading = true;
            // *** mongodb query to filter based on selected category id
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_parent_id": this.selectedCategory_id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentYearDate),
                        $lt: new Date(this.nextYearDate)
                    }
                }]
            }, {
                sort: sort_order
            });
            var self = this;
            self.csvdata = null;
            this.csvdata1.subscribe((data) => {
                this.ngZone.run(() => {
                    this.generateReport();
                    this.csvFullData = data;
                    self.csvdata = data;
                    self.detectirregular.length = 0;
                    self.flagclosingopenbalance = false;
                    self.loading = false;
                    self.limit = 5;
                    self.hideit = false;
                });
            });
            setTimeout(function () {
                self.loading = false;
            }, 3000);
        } else {
            this.filterData();
        }
    }
    yearFilterUnassignedCalled() {
        this.apply_filter_unassign_year = !this.apply_filter_unassign_year;
        if (this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        } else {
            this.filterData();
        }
    }
    // *** this function is used to filter all unassigned transaction of a complete year.
    unassignYearfilter() {
        var sort_order = {};
        this.limit = 5;
        this.hideit = false;
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        if (this.apply_filter && this.apply_filter_unassign_year) {
            this.loading = true;
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                // *** mongodb query to filter all CR tranasction whose category is not assigned
                this.csvdata1 = Csvdata.find({
                    $and: [{
                        Assigned_category_id: "not assigned"
                    }, {
                        "Cr/Dr": "CR"
                    }, {
                        "Txn_Posted_Date": {
                            $gte: new Date(this.currentYearDate),
                            $lt: new Date(this.nextYearDate)
                        }
                    }]
                }, {
                    sort: sort_order
                });
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                // *** mongodb query to filter all DR tranasction whose category is not assigned
                this.csvdata1 = Csvdata.find({
                    $and: [{
                        Assigned_category_id: "not assigned"
                    }, {
                        "Cr/Dr": "DR"
                    }, {
                        "Txn_Posted_Date": {
                            $gte: new Date(this.currentYearDate),
                            $lt: new Date(this.nextYearDate)
                        }
                    }]
                }, {
                    sort: sort_order
                });
            } else {
                this.csvdata1 = Csvdata.find({
                    $and: [{
                        Assigned_category_id: "not assigned"
                    }, {
                        "Txn_Posted_Date": {
                            $gte: new Date(this.currentYearDate),
                            $lt: new Date(this.nextYearDate)
                        }
                    }]
                }, {
                    sort: sort_order
                });
            }
            var self = this;
            self.csvdata = null;
            this.csvdata1.subscribe((data) => {
                this.ngZone.run(() => {
                    this.generateReport();
                    this.csvFullData = data;
                    self.csvdata = data;
                    self.detectirregular.length = 0;
                    self.flagclosingopenbalance = false;
                    self.loading = false;
                    self.limit = 5;
                    self.hideit = false;
                });
            });
            setTimeout(function () {
                self.loading = false;
            }, 3000);
        } else {
            this.filterData();
        }
    }
    // **** filterDataCR function is used to filter all transaction note based on CR value
    filterDataCR() {
        this.invoice_filter = false;
        this.apply_category_filter = false;
        this.selectedCategory_id = null;
        this.loading = true;
        this.apply_cr_filter = !this.apply_cr_filter;
        if (this.apply_cr_filter && this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        } else if (!this.apply_cr_filter && this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        } else {
            this.filterData();
        }
    }
    // **** filterDataCR function is used to filter all transaction note based on DR value
    filterDataDR() {
        this.invoice_filter = false;
        this.apply_category_filter = false;
        this.selectedCategory_id = null;
        this.loading = true;
        this.apply_dr_filter = !this.apply_dr_filter;
        if (this.apply_dr_filter && this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        } else if (!this.apply_dr_filter && this.apply_filter_unassign_year) {
            this.unassignYearfilter();
        } else {
            this.filterData();
        }
    }
    // filter Account function is used to filter using filterdata based on account filter boolean
    filterAccount() {
        this.invoice_filter = false;
        this.apply_category_filter = false;
        this.selectedCategory_id = null;
        this.loading = true;

        this.accountfilter = !this.accountfilter;
        if (!this.accountfilter) {
            this.Select_account = null;
            this.Selected_account_name = "Select Account";
        }
        this.filterData();
    }
    // *** invoice filter function is used to filter all transaction whose inovice is not assigned yet
    invoice_filters() {
        this.apply_filter = false;
        this.apply_cr_filter = false;
        this.apply_dr_filter = false;
        this.accountfilter = false;
        this.Select_account = null;
        this.limit = 5;
        this.hideit = false;
        this.Selected_account_name = "Choose Account";
        this.apply_category_filter = false;
        this.selectedCategory_id = null;
        this.invoice_filter = !this.invoice_filter;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        if (this.invoice_filter) {
            // mongodb query to filter all transaction whose inovice is not assigned yet
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "invoice_no": {
                        $ne: "not_assigned"
                    }
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.lowerlimitstring),
                        $lt: new Date(this.upperlimitstring)
                    }
                }]
            }, {
                sort: sort_order
            });
            var self = this;
            self.csvdata = null;
            this.csvdata1.subscribe((data) => {
                this.ngZone.run(() => {
                    this.generateReport();
                    this.csvFullData = data;
                    self.csvdata = data;
                    self.detectirregular.length = 0;
                    self.flagclosingopenbalance = false;
                    self.loading = false;
                });
            });
            setTimeout(function () {
                self.loading = false;
            }, 3000);
        } else {
            this.filterData();
        }
    }
    // *** filter Data function will check for all boolean filter variables and
    // based on these boolean it will select which fields to look for in csv transaction note
    // sort_order variable is used to sort retrieved list in desending transaction date wise
    // in every mongodb query we are setting a limit on Txn_Posted_date to search only current month or year

    filterData() {
        this.invoice_filter = false;
        this.limit = 5;
        this.hideit = false;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        sort_order["No"] = 1;
        if (!this.apply_filter) {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }

            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    this.csvdata1 = Csvdata.find({
                        "Txn_Posted_Date": {
                            $gte: new Date(this.lowerlimitstring),
                            $lt: new Date(this.upperlimitstring)
                        }
                    }, {
                        sort: sort_order
                    });
                }

            }
        } else {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                //*** first filter
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                }
            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    });
                } else {
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
                    });
                }
            }
        }
        var self = this; Csvdata
        self.csvdata = null;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                this.generateReport();
                this.csvFullData = data;
                self.csvdata = data;
                self.detectirregular.length = 0;
                self.flagclosingopenbalance = false;
                self.loading = false;
            });
        });
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                this.generateReport();
                this.csvFullData = data;
                self.csvdata = data;
                if (self.accountfilter && !self.apply_filter && !self.apply_cr_filter && !self.apply_dr_filter && !self.invoice_filter && !self.apply_category_filter && !self.apply_filter_unassign_year) {
                    self.validateTransactions();
                    self.closeopenbalance();
                } else {
                    self.detectirregular.length = 0;
                    self.flagclosingopenbalance = false;
                }
                self.loading = false;
            });
        });
        setTimeout(function () {
            self.loading = false;
        }, 3000);

    }
    // *** code to hide more button when transaction list finish
    hide_more_button(trigger) {
        // console.log(trigger);
        if (trigger == true) {
            this.hideit = true;
        }
    }
    // code to show 5 more transaction note in csvtimeline component
    incrementlimit() {
        this.limit = this.limit + 5
    }
    // code to remove a salary file from csvtimeline component,
    // this function will take id of a salary file which we want to delete
    removesalaryfile(id: any) {
        // Salaryfiles.remove(id);
        Meteor.call('removesalaryfile', id, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                console.log(response);
            }
        });
    }

    finalGenerateReport() {
        if ((this.csvFullData && this.csvFullData.length > 0) && (this.headarraylist && this.headarraylist.length > 0)) {
            this.finalTotalReportData = this._commonService.finalGenerateReport(this.csvFullData, this.headarraylist, this.accountlistdata)
        }
    }
    // here we are unsubscribing from all observalbles to save sytem from memory leaks when component get destoryed.
    ngOnDestroy() {
        this.csvSub.unsubscribe();
        // this.gstSub.unsubscribe();
        this.productSub.unsubscribe();
        this.subcategorySub.unsubscribe();
        this.queryparameterSub.unsubscribe();
        this.headarraySub.unsubscribe();
        this.parameterSub.unsubscribe();
        this.accountSub.unsubscribe();
        this.filecontentSub.unsubscribe();
        // this.headSub.unsubscribe();
        // this.usersData.unsubscribe();
    }
}
