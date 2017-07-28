// this is the list of Row variable collection which we used to pass from csv timeline to its children
export interface Row {
	_id: string;
	No: string;
	Transaction_ID: string;
	Value_Date: string;
	Txn_Posted_Date: any;
	ChequeNo: string;
	Description: string;
	Cr_dr: string;
	Transaction_Amount: string;
	Available_Balance: string;
	Assigned_category: string;
	is_processed: number;
	invoice_no: string;
	invoice_description: string;
	Assigned_user_id: string;
	Assigned_username: string;
	linktodrive ? : any;
}
