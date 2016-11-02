import {
    Route
} from '@angular/router';
import { Meteor } from 'meteor/meteor';
import {
    CsvTimelineComponent
} from './modules/core/csvtimeline/csvtimeline.component';
import {
    CsvJsonComponent
} from './modules/core/csvjsonparse/csvjson.component';
import {
    CsvAddProductComponent
} from './modules/core/addproduct/addproduct.component';
import {
    LoginComponent
} from './modules/loginComponent/login.component';
import {
    adduserComponent
} from './modules/core/adduserComponent/adduser.component';
import {
    TemplateComponent
} from './modules/core/template.component';
// import {
//     DashboardComponent
// } from './modules/core/dashboard/dashboard';

export const routes: Route[] = [{
    path: '',
    redirectTo: "login",
    pathMatch: "full"
}, 
{
    path: 'login',
    component: LoginComponent
}, 
{
    path: 'csvtemplate',
    component: TemplateComponent,
    canActivate: ['canActivateForLoggedIn'],
    children: [{
        path: '',
        redirectTo: 'csvtimeline'
    }, 
    // {
    //     path:'dashboard',component: DashboardComponent
    // },
    {
        path: 'csvtimeline',
        component: CsvTimelineComponent
    }, {
        path: 'csvjson',
        component: CsvJsonComponent
    }, {
        path: 'addcategory',
        component: CsvAddProductComponent
    }, {
        path: 'adduser',
        component: adduserComponent
    }
    ]
}];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
