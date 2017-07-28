// component to show category list graph in dashboard component.
import {
	Component,
	OnInit,
	OnDestroy,
	Input,
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
import template from './categorylinegraphhtml.html';
import {
	Head
} from '../../../../../../../both/collections/csvdata.collection';

@Component({
	selector: 'categorygraphshow',
	template
})
@InjectUser('user')
export class CategoryGraphComponent implements OnInit, OnDestroy {
	@Input() InputGraphs: any;
	@Input() parentcategory_List: any; //*** head list is use for storing getting head name from _id because our graphdata store _id not Head name. ***
	@Input() graphTypes: any;
	//*** timing related info
	date: any;
	current_year_header: any;
	current_year: number;
	current_month: any;


	// *** this will store our label list ***
	graph_statistic: any;
	labellist: any;
	labelfordata: any = [];
	filtervalue: any;
	labelname: any;
	labellistcount: number;
	fiscalMonths: string[] = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	// ng 2 chart variables with initial values.
	public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;
	public barChartData: any[];

	ngOnInit() {
		// initial values that we are assigning to ng 2 chart
		this.barChartType = this.graphTypes;
		this.barChartData = [{
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			label: 'Expense'
		}, {
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			label: 'Income'
		}];

		this.date = moment(localStorage.getItem("Selected_financial_year"));
		this.current_month = parseInt(this.date.format('MM'));
		this.current_year_header = this.date.format('YYYY');
		if (this.current_month > 3) { // code to check FY by current month value.
			this.current_year = parseInt(this.current_year_header);
		} else {
			this.current_year = parseInt(this.current_year_header) - 1;
		}
		this.categorygraphviewcreate(); // code to assign data into our category graph.
	}
	// main code to initialize data into our category graph
	categorygraphviewcreate() {
		if (this.InputGraphs) {
			this.labelfordata = [];
			this.labellist = this.InputGraphs.graph_head_list;
			this.labellistcount = this.labellist.length;
			for (let i = 0; i < this.InputGraphs.graph_head_list.length; i++) {
				this.filtervalue = _.filter(this.parentcategory_List, {
					"_id": this.InputGraphs.graph_head_list[i]
				});
				if (this.filtervalue) {
					this.labelfordata.push(this.filtervalue[0].category);
				}

			}
		}
		// getting data year from input graph data.
		var datayear = this.InputGraphs.graph_statistic ? this.InputGraphs.graph_statistic['FY' + this.current_year] : false;
		if (datayear) { // run this code if we have data for any perticular FY
			var label = []; //** label will store month names here
			var datawithhead = {};
			_.forEach(this.labellist, function (value) {
				datawithhead[value] = []; // code to create month total value
				datawithhead['total' + value] = 0; // initial month value will be zero.
			});
			for (var i = 0; i < 12; i++) { // running code for complete year means 12 month
				for (var j = 0; j < this.labellistcount; j++) {
					if (datayear[this.labellist[j]] && datayear[this.labellist[j]][this.fiscalMonths[i]]) {
						// adding current month under that year month label.
						datawithhead[this.labellist[j]].push(datayear[this.labellist[j]][this.fiscalMonths[i]]);
						// incrementing the code for that month.
						datawithhead['total' + this.labellist[j]] += datayear[this.labellist[j]][this.fiscalMonths[i]];
					} else {
						datawithhead[this.labellist[j]].push(0);
					}
				}
			}

			var newdata = [];
			// formatting data into key value that we can use in inside our barchartdata.
			_.forEach(this.InputGraphs.graph_head_list, function (value) {
				var input = {
					data: datawithhead[value],
					label: accounting.formatNumber(datawithhead['total' + value], " ")
				};
				newdata.push(input);
			});
			for (let i = 0; i < this.labelfordata.length; i++) {
				newdata[i].label = this.labelfordata[i] + ' ' + newdata[i].label;
			}
			this.barChartData = newdata;
		}
	}
	// code to increment year value
	yearMinus() {
		if (this.current_month > 3) {
			this.date.subtract(1, 'year');
			this.current_year = parseInt(this.date.format('YYYY'));
			this.categorygraphviewcreate();
		} else {
			this.current_year = this.current_year - 1;
			this.categorygraphviewcreate();
		}
	}
	// code to decremetn year value
	yearPlus() {
		if (this.current_month > 3) {
			this.date.add(1, 'year');
			this.current_year = parseInt(this.date.format('YYYY'));
			this.categorygraphviewcreate();
		} else {
			this.current_year = this.current_year + 1;
			this.categorygraphviewcreate();
		}
	}

	ngOnDestroy() {}
}
