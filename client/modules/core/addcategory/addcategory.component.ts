import {
    Component,
    OnInit,
    OnDestroy
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
    Productcategory,
    Subcategory
} from '../../../../both/collections/csvdata.collection';
import template from './addcategory.html';

@Component({
    selector: 'csvaddcategory',
    template
})

export class CsvAddCategoryComponent implements OnInit, OnDestroy {
    productlist: Observable < any[] > ;
    subcategory: Observable < any[] > ;
    selectedCategory: any;
    categorySub: Subscription;
    subcategorySub: Subscription;
    addForm: FormGroup;
    addFormsubcategory: FormGroup;
    activateChild: boolean;
    changevalue: string;

    constructor(private formBuilder: FormBuilder, private _router: Router) {}

    onSelect(category: any): void {
        this.selectedCategory = category;
        this.activateChild = true;
        this.subcategory = Subcategory.find({
            parent_id: category._id
        }).zone();
        // this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
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
                Meteor.logout(function(error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            }
        }

        this.productlist = Productcategory.find({}).zone();
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();

        // this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();

        this.addForm = this.formBuilder.group({
            category: ['', Validators.required],
        });

        this.addFormsubcategory = this.formBuilder.group({
            subcategory: ['', Validators.required],
        });

    }

        addCategory() {
        if (this.addForm.valid) {
            Productcategory.insert(this.addForm.value).zone();
            this.addForm.reset();
        }
    }

        addSubCategory(parentCategory_id) {
        if (this.addFormsubcategory.valid) {
            Subcategory.insert({
                "parent_id": parentCategory_id,
                "category": this.addFormsubcategory.controls['subcategory'].value
            });
            this.addFormsubcategory.reset();
        }
    }

        updateCategory() {
        this.changevalue = this.addForm.controls['category'].value;

        if (this.changevalue !== null && this.changevalue !== '') {
            Productcategory.update({
                _id: this.selectedCategory._id
            }, {
                $set: {
                    "category": this.changevalue
                }
            }).zone();
            this.addForm.reset();
            this.selectedCategory = undefined;
            this.activateChild = false;
        } else {
            this.addForm.reset();
            this.selectedCategory = "";
            this.activateChild = false;
        }
    }

        removeCategory(category_id) {
        Meteor.call('Subcategory_remove', category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
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
    removeSubCategory(id) {
        Subcategory.remove(id);
    }
    ngOnDestroy() {
        this.categorySub.unsubscribe();
        this.subcategorySub.unsubscribe();
    }
}