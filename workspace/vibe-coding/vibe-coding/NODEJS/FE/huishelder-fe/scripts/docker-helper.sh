#!/bin/bash

# Docker operations helper script for Huishelder Frontend
# Supports development, production, and proxy environments

set -e

# Default environment
ENV=${1:-dev}
COMMAND=${2:-start}

# Check for .env file and create if not exists
if [ ! -f .env ]; then
  echo "Creating default .env file..."
  echo "# Common environment variables
APP_NAME=huishelder-fe
APP_PORT=3000
NODE_ENV=development
DOCKER_PLATFORM=linux/amd64
VITE_APP_TITLE=Huishelder Frontend
PROXY_PORT=8080" > .env
  echo ".env file created"
fi

# Check for .env.development and create if not exists
if [ ! -f .env.development ]; then
  echo "Creating default .env.development file..."
  echo "# Development environment variables
NODE_ENV=development
APP_NAME=huishelder-fe
APP_PORT=3000
DOCKER_HOST_PORT=3000
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development" > .env.development
  echo ".env.development file created"
fi

# Check for .env.production and create if not exists
if [ ! -f .env.production ]; then
  echo "Creating default .env.production file..."
  echo "# Production environment variables
NODE_ENV=production
APP_NAME=huishelder-fe
APP_PORT=80
NGINX_PORT=80
DOCKER_HOST_PORT=80
VITE_API_BASE_URL=/api
VITE_APP_ENV=production" > .env.production
  echo ".env.production file created"
fi

# Source the .env file to get the APP_NAME and other variables
if [ -f .env ]; then
  export $(grep -v "^#" .env | xargs)
fi

# Define container prefix based on APP_NAME
CONTAINER_PREFIX=${APP_NAME:-huishelder-fe}

# Function to display help information
show_help() {
  echo "Usage: ./scripts/docker-helper.sh [environment] [command]"
  echo ""
  echo "Application: $CONTAINER_PREFIX"
  echo ""
  echo "Environment options:"
  echo "  dev (default) - Development environment"
  echo "  prod - Production environment"
  echo "  proxy - Start both dev and prod with Nginx proxy in front"
  echo "  all - Start all services (dev, prod, and proxy)"
  echo ""
  echo "Command options:"
  echo "  start (default) - Start services"
  echo "  stop - Stop services"
  echo "  build - Build services"
  echo "  restart - Restart services"
  echo "  logs - Show logs"
  echo "  clean - Remove containers, images, and volumes"
  echo "  shell - Open a shell in the running container"
  echo "  make [target] - Run a make target inside the container"
  echo "  status - Show the status of the containers"
  echo "  help - Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./scripts/docker-helper.sh dev start    # Start development environment"
  echo "  ./scripts/docker-helper.sh prod build   # Build production environment"
  echo "  ./scripts/docker-helper.sh proxy start  # Start both environments with proxy"
  echo "  ./scripts/docker-helper.sh dev make lint # Run 'make lint' in dev container"
}

# Main script logic
case $ENV in
  dev)
    SERVICE="frontend-dev"
    PROFILE="dev"
    ;;
  prod)
    SERVICE="frontend-prod"
    PROFILE="prod"
    ;;
  proxy)
    SERVICE="nginx-proxy"
    PROFILE="proxy,dev,prod"
    ;;
  all)
    SERVICE="frontend-dev frontend-prod nginx-proxy"
    PROFILE="dev,prod,proxy"
    ;;
  help)
    show_help
    exit 0
    ;;
  *)
    echo "Unknown environment: $ENV"
    show_help
    exit 1
    ;;
esac

case $COMMAND in
  start)
    echo "Starting $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE up -d
    
    # Display access information based on environment
    case $ENV in
      dev)
        echo "Development environment available at: http://localhost:${DOCKER_HOST_PORT:-3000}"
        ;;
      prod)
        echo "Production environment available at: http://localhost:${DOCKER_HOST_PORT:-80}"
        ;;
      proxy)
        echo "Proxy available at: http://localhost:${PROXY_PORT:-8080}"
        echo "  - Development environment: http://localhost:${PROXY_PORT:-8080}/dev/"
        echo "  - Production environment: http://localhost:${PROXY_PORT:-8080}/prod/"
        ;;
      all)
        echo "All environments started:"
        echo "  - Development: http://localhost:${DOCKER_HOST_PORT:-3000}"
        echo "  - Production: http://localhost:${DOCKER_HOST_PORT:-80}"
        echo "  - Proxy: http://localhost:${PROXY_PORT:-8080}"
        ;;
    esac
    ;;
  stop)
    echo "Stopping $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE down
    ;;
  build)
    echo "Building $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE build
    ;;
  restart)
    echo "Restarting $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE restart
    ;;
  logs)
    echo "Showing logs for $CONTAINER_PREFIX ($ENV environment)..."
    if [ "$ENV" = "all" ]; then
      docker compose logs -f
    else
      docker compose --profile $PROFILE logs -f
    fi
    ;;
  clean)
    echo "Cleaning up $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE down --rmi local -v
    ;;
  shell)
    if [ "$ENV" = "all" ] || [ "$ENV" = "proxy" ]; then
      echo "For shell access, please specify either 'dev' or 'prod' environment"
      exit 1
    fi
    echo "Opening shell in $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE exec $SERVICE /bin/bash || docker compose --profile $PROFILE exec $SERVICE /bin/sh
    ;;
  make)
    if [ "$ENV" = "all" ] || [ "$ENV" = "proxy" ]; then
      echo "For make command, please specify either 'dev' or 'prod' environment"
      exit 1
    fi
    MAKE_TARGET=$3
    if [ -z "$MAKE_TARGET" ]; then
      echo "Error: No make target specified"
      echo "Usage: ./scripts/docker-helper.sh $ENV make [target]"
      exit 1
    fi
    echo "Running 'make $MAKE_TARGET' in $CONTAINER_PREFIX ($ENV environment)..."
    docker compose --profile $PROFILE exec $SERVICE make $MAKE_TARGET
    ;;
  status)
    echo "Container status for $CONTAINER_PREFIX:"
    docker compose ps
    ;;
  help)
    show_help
    ;;
  *)
    echo "Unknown command: $COMMAND"
    show_help
    exit 1
    ;;
esac