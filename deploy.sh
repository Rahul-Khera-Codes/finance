#bin/bash

meteor npm install
DIR=../output
if [ -d "$DIR" ]; then
    printf '%s\n' "Removing old bundle ($DIR)"
    rm -rf "$DIR"
fi

meteor build ./../output

cd ..
cd output
gzip -df finance.tar.gz
tar -xf finance.tar
cd bundle
mv * ..
cd ..
cd programs/server
meteor npm install
npm uninstall fibers
npm install fibers
cd ../../

export MONGO_URL="mongodb+srv://sachin:qLwN5GtUF1NEar3G@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
export ROOT_URL=http://176.9.137.77
export PORT=3000

pm2 restart finance
