# Build environment
FROM node:18-alpine as build

ARG NODE_ENV
ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .
RUN yarn build

# Production environment
FROM nginx:1.22-alpine
COPY conf/nginx.spa.conf /etc/nginx/conf.d
COPY --from=build /app/build/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
