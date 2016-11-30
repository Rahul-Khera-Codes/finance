import {
    Component,
    OnInit,
    Input,
    OnChanges,
    OnDestroy
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
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
    Productcategory,
       Subcategory
} from '../../../../../../both/collections/csvdata.collection';
import * as _ from 'lodash';
import template from './category.html';

@Component({
    selector: 'category',
    template
})

export class CategoryComponent implements OnInit, OnDestroy, OnChanges {
    @Input() id: string;
    @Input() assigned_category_id: string;
    @Input() is_processed: number;
    @Input() Cr_Dr: string;
    @Input() parent_category_list: any;
    @Input() child_category_list: any;
    subcategorySub: Subscription;
    addForm: FormGroup; // form group instance
    show_category: any;
    parent_category: any;
    selectedparent_id: any;
    select_parent: boolean;
    child_list: any;
    Choose_Cateogry: string = "Choose Cateogry";
    constructor(private _formBuilder: FormBuilder) {}
    ngOnInit() {
           this.addForm = this._formBuilder.group({
                category: ['', Validators.required],
            });
        if (this.assigned_category_id != "not assigned") {
                this.show_category = _.filter(this.child_category_list, {
                    "_id": this.assigned_category_id
                });
            if (this.show_category!='') {
                this.parent_category = _.filter(this.parent_category_list, {
                    "_id": this.show_category[0].parent_id
                });
            }
        }
        this.select_parent = true;
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
    }
    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
         // console.log(changes);
        if(changes["assigned_category_id"] && changes["child_category_list"]){
          // console.log(changes["assigned_category_id"]);  console.log(changes["assigned_category_id"]);
          //  console.log("calling after getting values");
          if (changes["assigned_category_id"].currentValue != "not assigned") {
                // console.log(this.child_category_list);
                // console.log(changes["assigned_category_id"].currentValue);
                this.show_category = _.filter(this.child_category_list, {
                    "_id": this.assigned_category_id
                });        
            // console.log(this.show_category);
            if (this.show_category!='') {
                this.parent_category = _.filter(this.parent_category_list,{
                    "_id": this.show_category[0].parent_id
                });
            }
            // console.log(this.parent_category);
            // console.log(this.show_category);
        }
      }
     }

    ParentSelected(selected_parent) {
        this.child_list = _.filter(this.child_category_list, {
            "parent_id": selected_parent._id
        });
        this.Choose_Cateogry = selected_parent.category;
        this.selectedparent_id=selected_parent._id;
        this.select_parent = false;
        console.log(this.selectedparent_id);
        console.log(this.Choose_Cateogry);
    }

    changeCategory(id, category_id) {
        Meteor.call('changeCategory', id, category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.select_parent = true;
        this.Choose_Cateogry = "Choose Cateogry";
    }
     addNewCategory() { 
        if (this.addForm.valid) {
            Productcategory.insert(this.addForm.value);
            // to empty the input box
            this.addForm.reset();
        }
    }
    addNewsubCategory(parentCategory_id) {
        console.log(parentCategory_id);
        console.log(this.addForm.controls['category'].value);
        if (this.addForm.valid) {
            Subcategory.insert({
                "parent_id": parentCategory_id,
                "category": this.addForm.controls['category'].value
            });
            this.addForm.reset();
        this.Choose_Cateogry = "Choose Cateogry";
        this.selectedparent_id=undefined;
        this.select_parent = false;
        }
    }
    ngOnDestroy() {
         this.subcategorySub.unsubscribe();
    }
}
