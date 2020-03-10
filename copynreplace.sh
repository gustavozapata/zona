#!/bin/bash

# cd destination
# find . ! -name '.git' ! -name '.gitignore' ! -name '.cpanel.yml' -type f -exec rm -f {} +
# cd ..
# cp -a ./source/. ./destination/

shopt -s extglob
cd client/deploy
# find . ! -name '.git' ! -name '.gitignore' ! -name '.cpanel.yml' -type f -exec rm -f {} + #delete all but these
# find . -mindepth 1 ! -regex '^.git\(/.*\)?'
# find ./myfolder -mindepth 1 ! -regex '^./myfolder/test2\(/.*\)?'
# find ./myfolder -mindepth 1 -type d ! -regex '^./myfolder/test2\(/.*\)?'
rm -rf !(.git)
# find ./myfolder -depth -mindepth 1 -maxdepth 1 -type d ! -regex '^./myfolder/test2\(/.*\)?'
# rm -r static #delete static folder
cd ..
# cp -a ./build/. ./deploy/