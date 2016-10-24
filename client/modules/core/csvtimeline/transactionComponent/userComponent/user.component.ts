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
import template from './user.html';

@Component({
    selector: 'user',
    template
})

export class UserComponent extends MeteorComponent implements OnInit {
    userlist: Mongo.Cursor < any > ;
    @Input() id: string;
    @Input() assigned_user: string;
    constructor() {
        super();
    }
    ngOnInit() {     
          this.subscribe('userData', () => {
            this.userlist = Meteor.users.find();
        }, true);
        
    }
    assignTransDocToUser(id:string, userid:string, username:string) {
        Meteor.call('assignTransDocToUser', id, userid, username, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        })
    }
}