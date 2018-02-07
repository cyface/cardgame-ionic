#!/usr/bin/env bash
# You need to run ionic cordova build browser before this
# and docker login
docker build -f Dockerfile --tag cardgame-ionic . --no-cache
docker tag cardgame-ionic cyface/cardgame-ionic
docker push cyface/cardgame-ionic
