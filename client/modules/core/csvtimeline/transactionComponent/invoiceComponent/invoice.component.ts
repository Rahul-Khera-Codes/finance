import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import {
    Meteor
} from 'meteor/meteor';
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

export class InvoiceComponent implements OnInit {
    addForm: FormGroup; // form group instance
    @Input() input_id: string;
    @Input() input_invoice_no: string;
    @Input() input_invoice_description: number;
    @Input() Input_Transaction_ID: string;
    @Input() input_linktodrive: any;
    
    invoice_no: string; //**** invoice_no and description are 
    description: string; //   used in adding new invoice details ****
    linkaddressarray: any;
    
    constructor(private formBuilder: FormBuilder) {}
    ngOnInit() { 
        //    *** this is code for adding invoice details ***
         this.addForm = this.formBuilder.group({
            invoice_no: ['', Validators.required],
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
    updateInvoice(id:string, invoice_no:string, descriptions:string, drivelink:any) {
        this.invoice_no = this.addForm.controls['invoice_no'].value;
        this.description = this.addForm.controls['description'].value;
        this.linkaddressarray = this.addForm.controls['linktodrive'].value;
        if (this.invoice_no == '') {
            this.invoice_no = invoice_no;
        }
        if (this.description == '') {
            this.description = descriptions;
        }
        if (this.linkaddressarray == '') {
            this.linkaddressarray = drivelink;
        }

        Meteor.call('addInvoice', id, this.invoice_no, this.description, this.linkaddressarray, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
    addInvoice(id:string) {
        this.invoice_no = this.addForm.controls['invoice_no'].value;
        this.description = this.addForm.controls['description'].value;
        this.linkaddressarray = this.addForm.controls['linktodrive'].value;

        Meteor.call('addInvoice', id, this.invoice_no, this.description, this.linkaddressarray, (error:any, response:any) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
    
    deleteInvoice(id:string) {
        Meteor.call('deleteInvoice', id, (error:any, response:any) => {
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