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
	routes
} from './app.routes';
import {
	ALL_DECLARATIONS
} from './modules';
import {
	SharedNavigationService
} from './modules/services/navigationbar.service';
import {
	StorageService
} from './modules/services/storage';
import {
	RemoveStorageService
} from './modules/services/removeStorage';
import { CommonService } from './modules/services/common.service';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { AuthGuardService } from './modules/services/authguard.service';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot(routes),
		AccountsModule,
		ChartsModule,
		InfiniteScrollModule
	],
	declarations: [
		AppComponent,
		SafeHtmlPipe,
		...ALL_DECLARATIONS
	],
	providers: [
		SharedNavigationService,
		CommonService,
		AuthGuardService,
		StorageService,
		RemoveStorageService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
