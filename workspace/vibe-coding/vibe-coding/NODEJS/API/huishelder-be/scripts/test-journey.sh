#!/bin/bash
# filepath: /Users/gideonnimoh/projects/dev/VIBE-CODING/NODEJS/API/huishelder-be/scripts/test-journey.sh

# This script runs the journey tests in a clean Docker environment
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print with colors
echo -e "${BLUE}=== Starting Journey Feature Tests ===${NC}"

# Make sure we're in the project root
cd "$(dirname "$0")/.."

# Run docker compose for journey setup
echo -e "${BLUE}Starting docker containers...${NC}"
docker-compose -f docker-compose.journey.yml up -d

# Give the database time to initialize
echo -e "${BLUE}Waiting for database to initialize...${NC}"
sleep 5

# Run migrations
echo -e "${BLUE}Running migrations...${NC}"
docker-compose -f docker-compose.journey.yml exec journey-api npm run migrate:up

# Run the journey tests
echo -e "${BLUE}Running journey tests...${NC}"
docker-compose -f docker-compose.journey.yml exec journey-api npm run test:journey

# Tests complete
echo -e "${GREEN}Journey tests completed!${NC}"

# Ask if user wants to keep the containers running
read -p "Do you want to keep the Docker containers running? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${BLUE}Stopping and removing containers...${NC}"
    docker-compose -f docker-compose.journey.yml down
else
    echo -e "${BLUE}Containers are still running.${NC}"
    echo -e "To stop them later, run: docker-compose -f docker-compose.journey.yml down"
fi
