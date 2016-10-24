import { 
  NgModule 
} from '@angular/core';
import { 
  BrowserModule
} from '@angular/platform-browser';
import { 
  FormsModule,
  ReactiveFormsModule 
} from '@angular/forms';
import { 
  RouterModule,
  Routes,
  Router 
} from '@angular/router';
import { 
  AccountsModule 
} from 'angular2-meteor-accounts-ui';
import {
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
    import {
    routes as childRoutes,
    TemplateComponentModule,
    TemplateComponent
} from './modules/core/template.component';
import {
    LoginComponent
} from './modules/loginComponent/login.component';

import { AppComponent } from './app.component';
// import { CoreModule } from './modules/core/core.module';
// import { ROUTES_PROVIDERS } from './app.routes';
// import { ALL_DECLARATIONS } from './modules';
// import { AppRoutingModule }     from './app.routes';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'csvtemplate', component: TemplateComponent, children: childRoutes }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    TemplateComponentModule,
    // CoreModule,
    AccountsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
    // ,
    // TemplateComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}

