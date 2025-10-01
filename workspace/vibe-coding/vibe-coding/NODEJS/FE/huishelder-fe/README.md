# HuisHelder Frontend

> Modern React application for the HuisHelder home-buying journey platform.

    *This application helps users navigate their home-buying journey with a comprehensive timeline, task management, document handling, and financial overview.*

## API Integration

For details on how this frontend integrates with backend APIs, see [API_INTEGRATION.md](./API_INTEGRATION.md).

## Features

- [Vite](https://vitejs.dev/) for fast development and build times.
- [TypeScript](https://www.typescriptlang.org/) for strictly typed code at compile time.
- [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) for linting TypeScript and Sass.
- Custom, lean interpretation of PwC's [Appkit 4](https://appkit.pwc.com/appkit4/) for starter styles.
- [Patterns](http://localhost:3000/patterns) page for style scaffolding in `development` mode.

## Prerequisites

- [Node.js](https://nodejs.org/en) (latest LTE, or at least 18.x or higher), ideally via [nvm](https://github.com/nvm-sh/nvm))
- [Yarn](https://classic.yarnpkg.com/lang/en/) (v1) as dependency package manager
- [Docker](https://www.docker.com/) for running the project inside a container for non-frontend devs

## Quickstart

There are two ways to run the project: locally and using Docker. \
Both methods will serve the application on port `3000`: [http://localhost:3000](http://localhost:3000)

### Running Locally

For active frontend development, it is best to run the project on your local machine. \
This will enable live rebuilds, and changes will be instantly applied without refreshing.

1.  Install the dependencies:

    ```sh
    $ yarn install
    ```

2.  Start the development server:

    ```sh
    $ yarn start
    ```

### Running with Docker

If you prefer not to deal with Node.js on your local machine, you can run the project inside Docker.

1. Start the Docker container:

   ```sh
   $ docker-compose up
   ```

2. If dependencies have changed (`yarn.lock`), you may need to rebuild the image::

   ```sh
    $ docker-compose build --no-cache
   ```

## Docker Setup

This project provides a flexible Docker setup with support for both development and production environments.

### Docker Environments

Three main environments are available:

1. **Development Environment**: Optimized for development with hot-reloading
2. **Production Environment**: Optimized for production with Nginx serving static files
3. **Proxy Environment**: Runs both environments behind an Nginx proxy for easy comparison

### Using the Docker Helper Script

The `scripts/docker-helper.sh` script makes Docker operations simple:

```bash
# Start development environment
./scripts/docker-helper.sh dev start

# Start production environment
./scripts/docker-helper.sh prod start

# Start both environments with a proxy in front
./scripts/docker-helper.sh proxy start

# View logs
./scripts/docker-helper.sh dev logs

# Shell access to containers
./scripts/docker-helper.sh dev shell

# Run make commands in containers
./scripts/docker-helper.sh dev make lint

# See all available commands
./scripts/docker-helper.sh help
```

### Docker Compose Configuration

The Docker Compose setup includes:

- Named volumes for persistent node_modules
- Networking between services
- Health checks for monitoring service health
- Environment-specific settings via .env files
- An optional proxy service for accessing both environments

### Access Points

When using the proxy environment:

- Development: http://localhost:8080/dev/
- Production: http://localhost:8080/prod/

With individual environments:

- Development: http://localhost:3000
- Production: http://localhost:80

## Environment Configuration

This project uses environment variables for configuration, with separate setups for development and production environments.

### Using direnv (recommended)

This project includes a `.envrc` file for use with [direnv](https://direnv.net/), which automatically loads environment variables when you enter the directory.

1. Install direnv:

   ```bash
   # macOS
   brew install direnv

   # Linux
   curl -sfL https://direnv.net/install.sh | bash
   ```

2. Add direnv hook to your shell configuration file (`.bashrc`, `.zshrc`, etc.):

   ```bash
   eval "$(direnv hook bash)"  # for bash
   # or
   eval "$(direnv hook zsh)"   # for zsh
   ```

3. Allow direnv in the project directory:
   ```bash
   cd /path/to/huishelder-fe
   direnv allow
   ```

### Environment Files

The project uses these environment files:

- `.env`: Common variables used across all environments
- `.env.development`: Development-specific variables
- `.env.production`: Production-specific variables

Key environment variables:

- `APP_NAME`: Application name (default: "huishelder-fe")
- `NODE_ENV`: Current environment (development/production)
- `APP_PORT`: Port the application runs on
- `DOCKER_HOST_PORT`: Port mapping on host machine for Docker
- `VITE_API_BASE_URL`: API endpoint base URL

## Project Structure

The boilerplate's project structure is organized as follows:

    .
    ├── charts                  # Helm charts (used for deployment)
    ├── conf                    # Hosting and pipeline configs
    ├── docs                    # Additional documentation
    ├── public                  # Static assets (which aren't processed)
    ├── scripts                 # Build scripts
    ├── src                     # Application source code
    │   ├── assets              # Assets (e.g. logos, icons, fonts)
    │   ├── components          # React reusable components
    │   ├── configs             # Configs and constants
    │   ├── contexts            # React contexts and context providers
    │   ├── data                # Default and mock data
    │   ├── helpers             # Helper and utility functions
    │   ├── hocs                # React Higher-Order Components
    │   ├── hooks               # React Hooks (e.g. `useAppState`)
    │   ├── pages               # React page components
    │   ├── styles              # Sass styling
    ├── .editorconfig           # EditorConfig to align editor configs
    ├── .envrc                  # Leveraged by `brew install direnv`
    ├── .env.devlopment         # Environment variables (local)
    ├── .env.production         # Environment variables (non-local)
    ├── .eslintrc.cjs           # ESLint rules for linting TypeScript files
    ├── .gitlab.ci.yml          # GitLab CI/CD rules for the build pipeline
    ├── .stylelintrc.cjs        # Stylelint rules for linting Sass files
    ├── docker-compose.yml      # Docker Compose configuration
    ├── Dockerfile              # Docker config (used in build pipeline)
    ├── Dockerfile-dev          # Docker config (used locally during development)
    ├── index.html              # Browser entry point
    ├── Makefile                # Make commands leveraged by Docker
    ├── package.json            # Project dependencies (3rd party packages)
    ├── README.md               # What you're reading now
    ├── reset.d.ts              # TypeScript reset (to normalize typings)
    ├── tsconfig.json           # TypeScript browser config
    ├── tsconfig.node.json      # TypeScript Node.js config
    ├── vite.config.ts          # Vite config (used for creating the build)
    └── yarn.lock               # Project dependencies lockfile (locked versions)

## Customization

To customize the boilerplate, you can edit the styles in the `src/styles` folder, add new components to the `src/components` folder, and create new pages in the `src/pages` folder.

## Contributing

> We appreciate any contributions to improve this boilerplate.
> To contribute, please submit your proposed changes to one of the frontend leads, or
> submit a pull request with your proposed changes, and it will be reviewed by **Koen**.
> Please ensure that your changes adhere to the project's coding standards and guidelines.

## License

This project is for private and internal use only, licensed by the PwC Experience Consulting NL team.
