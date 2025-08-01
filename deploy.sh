#!/bin/sh
SERVER_PORT=7001
DB_PASSWORD="Perfect%40%23%40%23%23%29%40%3F"
GITHUB_TOKEN=""

installModules () {
    echo "Installing frontend node modules ..."
    npm --prefix ./frontend install

    echo "Installing backend node modules ..."
    npm --prefix ./backend install
}


configure(){
    rm  ./backend/prisma/seeder/foreignWrapper.seed.ts
    cp ./deploy/foreignWrapper.seed.ts ./backend/prisma/seeder/

    rm ./frontend/next.config.js
    cp ./deploy/next.config.js ./frontend
}

resetDatabases() {
    rm -rf ./backend/prisma/migrations
    cd backend
    echo "creating/updating the env file ..."
    echo "PORT=$SERVER_PORT\nDATABASE_URL=\"postgresql://postgres:$DB_PASSWORD@localhost:5432/hrms?schema=public\"" > .env
    # npx prisma migrate dev
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

    pm2 delete "hrms-back"
    pm2 delete "hrms-front"

    cd ./backend

    pm2 start npm --name "hrms-back" -- start
    cd ../frontend
    pm2 start npm --name "hrms-front" -- start

 krish_dev   cd ..
    pm2 list
}

# git clone -b krish_dev https://Kkrish7654:@github.com/aadrika123/JuidcoHrms.git

# git clone -b krish_dev https://Kkrish7654:$GITHUB_TOKEN@github.com/aadrika123/JuidcoHrms.git

installModules
configure
resetDatabases
buildThem
startServices


echo "Done!"
