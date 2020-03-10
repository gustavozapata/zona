#!/bin/bash

echo "Pushing and deploying app..."

#project (GitHub)
git push
echo "\033[1;32mProject (GitHub) repo done \033[0m"

#client (cPanel)
cd client && npm run build
cd deploy
shopt -s extglob
# find . ! -name '.git' ! -name '.gitignore' ! -name '.cpanel.yml' -type f -exec rm -f {} + #delete all but these files
rm -rf !(.git) #delete all folders but .git
# rm -r static #delete static folder
cd .. #go to client
cp -a ./build/. ./deploy/ #copy all files from build to deploy
cd deploy && git push cpanel
echo "\033[1;32mClient (cPanel) repo done \033[0m"
# "homepage": "https://zona.gustavozapata.me",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build",

#server (Heroku)
cd ../../server
# heroku login
git push heroku master
echo "\033[1;32mServer (Heroku) repo done \033[0m"