FROM node:alpine AS builder
#Set environment variable to prod
# Create app directory
WORKDIR /app
# Install app dependencies

COPY ["package.json", "yarn.lock", "./"]
RUN yarn --version
RUN yarn
COPY . ./
RUN yarn run build-ts && yarn run build:webpack

# copy the dist folder to builder
FROM node:alpine
#Set environment variable to prod
# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND yarn.lock are copied
COPY ["package.json", "yarn.lock", "./"]
RUN yarn --version
RUN yarn
COPY --from=builder app/dist ./dist
COPY --from=builder app/config.env ./
COPY --from=builder app/config-dev.env ./
EXPOSE 4000
CMD ["yarn", "run", "serve"]


