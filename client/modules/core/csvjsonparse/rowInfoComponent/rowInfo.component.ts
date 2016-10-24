import {
    Component,
    Input
} from '@angular/core';
import template from './rowInfo.html';
import {
    Row
} from '../../../../../both/interfaces/row.model';

@Component({
    selector: '[other]',
    template
})

export class RowInfoComponent {
    @Input() row: Row;
    constructor() {}
}