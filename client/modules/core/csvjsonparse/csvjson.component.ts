import {
    Component,
    OnInit,
    Input,
    OnDestroy
} from '@angular/core';
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
    Observable 
} from 'rxjs/Observable';
import { 
    Subscription 
} from 'rxjs/Subscription';
import { 
    MeteorObservable 
} from 'meteor-rxjs';
import template from './csvjsoncomponent.html';


@Component({
    selector: 'csvjson',
    template
})

export class CsvJsonComponent implements OnInit, OnDestroy {
    csvdata: Observable<any[]>; // this is for csv data collection
    successmessage: string;
    messageshow: boolean = true;
    csvSub: Subscription;

    constructor() {}

    ngOnInit() {

        //  *** subscribing to csvdata which is unprocessed right now ***
        this.csvdata = Csvdata.find({}).zone();
        this.csvSub = MeteorObservable.subscribe('csvdata_unprocessed').subscribe();
    }

    handleFiles() {
        // Check for the various File API support.
        var files = document.getElementById('files').files;
        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0], {
            header: true,
            complete(results, file) {
                Meteor.call('parseUpload', results.data, (error, response) => {
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
     ngOnDestroy() {
    this.csvSub.unsubscribe();
  }
}