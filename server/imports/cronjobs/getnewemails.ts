import {
	Meteor
} from 'meteor/meteor';
import {
	check
} from 'meteor/check';
import {
	Accounts
} from 'meteor/accounts-base';
import {
	SyncedCron
} from 'meteor/percolate:synced-cron';
import * as _ from 'lodash';
import {
	Csvdata,
	Users,
	Emaillist
} from '../../../both/collections/csvdata.collection';
declare var process: any;
export function getnewemails() {
	SyncedCron.add({
		name: 'Get New Emails',
		schedule: function (parser) {
			// parser is a later.parse object
			//('every 24 hours') or ('at 04:01 pm') or ('every 1 mins')
			return parser.text('at 12:15 pm');
			// return parser.text('at 11:12 am');
		},
		job: function () {
			HTTP.call('GET', process.env.STORE_MAIL, {}, function (error, response) {
				if (error) {
					console.log(error);
				} else {
					console.log(response.data.data.length);
					_.forEach(response.data.data, function (value) {
						// console.log(value);
						let exists: any;
						exists = Emaillist.find({
							$and: [{
								"email_timestamp": value["email_timestamp"]
							}, {
								"from": value["from"]
							}]
						}).fetch();
						if (exists && exists[0]) {
							// console.log(exists);
							console.log("********** Not Adding Email to collection ***********");
							console.log("Email id: " + value["email_id"] + " === " + "exist Email id" + exists[0]["email_id"]);
							console.log("Email from: " + value["from"] + " === " + "exist Email from" + exists[0]["from"]);
							console.log("Email Timestamp: " + value["email_timestamp"] + " === " + "Email Timestamp:" + exists[0]["email_timestamp"]);
							console.log("this email is already exists in db");
							console.log(value["email_date"]);
							// Emaillist.update({
							//   "_id": value["_id"]
							//   },{
							//     $set:{
							//       "email_date": new Date(value["email_date"])
							//        }
							//    });
						} else {
							console.log("********** Adding new Email to collection ***********");
							console.log("Email id: " + value["email_id"]);
							console.log("Email from: " + value["from"]);
							console.log("Email Timestamp: " + value["email_timestamp"]);
							value["email_date"] = new Date(value["email_date"]);
							console.log(value["email_date"]);
							Emaillist.insert(value);
						}
					});
					// console.log(response.data.data[1]);
				}
			});
		}
	});
	SyncedCron.start();
}
