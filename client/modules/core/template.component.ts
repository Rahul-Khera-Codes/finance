import {
    NgModule,
    Component,
    OnInit,
    OnChanges
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
  ActivatedRoute,
  Router,
  Routes
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    MeteorComponent
} from 'angular2-meteor';

// *** new code for ngmodule checking ***
import {
    CsvTimelineComponent
} from './csvtimeline/csvtimeline.component';
import {
    CsvJsonComponent
} from './csvjsonparse/csvjson.component';
import {
    CsvAddProductComponent
} from './addproduct/addproduct.component';
import {
    adduserComponent
} from './adduserComponent/adduser.component';

// *** checking directives***
import {
    TransactionComponent
} from './csvtimeline/transactionComponent/transaction.component';
import {
    UserComponent
} from './csvtimeline/transactionComponent/userComponent/user.component';
import {
    InvoiceComponent
} from './csvtimeline/transactionComponent/invoiceComponent/invoice.component';
import {
    CategoryComponent
} from './csvtimeline/transactionComponent/categoryComponent/category.component';
import {
    RowInfoComponent
} from './csvjsonparse/rowInfoComponent/rowInfo.component';
import {
    AssignCategoryComponent
} from './csvjsonparse/rowInfoComponent/assignCategoryComponent/assignCategory.component';

import template from './template.html';


@Component({
    selector: 'csvtemplate',
    template
})

export class TemplateComponent extends MeteorComponent implements OnInit, OnChanges {
    checkloginuser: any;// store mongo curser
    logoutprocess: boolean;

    constructor(private _router: Router) {
        super();
        this.checkloginuser = Meteor.user();
    }

    ngOnChanges() {
        this.checkloginuser = Meteor.user();
    }

    ngOnInit() {
        this.logoutprocess = false;
        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }
        this.checkloginuser = Meteor.user();
    }
    logout() {
        var self = this;
        self.logoutprocess = true;
        Meteor.logout(function(error:any) {
            if (error) {
                console.log("ERROR: " + error.reason);
            } else {
                self._router.navigate(['/login']);
            }
        });
    }
}
export const routes: Routes = [
   { path: '', redirectTo: 'addcategory'},
   { path: 'csvtimeline',component: CsvTimelineComponent},
   { path: 'csvjson',component: CsvJsonComponent }, 
   { path: 'addcategory',component: CsvAddProductComponent }, 
   { path: 'adduser',component: adduserComponent}
   ];

   @NgModule({
  declarations: [
    TemplateComponent,
    CsvTimelineComponent,
    CsvJsonComponent,
    CsvAddProductComponent,
    adduserComponent,
    TransactionComponent,
    UserComponent,
    InvoiceComponent,
    CategoryComponent,
    RowInfoComponent,
    AssignCategoryComponent
  ],
  exports: [
    TemplateComponent,
    CsvTimelineComponent,
    CsvJsonComponent,
    CsvAddProductComponent,
    adduserComponent,
    TransactionComponent,
    UserComponent,
    InvoiceComponent,
    CategoryComponent,
    RowInfoComponent,
    AssignCategoryComponent
  ],
  imports: [ RouterModule,BrowserModule ]
})
export class TemplateComponentModule {}