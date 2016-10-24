import {
    Component,
    OnInit,
    OnChanges,
    Input
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import * as moment from 'moment';
import {
    MeteorComponent
} from 'angular2-meteor';
import {
    TransactionComponent
} from './transactionComponent/transaction.component';
import {
    Csvdata
} from '../../../../both/collections/csvdata.collection';
import template from './csvtimeline.html';


@Component({
    selector: 'csvtimeline',
    template
})

export class CsvTimelineComponent extends MeteorComponent implements OnInit, OnChanges {
    csvdata: Mongo.Cursor < any > ;
    loginuser: any;
    loginrole: boolean; // *** will use for hide assigning label****

    data_month: any;
    sort_order: any;
    month_in_headbar: any;
    yearly: any;
    monthly: any;
    dateB: any;
    dbdate: any;
    initialupperlimit: any;

    constructor(private _router: Router) {
        super();
        this.loginuser = Meteor.user();
    }
    ngOnChanges() {
        this.loginuser = Meteor.user();
        this.data_month = moment();
    }
    
    ngOnInit() {
    //  this.loginuser=Meteor.user();
        Meteor.subscribe('csvdata');
        Meteor.subscribe("Productcategory");
        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }

        var sort_order = {};
        sort_order["Txn_Posted_Date"] = -1;
        //  *** all date related code ****
        this.data_month = moment();
        this.month_in_headbar = this.data_month.format('MMMM YYYY');
        this.yearly = this.data_month.format('YYYY');
        this.monthly = this.data_month.format('MM');
        this.dateB = moment().year(this.yearly).month(this.monthly - 1).date(1);
        this.dbdate = this.dateB.format('MM-DD-YYYY');
        this.initialupperlimit = this.data_month.format('MM-DD-YYYY');
        //  *** getting data from db related to this month***
        this.csvdata = Csvdata.find({
            "Txn_Posted_Date": {
                $gt: new Date(this.dbdate),
                $lte: new Date(this.initialupperlimit)
            }
        }, {
            sort: sort_order
        });
        
        this.data_month = this.dateB;

    }

    //  ******** incremented monthly data *****
    csvDataMonthlyPlus() {
        var sort_order = {};
        var product_order = {};
        product_order["category"] = 1;
        //  *** all date related code ****      
        sort_order["Txn_Posted_Date"] = -1;
        //  *** momentjs use ** 
        var incrementDateMoment = moment(this.data_month);
        incrementDateMoment.add(1, 'months');
        this.data_month = moment(incrementDateMoment);
        var data_month_temp = incrementDateMoment;
        this.month_in_headbar = this.data_month.format('MMMM YYYY');
        //  ***** here we need two months next and next to next ****
        var yearly = this.data_month.format('YYYY');
        var monthly = this.data_month.format('MM');
        var dateB = moment().year(yearly).month(monthly).date(1);
        var dbdatelower = this.data_month.format('MM-DD-YYYY');
        var dbdateupperlimit = dateB.format('MM-DD-YYYY');
        //  *** getting data from db related to this month***
        this.csvdata = Csvdata.find({
            "Txn_Posted_Date": {
                $gte: new Date(dbdatelower),
                $lt: new Date(dbdateupperlimit)
            }
        }, {
            sort: sort_order
        });
    }

    csvDataMonthlyMinus() {
        var sort_order = {};
        var product_order = {};
        product_order["category"] = 1;
        //  *** all date related code ****   
        sort_order["Txn_Posted_Date"] = -1;
        var dbdateprevious = this.data_month.format('MM-DD-YYYY');
        var decrementDateMoment = moment(this.data_month);
        decrementDateMoment.subtract(1, 'months');

        this.data_month = decrementDateMoment;
        this.month_in_headbar = this.data_month.format('MMMM YYYY');
        //  ***** code to data retrive *****
        var yearly = this.data_month.format('YYYY');
        var monthly = this.data_month.format('MM');
        var dateB = moment().year(yearly).month(monthly - 1).date(1);
        var dbdate = dateB.format('MM-DD-YYYY');
        //  *** getting data from db related to this month***
        this.csvdata = Csvdata.find({
            "Txn_Posted_Date": {
                $gte: new Date(dbdate),
                $lt: new Date(dbdateprevious)
            }
        }, {
            sort: sort_order
        });
    }
}