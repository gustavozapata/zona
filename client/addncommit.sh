#!/bin/bash

addncommit(){
    git add .
    git commit -m "$msg"
}
#TODO: - add the appropiate push: $ git push:heroku, cpanel

echo "Enter commit message:"
read msg

#project
cd ../ && addncommit
echo "\033[1;32mProject (GitHub) repo done \033[0m"

#client
cd ../client && addncommit
echo "\033[1;32mClient (cPanel) repo done \033[0m"

#server
cd ../server && addncommit
echo "\033[1;32mServer (Heroku) repo done \033[0m"