import {
    Component,
    OnInit,
    OnDestroy
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
    Productcategory
} from '../../../../both/collections/csvdata.collection';
import template from './addproduct.html';

@Component({
    selector: 'csvaddproduct',
    template
})

export class CsvAddProductComponent implements OnInit, OnDestroy {
    productlist: Observable<any[]>;
    subcategory: Observable<any[]>;
    selectedCategory: any;
    productSub: Subscription;
    subcategSub: Subscription;
    addForm: FormGroup;
    addFormsubcategory: FormGroup;
    // selectedCategory: any;
    activateChild: boolean;

    constructor(private formBuilder: FormBuilder, private _router: Router) {}

    onSelect(category: any): void {
        this.selectedCategory = category;
        this.activateChild = true;
        this.subcategSub = MeteorObservable.subscribe('Productcategory').subscribe(() => {
             this.subcategory = Productcategory.find({_id:category._id}).zone();
        });
    }

        ngOnInit() {

        this.productlist = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();

        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }

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
            Productcategory.update({
                _id: parentCategory_id
            }, {
                $push: {
                    "subarray": {
                        "subcategory": this.addFormsubcategory.controls['subcategory'].value
                    }
                }
            }).zone();
            this.addFormsubcategory.reset();
            // this.subcategory=selectedCategory.subarray;

        }
    }

    updateCategory() {
        if (this.addForm.valid) {
            Productcategory.update({
                _id: this.selectedCategory._id
            }, {
                $set: {
                    "category": this.selectedCategory.category
                }
            }).zone();
            this.addForm.reset();
            this.selectedCategory = undefined;
            this.activateChild = false;
        }
    }

    removeCategory(category_id) {
        Productcategory.remove(category_id).zone();
    }
    removeSubCategory(id, subarraycategoryname) {
        Productcategory.update({
            _id: id
        }, {
            $pull: {
                'subarray': {
                    'subcategory': subarraycategoryname
                }
            }
        }).zone();
    }
    ngOnDestroy() {
    this.productSub.unsubscribe();
     this.subcategSub.unsubscribe();
  }

}