import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
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
, 
    Subscription
} from 'rxjs';
import {
    MeteorObservable
} from 'meteor-rxjs';
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    emailpatterncollection
} from '../../../../../../both/collections/csvdata.collection';
import template from './emailpattern.html';
import { StorageService } from './../../services/storage';
import { RemoveStorageService } from '../../services/removeStorage';

@Component({
    selector: 'emailpattern',
    templateUrl: './emailpattern.html',
    moduleId: module.id
})

export class EmailPatternComponent implements OnInit, OnDestroy {
    patternlist: Observable<any[]>;
    selectedpattern: any;
    patternSub: Subscription;
    addForm: FormGroup;
    changevalue: string;
    patternlistvalue: any;
    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) { }

    onSelect(selected: any): void {
        this.selectedpattern = selected;
    }

    ngOnInit() {
        //**** time limit check condition
        // if (this._local.getLocaldata("login_time")) {
        //     var login_time = new Date(this._local.getLocaldata("login_time"));
        //     var current_time = new Date();
        //     var diff = (current_time.getTime() - login_time.getTime()) / 1000;
        //     if (diff > 3600) {
        //         console.log("Your session has expired. Please log in again");
        //         var self = this;
        //         this._remove.removeData();
        //         Meteor.logout(function (error) {
        //             if (error) {
        //                 console.log("ERROR: " + error.reason);
        //             } else {
        //                 self._router.navigate(['/login']);
        //             }
        //         });
        //     } else {
        //         this._local.setLocalData("login_time", current_time.toString());
        //     }
        // }

        // this.patternlist = emailpatterncollection.find({});
        // this.patternSub = MeteorObservable.subscribe('emailpattern').subscribe();
        // this.patternlist.debounceTime(1000).subscribe((data) => {
        //     this.ngZone.run(() => {
        //         this.patternlistvalue = data;
        //         console.log(this.patternlistvalue);
        //     });
        // });

        // this.addForm = this.formBuilder.group({
        //     patterninput: ['', Validators.required],
        // });
    }
    trackByFn(index, item) {
        return item._id || index;
    }
    escape(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    addpattern() {
        if (this.addForm.valid) {
            var pattern = {
                "string": this.addForm.controls['patterninput'].value,
                "regex": this.escape(this.addForm.controls['patterninput'].value)
            }
            emailpatterncollection.insert(pattern);
            this.addForm.reset();
        }
    }

    updatePattern() {
        this.changevalue = this.addForm.controls['patterninput'].value;

        if (this.changevalue != null) {
            emailpatterncollection.update({
                _id: this.selectedpattern._id
            }, {
                $set: {
                    "string": this.changevalue,
                    "regex": this.escape(this.changevalue)
                }
            });
            this.addForm.reset();
            this.selectedpattern = undefined;
        } else {
            this.addForm.reset();
            this.selectedpattern = undefined;
        }
    }

    removePattern(id) {
        emailpatterncollection.remove(id);
        this.addForm.reset();
        this.selectedpattern = "";
    }

    ngOnDestroy() {
        this.patternSub.unsubscribe();
    }
}
