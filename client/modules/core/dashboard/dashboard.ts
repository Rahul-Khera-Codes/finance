import {
    Component,
    OnInit
} from '@angular/core';
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
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import template from './adduser.html';

import { 
    Users 
} from '../../../../both/collections/csvdata.collection';


@Component({
    selector: 'dashboard',
    template
})

export class DashboardComponent implements OnInit {
 
    constructor() {}

    ngOnInit() { }
 }
  

  