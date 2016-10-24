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
    Csvdata
} from '../../../../both/collections/csvdata.collection';
import {
    MeteorComponent
} from 'angular2-meteor';
import template from './csvjsoncomponent.html';


@Component({
    selector: 'csvjson',
    template
})

export class CsvJsonComponent extends MeteorComponent implements OnInit {
    csvdata: Mongo.Cursor < any > ; // this is for csv data collection
    successmessage: string;
    messageshow: boolean = true;


    constructor(private _router: Router) {
        super();
    }

    ngOnInit() {
        //    **** for checking user is login or not ****  
        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }
        //  *** subscribing to csvdata which is unprocessed right now ***
        this.subscribe('csvdata_unprocessed', () => {
            this.csvdata = Csvdata.find({});
        }, true);
    }

    handleFiles() {
        // Check for the various File API support.
        var files = document.getElementById('files').files;
        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0], {
            header: true,
            complete(results:any, file:any) {
                Meteor.call('parseUpload', results.data, (error:any, response:any) => {
                    if (error) {
                        this.messageshow = true;
                        this.successmessage = "Document not uploaded ";
                    } else {
                        console.log(response);
                        console.log("in response message is" + response);
                        this.messageshow = true;
                        this.successmessage = "Document Uploaded Sucessfully";
                    }
                });
            }
        });
    }
}