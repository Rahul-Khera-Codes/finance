import {
    CsvTimelineComponent
} from './core/csvtimeline/csvtimeline.component';
import {
    TransactionComponent
} from './core/csvtimeline/transactionComponent/transaction.component';
import {
    UserComponent
} from './core/csvtimeline/transactionComponent/userComponent/user.component';
import {
    InvoiceComponent
} from './core/csvtimeline/transactionComponent/invoiceComponent/invoice.component';
import {
    CategoryComponent
} from './core/csvtimeline/transactionComponent/categoryComponent/category.component';
import {
    CsvJsonComponent
} from './core/csvjsonparse/csvjson.component';
import {
    RowInfoComponent
} from './core/csvjsonparse/rowInfoComponent/rowInfo.component';
import {
    AssignCategoryComponent
} from './core/csvjsonparse/rowInfoComponent/assignCategoryComponent/assignCategory.component';
import {
    CsvAddCategoryComponent
} from './core/addcategory/addcategory.component';
import {
    LoginComponent
} from './loginComponent/login.component';
import {
    adduserComponent
} from './core/adduserComponent/adduser.component';
import {
    TemplateComponent
} from './core/template.component';
import {
    DashboardComponent
} from './core/dashboard/dashboard';

export const ALL_DECLARATIONS = [
    DashboardComponent,
    CsvTimelineComponent,
    TransactionComponent,
    UserComponent,
    InvoiceComponent,
    CategoryComponent,
    CsvJsonComponent,
    RowInfoComponent,
    AssignCategoryComponent,
    CsvAddCategoryComponent,
    LoginComponent,
    adduserComponent,
    TemplateComponent
];