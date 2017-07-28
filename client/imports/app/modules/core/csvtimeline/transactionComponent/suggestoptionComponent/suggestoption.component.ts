// This component is used to suggest category to transaction note whose category is not assigned yet

import {
	Component,
	Input,
	OnInit
} from '@angular/core';
import {
	Mongo
} from 'meteor/mongo';
import {
	Meteor
} from 'meteor/meteor';
import * as _ from 'lodash';
import template from './suggestoption.html';


@Component({
	selector: 'suggest-option',
	template
})

export class suggestionComponent implements OnInit {
	suggestarray: any = [];
	allcategoryArray: any;
	category: any;
	n: any;
	parent_category: any;
	description: string;
	parentnameassigned: string;
	categoryassigned: string;
	// list of inputs we are getting from parent component.
	@Input() input: string; // this variable will have input from parent  component
	@Input() id: string;
	@Input() parent_category_list: any;
	@Input() child_category_list: any;
	ngOnInit() {
		this.description = this.input.toLowerCase();
		this.allcategoryArray = this.child_category_list;
		for (let i = 0; i < this.allcategoryArray.length; i++) {
			// code to match transaction note description with category array and subcategory array.
			this.n = this.description.indexOf(this.allcategoryArray[i].category.toLowerCase());
			if (this.n != -1) {
				this.parent_category = _.filter(this.parent_category_list, {
					"_id": this.allcategoryArray[i].parent_id
				});
				this.category = this.allcategoryArray[i];
				this.parentnameassigned = this.parent_category[0] ? this.parent_category[0].category : "Parent Category";
				this.categoryassigned = this.allcategoryArray[i] ? this.allcategoryArray[i].category : "category";
				// if there is some matching category then we will use this code to add it to suggest list array
				if (this.parentnameassigned != "Parent Category") {
					let suggest = {
						id: this.allcategoryArray[i]._id,
						category: this.categoryassigned,
						parentname: this.parentnameassigned,
						parentcategoryid: this.allcategoryArray[i].parent_id
					};
					this.suggestarray.push(suggest);
				}
			}
		}
	}
	// code to assign parent id and subcategory to a transaction note.
	assigncategory(parent_id: string, category_id: string) {
		Meteor.call('changeCategory', this.id, parent_id, category_id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
	}
}
