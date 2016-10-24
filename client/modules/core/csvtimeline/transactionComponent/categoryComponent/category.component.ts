import {
    Component,
    OnInit,
    Input
} from '@angular/core';
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
    Productcategory
} from '../../../../../../both/collections/csvdata.collection';
import template from './category.html';

@Component({
    selector: 'category',
    template
})

export class CategoryComponent extends MeteorComponent implements OnInit {
    productcategory: Mongo.Cursor < any > ; // this is for our productcategory collection
    @Input() id: string;
    @Input() assigned_category: string;
    @Input() is_processed: number;
    @Input() Cr_Dr: string;
    constructor() {
        super();
    }
    ngOnInit() {     
          this.subscribe('Productcategory', () => {
            this.productcategory = Productcategory.find({});
        }, true);   
    }
    changeCategory(id:string, category:string) {
      Meteor.call('changeCategory', id, category, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
}