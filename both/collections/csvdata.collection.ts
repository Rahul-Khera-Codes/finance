// list of imports for mongo collections
import {
	Mongo
} from 'meteor/mongo';
import {
	Meteor
} from 'meteor/meteor';
import {
	Observable
} from 'rxjs/Observable';
import {
	Subscription
} from 'rxjs/Subscription';
import {
	MongoObservable
} from 'meteor-rxjs';
import {
	check
} from 'meteor/check';
import {
	Accounts
} from 'meteor/accounts-base';
import {
	accounting
} from 'meteor/iain:accounting';
import {
	Roles
} from 'meteor/alanning:roles';
import {
	Email
} from 'meteor/email';
import * as moment from 'moment';
import * as _ from 'lodash';

// ***** we use UploadFS to create a store *****
import {
	UploadFS
} from 'meteor/jalik:ufs';
// import {LocalStore} from 'meteor/jalik:ufs-local';// use in case of local storage
// **** end *****
// this is list of our all mongodb collection in our system.
export const Csvdata = new MongoObservable.Collection('csvdata');
export const Productcategory = new MongoObservable.Collection('Productcategory');
export const Head = new MongoObservable.Collection('Head');
export const Subcategory = new MongoObservable.Collection('Subcategory');
// *** Graphdata will store month wise info of CR and DR ***
export const Graphdata = new MongoObservable.Collection('graphdata');
export const Graphlist = new MongoObservable.Collection('graphlist');
export const CategoryGraphList = new MongoObservable.Collection('categorygraphlist');
// *** Accounts no will hold list of Accounts to which we want to assign to any transaction ***
export const Comments = new MongoObservable.Collection('Comments');
export const Accounts_no = new MongoObservable.Collection('Accounts_no');
export const Users = MongoObservable.fromExisting(Meteor.users);
export const Emaillist = new MongoObservable.Collection('Emaillist');

// ****** collection to store salary details file **********
export const Salaryfiles = new MongoObservable.Collection('Salaryfiles');

// ******* collection to store all our regex pattern for finding mail matching ******
export const emailpatterncollection = new MongoObservable.Collection('emailpatternlist');

declare var process: any;

function loggedIn(userId) {
	return !!userId;
}

// Declare store
// **** uploadFS settings ****
export const SalaryfileStore = new UploadFS.store.GridFS({
	collection: Salaryfiles.collection,
	name: 'salary',
	// filter: new UploadFS.Filter({
	//   contentTypes: ['']
	// }),
	permissions: new UploadFS.StorePermissions({
		insert: loggedIn,
		update: loggedIn,
		remove: loggedIn
	})
});


//***** process to store files on localserver *****
// export const SalaryfileStore = new UploadFS.store.Local({
//   collection: Salaryfiles.collection,
//   name: 'salary',
//   path: '/var/www/html/amit/csvmeteor2',
//   // filter: new UploadFS.Filter({
//   //   contentTypes: ['']
//   // }),
//   permissions: new UploadFS.StorePermissions({
//     insert: loggedIn,
//     update: loggedIn,
//     remove: loggedIn
//   })
// });

// email pattern collection permission settings
emailpatterncollection.allow({
	insert: function () {
		// if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
		return true;
		// } else {
		//     return false;
		// }
	},

	update: function () {
		// if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
		return true;
		// } else {
		//     return false;
		// }
	},

	remove: function () {
		// if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
		return true;
		// } else {
		//     return false;
		// }
	}
});

// Account collection permission settings
Accounts_no.allow({
	insert: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	}
});

