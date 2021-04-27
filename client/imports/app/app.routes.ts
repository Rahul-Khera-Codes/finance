// this is our main routing file
import {
	Route
} from '@angular/router';
import {
	CsvTimelineComponent
} from './modules/core/csvtimeline/csvtimeline.component';
import {
	CsvJsonComponent
} from './modules/core/csvjsonparse/csvjson.component';
import {
	CsvAddCategoryComponent
} from './modules/core/addcategory/addcategory.component';
import {
	LoginComponent
} from './modules/loginComponent/login.component';
import {
	ResetPasswordComponent
} from './modules/reset/resetpass.component';
import {
	adduserComponent
} from './modules/core/adduserComponent/adduser.component';
import {
	TemplateComponent
} from './modules/core/template.component';
import {
	DashboardComponent
} from './modules/core/dashboard/dashboard';
import {
	HeadComponent
} from './modules/core/headComponent/head.component';
import {
	ExpenseReportComponent
} from './modules/core/expensereport/expenseReport';
import {
	ReportByHeadComponent
} from './modules/core/reportbyhead/reportbyhead';
import {
	ReportByCategoryComponent
} from './modules/core/reportbycategory/reportbycategory';
import {
	IncomeReportComponent
} from './modules/core/incomereport/incomereport';
import {
	AccountComponent
} from './modules/core/accounts/accounts';
import {
	EmailPatternComponent
} from './modules/core/emailpattern/emailpattern';
import {
	PendingInvoices
} from './modules/core/Pendinginvoices/pendinginvoices';
import {
	CompleteInvoices
} from './modules/core/completeinvoice/completeinvoices';
import {
	SuspenseTransComponent
} from './modules/core/suspensetransaction/suspensetransaction';
import {
	SalaryDetailsUploadComponent
} from './modules/core/salarydetails/salarydetails';
import {
	ViewEmailComponent
} from './modules/emailview/emailview';
import {
	GstReportComponent
} from './modules/core/gstReport/gstReport';
import { AuthGuardService } from './modules/services/authguard.service';

export const routes: Route[] = [{
	path: '',
	redirectTo: "login",
	pathMatch: "full"
},
{
	path: 'login',
	component: LoginComponent,
	canActivate: [AuthGuardService],
},
{
	path: 'reset-password/:token',
	component: ResetPasswordComponent,
	canActivate: [AuthGuardService],
},
{
	path: 'csvtemplate',
	component: TemplateComponent,
	canActivate: [AuthGuardService],
	children: [
		{
			path: 'dashboard',
			component: DashboardComponent
		},
		{
			path: 'csvtimeline/:month/:year',
			component: CsvTimelineComponent
		}, {
			path: 'completeinvoice',
			component: CompleteInvoices
		},
		{
			path: 'pendinginvoice',
			component: PendingInvoices

		}, {
			path: 'csvjson',
			component: CsvJsonComponent
		},
		{
			path: 'addcategory',
			component: CsvAddCategoryComponent
		},
		{
			path: 'adduser',
			component: adduserComponent
		},
		{
			path: 'heads',
			component: HeadComponent

		}, {
			path: 'suspensetrans',
			component: SuspenseTransComponent
		},
		{
			path: 'accounts',
			component: AccountComponent
		},
		{
			path: 'expensereport',
			component: ExpenseReportComponent
		},
		{
			path: 'incomereport',
			component: IncomeReportComponent
		},
		{
			path: 'byreporthead',
			component: ReportByHeadComponent
		},
		{
			path: 'reportbycategory',
			component: ReportByCategoryComponent
		},
		{
			path: 'salaryuploaddetails',
			component: SalaryDetailsUploadComponent
		},
		{
			path: 'emailpattern',
			component: EmailPatternComponent
		},
		{
			path: 'gstreport',
			component: GstReportComponent

		}
	]
}, {
	path: 'emailview/:id',
	component: ViewEmailComponent,
	canActivate: [AuthGuardService]
}

];
