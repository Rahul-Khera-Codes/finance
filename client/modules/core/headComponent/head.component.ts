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
    Head
} from '../../../../both/collections/csvdata.collection';
import template from './head.html';

@Component({
    selector: 'heads',
    template
})

export class HeadComponent implements OnInit, OnDestroy {
    headlist: Observable < any[] > ;
    selectedCategory: any;
    headSub: Subscription;
    addForm: FormGroup;
    changevalue: string;
    constructor(private formBuilder: FormBuilder) {}

    onSelect(category: any): void {
        this.selectedCategory = category;
    }

        ngOnInit() {

        this.headlist = Head.find({}).zone();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();

        this.addForm = this.formBuilder.group({
            head: ['', Validators.required],
        });
    }

        addCategory() {
        if (this.addForm.valid) {
            Head.insert(this.addForm.value).zone();
            this.addForm.reset();
        }
    }

        updateCategory() {
        this.changevalue = this.addForm.controls['head'].value;

        if (this.changevalue != null) {
            Head.update({
                _id: this.selectedCategory._id
            }, {
                $set: {
                    "head": this.changevalue
                }
            }).zone();
            this.addForm.reset();
            this.selectedCategory = undefined;
        } else {
            this.addForm.reset();
            this.selectedCategory = undefined;

        }
    }

        removeCategory(category_id) {
        Meteor.call('head_remove', category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.addForm.reset();
        this.selectedCategory = "";
    }

        ngOnDestroy() {
        this.headSub.unsubscribe();
    }

}