// email list collection permission settings
Emaillist.allow({
	insert: function () {
		// if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
		return true;
		// } else {
		//     return false;
		// }
	},

	update: function () {
		// if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
		return true;
		// } else {
		//     return false;
		// }
	},

	remove: function () {
		// if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
		return true;
		// } else {
		//     return false;
		// }
	}
});
// comments collection permission settings.
Comments.allow({
	insert: function () {
		if (Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	}
});
// Meteor users collection permissions settings
Meteor.users.allow({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});
// Graph list collection permissions settings
Graphlist.allow({
	insert: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	}
});
// Category graphlist collection permissions settings
CategoryGraphList.allow({
	insert: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	}
});
// Head list collection permissions settings
Head.allow({
	insert: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	}
});
// Parent collection permissions settings
Productcategory.allow({
	insert: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	}
});
// Subcategory collection permissions settings
Subcategory.allow({
	insert: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	update: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	},

	remove: function () {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			return true;
		} else {
			return false;
		}
	}
});
// Transaction notes collection permissions settings
Csvdata.allow({
	insert: function () {
		return true;
	},

	update: function () {
		return true;
	},

	remove: function () {
		return true;
	}
});
// this is list of meteor methods used in our system.
Meteor.methods({
	// parse upload method is used to upload csv file in our system.
	// in this method we need csv data , income id, expense id, account no on which we are uploading csv data
	// and date format we used to upload csv data
	'parseUpload' (data, Income, Expense, Account_no, DateFormat,filename) {
		check(Income, String);
		check(Expense, String);
		check(data, Array);
		let report: any = {}; // report store our response we send
		var month = new Array(); // list of month used for sending month wise details
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		report["invalidtransactionlist"] = [];
		report["updated"] = {};
		report["added"] = {};
		// console.log(Account_no);
		for (let i = 0; i < data.length; i++) { // running for loop on csvdata we get from front end
			var item = data[i];
			let assigned_head_id: any;
			// list of error we send as response if we get any error.
			if (!item["Transaction ID"]) {
				console.log("transaction note have invalid Transaction ID" + item["No."]);
				report["invalidtransactionlist"].push(item["No."]);
				continue;
			}
			if (!item["Txn Posted Date"]) {
				console.log("transaction note have invalid Txn Posted Date" + item["No."]);
				report["invalidtransactionlist"].push(item["No."]);
				continue;
			}
			if (!item["Transaction Amount(INR)"]) {
				console.log("transaction note have invalid Transaction Amount(INR)" + item["No."]);
				report["invalidtransactionlist"].push(item["No."]);
				continue;
			}
			// checking if current transaction note is CR or DR
			if (item["Cr/Dr"] == "CR") {
				assigned_head_id = Income;
			}
			if (item["Cr/Dr"] == "DR") {
				assigned_head_id = Expense;
			}
			// code to store txn post date in required format
			var txn_posted_date = moment(item["Txn Posted Date"], DateFormat).format('MM-DD-YYYY h:mm:ss a');
			// console.log(txn_posted_date);
			// console.log("assigned head id is" + assigned_head_id);
			let existsCR: any;
			let existsDR: any;
			// var search={};
			// search["Transaction_ID"]= item["Transaction ID"];
			item["ChequeNo."] = isNaN(parseInt(item["ChequeNo."])) ? '-' : item["ChequeNo."];
			// code to check if this transaction exists in CR transaction list
			existsCR = Csvdata.find({
				$and: [{
					"Transaction_ID": item["Transaction ID"]
				}, {
					"Cr/Dr": "CR"
				}, {
					"ChequeNo": item["ChequeNo."]
				}]
			}).fetch();
			// code to check if this transaction exists in DR transaction list
			existsDR = Csvdata.find({
				$and: [{
					"Transaction_ID": item["Transaction ID"]
				}, {
					"Cr/Dr": "DR"
				}, {
					"ChequeNo": item["ChequeNo."]
				}]
			}).fetch();

			// **** In case we are updating our csvdata valules we will use this part ****
			if (existsCR && existsCR[0] && existsCR[0]["Cr/Dr"] == item["Cr/Dr"] && existsCR[0]["ChequeNo"] == item["ChequeNo."]) {
				// code to add updated field with month if this transaction exist before to show report on response
				if (!report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]]) {
					// if no previous data of this month updated then add it and assign it 1
					report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]] = 1;
				} else {
					// if previous data of this month updated then we increment that value
					++report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]];
				}
				// updating the document in collection for given transaction note
				Csvdata.update({
					$and: [{
						"Transaction_ID": item["Transaction ID"]
					}, {
						"Cr/Dr": "CR"
					}, {
						"ChequeNo": item["ChequeNo."]
					}]
				}, {
					$set: 
					{
						"No": parseInt(item["No."]),
						"Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
						"Txn_Posted_Date": new Date(txn_posted_date),
						"ChequeNo": item["ChequeNo."],
						"Description": item["Description"],
						"Cr/Dr": item["Cr/Dr"],
						"Transaction_Amount(INR)": accounting.unformat(item["Transaction Amount(INR)"]),
						"Available_Balance(INR)": accounting.unformat(item["Available Balance(INR)"]),
						"AssignedAccountNo": Account_no,
						"lastUpdated":new Date(),
						"filename":filename
					}

				});
				return report;
			} 

			else if (existsDR && existsDR[0] && existsDR[0]["Cr/Dr"] == item["Cr/Dr"] && existsDR[0]["ChequeNo"] == item["ChequeNo."]) {
				// code to add updated field with month if this transaction exist before to show report on response
				if (!report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]]) {
					// if no previous data of this month updated then add it and assign it 1
					report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]] = 1;
				} else {
					// if previous data of this month updated then we increment that value
					++report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]];
				}
				// code to update transaction note which have DR in Cr/Dr
				Csvdata.update({
					$and: [{
						"Transaction_ID": item["Transaction ID"]
					}, {
						"Cr/Dr": "DR"
					}, {
						"ChequeNo": item["ChequeNo."]
					}]
				}, {
					$set: {
						"No": parseInt(item["No."]),
						"Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
						"Txn_Posted_Date": new Date(txn_posted_date),
						"ChequeNo": item["ChequeNo."],
						"Description": item["Description"],
						"Cr/Dr": item["Cr/Dr"],
						"Transaction_Amount(INR)": accounting.unformat(item["Transaction Amount(INR)"]),
						"Available_Balance(INR)": accounting.unformat(item["Available Balance(INR)"]),
						"AssignedAccountNo": Account_no,
						"lastUpdated":new Date(),
						"filename":filename
					}
				});
				return report;
			} else {
				if (!report["added"][month[moment(item["Txn Posted Date"], DateFormat).month()]]) {
					report["added"][month[moment(item["Txn Posted Date"], DateFormat).month()]] = 1;
				} else {
					++report["added"][month[moment(item["Txn Posted Date"], DateFormat).month()]];
				}
				// code to insert transaction note if no previous transaction with this name
				Csvdata.insert({
					"No": parseInt(item["No."]),
					"Transaction_ID": item["Transaction ID"],
					"Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
					"Txn_Posted_Date": new Date(txn_posted_date),
					"ChequeNo": item["ChequeNo."],
					"Description": item["Description"],
					"Cr/Dr": item["Cr/Dr"],
					"Transaction_Amount(INR)": accounting.unformat(item["Transaction Amount(INR)"]),
					"Available_Balance(INR)": accounting.unformat(item["Available Balance(INR)"]),
					"Assigned_head_id": assigned_head_id,
					"Assigned_category_id": "not assigned",
					"Assigned_parent_id": "not assigned",
					"is_processed": 0,
					"invoice_no": "not_assigned",
					"invoice_description": "invoice_description",
					"Assigned_user_id": "not_assigned",
					"Assigned_username": "not_assigned",
					"AssignedAccountNo": Account_no,
					"lastUpdated":new Date(),
					"filename":filename
				});
				return report;
			}
		}
		 // return error;
	},
	// this is the code to refresh category graph list with latest data
	'refresh_category_graph_list' (all_csvdata, all_categoryGraph, subcategoryarray) { // complexity will be O(n2)
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			// ** fixing database for parent id ** this code is to check if all assigned category have parent_id or not
			// for(let p=0; p < all_csvdata.length; p++){
			//      var product=all_csvdata[p];
			//      console.log("old ChequeNo value: "+product["ChequeNo"]);
			//      product["ChequeNo"]=isNaN(parseInt(product["ChequeNo"]))? '-':product["ChequeNo"];
			//      console.log("new ChequeNo value: "+product["ChequeNo"])
			//      Csvdata.update(
			//           {
			//             "_id":product["_id"]
			//           },
			//           {
			//             $set: {
			//              "ChequeNo": product["ChequeNo"]
			//           } }
			//        );
			// }
			//** fixing database for format is done.

			for (let i = 0; i < all_categoryGraph.length; i++) {
				var month = new Array(); // list of months
				month[0] = "January";
				month[1] = "February";
				month[2] = "March";
				month[3] = "April";
				month[4] = "May";
				month[5] = "June";
				month[6] = "July";
				month[7] = "August";
				month[8] = "September";
				month[9] = "October";
				month[10] = "November";
				month[11] = "December";
				// this will store statistic which we find out for each graph
				let graph_statistic = {}; // variable which will store graph statistic
				for (let j = 0; j < all_csvdata.length; j++) {
					if (all_csvdata[j]["Assigned_parent_id"] == "not assigned" || all_csvdata[j]["Assigned_parent_id"] == null) {
						continue;
					}
					var item = all_csvdata[j];
					let n: any;
					let FY: any;
					let exists_graph: any;
					let d: any = new Date(item["Txn_Posted_Date"]);
					let year: number = d.getFullYear();
					let month_value: number = d.getMonth();
					// storing amount after unformatiing it using accounting.js help
					let amount: number = accounting.unformat(item["Transaction_Amount(INR)"], ".");
					amount = Math.round(amount);
					if (month_value > 2) { // checking financial year
						FY = 'FY' + year;
					} else {
						year = year - 1;
						FY = 'FY' + year;
					}
					if (!graph_statistic[FY]) {
						graph_statistic[FY] = {};
					}
					let key;
					// code to check if category graph i have any assigned parent id
					if (all_categoryGraph[i].graph_head_list.indexOf(item["Assigned_parent_id"]) != -1) {
						key = month[month_value]; // making key for stroing in graph statistic
						if (!graph_statistic[FY][item["Assigned_parent_id"]]) {
							graph_statistic[FY][item["Assigned_parent_id"]] = {}; // initialzing graph field for fy month
						}
						if (!graph_statistic[FY][item["Assigned_parent_id"]][key]) {
							graph_statistic[FY][item["Assigned_parent_id"]][key] = 0;
						}
						// code to increase graph statistic amount value for given assinged parent id
						graph_statistic[FY][item["Assigned_parent_id"]][key] += amount;
					} else {
						continue;
					}
				}
				// mongodb query to make update in mongodb
				CategoryGraphList.update({
					"_id": all_categoryGraph[i]._id
				}, {
					$set: {
						"graph_statistic": graph_statistic
					}
				});
			}

		}
	},
	// code to refresh graph list for head graphs
	'refresh_graph_list' (all_csvdata, all_graphs) { // complexity will be O(n2)
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			for (let i = 0; i < all_graphs.length; i++) {
				var month = new Array();
				month[0] = "January";
				month[1] = "February";
				month[2] = "March";
				month[3] = "April";
				month[4] = "May";
				month[5] = "June";
				month[6] = "July";
				month[7] = "August";
				month[8] = "September";
				month[9] = "October";
				month[10] = "November";
				month[11] = "December";
				// this will store statistic which we find out for each graph
				let graph_statistic = {};
				for (let j = 0; j < all_csvdata.length; j++) {
					var item = all_csvdata[j];
					let n: any;
					let FY: any;
					let exists_graph: any;
					let d: any = new Date(item["Txn_Posted_Date"]);
					let year: number = d.getFullYear();
					let month_value: number = d.getMonth();
					let amount: number = accounting.unformat(item["Transaction_Amount(INR)"], ".");
					amount = Math.round(amount);
					if (month_value > 2) { // checking financial year
						FY = 'FY' + year;
					} else {
						year = year - 1;
						FY = 'FY' + year;
					}
					if (!graph_statistic[FY]) {
						graph_statistic[FY] = {}; // initializing graph statistics
					}
					let key;
					// checking assinged head id of a given item.
					if (all_graphs[i].graph_head_list.indexOf(item["Assigned_head_id"]) != -1) {
						key = month[month_value]; // making key for given month
						if (!graph_statistic[FY][item["Assigned_head_id"]]) {
							// if no graph into for given FY then initialize that for given month
							graph_statistic[FY][item["Assigned_head_id"]] = {};
						}
						if (!graph_statistic[FY][item["Assigned_head_id"]][key]) {
							// setting amount value to 0 if there is no previous head with this assigned head id
							graph_statistic[FY][item["Assigned_head_id"]][key] = 0;
						}
						// code to increment amount for a given month value for a given head id
						graph_statistic[FY][item["Assigned_head_id"]][key] += amount;
					} else {
						continue;
					}
				}
				// making final finished graph statistic list update in graphlist collection
				Graphlist.update({
					"_id": all_graphs[i]._id
				}, {
					$set: {
						"graph_statistic": graph_statistic
					}
				});
			}

		}
	},
	// email list store method will store new email in our collection
	'emailliststore' () {
		// code to call for previous email form stored imap api
		HTTP.call('GET', process.env.STORE_MAIL, {}, function (error, response) {
			if (error) {
				console.log(error);
			} else {
				console.log(response.data.data.length);
				_.forEach(response.data.data, function (value) {
					// console.log(value);
					let exists: any;
					// checking if any email already stored with same timestamp with same from id
					exists = Emaillist.find({
						$and: [{
							"email_timestamp": value["email_timestamp"]
						}, {
							"from": value["from"]
						}]
					}).fetch();
					if (exists && exists[0]) { // if email already exist in our system.
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
	},
	// meteor method to add a category to transaction note.
	'addCategory' (Transaction_id, category_id) {
		check(Transaction_id, String);
		check(category_id, String);
		// only admin can add this new category id to transaction note
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			Csvdata.update({
				"_id": Transaction_id
			}, {
				$set: {
					"Assigned_category_id": category_id,
					"is_processed": 1
				}
			});
		} else { // other wise show error access denied
			throw new Meteor.Error(403, "Access denied");
		}

	},
	// meteor method to add any transactio note to suspense list
	'addtosuspenselist' (id: string) {
		check(id, String);
		// if user is admin or CA then allow him to add this transction to suspense list
		if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'CA')) {
			// monodb query to add transaction to suspense list
			Csvdata.update({
				"_id": id
			}, {
				$set: {
					"suspensetransaction": true
				}
			});
			return true;
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to remove any transactio note to suspense list
	'removefromsuspenselist' (id: string) {
		check(id, String);
		// if user is admin or CA then allow him to remove this transction to suspense list
		if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'CA')) {
			Csvdata.update({
				"_id": id
			}, {
				$set: {
					"suspensetransaction": false
				}
			});
			return true;
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// Meteor method to change category and subcategory of a given transction note
	'changeCategory' (id, parent_id, category_id) {
		check(id, String);
		check(category_id, String);
		// all to change category only if given user is admin
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			// mongdb query to change category
			Csvdata.update({
				"_id": id
			}, {
				$set: {
					"Assigned_parent_id": parent_id,
					"Assigned_category_id": category_id
				}
			});
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to change head assigned to a given transaction note
	'changeheadtag' (id, newhead_id) {
		check(id, String);
		check(newhead_id, String);
		// allow only if user is admin
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			// mongodb query to change the head id that is given to a transction
			Csvdata.update({
				"_id": id
			}, {
				$set: {
					"Assigned_head_id": newhead_id
				}
			});
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}

	},
	// meteor method to add invoice to any transaction note
	'addInvoice' (id, invoice_no, file_no, description, linkarray) {
		check(id, String);
		check(invoice_no, String);
		check(description, String);
		// allow to add invoice if user is admin or accounts
		if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'Accounts')) {
			// mongo query to add invoice
			Csvdata.update({
				"_id": id
			}, {
				$set: {
					"invoice_no": invoice_no,
					"file_no": file_no,
					"invoice_description": description,
					"linktodrive": linkarray
				}
			});
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to delete invoice of any transaction note
	'deleteInvoice' (id) {
		check(id, String);
		// allow to delete invoice if user is admin or accounts
		if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'Accounts')) {
			Csvdata.update({
				"_id": id
			}, {
				$set: {
					"invoice_no": "not_assigned",
					"invoice_description": "invoice_description",
					"linktodrive": "notassigned"
				}
			});
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to add new user to our styem
	'addUser' (adduserinfo) {
		check(adduserinfo.username, String);
		check(adduserinfo.email, String);
		check(adduserinfo.password, String);
		if (Meteor.isServer) {
			// allow only admin to add new user
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				let userid = Accounts.createUser(adduserinfo);
				Roles.addUsersToRoles(userid, [adduserinfo.profile.role]);
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// ******** we will use pending invoice loading function as mongoobservalbe.call to load all pendinginvoice *****
	'pendinginvoiceloading' (currentyear, nextyear) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			var sort_order = {};
			sort_order["Txn_Posted_Date"] = 1;
			var accountusers = Users.find({
				"roles": "Accounts"
			}, {
				"fields": {
					_id: 1
				}
			}).fetch();
			var locs = accountusers.map(function (x) {
				return x._id
			});
			return Csvdata.collection.find({
				$and: [{
					"invoice_no": {
						$eq: "not_assigned"
					}
				}, {
					"Txn_Posted_Date": {
						$gte: new Date(currentyear),
						$lt: new Date(nextyear)
					}
				}, {
					"Cr/Dr": "DR"
				}, {
					"Assigned_user_id": {
						"$in": locs
					}
				}]
			}, {
				sort: sort_order
			}).fetch();
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to show complete invoice added in a given year.
	'completeinvoiceloading' (currentyear, nextyear) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			var sort_order = {};
			sort_order["Txn_Posted_Date"] = 1;
			var accountusers = Users.find({
				"roles": "Accounts"
			}, {
				"fields": {
					_id: 1
				}
			}).fetch();
			var locs = accountusers.map(function (x) {
				return x._id
			});
			return Csvdata.collection.find({
				$and: [{
					"invoice_no": {
						$ne: "not_assigned"
					}
				}, {
					"Txn_Posted_Date": {
						$gte: new Date(currentyear),
						$lt: new Date(nextyear)
					}
				}, {
					"Cr/Dr": "DR"
				}, {
					"Assigned_user_id": {
						"$in": locs
					}
				}]
			}, {
				sort: sort_order
			}).fetch();
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to update user profile
	'userupdate' (id, address, username, role) {
		console.log(id);
		console.log(address);
		console.log(username);
		if (Meteor.isServer) {
			// allow only if user is admin or himself
			if (Roles.userIsInRole(Meteor.userId(), 'admin') || Meteor.userId() == id) {
				Meteor.users.update({
					_id: id
				}, {
					$set: {
						'emails.0.address': address,
						"username": username,
						"roles.0": role,
						"profile.email": address,
						"profile.name": username,
						"profile.role": role
					}
				});
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// meteor method to remove user from our sytem
	'removeUser' (user) {
		// allow this permission to admin only
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			check(user._id, String);
			Meteor.users.remove(user._id);
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to remove a transaction note from system
	'removeTransaction' (id) {
		// allow only admin to remove any transaction note
		if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
			check(id, String);
			Csvdata.remove(id);
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	},
	// meteor method to change password any user whose id we pass in userId field
	'changePasswordForce' (userId, newPassword) {
		if (Meteor.isServer) {
			if (userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Accounts.setPassword(userId, newPassword);
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// metoer method to assign transaction note to any user in our system
	'assignTransDocToUser' (docid, userid, username) {
		if (Meteor.isServer) {
			// allow only admin to assign any transaction note to any user.
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Csvdata.update({
					"_id": docid
				}, {
					$set: {
						"Assigned_user_id": userid,
						"Assigned_username": username
					}
				});
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// metoer method to remove any subcategory from subcategory collection
	'Subcategory_remove' (subcategory_id) {
		if (Meteor.isServer) {
			// allow only admin to do that
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Subcategory.remove({
					"parent_id": subcategory_id
				});
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// metoer method to remove any subcategory from category collection
	'Category_remove' (id) {
		if (Meteor.isServer) {
			// allow only admin to do that
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Productcategory.remove(id);
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// meteor method to remove any head from head collection
	'head_remove' (id) {
		if (Meteor.isServer) {
			// allow only admin to do that
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Head.remove(id);
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// 'searchpattern'(regexvalue, lowerdate, upperdate){
	//   console.log(regexvalue);
	//   console.log(lowerdate);
	//   console.log(upperdate);
	//      if(Meteor.isServer){
	//        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
	//            // var existemails=Emaillist.find({
	//            //          $and: [{
	//            //              'subject': { '$regex' : new RegExp(regexvalue, "i")}
	//            //          }, {
	//            //              "email_date": {
	//            //                 $gte: new Date(lowerdate),
	//            //                 $lt: new Date(upperdate)
	//            //              }
	//            //        }]
	//            //     });
	//            // var existemails=Emaillist.find({
	//            //    "subject":
	//            //               {
	//            //                 "$regex": new RegExp("airtel","i")
	//            //               }
	//            // });
	//            var existemails=Emaillist.find({},{ limit:1 });
	//            console.log(existemails);
	//            return existemails;
	//         } else {
	//             throw new Meteor.Error(403, "Access denied");
	//         }
	//      }
	// },
	// meteor method to remove any accounts from account collection
	'Account_remove' (id) {
		if (Meteor.isServer) {
			// allow only admin to do that
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Accounts_no.remove(id);
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// meteor method to remove any salary file from collection
	'removesalaryfile' (id) {
		console.log(id);
		if (Meteor.isServer) {
			if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
				Salaryfiles.remove(id);
			} else { // else throw error access denied
				throw new Meteor.Error(403, "Access denied");
			}
		}
	},
	// meteor method to send any email to any user
	'sendEmail' (to, from, subject, text) {
		if (Meteor.isServer) {
			check([to, from, subject, text], [String]);
			// Let other method calls from the same client start running,
			// without waiting for the email sending to complete.
			// this.unblock();
			Email.send({
				"headers": {
					'Content-Type': 'text/html; charset=UTF-8'
				},
				to: to,
				from: from,
				subject: subject,
				text: text
			});
		}
	},
	// meteor method to upload any date using meteor upload fs
	'upload' (data: any, uploaddate: any) {
		// pick from an object only: name, type and size
		var file = {
			name: data.name,
			type: data.type,
			size: data.size,
			monthdate: new Date(uploaddate),
		};
		console.log(file);

		var upload = new UploadFS.Uploader({
			data,
			file,
			store: SalaryfileStore,
			// onProgress: function(file, progress) {
			//     console.log(file.name + ' ' + (progress * 100) + '% uploaded');
			//   },
			onError: function () {
				console.log("failed");
			},
			onComplete: function () {
				console.log("sucessfully done");
			}
		});

		upload.start();
		// });
	},
	// meteor method to get list of csv transaction notes whose invoice is not added of given user id
	'remindercsvdata' (user_id) {
		if (Meteor.isServer) {
			return Csvdata.find({
				$and: [{
					"Assigned_user_id": user_id
				}, {
					"invoice_description": "invoice_description"
				}]
			});
		} else { // else throw error access denied
			throw new Meteor.Error(403, "Access denied");
		}
	}
});
