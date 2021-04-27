import 'angular2-meteor-polyfills';
import {
	enableProdMode
} from '@angular/core';
import {
	platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

import {
	AppModule
} from './imports/app/app.module';

const platform = platformBrowserDynamic();
enableProdMode();
platform.bootstrapModule(AppModule);
