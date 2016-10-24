import {
    Component,
    Input
} from '@angular/core';
import {
    UserComponent
} from './userComponent/user.component';
import {
    CategoryComponent
} from './categoryComponent/category.component';
import {
    Row
} from '../../../../../both/interfaces/row.model';
import {
    InvoiceComponent
} from './invoiceComponent/invoice.component';
import template from './transaction.html';

@Component({
    selector: '[transaction]',
    template
})

export class TransactionComponent {
    @Input() transaction_data: Row;
    constructor() {}
}