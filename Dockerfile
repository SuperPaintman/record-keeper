FROM node:4.5.0

MAINTAINER SuperPaintman <SuperPaintmanDeveloper@gmail.com>

# Workdir
WORKDIR /app

# Env
ENV NODE_ENV="production" \
    NODE_APP_PATH="/app" \
    NODE_PORT="3000"
# ENV NODE_STATIC_ADDR localhost

# Exposing port
EXPOSE 3000 

# NPM F3
RUN curl -fL https://gist.githubusercontent.com/SuperPaintman/851b330c08b2363aea1c870f0cc1ea5a/raw/a6bbb8c1cae45ffbe7259c4e3a6b2814d43ca8b5/npm-f3-install.sh -o ./npm-f3-install \
    && chmod +x ./npm-f3-install

# Install deps
COPY ./package.json /app/package.json

RUN ./npm-f3-install -s all

# Copy code
ADD . /app

# TODO: убрать build:images
RUN npm run build:clear \
    && npm run build:server

# Remove extra deps
RUN npm prune --production=true && npm ls

# Volumes
VOLUME ["/app/certs", "/app/logs"]

CMD ["npm", "start"]