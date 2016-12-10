import {
    Csvdata,
    Productcategory,
    Users,
    Graphdata,
    Subcategory,
    Head,
    Accounts_no,
    Graphlist
} from '../../../both/collections/csvdata.collection';
import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';
import {
    Accounts
} from 'meteor/accounts-base';

interface Options {
    [key: string]: any;
}

if (Meteor.isServer) {
       
    Meteor.publish('csvdata', function() {
        if (Roles.userIsInRole(this.userId, 'Accounts')) {
            const selector = {
                'Assigned_user_id': this.userId
            };
            return Csvdata.find(selector);
        } else {
            return Csvdata.find();
        }
    });
    Meteor.publish('csvdata_unprocessed', function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            const selector = {
                "is_processed": 0
            };
            return Csvdata.find(selector);
        }

    });
    // *** use this publish if want monthly data for graph ***
    Meteor.publish('csvdata_month', function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Graphdata.find({});
        } else {
            this.ready()
        }

    });
      Meteor.publish('graphlist', function(){
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Graphlist.find({});
        } else {
            this.ready()
        }
    });

    Meteor.publish('Productcategory', function() {
        var product_order = {};
        product_order["category"] = 1;
        return Productcategory.find({}, {
            sort: product_order
        });
    });

    Meteor.publish('Subcategory', function() {
          if (Roles.userIsInRole(this.userId, 'admin')) {
               return Subcategory.find({});
        } else {
            this.ready()
        }
    });

    // *** head part for income expenses ***

    Meteor.publish('headlist', function() {
          // if (Roles.userIsInRole(this.userId, 'admin')) {
               return Head.find({});
        // } else {
        //     this.ready()
        // }
    });

    Meteor.publish('Accounts_no', function() {
          // if (Roles.userIsInRole(this.userId, 'admin')) {
               return Accounts_no.find({});
        // } else {
        //     this.ready()
        // }
    });

    Meteor.publish("userData", function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Meteor.users.find();
        } else {
            const selector = {
                '_id': this.userId
            };
            return Meteor.users.find(selector);
        }
    });
}