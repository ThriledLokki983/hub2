# Makefile for Huishelder Frontend

# Include environment variables from .env file if it exists
-include .env

#-- Variables --------------------------------------------------------------
APP_NAME ?= huishelder-fe
NODE_ENV ?= development
APP_PORT ?= 3000
DOCKER_HOST_PORT ?= 3000

# Docker compose configuration
DOCKER_COMPOSE = docker compose
DEV_COMPOSE_FILE = docker-compose.yml
DOCKER_HELPER = ./scripts/docker-helper.sh

# Default target
.DEFAULT_GOAL := help

# Mark all targets that don't represent files
.PHONY: help install build clean test lint format \
        dev dev-d prod prod-d proxy proxy-d all \
        docker-build docker-run docker-shell

#-- Help ------------------------------------------------------------------
help: ## Show this help message
	@echo "Huishelder Frontend ($(APP_NAME)) - Makefile commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Environment variables:"
	@echo "  APP_NAME: $(APP_NAME)"
	@echo "  NODE_ENV: $(NODE_ENV)"
	@echo "  APP_PORT: $(APP_PORT)"

#-- Development Environment ------------------------------------------------
dev: ## Start development server (interactive mode)
	@echo "Starting development server..."
	yarn run dev --host 0.0.0.0 --port $(APP_PORT) --no-open

start: dev ## Alias for dev

run: install dev ## Install dependencies and start development server

#-- Docker Environments ----------------------------------------------------
dev-d: ## Start development environment (detached mode)
	@echo "Starting development environment in detached mode..."
	$(DOCKER_HELPER) dev start

prod: ## Start production environment (interactive mode)
	@echo "Starting production environment..."
	$(DOCKER_COMPOSE) --profile prod up

prod-d: ## Start production environment (detached mode)
	@echo "Starting production environment in detached mode..."
	$(DOCKER_HELPER) prod start

proxy: ## Start proxy with both dev and prod (interactive mode)
	@echo "Starting both environments with proxy..."
	$(DOCKER_COMPOSE) --profile proxy,dev,prod up

proxy-d: ## Start proxy with both dev and prod (detached mode)
	@echo "Starting both environments with proxy in detached mode..."
	$(DOCKER_HELPER) proxy start

all: ## Start all environments (interactive mode)
	@echo "Starting all environments..."
	$(DOCKER_COMPOSE) --profile dev,prod,proxy up

all-d: ## Start all environments (detached mode)
	@echo "Starting all environments in detached mode..."
	$(DOCKER_HELPER) all start

#-- Build and Install -----------------------------------------------------
install: ## Install dependencies
	@echo "Installing dependencies..."
	yarn install --frozen-lockfile

build: ## Build the application for production
	@echo "Building for $(NODE_ENV)..."
	NODE_ENV=$(NODE_ENV) yarn build

serve: build ## Serve the built application
	@echo "Serving built application on port $(APP_PORT)..."
	yarn run vite preview --port $(APP_PORT)

#-- Testing and Quality Assurance -----------------------------------------
test: ## Run tests
	@echo "Running tests..."
	yarn run test

lint: ## Run linters
	@echo "Linting code..."
	yarn run lint

format: ## Format code with Prettier
	@echo "Formatting code..."
	yarn prettier --write src/**/*.{ts,tsx,scss}

#-- Cleanup --------------------------------------------------------------
clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	rm -rf dist
	rm -rf node_modules/.cache

#-- Docker Utilities -----------------------------------------------------
docker-build: ## Build Docker image
	@echo "Building $(NODE_ENV) Docker image..."
	docker build -f Dockerfile-$(NODE_ENV) -t $(APP_NAME):$(NODE_ENV) .

docker-run: docker-build ## Run Docker container
	@echo "Running $(NODE_ENV) Docker container..."
	docker run -p $(DOCKER_HOST_PORT):$(APP_PORT) --name $(APP_NAME)-$(NODE_ENV) --rm $(APP_NAME):$(NODE_ENV)

docker-shell: ## Open shell in running container
	@echo "Opening shell in $(NODE_ENV) container..."
	$(DOCKER_HELPER) $(NODE_ENV) shell

docker-logs: ## View logs for a container
	@echo "Viewing logs for $(NODE_ENV) container..."
	$(DOCKER_HELPER) $(NODE_ENV) logs

docker-clean: ## Clean Docker resources
	@echo "Cleaning Docker resources for $(NODE_ENV)..."
	$(DOCKER_HELPER) $(NODE_ENV) clean
