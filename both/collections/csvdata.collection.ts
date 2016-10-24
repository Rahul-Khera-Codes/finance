import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
export const Csvdata = new Mongo.Collection('csvdata');
export const Productcategory = new Mongo.Collection('Productcategory');

Meteor.users.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
      });
Productcategory.allow({
      insert: function () { 
        if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
            return true;
        }
        else{
            return false;
        }
        },
      update: function () { 
      if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
            return true;
        }
        else{
            return false;
        }
         },
      remove: function () { 
      if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
            return true;
        }
        else{
            return false;
        }
         }
});
Csvdata.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
});
Meteor.methods({
 'parseUpload'( data:any, categoryarray:any ) {
    check( data, Array );
    for ( let i = 0; i < data.length; i++ ) {
      var item   = data[ i ];
      
      if(item["Transaction ID"]=='')
      {
          continue;
      }
      let exists:any;
      exists = Csvdata.findOne( { "Transaction_ID": item["Transaction ID"] } );

      if ( exists ) { 
         Csvdata.update({"Transaction_ID": item["Transaction ID"]},
         { $set:{"No":item["No."],
                 "Value_Date":item["Value Date"],
                 "Txn_Posted_Date":new Date(item["Txn Posted Date"]),
                 "ChequeNo":item["ChequeNo."],
                  "Description":item["Description"],
                 "Cr/Dr":item["Cr/Dr"],
                 "Transaction_Amount(INR)":item["Transaction Amount(INR)"],
                 "Available_Balance(INR)":item["Available Balance(INR)"]}});
        console.log( 'transaction id :'+item["Transaction ID"]+'with no:'+item["No."]+' is updating document !!!! ' );
      } 
      else {        
         Csvdata.insert({
                 "No":item["No."],
                 "Transaction_ID": item["Transaction ID"],
                 "Value_Date":item["Value Date"],
                 "Txn_Posted_Date": new Date(item["Txn Posted Date"]),
                 "ChequeNo":item["ChequeNo."],
                 "Description":item["Description"],
                 "Cr/Dr":item["Cr/Dr"],
                 "Transaction_Amount(INR)":item["Transaction Amount(INR)"],
                 "Available_Balance(INR)":item["Available Balance(INR)"],
                 "Assigned_category": "not assigned",
                 "is_processed": 0,
                 "invoice_no":"not_assigned",
                 "invoice_description":"invoice_description",
                 "Assigned_user_id":"not_assigned",
                 "Assigned_username":"not_assigned"
             }); 
      }
    }
    return true;
  },// Meteor method addcategory will assign category to our document which we choose in csvjson component
  'addCategory'(id:string,category:string){
       check( id, String );
       check( category, String );
       Csvdata.update({"_id": id},{ $set:{ "Assigned_category":category,"is_processed":1}});
  },
  'changeCategory'(id:string,category:string){
       check( id, String );
       check( category, String );
       Csvdata.update({"_id": id},{ $set:{ "Assigned_category":category}});
  },
  'addInvoice'(id:string,invoice_no:string,description:string,linkarray:any){
      check(id,String);
      check(invoice_no,String);
      check(description,String);
      Csvdata.update({"_id": id},{ $set:{"invoice_no":invoice_no,"invoice_description":description,"linktodrive":linkarray}});
  },
  'deleteInvoice'(id:string){
      check(id,String);
      Csvdata.update({"_id": id},{ $set:{"invoice_no":"not_assigned","invoice_description":"invoice_description","linktodrive":"notassigned"}});
  },
  'addUser'(adduserinfo:any){
     check(adduserinfo.username, String);
     check(adduserinfo.email, String);
     check(adduserinfo.password, String);
     console.log(adduserinfo);
     if (Meteor.isServer) {
        if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
     let userid=Accounts.createUser(adduserinfo);
     console.log(userid);
     Roles.addUsersToRoles( userid, [adduserinfo.profile.role] );
        }
        else{
             throw new Meteor.Error(403, "Access denied");
        }
     }
     
  },
  'removeUser'(user:any){
      if(Roles.userIsInRole( Meteor.userId(), 'admin' ))
      {
      check(user._id,String);
      Meteor.users.remove(user._id);
      }
      else {
           throw new Meteor.Error(403, "Access denied");
      }
      
  },
  'changePasswordForce'(userId:string,newPassword:string){
     if (Meteor.isServer) {
         if(userId===Meteor.userId() || Roles.userIsInRole( Meteor.userId(), 'admin' )){
      Accounts.setPassword(userId,newPassword);
         }else{
             throw new Meteor.Error(403, "Access denied");
         }
       }
  },
  'assignTransDocToUser'(docid:string,userid:string,username:string){
      if(Meteor.isServer){
           if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
           Csvdata.update({"_id": docid},{ $set:{"Assigned_user_id":userid,"Assigned_username":username}});
           }
           else{
               throw new Meteor.Error(403, "Access denied");
           }  
      }
  }
  
});