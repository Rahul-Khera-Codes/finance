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
import * as moment from 'moment';

export const Csvdata = new MongoObservable.Collection('csvdata');
export const Productcategory = new MongoObservable.Collection('Productcategory');
export const Head = new MongoObservable.Collection('Head');
export const Subcategory = new MongoObservable.Collection('Subcategory');
// *** Graphdata will store month wise info of CR and DR ***
export const Graphdata = new MongoObservable.Collection('graphdata');
export const Graphlist = new MongoObservable.Collection('graphlist');
// *** Accounts no will hold list of Accounts to which we want to assign to any transaction ***
export const Accounts_no = new MongoObservable.Collection('Accounts_no');
export const Users = MongoObservable.fromExisting(Meteor.users);


Accounts_no.allow({
    insert: function() {
        return true;
    },

    update: function() {
        return true;
    },

    remove: function() {
        return true;
    }
});

Meteor.users.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Graphlist.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
             return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Head.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
             return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Productcategory.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Subcategory.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Csvdata.allow({
    insert: function() {
        return true;
    },

    update: function() {
        return true;
    },

    remove: function() {
        return true;
    }
});

Meteor.methods({
    'parseUpload' (data, Income, Expense, Account_no ,DateFormat) {
        check(Income, String);
        check(Expense, String);
        check(data, Array);
        for (let i = 0; i < data.length; i++) {
            var item = data[i];
            let assigned_head_id: any;
            if (!item["Transaction ID"]) {
                console.log("transaction note have invalid Transaction ID" + item["No."]);
                continue;
            }
            if (!item["Txn Posted Date"]) {
                 console.log("transaction note have invalid Txn Posted Date" + item["No."]);
                continue;
            }
            if (!item["Transaction Amount(INR)"]) {
                 console.log("transaction note have invalid Transaction Amount(INR)" + item["No."]);
                continue;
            }
            if(item["Cr/Dr"]=="CR"){
               assigned_head_id=Income;
            }
            if(item["Cr/Dr"]=="DR"){
                assigned_head_id=Expense;
            }
            var txn_posted_date = moment(item["Txn Posted Date"], DateFormat).format('MM-DD-YYYY h:mm:ss a');
            console.log(txn_posted_date);
            // console.log(item["Txn Posted Date"] +' converted to '+ moment(item["Txn Posted Date"], "MM-DD-YYYY h:mm:ss a").format('MM-DD-YYYY h:mm:ss a'));
            // console.log(item["Txn Posted Date"] +' converted to '+ new Date(moment(item["Txn Posted Date"], "MM-DD-YYYY h:mm:ss a").format('MM-DD-YYYY h:mm:ss a')));
            // console.log(item["Txn Posted Date"] +' converted to '+ new Date(item["Txn Posted Date"]));
            console.log("assigned head id is" + assigned_head_id);
            let existsCR: any;
            let existsDR: any;
            var search={};
            search["Transaction_ID"]= item["Transaction ID"];
            console.log(search);

            existsCR = Csvdata.findOne({
                  $and: [{
                            "Transaction_ID": item["Transaction ID"]
                        }, {
                            "Cr/Dr": "CR"
                        }]
            });
             existsDR = Csvdata.findOne({
                  $and: [{
                            "Transaction_ID": item["Transaction ID"]
                        }, {
                            "Cr/Dr": "DR"
                        }]
            });

            // **** In case we are updating our csvdata valules we will use this part **** 
            if (existsCR || existsDR) {
                if(existsCR && existsCR["Cr/Dr"]==item["Cr/Dr"])
                   {
                Csvdata.update({
                    "Transaction_ID": item["Transaction ID"]
                }, {
                    $set: {
                        "No": item["No."],
                        "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                        "Txn_Posted_Date": new Date(txn_posted_date),
                        "ChequeNo": item["ChequeNo."],
                        "Description": item["Description"],
                        "Cr/Dr": item["Cr/Dr"],
                        "Transaction_Amount(INR)": item["Transaction Amount(INR)"],
                        "Available_Balance(INR)": item["Available Balance(INR)"],
                        "AssignedAccountNo": Account_no
                            }
                       });
                   }
                else if(existsDR && existsDR["Cr/Dr"]==item["Cr/Dr"]){
                        Csvdata.update({
                    "Transaction_ID": item["Transaction ID"]
                }, {
                    $set: {
                        "No": item["No."],
                        "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                        "Txn_Posted_Date": new Date(txn_posted_date),
                        "ChequeNo": item["ChequeNo."],
                        "Description": item["Description"],
                        "Cr/Dr": item["Cr/Dr"],
                        "Transaction_Amount(INR)": item["Transaction Amount(INR)"],
                        "Available_Balance(INR)": item["Available Balance(INR)"],
                        "AssignedAccountNo": Account_no
                            }
                       });
                }
                else
                {
                     Csvdata.insert({
                    "No": item["No."],
                    "Transaction_ID": item["Transaction ID"],
                    "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                    "Txn_Posted_Date": new Date(txn_posted_date),
                    "ChequeNo": item["ChequeNo."],
                    "Description": item["Description"],
                    "Cr/Dr": item["Cr/Dr"],
                    "Transaction_Amount(INR)": item["Transaction Amount(INR)"],
                    "Available_Balance(INR)": item["Available Balance(INR)"],
                    "Assigned_head_id": assigned_head_id,
                    "Assigned_category_id": "not assigned",
                    "Assigned_parent_id": "not assigned",
                    "is_processed": 0,
                    "invoice_no": "not_assigned",
                    "invoice_description": "invoice_description",
                    "Assigned_user_id": "not_assigned",
                    "Assigned_username": "not_assigned",
                    "AssignedAccountNo": Account_no
                    });
                    // console.log("adding transaction note with already exist transaction no but different CR/DR ");
                    // console.log(item);
                    // console.log(exists);
                  }
               }
            // *** In case our csvdata is new *** 
            else {
                Csvdata.insert({
                    "No": item["No."],
                    "Transaction_ID": item["Transaction ID"],
                    "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                    "Txn_Posted_Date": new Date(txn_posted_date),
                    "ChequeNo": item["ChequeNo."],
                    "Description": item["Description"],
                    "Cr/Dr": item["Cr/Dr"],
                    "Transaction_Amount(INR)": item["Transaction Amount(INR)"],
                    "Available_Balance(INR)": item["Available Balance(INR)"],
                    "Assigned_head_id": assigned_head_id,
                    "Assigned_category_id": "not assigned",
                    "Assigned_parent_id": "not assigned",
                    "is_processed": 0,
                    "invoice_no": "not_assigned",
                    "invoice_description": "invoice_description",
                    "Assigned_user_id": "not_assigned",
                    "Assigned_username": "not_assigned",
                    "AssignedAccountNo": Account_no
                });
            }
        }
        return true;
    }, // Meteor method addcategory will assign category to our document which we choose in csvjson component
    'refresh_graph_data' (all_csvdata ,Income, Expense) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
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

            var graphdata = {};//array json we will use 

            Graphdata.remove({});
                // Title should be FY16-17 which is from april16 to march17
            for (let i = 0; i < all_csvdata.length; i++) {
                var item = all_csvdata[i];
                let n: any;
                let FY: any;
                // **** put clouse proceed here in if condition*** 
                let exists_graph: any;
                let d: any = new Date(item["Txn_Posted_Date"]);
                let year: number = d.getFullYear();
                let month_value: number = d.getMonth();
                let amount: number = accounting.unformat(item["Transaction_Amount(INR)"],".");    
                amount=Math.round(amount);
                if(month_value>2){
                     FY='FY'+year;
                }
                else{
                     year=year-1;
                     FY='FY'+year;
                }
                if(!graphdata[FY]){
                  graphdata[FY] = {};
                }
                let key;
                    if (item["Assigned_head_id"] == Income) {
                        key= month[month_value];
                         if(!graphdata[FY]['Income']){
                                   graphdata[FY]['Income'] = {};
                             }   
                         if(!graphdata[FY]['Income'][key]){
                                   graphdata[FY]['Income'][key] = 0;
                             }
                        graphdata[FY]['Income'][key] += amount;  
                    } 
                   else if(item["Assigned_head_id"] == Expense) {
                        key= month[month_value];  
                         if(!graphdata[FY]['Expense']){
                                   graphdata[FY]['Expense'] = {};
                              }
                         if(!graphdata[FY]['Expense'][key]){
                                   graphdata[FY]['Expense'][key] = 0;
                              }   
                        graphdata[FY]['Expense'][key] += amount;       
                    }
                    else{
                        continue;
                    }

                    console.log("------------------------");
                    console.log("month"+ ":" + month[month_value]);
                    console.log("transaction id " + item['Transaction_ID']);
                    console.log("description "+ item['Description']);
                    console.log("transaction amount "+ amount);
                    console.log("assigned head id " + item["Assigned_head_id"]);
                    console.log("------------------------");
            }
            Graphdata.insert(graphdata);
             console.log(graphdata);
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
        return true;
    },

    'addCategory' (Transaction_id, category_id) {
        check(Transaction_id, String);
        check(category_id, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Csvdata.update({
                "_id": Transaction_id
            }, {
                $set: {
                    "Assigned_category_id": category_id,
                    "is_processed": 1
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }

    },

    'changeCategory' (id, category_id) {
        check(id, String);
        check(category_id, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Csvdata.update({
                "_id": id
            }, {
                $set: {
                    "Assigned_category_id": category_id
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },
    'changeheadtag'(id,newhead_id){
        check(id, String);
        check(newhead_id, String);
         if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Csvdata.update({
                "_id": id
            }, {
                $set: {
                    "Assigned_head_id": newhead_id
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }

    },

    'addInvoice' (id, invoice_no,file_no, description, linkarray) {
        check(id, String);
        check(invoice_no, String);
        check(description, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'Accounts')) {
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
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'deleteInvoice' (id) {
        check(id, String);
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
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'addUser' (adduserinfo) {
        check(adduserinfo.username, String);
        check(adduserinfo.email, String);
        check(adduserinfo.password, String);
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                let userid = Accounts.createUser(adduserinfo);
                Roles.addUsersToRoles(userid, [adduserinfo.profile.role]);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }

    },

    'removeUser' (user) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            check(user._id, String);
            Meteor.users.remove(user._id);
        } else {
            throw new Meteor.Error(403, "Access denied");
        }

    },

    'changePasswordForce' (userId, newPassword) {
        if (Meteor.isServer) {
            if (userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Accounts.setPassword(userId, newPassword);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'assignTransDocToUser' (docid, userid, username) {
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'Accounts')) {
                Csvdata.update({
                    "_id": docid
                }, {
                    $set: {
                        "Assigned_user_id": userid,
                        "Assigned_username": username
                    }
                });
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'Subcategory_remove' (subcategory_id) {
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Subcategory.remove({
                    "parent_id": subcategory_id
                });
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'Category_remove' (id) {
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Productcategory.remove(id);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'head_remove'(id){
           if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Head.remove(id);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },
    'Account_remove'(id){
             if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Accounts_no.remove(id);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    }
});