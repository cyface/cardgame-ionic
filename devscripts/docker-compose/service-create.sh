#!/usr/bin/env bash
docker service create --replicas 2 --name cardgame-ionic --publish published=5678,target=80 cyface/cardgame-ionic
