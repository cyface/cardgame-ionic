#!/usr/bin/env bash
docker build -f Dockerfile --tag cardgame-ionic . --no-cache
docker tag cardgame-ionic cyface/cardgame-ionic
docker push cyface/cardgame-ionic
