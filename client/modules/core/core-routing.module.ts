// export const routes: Routes = [
//    { path: '', redirectTo: 'addcategory'},
//    { path: 'csvtimeline',component: CsvTimelineComponent},
//    { path: 'csvjson',component: CsvJsonComponent }, 
//    { path: 'addcategory',component: CsvAddProductComponent }, 
//    { path: 'adduser',component: adduserComponent}
//    ];





//     import { NgModule }     from '@angular/core';
//     import { RouterModule } from '@angular/router';
// import {
//     CsvTimelineComponent
// } from './csvtimeline/csvtimeline.component';
// import {
//     CsvJsonComponent
// } from './csvjsonparse/csvjson.component';
// import {
//     CsvAddProductComponent
// } from './addproduct/addproduct.component';
// import {
//     adduserComponent
// } from './adduserComponent/adduser.component';
// import {
//     TemplateComponent
// } from './template.component';
//     @NgModule({
//       imports: [
//         RouterModule.forChild([
//            {
//                path: '',
//               redirectTo: "/csvtemplate",
//               pathMatch: 'full'
//            },
//           { path: 'csvtemplate',
//             component:TemplateComponent,
//              children: [{
//                   path: '',
//                   redirectTo: 'addcategory'
//                   },
//                   {
//                   path: 'csvtimeline',
//                   component: CsvTimelineComponent
//                    },
//                  {
//                    path: 'csvjson',
//                   component: CsvJsonComponent
//                  }, 
//                    {
//                     path: 'addcategory',
//                      component: CsvAddProductComponent
//                    }, 
//                  {
//                    path: 'adduser',
//                    component: adduserComponent
//                  }]
//                }
//       ])
//         ],
//       exports: [
//         RouterModule
//       ]
//     })
//     export class CoreRoutingModule { }

    //  {
    // path: 'csvtemplate',
    // component: TemplateComponent,
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