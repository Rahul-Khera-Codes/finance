// login component is used to login into our system.
import {
    Component,
    OnInit,
    NgZone
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import template from './login.html';

@Component({
    selector: 'login',
    template
})

export class LoginComponent implements OnInit {
    addForm: FormGroup;
	resetEmailForm:FormGroup;
    email: string;
	resetEmail:string;
    password: string;
    message: string;
    showmessage: boolean = false;
    loginprocess: boolean;
    logintime: any;

    current_date: any;
    current_month: any;
    current_year:any;
    years: number[];
    constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) {

    }

    ngOnInit() {
        // list of things we do when our login component loads
        this.current_date = new Date();// storing current date in current date variable
        this.current_month = this.current_date.getMonth()+1;// extracting current month value
        this.current_year=this.current_date.getFullYear();
        //  *** checking if user is already login ***
        if (Meteor.user()) {// if user already login then redirect him to csvtimeline component.
            this._router.navigate(['csvtemplate/csvtimeline',this.current_month,this.current_year]);
        }
        this.getYears(-10, 10);// get Year function will give us list of 10 years date from current date.
        this.addForm = this.formBuilder.group({// this is the form used to take input at login
            email: ['', Validators.required],
            password: ['', Validators.required],
            FYYear: ['Select Financial Year', Validators.required]// option to select financial year
        });
		this.resetEmailForm = this.formBuilder.group({// this is the form used to take email to reset password
            email: ['', Validators.required]
        });

        this.loginprocess = false;
    }
    // code to get list of years in years variable
    getYears(offset: number, range: number){
        this.years = [];
        for (var i = 0; i < range + 1; i++){
            this.years.push(this.current_year + offset + i);
        }
    }

    // function called when we enter our login detail and click login
    login() {
        var self = this;
        self.loginprocess = true;
        if (this.addForm.valid) {// run code only if form is valid
            self.logintime = new Date();
            this.email = this.addForm.controls['email'].value;// taking out email value
            this.password = this.addForm.controls['password'].value;// taking out password value
            if(isNaN(this.addForm.controls['FYYear'].value)){// checking financial year value
               this.ngZone.run(() => {// if financial year is not selected show error message.
                    this.loginprocess = false;
                    this.showmessage = true;
                    this.message = "Please Select Financial Year";
               });
             }
            else {
               // meteor method to login a user by passing email and password into loginwithpassword function
               Meteor.loginWithPassword(this.email, this.password, function(error) {
                if (Meteor.user()) {// if login is successfull we will store logintime in localstorage and current financial year.
                    localStorage.setItem("login_time", self.logintime);
                    localStorage.setItem("Selected_financial_year", new Date('04-04-'+self.addForm.controls['FYYear'].value).toString());
                    console.log('04-04-'+self.addForm.controls['FYYear'].value);
                    // After successfull login redirect to csvtimeline component.
                    self._router.navigate(['csvtemplate/csvtimeline',self.current_month,self.current_year]);
                } else {
                    self.ngZone.run(() => {// if there is error at login time show error message
                        self.loginprocess = false;
                        self.showmessage = true;
                        self.message = error.reason;
                    });
                  }
             });
            }
        }
    }

	//function called when click to forgot password
	forgotUserPassword(){
	var self=this;
	this.resetEmail = this.resetEmailForm.controls['email'].value;// taking out email value
		Accounts.forgotPassword({email: this.resetEmail}, function(res) {
		    if (res) {
		      if (res.message === 'User not found [403]') {
		        alert('This email does not exist.');
		      } else {
		        alert('We are sorry but something went wrong.');
				console.log(res)
		      }
		    } else {
				alert('Email Sent. Check your mailbox.');
				this.location.reload();
		    }
		  });
	}
}
