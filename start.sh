#!/bin/bash

if [ "$1" == "prod" ]
then
  docker-compose -f docker-compose.yml up
else
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
fi
