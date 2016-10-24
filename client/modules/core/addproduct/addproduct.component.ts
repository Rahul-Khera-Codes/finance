import {
    Component,
    OnInit
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
import {
    MeteorComponent
} from 'angular2-meteor';
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

export class CsvAddProductComponent extends MeteorComponent implements OnInit {
    productlist: Mongo.Cursor < any > ;
    subcategory: Mongo.Cursor < any > ;
    addForm: FormGroup;
    addFormsubcategory: FormGroup;
    selectedCategory: any;
    activateChild: boolean;

    constructor(private formBuilder: FormBuilder, private _router: Router) {
        super();
    }

    onSelect(category: any): void {
        this.selectedCategory = category;
        this.activateChild = true;
        this.subcategory = category;
    }

        ngOnInit() {

        this.subscribe('Productcategory', () => {
            this.productlist = Productcategory.find();
        }, true);
        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }
        this.productlist = Productcategory.find();

        this.addForm = this.formBuilder.group({
            category: ['', Validators.required],
        });

        this.addFormsubcategory = this.formBuilder.group({
            subcategory: ['', Validators.required],
        });

    }
    resetForm() {
        this.addForm.controls['category']['updateValue']('');
    }

    ressetChildForm() {
        this.addFormsubcategory.controls['subcategory']['updateValue']('');
    }

    addCategory() {
        if (this.addForm.valid) {
            Productcategory.insert(this.addForm.value);
            this.resetForm();
        }
    }

    addSubCategory(parentCategory_id:string) {
        if (this.addFormsubcategory.valid) {
            Productcategory.update({
                _id: parentCategory_id
            }, {
                $push: {
                    "subarray": {
                        "subcategory": this.addFormsubcategory.controls['subcategory'].value
                    }
                }
            });
            this.ressetChildForm();
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
            });
            this.resetForm();
            this.selectedCategory = "";
            this.activateChild = false;
        }
    }

    removeCategory(category:any) {
        Productcategory.remove(category._id);
    }
    removeSubCategory(id:string, subarraycategoryname:any) {
        Productcategory.update({
            _id: id
        }, {
            $pull: {
                'subarray': {
                    'subcategory': subarraycategoryname
                }
            }
        });
    }

}