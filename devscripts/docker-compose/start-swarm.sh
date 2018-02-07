#!/usr/bin/env bash
#This has to be run from swarm master
docker stack up -c docker-compose-production.yml cardgame-ionic
