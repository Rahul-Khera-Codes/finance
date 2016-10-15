import {
    Component
} from '@angular/core';
import {
    ROUTER_DIRECTIVES
} from '@angular/router';

@Component({
    selector: 'app',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['style.css'],
    directives: [ROUTER_DIRECTIVES]
})

export class AppComponent {}