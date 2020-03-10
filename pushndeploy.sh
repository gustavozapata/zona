#!/bin/bash

addncommit(){
    git add .
    git commit -m "$msg"
}

#project (GitHub)
echo "Enter commit message:"
read msg
addncommit
echo "\033[1;32mProject (GitHub) repo done \033[0m"

#server (Heroku)
cd ../../server && addncommit
echo "\033[1;32mServer (Heroku) repo done \033[0m"

echo "\033[1;32Pushing and deploying app...\033[0m"

#project (GitHub)
git push
echo "\033[1;32mProject (GitHub) repo done \033[0m"

#client (cPanel)
cd client && npm run build
cd deploy
shopt -s extglob
rm -rf !(.git) #delete all folders but .git
cd .. #go to client
cp -a ./build/. ./deploy/ #copy all files from build to deploy
cd deploy && addncommit
git push
echo "\033[1;32mClient (cPanel) repo done \033[0m"

#server (Heroku)
cd ../../server
# heroku login
git push heroku master
echo "\033[1;32mServer (Heroku) repo done \033[0m"