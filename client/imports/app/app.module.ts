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
	RouterModule
} from '@angular/router';
import {
	AccountsModule
} from 'angular2-meteor-accounts-ui';
import {
	ChartsModule
} from 'ng2-charts/ng2-charts';
import {
	AppComponent
} from './app.component';
import {
	SafeHtmlPipe
} from './modules/pipes/domsanitizer.pipe';
import {
	routes,
	ROUTES_PROVIDERS
} from './app.routes';
import {
	ALL_DECLARATIONS
} from './modules';
import {
	SharedNavigationService
} from './modules/services/navigationbar.service';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot(routes),
		AccountsModule,
		ChartsModule
	],
	declarations: [
		AppComponent,
		SafeHtmlPipe,
		...ALL_DECLARATIONS
	],
	providers: [
		...ROUTES_PROVIDERS,
		SharedNavigationService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
