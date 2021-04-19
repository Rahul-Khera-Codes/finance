Tech Stack
Angular4, Meteor

Purpose
To manage bank statments and daily financial operations for a company

DEPLOY
meteor angular 2 project to server


You can deploy it using 2 methods either manually or using deploy.sh as mentioned below:

METHOD 1: Using deploy.sh


On your server clone the finance app and deploy it using below commands.

    git clone https://github.com/upexcel/finance.git 

    cd finance

    chomod 777 ./deploy.sh

    ./deploy.sh

    export MONGO_URL="mongodb+srv://<username>:<password>@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
 
    export ROOT_URL=http://176.9.137.77

    export PORT=3000

Note: 

1. If you are deploying for first time then run below command after completing above steps 
   
     pm2 start main.js --name finance

2. Else restart it

    pm2 restart finance




METHOD 2: Manually by following below steps 


Step 1: On your server clone the finance app and install below packages using below commands.

        git clone https://github.com/upexcel/finance.git 

        cd finance

        meteor npm install


Step 2: Run below command into your root folder of our app, this will generate a zip folder in output folder 
        (if there is already an output folder then delete it before hitting below command).

        meteor build ./../output


Step 3: Move to output folder which is outside of app folder and run below command to extract the zip file

        gzip -df finance.tar.gz 

        tar -xf your_file_name.tar

Step 4: After extracting file using tar we will get a folder bundle. go to bundle folder and move all file outside using these commands

        cd bundle

        mv * ..

        cd ..

Step 5: Now go to /programs/server and install dependencies

         a) cd /programs/server

         b) meteor npm install

         c) npm uninstall fibers   // to fix the fibers error

         d) npm install fibers    


Step 6: Now export detail of mongo atlas by typing command

          export MONGO_URL="mongodb+srv://<username>:<password>@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" 
        
          export ROOT_URL=http://176.9.137.77

          export PORT=3000 


Step 7: Move to bundle root folder and start it with pm2 if deploying for the first time or restart it if the process is 
        already there

    a) To start new process

           pm2 start main.js --name finance

    b) To check all process

           pm2 list

    c) To restart process
     
           pm2 restart finance

pm2 process env settings:

To check the current process environment variables:

    pm2 env <processId>

To update the process environment variables:

    ENV_VAR=somethingnew pm2 restart app --update-env

    example:
     
        MONGO_URL="mongodb+srv://<user>:<password>@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" pm2 restart finance --update-env



Mongo Atlas settings: 

Step 1: create your own Mongo Atlas account and set MONGO_URL export MONGO_URL="mongodb+srv://<username>:<password>@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


Step 2: for setting basic accounts system add these files into collection users 

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

Step 3: Add these document into roles collection 

        { "_id": "xC6ng3WYqxLdSbMgF", "name": "admin" }

        { "_id": "hhydvtSS9PeFxnT44", "name": "Accounts" }

        { "_id": "Y3uixAiEFYdbbpH29", "name": "guest" }
