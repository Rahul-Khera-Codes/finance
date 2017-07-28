// this is the code to see email in our system.
import {
	Component,
	OnInit,
	OnDestroy,
	NgZone,
	ViewEncapsulation
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
} from 'rxjs/Observable';
import {
	Subscription
} from 'rxjs/Subscription';
import {
	MeteorObservable
} from 'meteor-rxjs';
import {
	ActivatedRoute
} from '@angular/router';
import {
	Emaillist
} from '../../../../../both/collections/csvdata.collection';
import * as _ from 'lodash';
import template from './emailview.html';

@Component({
	selector: 'emailview',
	template,
	encapsulation: ViewEncapsulation.Emulated
})

export class ViewEmailComponent implements OnInit, OnDestroy {
	emailobser: Observable < any[] > ;
	emaillistraw: any;
	emaillistSub: Subscription;
	loading: boolean = true;
	id: string;
	current_date: any;
	current_month: any;
	current_year: any;
	private sub: any;
	constructor(private ngZone: NgZone, private route: ActivatedRoute, private _router: Router) {}
	ngOnInit() {
		// storing dates in our date variables at the component init time
		this.current_date = new Date();
		this.current_month = this.current_date.getMonth() + 1;
		this.current_year = this.current_date.getFullYear();
		this.sub = this.route.params.subscribe(params => { // extracting params which are passed when we call this component at router.
			this.loading = true;
			this.ngZone.run(() => {
				this.id = params['id']; // storing params id in id variable
				// extracting email content from unique email collection by passing id
				this.emaillistSub = MeteorObservable.subscribe('uniqueemail', this.id).subscribe();
				console.log(this.id);
				this.emailobser = Emaillist.find().zone(); // calling email list collection
			});
		});
		this.emailobser.subscribe(data => {
			this.ngZone.run(() => {
				this.emaillistraw = data; // storing emaillist into email list raw variable
				this.loading = false;
				// console.log(this.emaillistraw);
			});
		});
	}

	ngOnDestroy() {
		this.emaillistSub.unsubscribe();
		this.sub.unsubscribe();
	}
}
