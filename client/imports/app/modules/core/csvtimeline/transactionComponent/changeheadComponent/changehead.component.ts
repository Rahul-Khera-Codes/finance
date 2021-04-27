// This component is used to change head option in csvtimeline component

import {
	Component,
	OnInit,
	Input,
	OnDestroy,
	OnChanges,
	Output,
	EventEmitter
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
	Productcategory
} from '../../../../../../../../both/collections/csvdata.collection';
import * as _ from 'lodash';
import template from './changehead.html';

@Component({
	selector: 'changehead',
	templateUrl: './changehead.html',
	moduleId: module.id
})
@InjectUser('user')
export class ChangeHeadComponent implements OnInit, OnDestroy, OnChanges {
	user: Meteor.User;
	@Input() id: string;
	@Input() assigned_head_id: string;
	@Input() headlist: any[];
	@Output() change: EventEmitter<string> = new EventEmitter<string>();
	show_head: any;
	constructor() { }
	ngOnInit() {
		if (this.assigned_head_id) {
			this.show_head = _.filter(this.headlist, {
				"_id": this.assigned_head_id
			});
		} else {
			console.log('assign head id not found');
		}
	}
	// calling meteor method to change assigned head on a give transaction note
	changeHead(newhead_id) {
		Meteor.call('changeheadtag', this.id, newhead_id, (error, response) => {
			if (error) {
				console.log(error.reason);
				alert(error.reason);
			} else {
				console.log(response);
			}
		});
	}
	trackByFn(index, item) {
		return item._id || index;
	}
	// code to save system from error if there is delay in getting input from parent component.
	ngOnChanges(changes: any) {
		if (!!changes["assigned_head_id"]) {
			let assigned = changes["assigned_head_id"].currentValue;
			if (assigned) {
				this.show_head = _.filter(this.headlist, {
					"_id": this.assigned_head_id
				});
			}
		}
		if (this.show_head.length) {
			this.change.emit(this.show_head[0].head);
		}
	}
	ngOnDestroy() { }
}
