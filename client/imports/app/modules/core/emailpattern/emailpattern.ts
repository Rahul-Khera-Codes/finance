import {
	Component,
	OnInit,
	OnDestroy,
	NgZone
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
	FormGroup,
	FormBuilder,
	Validators
} from '@angular/forms';
import {
	emailpatterncollection
} from '../../../../../../both/collections/csvdata.collection';
import template from './emailpattern.html';

@Component({
	selector: 'emailpattern',
	template
})

export class EmailPatternComponent implements OnInit, OnDestroy {
	patternlist: Observable < any[] > ;
	selectedpattern: any;
	patternSub: Subscription;
	addForm: FormGroup;
	changevalue: string;
	patternlistvalue: any;
	constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) {}

	onSelect(selected: any): void {
		this.selectedpattern = selected;
	}

	ngOnInit() {
		//**** time limit check condition
		if (localStorage.getItem("login_time")) {
			var login_time = new Date(localStorage.getItem("login_time"));
			var current_time = new Date();
			var diff = (current_time.getTime() - login_time.getTime()) / 1000;
			if (diff > 3600) {
				console.log("Your session has expired. Please log in again");
				var self = this;
				localStorage.removeItem('login_time');
				localStorage.removeItem('Meteor.loginToken');
				localStorage.removeItem('Meteor.loginTokenExpires');
				localStorage.removeItem('Meteor.userId');
				Meteor.logout(function (error) {
					if (error) {
						console.log("ERROR: " + error.reason);
					} else {
						self._router.navigate(['/login']);
					}
				});
			} else {
				localStorage.setItem("login_time", current_time.toString());
			}
		}

		this.patternlist = emailpatterncollection.find({}).zone();
		this.patternSub = MeteorObservable.subscribe('emailpattern').subscribe();
		this.patternlist.subscribe((data) => {
			this.ngZone.run(() => {
				this.patternlistvalue = data;
				console.log(this.patternlistvalue);
			});
		});

		this.addForm = this.formBuilder.group({
			patterninput: ['', Validators.required],
		});
	}

	escape(string) {
		return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	}

	addpattern() {
		if (this.addForm.valid) {
			var pattern = {
				"string": this.addForm.controls['patterninput'].value,
				"regex": this.escape(this.addForm.controls['patterninput'].value)
			}
			emailpatterncollection.insert(pattern).zone();
			this.addForm.reset();
		}
	}

	updatePattern() {
		this.changevalue = this.addForm.controls['patterninput'].value;

		if (this.changevalue != null) {
			emailpatterncollection.update({
				_id: this.selectedpattern._id
			}, {
				$set: {
					"string": this.changevalue,
					"regex": this.escape(this.changevalue)
				}
			}).zone();
			this.addForm.reset();
			this.selectedpattern = undefined;
		} else {
			this.addForm.reset();
			this.selectedpattern = undefined;
		}
	}

	removePattern(id) {
		emailpatterncollection.remove(id);
		this.addForm.reset();
		this.selectedpattern = "";
	}

	ngOnDestroy() {
		this.patternSub.unsubscribe();
	}
}
