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
