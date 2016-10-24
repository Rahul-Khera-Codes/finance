import {
    Component,
    OnInit,
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
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    MeteorComponent
} from 'angular2-meteor';
import {
    Csvdata,
    Productcategory
} from '../../../../../../both/collections/csvdata.collection';
import template from './assignCategory.html';


@Component({
    selector: '[assign]',
    template
})

export class AssignCategoryComponent extends MeteorComponent implements OnInit {
    productcategory: Mongo.Cursor < any >; // this is for our productcategory collection
    @Input() id: string;
    addForm: FormGroup; // form group instance

    constructor(private _formBuilder: FormBuilder) {
        super();
    }
    ngOnInit() {
        this.addForm = this._formBuilder.group({
            category: ['', Validators.required],
        });
        this.subscribe('Productcategory', () => {
            this.productcategory = Productcategory.find({});
        }, true);
    }
    addCategory(id:string, category:string) {
        // **** add category is actually assigning category to all the transaction notes ****
        Meteor.call('addCategory', id, category, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
    addNewCategory() {
        if (this.addForm.valid) {
            Productcategory.insert(this.addForm.value);

            // to empty the input box
            this.resetForm();
        }
    }
    resetForm() {
        this.addForm.controls['category']['updateValue']('');
    }

}