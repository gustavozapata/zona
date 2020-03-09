#!/bin/bash

# cd destination
# find . ! -name '.git' ! -name '.gitignore' ! -name '.cpanel.yml' -type f -exec rm -f {} +
# cd ..
# cp -a ./source/. ./destination/


cd client/deploy
find . ! -name '.git' ! -name '.gitignore' ! -name '.cpanel.yml' -type f -exec rm -f {} + #delete all but these
rm -r static #delete static folder
cd ..
cp -a ./build/. ./deploy/