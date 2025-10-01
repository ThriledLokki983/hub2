# Common build stage
FROM node:alpine as common-build-stage

COPY . ./app

WORKDIR /app

RUN yarn
RUN npm install -g npm@latest

EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV="development"
ENV LOG_FORMAT="dev"
ENV LOG_DIR ="../logs"
ENV ORIGIN="*"
ENV CREDENTIALS="true"
ENV API_BASE_AUTH="https://start.exactonline.nl/api/oauth2/auth?client_id=22bd3e3b-42d3-45b4-944a-ae45f22f265f&redirect_uri=https://05bf-88-159-226-199.eu.ngrok.io/&response_type=code&force_login=1"
ENV SESSION_SECRET="mysuperstrong_secret-4576Which)*&c-5a<.thisaskjdakllkhhalkhlkha"
ENV SECRET_KEY="secretKey"

CMD ["yarn", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV="production"
ENV LOG_FORMAT="dev"
ENV LOG_DIR ="../logs"
ENV ORIGIN="*"
ENV CREDENTIALS="true"
ENV API_BASE_AUTH="https://start.exactonline.nl/api/oauth2/auth?client_id=22bd3e3b-42d3-45b4-944a-ae45f22f265f&redirect_uri=https://05bf-88-159-226-199.eu.ngrok.io/&response_type=code&force_login=1"
ENV SESSION_SECRET="mysuperstrong_secret-4576Which)*&c-5a<.thisaskjdakllkhhalkhlkha"
ENV SECRET_KEY="secretKey"

CMD ["yarn", "run", "deploy:prod"]
