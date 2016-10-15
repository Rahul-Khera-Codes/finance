import {
    Route,
    RouterConfig,
    provideRouter
} from '@angular/router';
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

export const routes: Route[] = [{
    path: '',
    redirectTo: "login"
}, {
    path: 'login',
    component: LoginComponent
}, {
    path: 'csvtemplate',
    component: TemplateComponent,
    children: [{
        path: '',
        redirectTo: 'csvtimeline'
    }, {
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
    }]
}];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];