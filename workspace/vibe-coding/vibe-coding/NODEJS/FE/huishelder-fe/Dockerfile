# Build environment
FROM node:18-alpine as build

# Install make
RUN apk add --no-cache make

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy Makefile and package files first
COPY Makefile package.json yarn.lock ./

# Install dependencies using Makefile
RUN make install

# Copy source code
COPY . .

# Build the application using Makefile
RUN make build NODE_ENV=${NODE_ENV}

# Production environment
FROM nginx:1.22-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy Nginx configuration
COPY conf/nginx.spa.conf /etc/nginx/conf.d/default.conf

# Add bash for shell scripts
RUN apk add --no-cache bash

# Copy the build output from build stage
COPY --from=build /app/dist/ .

# Create script to substitute environment variables at runtime
COPY --from=build /app/.env.production /tmp/.env.production
RUN echo '#!/bin/bash\n\
# Read env file and create env.js with environment variables\n\
echo "window.env = {" > /usr/share/nginx/html/env.js\n\
grep -v "^#" /tmp/.env.production | while IFS="=" read -r key value; do\n\
  if [[ $key == VITE_* ]]; then\n\
    echo "  \"$key\": \"$value\"," >> /usr/share/nginx/html/env.js\n\
  fi\n\
done\n\
echo "};" >> /usr/share/nginx/html/env.js\n\
\n\
# Substitute NGINX_PORT in nginx config if provided\n\
if [ -n "$NGINX_PORT" ]; then\n\
  sed -i "s/listen 80/listen $NGINX_PORT/g" /etc/nginx/conf.d/default.conf\n\
fi\n\
\n\
# Start Nginx\n\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE ${NGINX_PORT:-80}

# Use the custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
