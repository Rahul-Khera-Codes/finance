// Invoice component is used to show info we attach to our transaction note, we can add & update this inovie info using this component
import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import {
	Meteor
} from 'meteor/meteor';
import {
	InjectUser
} from 'angular2-meteor-accounts-ui';
import {
	FormGroup,
	FormArray,
	FormBuilder,
	Validators
} from '@angular/forms';
import template from './invoice.html';

@Component({
	selector: 'invoice',
	template
})
@InjectUser('user')
export class InvoiceComponent implements OnInit {
	user: Meteor.User;
	addForm: FormGroup; // form group instance
	@Input() input_id: string;
	@Input() input_invoice_no: string;
	@Input() input_file_no: string;
	@Input() input_invoice_description: number;
	@Input() Input_Transaction_ID: string;
	@Input() input_linktodrive: any;
	@Input() adminemail: string;

	dateforemail: any;

	file_no: string;
	invoice_no: string; //**** invoice_no and description are
	description: string; //   used in adding new invoice details ****
	locationurl: any;
	linkaddressarray: any;
	linkaddressstring: any;

	constructor(private formBuilder: FormBuilder) {}
	ngOnInit() {
		this.dateforemail = new Date();
		this.locationurl = window.location.origin;
		//    *** this is code for adding invoice details ***
		this.addForm = this.formBuilder.group({
			invoice_no: ['', Validators.required],
			file_no: ['', Validators.required],
			description: ['', Validators.required],
			linktodrive: this.formBuilder.array([
				this.initLink(),
			])
		});
	}

	initLink() {
		return this.formBuilder.group({
			linkAddress: ['', Validators.required]
		});
	}

	addLink() {
		const control = < FormArray > this.addForm.controls['linktodrive'];
		control.push(this.initLink());
	}

	removeLink(i: number) {
		const control = < FormArray > this.addForm.controls['linktodrive'];
		control.removeAt(i);
	}
	//  **** function use for adding invoice details ****
	updateInvoice(id, file_no, invoice_no, descriptions, drivelink) {
		this.invoice_no = this.addForm.controls['invoice_no'].value;
		this.file_no = this.addForm.controls['file_no'].value;
		this.description = this.addForm.controls['description'].value;
		this.linkaddressarray = this.addForm.controls['linktodrive'].value;
		if (this.invoice_no == '') {
			this.invoice_no = invoice_no;
		}
		if (this.file_no == '') {
			this.file_no = file_no;
		}
		if (this.description == '') {
			this.description = descriptions;
		}
		if (this.linkaddressarray == '') {
			this.linkaddressarray = drivelink;
		}

		Meteor.call('addInvoice', id, this.invoice_no, this.file_no, this.description, this.linkaddressarray, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
	}

	addInvoice(id) {
		this.invoice_no = this.addForm.controls['invoice_no'].value;
		this.file_no = this.addForm.controls['file_no'].value;
		this.description = this.addForm.controls['description'].value;
		this.linkaddressarray = this.addForm.controls['linktodrive'].value;
		this.linkaddressstring = '';
		for (var i = 0; i < this.linkaddressarray.length; i++) {
			this.linkaddressstring += '<b>Link</b>: <a href="' + this.linkaddressarray[i].linkAddress + '">' + this.linkaddressarray[i].linkAddress + '</a><br>';
		}
		Meteor.call('addInvoice', id, this.invoice_no, this.file_no, this.description, this.linkaddressarray, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log("Sending an email to notify admin about new invoice");
				Meteor.call('sendEmail',
					this.adminemail,
					// address of admin who get notification on invoice add
					'admin@excellencetechnologies.com',
					'New invoice added by ' + this.user.username,
					'Hi Admin,<br><br> A new Invoice has been added to a Transaction by ' + this.user.username + '. <a href="' + this.locationurl + '/csvtemplate/csvtimeline/' + this.dateforemail.getMonth() + '/' + this.dateforemail.getFullYear() + '?comment_id=' + id + '">Click here to check</a><br/><br/> Details : <br/>' +
					'<b>Invoice No</b> : ' + this.invoice_no + '<br>' +
					'<b>File No</b> : ' + this.file_no + '<br>' +
					'<b>Description</b> : ' + this.description + '<br>' + this.linkaddressstring +
					'<br><br>Thanks',
					(error, response) => {
						if (error) {
							console.log(error.reason);
						} else {
							console.log("An email sent to admin successfully");
						}
					});
			}
		});
	}

	deleteInvoice(id) {
		Meteor.call('deleteInvoice', id, (error, response) => {
			if (error) {
				console.log(error.reason);
			} else {
				console.log(response);
			}
		});
	}

	resetForm() {
		this.addForm.controls['invoice_no']['updateValue']('');
		this.addForm.controls['description']['updateValue']('');
		this.addForm.controls['linkAddress']['updateValue']('');
	}
}
