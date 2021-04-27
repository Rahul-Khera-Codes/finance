#bin/bash

nvm use 14
rm -rf node_modules
rm package-lock.json
git stash
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
pm2 restart finance
