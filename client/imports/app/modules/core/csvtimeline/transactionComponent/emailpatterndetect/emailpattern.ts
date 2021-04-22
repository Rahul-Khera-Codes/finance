// This component is used to detect if there is any email in our system with same invoice detail

import {
	Component,
	OnInit,
	Input,
	OnChanges,
	OnDestroy,
	ViewChild,
	ElementRef,
	// ViewEncapsulation,
	NgZone
} from '@angular/core';
import {
	InjectUser
} from 'angular2-meteor-accounts-ui';
import {
	Mongo
} from 'meteor/mongo';
import {
	Meteor
} from 'meteor/meteor';
import {
	Observable
, 
	Subscription
} from 'rxjs';
import {
	MeteorObservable
} from 'meteor-rxjs';
import {
	Emaillist
} from '../../../../../../../../both/collections/csvdata.collection';
import * as _ from 'lodash';
import * as moment from 'moment';
import template from './emailpattern.html';

@Component({
	selector: 'emailpatterns',
	// encapsulation: ViewEncapsulation.Emulated,
	templateUrl: './emailpattern.html',
	moduleId: module.id
})

export class EmailPatternDetect implements OnInit, OnDestroy {
	@Input() transaction_description: string;
	@Input() emailpatternarray: any;
	@Input() transaction_date: any;
	@Input() transaction_id: string;

	emailobser: Observable<any[]>;
	emaillistraw: any;
	emaillistSub: Subscription;

	// @ViewChild('emailbody') emailbody: ElementRef;

	constructor(private ngZone: NgZone) { }
	ngOnInit() {
		this.emaillistraw = [];
		this.emaillistSub = MeteorObservable.subscribe('emaillistarray').subscribe();
		var self = this;
		_.forEach(this.emailpatternarray, function (value) {
			// console.log(value['regex']);
			var testdescriptionmatch = new RegExp(value['regex']);
			if (testdescriptionmatch.test(self.transaction_description) == true) {
				var lowerdate = moment(self.transaction_date).subtract(1, 'days').format('MM-DD-YYYY');
				var upperdate = moment(self.transaction_date).add(1, 'days').format('MM-DD-YYYY');
				self.emailobser = Emaillist.find({
					$and: [{
						'subject': {
							'$regex': new RegExp(value['regex'], "i")
						}
					}, {
						"email_date": {
							$gt: new Date(lowerdate),
							$lt: new Date(upperdate)
						}
					}]
				}, {
					fields: {
						"_id": 1,
						"date": 1,
						"from": 1,
						"subject": 1
					}
				});
				self.emailobser.subscribe((data) => {
					self.ngZone.run(() => {
						self.emaillistraw = data;
						// console.log(self.emaillistraw);
					});
				});
			}
		});

	}
	trackByFn(index, item) {
		return item._id || index;
	}
	ngOnDestroy() {
		this.emaillistSub.unsubscribe();
	}
}
