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

#client (cPanel)
cd client/deploy && addncommit
echo "\033[1;32mClient (cPanel) repo done \033[0m"

#server (Heroku)
cd ../../server && addncommit
echo "\033[1;32mServer (Heroku) repo done \033[0m"