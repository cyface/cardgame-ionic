#!/usr/bin/env bash
git pull
npm install
PATH=./node_modules/.bin:$PATH
ionic cordova build browser --prod
docker-compose up -d --build --force-recreate
