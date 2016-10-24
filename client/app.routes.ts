//     import { NgModule }     from '@angular/core';
//     import { RouterModule } from '@angular/router';
//     import {
//     TemplateComponent
// } from './modules/core/template.component';
// import {
//     LoginComponent
// } from './modules/loginComponent/login.component';
//     @NgModule({
//       imports: [
//         RouterModule.forRoot([
//             {
//                path: '',
//               redirectTo: "/login",
//               pathMatch: 'full'
//            },
//            {
//               path: 'login',
//               component: LoginComponent
//             }
//             // ,
//             // {
//             //    path: 'csvtemplate',
//             //    component: TemplateComponent
//             //  }
//         ])
//       ],
//       exports: [
//         RouterModule
//       ]
//     })
//     export class AppRoutingModule {}
// import { RouterModule, Routes } from '@angular/router';
// import { ModuleWithProviders }  from '@angular/core';
// import { Meteor } from 'meteor/meteor';
// import {
//     CsvTimelineComponent
// } from './modules/core/csvtimeline/csvtimeline.component';
// import {
//     CsvJsonComponent
// } from './modules/core/csvjsonparse/csvjson.component';
// import {
//     CsvAddProductComponent
// } from './modules/core/addproduct/addproduct.component';
// import {
//     LoginComponent
// } from './modules/loginComponent/login.component';
// import {
//     adduserComponent
// } from './modules/core/adduserComponent/adduser.component';
// import {
//     TemplateComponent
// } from './modules/core/template.component';

// export const routes: Routes = [{
//     path: '',
//     redirectTo: "/login",
//      pathMatch: 'full'
// }, {
//     path: 'login',
//     component: LoginComponent
// }, {
//     path: 'csvtemplate',
//     component: TemplateComponent,
    // children: [{
    //     path: '',
    //     redirectTo: 'addcategory'
    // }, {
    //     path: 'csvtimeline',
    //     component: CsvTimelineComponent
    // }, {
    //     path: 'csvjson',
    //     component: CsvJsonComponent
    // }, {
    //     path: 'addcategory',
    //     component: CsvAddProductComponent
    // }, {
    //     path: 'adduser',
    //     component: adduserComponent
    // }]
// }];

// export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
