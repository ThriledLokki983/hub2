# Sustainability Legislation Navigator - (SLN) — Frontend

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

 1. Install the dependencies:

    ```sh
    $ yarn install
    ```

 2. Start the development server:

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

## Project Structure

The project structure is organized as follows:

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
    ├── .env.development         # Environment variables (local)
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

## License
This project is for private and internal use only, licensed by the PwC Experience Consulting NL team.
