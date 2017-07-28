// this is list of all our component we use in our app.
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
	EmailPatternDetect
} from './core/csvtimeline/transactionComponent/emailpatterndetect/emailpattern';
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
	ExpenseReportComponent
} from './core/expensereport/expenseReport';
import {
	ReportByHeadComponent
} from './core/reportbyhead/reportbyhead';
import {
	ReportByCategoryComponent
} from './core/reportbycategory/reportbycategory';
import {
	IncomeReportComponent
} from './core/incomereport/incomereport';
import {
	GraphShowComponent
} from './core/dashboard/graphShow/graphShow';
import {
	CategoryGraphComponent
} from './core/dashboard/categorylinegraph/categorylinegraph';
import {
	AccountComponent
} from './core/accounts/accounts';
import {
	EmailPatternComponent
} from './core/emailpattern/emailpattern';
import {
	PendingInvoices
} from './core/Pendinginvoices/pendinginvoices';
import {
	CompleteInvoices
} from './core/completeinvoice/completeinvoices';
import {
	SuspenseTransComponent
} from './core/suspensetransaction/suspensetransaction';
import {
	SalaryDetailsUploadComponent
} from './core/salarydetails/salarydetails';
import {
	ViewEmailComponent
} from './emailview/emailview';


export const ALL_DECLARATIONS = [
	ViewEmailComponent,
	EmailPatternDetect,
	SalaryDetailsUploadComponent,
	EmailPatternComponent,
	SuspenseTransComponent,
	CompleteInvoices,
	PendingInvoices,
	ReportByHeadComponent,
	DashboardComponent,
	GraphShowComponent,
	IncomeReportComponent,
	CategoryGraphComponent,
	suggestionComponent,
	CsvTimelineComponent,
	TransactionComponent,
	UserComponent,
	InvoiceComponent,
	CategoryComponent,
	CsvJsonComponent,
	ExpenseReportComponent,
	CsvAddCategoryComponent,
	LoginComponent,
	adduserComponent,
	TemplateComponent,
	HeadComponent,
	ReportByCategoryComponent,
	ChangeHeadComponent,
	AccountComponent
];
