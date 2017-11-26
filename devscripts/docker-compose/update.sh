#!/usr/bin/env bash
git checkout config.xml
git checkout package.json
git checkout package-lock.json
git pull
npm install
PATH=./node_modules/.bin:$PATH
ionic cordova build browser --prod
docker-compose up -d --build --force-recreate
