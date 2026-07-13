#!/bin/bash
echo "Starting ProspectIQ AI Production Deploy..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo "ProspectIQ AI deployment completed successfully."
