#!/bin/sh
SERVER_PORT=5006
DB_PASSWORD="Perfect%40%23%40%23%23%29%40%3F"

installModules () {
    echo "Installing frontend node modules ..."
    npm --prefix ./frontend install

    echo "Installing backend node modules ..."
    npm --prefix ./backend install
}


configure(){
    rm  ./backend/prisma/seeder/foreignWrapper.seed.ts
    cp ./staging/foreignWrapper.seed.ts ./backend/prisma/seeder/

    rm ./frontend/next.config.js
    cp ./staging/next.config.js ./frontend
}

migrate() {
    cd backend
    echo "creating/updating the env file ..."
    echo "PORT=$SERVER_PORT\nDATABASE_URL=\"postgresql://postgres:$DB_PASSWORD@localhost:5432/lams?schema=public\"" > .env
    npx prisma migrate deploy
    cd ..
}


buildThem(){
    echo "building backend ..."
    npm --prefix ./backend run build

    echo "building frontend ..."
    npm --prefix ./frontend run build
}

startServices(){

    pm2 delete "lams-back"
    pm2 delete "lams-front"

    cd ./backend

    pm2 start npm --name "lams-back" -- start
    cd ../frontend
    pm2 start npm --name "lams-front" -- start

    cd ..
    pm2 list
}

git pull
installModules
configure
migrate
buildThem
startServices


echo "Done!"
