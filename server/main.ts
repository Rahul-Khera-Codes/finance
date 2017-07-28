import {
	loadinitialheads
}
from './imports/fixtures/loadinitialheads';
import {
	reminderinvoice
}
from './imports/cronjobs/dailyanalysis';
import {
	getnewemails
}
from './imports/cronjobs/getnewemails';
import {
	Meteor
}
from 'meteor/meteor';
import {
	check
}
from 'meteor/check';
import {
	Accounts
}
from 'meteor/accounts-base';
import {
	accounting
}
from 'meteor/iain:accounting';
import { // importing all collection into server
	Csvdata,
	Productcategory,
	Users,
	Graphdata,
	Subcategory,
	Head,
	Accounts_no,
	Graphlist,
	CategoryGraphList,
	Comments,
	Emaillist,
	emailpatterncollection
}
from '../both/collections/csvdata.collection';

import './imports/publications/categorycollection';
import '../both/methods/fileuploadmethods';
import {
	WebApp
}
from "meteor/webapp";
// declare var WebApp:any;
declare var process: any;

Meteor.startup(() => {
	// code to solve corns issue in our request and file upload
	WebApp.rawConnectHandlers.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Methods", 'POST, PUT, GET, DELETE, OPTIONS');
		res.setHeader("Access-Control-Allow-Origin", "*");
		return next();
	});

	//code to set custom template and url as a email link

	process.env.MAIL_URL = 'smtp://postmaster%40sandbox2599d4676ee6496689a2aa20ba27ac82.mailgun.org:c894bd1a245a8f2bbdd7a1ca95721092@smtp.mailgun.org:587'
	Accounts.emailTemplates.from = 'no-reply@excellecetechnologies.in';
	Accounts.emailTemplates.resetPassword.subject = function (user) {
		return 'Excellence reset password link';
	};
	Accounts.urls.resetPassword = function (token) {
		return Meteor.absoluteUrl('reset-password/' + token);
	};


	// function use for loading initial values in our app when our app starts
	loadinitialheads();
	// getnewemails();
	//** add below method if you want reminder emails
	// reminderinvoice();

	// ** use this code only if you want to detect which user come online **
	//   Meteor.users.find({ "status.online": true }).observe({
	//    added: function(id: any) {
	//       // id just came online
	//       console.log("--------- New User Login ---------");
	//       console.log("user " + id.username + " (" + id._id + ") is online now");
	//     },
	//    removed: function(id: any) {
	//      // id just went offline
	//      console.log("----------- User idle --------------");
	//      console.log("user " + id.username + " (" + id._id + ") is gone offline");
	//    }
	// });
});
