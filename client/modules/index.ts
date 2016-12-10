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
    suggestionComponent
} from './core/csvtimeline/transactionComponent/suggestoptionComponent/suggestoption.component';
import {
    CategoryComponent
} from './core/csvtimeline/transactionComponent/categoryComponent/category.component';
import {
    ChangeHeadComponent
} from './core/csvtimeline/transactionComponent/changeheadComponent/changehead.component';
import {
    CsvJsonComponent
} from './core/csvjsonparse/csvjson.component';
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
import {
   HeadComponent
} from './core/headComponent/head.component';
import {
   AccountComponent
} from './core/accounts/accounts';

export const ALL_DECLARATIONS = [
    DashboardComponent,
    suggestionComponent,
    CsvTimelineComponent,
    TransactionComponent,
    UserComponent,
    InvoiceComponent,
    CategoryComponent,
    CsvJsonComponent,
    CsvAddCategoryComponent,
    LoginComponent,
    adduserComponent,
    TemplateComponent,
    HeadComponent,
    ChangeHeadComponent,
    AccountComponent
];