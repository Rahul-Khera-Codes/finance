// Add category component is used to add new category and subcategory into our system

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
, 
	Subscription
} from 'rxjs';
import {
	MeteorObservable
} from 'meteor-rxjs';
import {
	FormGroup,
	FormBuilder,
	Validators
} from '@angular/forms';
import {
	Productcategory,
	Subcategory
} from '../../../../../../both/collections/csvdata.collection';
import template from './addcategory.html';

@Component({
	selector: 'csvaddcategory',
	templateUrl: './addcategory.html',
	moduleId: module.id
})

export class CsvAddCategoryComponent implements OnInit, OnDestroy {
	productlistvalue: any;
	productlist: Observable<any[]>;
	subcategory: Observable<any[]>;
	selectedCategory: any;
	categorySub: Subscription;
	subcategorySub: Subscription;
	addForm: FormGroup;
	addFormsubcategory: FormGroup;
	activateChild: boolean;
	changevalue: string;

	constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) { }

	ngOnInit() {
		//**** time limit check condition if it excced 1 hrs
		// if login time is more than 1 hr then we should logout the user.
		if (localStorage.getItem("login_time")) {
			var login_time = new Date(localStorage.getItem("login_time"));
			var current_time = new Date();
			var diff = (current_time.getTime() - login_time.getTime()) / 1000;
			if (diff > 3600) {
				console.log("Your session has expired. Please log in again");
				var self = this;
				localStorage.removeItem('login_time'); // removing login time from localstorage
				localStorage.removeItem('Meteor.loginToken'); // rm login tokens
				localStorage.removeItem('Meteor.loginTokenExpires'); // from localstorage
				localStorage.removeItem('Meteor.userId'); // rm user id also from localstorage
				Meteor.logout(function (error) {
					if (error) {
						console.log("ERROR: " + error.reason);
					} else {
						self._router.navigate(['/login']); // we are naviagating user back to login page.
					}
				});
			} else {
				// if login time is less then one hour we increment login time so that user don't face difficulty
				localStorage.setItem("login_time", current_time.toString());
			}
		}
		// *** code to get list of parent category list
		this.productlist = Productcategory.find({});
		this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
		this.productlist.subscribe((data) => {
			this.ngZone.run(() => {
				this.productlistvalue = data;
			});
		});

		// this.subcategory = Subcategory.find({});
		// *** code to get list of subcategory category list
		this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();

		this.addForm = this.formBuilder.group({
			category: ['', Validators.required],
		});

		this.addFormsubcategory = this.formBuilder.group({
			subcategory: ['', Validators.required],
		});

	}

	onSelect(category: any): void { // selecting a category to retrieve its subscategory list
		this.selectedCategory = category;
		this.activateChild = true;
		this.subcategory = Subcategory.find({
			parent_id: category._id
		});
	}

	addCategory() { // add new category to our system
		if (this.addForm.valid) {
			Productcategory.insert(this.addForm.value);
			this.addForm.reset();
		}
	}

	addSubCategory(parentCategory_id) { // this fucntion iss used to add subcategory to our system
		if (this.addFormsubcategory.valid) {
			Subcategory.insert({ // mongodb query to insert new subcategory in sytem
				"parent_id": parentCategory_id,
				"category": this.addFormsubcategory.controls['subcategory'].value
			});
			this.addFormsubcategory.reset();
		}
	}

	updateCategory() { // this function is used to update a category in system.
		this.changevalue = this.addForm.controls['category'].value;

		if (this.changevalue !== null && this.changevalue !== '') {
			Productcategory.update({ // mongodb query to update a category
				_id: this.selectedCategory._id
			}, {
				$set: {
					"category": this.changevalue
				}
			});
			this.addForm.reset(); // resetting form
			this.selectedCategory = undefined; // unselecting selected category
			this.activateChild = false;
		} else {
			this.addForm.reset();
			this.selectedCategory = "";
			this.activateChild = false;
		}
	}

	removeCategory(category_id) { // this fucntion is used to remove category from system.
		// first we will remove all subcategory under a category
		Meteor.call('Subcategory_remove', category_id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
		// second remove category from our system.
		Meteor.call('Category_remove', category_id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
		this.selectedCategory = "";
		this.activateChild = false;
	}
	removeSubCategory(id) { // code to remove subcategory from our system.
		Subcategory.remove(id);
	}
	ngOnDestroy() { // unsubscribing collection after component get destroyed.
		this.categorySub.unsubscribe();
		this.subcategorySub.unsubscribe();
	}
}
