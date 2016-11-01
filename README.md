# meteor_angular2_bank


Deploy meteor angular 2 project to server

step 1: On your computer run below command into your root folder of our app, this will generate a zip folder in output folder
       
        meteor build ./../output

step 2: On server upload the zip file to  below directory using filezilla from output folder which is outside of our app folder

        /public_html/bank


step 3: Use terminal to connect to server using SSH Connect

ssh etech@144.76.34.244 -p 4444 -i  {path to pricegenie-fashioniq-key.ppk }

        here pricegenie...ppk is key that is required to login to etech server.
      
step 4: Do ssh connect etech user from your terminal and reach to /public_html/bank  directory

       cd /public_html/bank

step 5: Then type 

gzip -df socially.tar.gz ( in place of socially.tar.gz enter your zip file name )

step 6: tar -xf  your_file_name.tar 

step 7: After extracting file using tar we will get a folder bundle. go to bundle folder and move all file outside using these commands

        cd bundle

        mv * ..

        cd ..

step 8: Now go to /programs/server 
           
        i) cd /programs/server

       then type command 

        ii) npm install

step 9: Now  export detail of mlab mongodb by typing command 

       export MONGO_URL=mongodb://username:password@ds019796.mlab.com:19796/csv_json_test 

       export ROOT_URL=http://144.76.34.244:3012/

       export PORT=3012 

step 10: To stop previous process of our app type this command.
         pm2 stop id
         
         Replace id with your app process id no. which you can see using pm2 list command.

         After setting all the config.Go to root of app folder and start application by running this command. 

         node main.js     

        This command is use for temporary checking if our app is running or not. if it is runing sucessfully then stop it and start our app with pm2. 

        pm2 start main.js --name project_name

        Replace project_name with your project name and run this command

step 11: In case we are updating our application then we have to Restart app with below command. 

          pm2 list  ( this will list all app running with pm2 )

          pm2 restart { id }
        
        here id is our app id in pm2 list. 


Mlab settings: 
    step 1: create your own mlab account. and set MONGO_URL 
        export MONGO_URL=mongodb://username:password@ds019796.mlab.com:19796/csv_json_test 
    step 2: for setting basic accounts system add these files into collection users
         {

    "_id": "BSricoEcZkdjLimsD",

    "createdAt": {

        "$date": "2016-09-30T05:48:51.059Z"

    },

    "services": {

        "password": {

            "bcrypt": "$2a$10$4EpqYDIdE0VG1.Hy2IzoJ.wbJUfJO8GZDTX7XeEwaPbxIp9FIgKYi"

        },

        "resume": {

            "loginTokens": [

                {

                    "when": {

                        "$date": "2016-09-30T05:50:21.673Z"

                    },

                    "hashedToken": "2VQ3gF1auPInHyi2IcMb6tpxwmxuoVqg/UUzdq7+hxA="

                }

            ]

        }

    },

    "username": "manish",

    "emails": [

        {

            "address": "manish@gmail.com",

            "verified": false

        }

    ],

    "profile": {

        "role": "admin",

        "name": "manish",

        "email": "manish@gmail.com"

    },

    "roles": [

        "admin"

    ]

}
 
 it will create a account with email id manish@gmail.com and password 1****6 . Login and create a new admin account and delete old one.

 step 3:add these document into roles collection 
       {
    "_id": "xC6ng3WYqxLdSbMgF",
    "name": "admin"
      }

      {
    "_id": "hhydvtSS9PeFxnT44",
    "name": "Accounts"
      }

    {
    "_id": "Y3uixAiEFYdbbpH29",
    "name": "guest"
    }
