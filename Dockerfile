FROM redis:3.2 AS redis

FROM traefik:1.4.4 AS traefik

FROM node:8.4.0 AS node

FROM ruby:2.4.2
# Start Node installation copied from docker-node
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

COPY --from=node /usr/local/bin/. /usr/local/bin/
COPY --from=node /usr/local/include/. /usr/local/include/
COPY --from=node /usr/local/lib/. /usr/local/lib/
COPY --from=node /usr/local/share/. /usr/local/share/
# End Node installation

COPY --from=redis /usr/local/bin/redis-server /usr/local/bin/redis-server
COPY --from=redis /usr/local/bin/redis-cli /usr/local/bin/redis-cli

COPY --from=traefik /traefik /usr/local/bin/

RUN npm config set unsafe-perm true -g
RUN npm install foreman -g

EXPOSE 80

# Prepare Directory for Source Code
RUN mkdir /app
WORKDIR /app

# Install Node Dependencies

COPY ["rails/package.json", "rails/package-lock.json", "rails/Gemfile", "rails/Gemfile.lock",  "/app/rails/"]
COPY ["rails/client/package.json", "rails/client/package.json", "/app/rails/client/"]
COPY ["node/package.json", "node/package-lock.json", "/app/node/"]
COPY ["package.json", "package-lock.json", "/app/"]

RUN npm install

COPY . /app

# Node Env
ENV NODE_ENV=production
ENV KAIJU_RAILS_SERVER_URL http://localhost
ENV KAIJU_AUTH_REDIRECT_URL http://localhost/auth

# Rails Env
ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV KAIJU_ALLOW_NO_AUTH i_accept_the_risk_of_running_with_no_authentication
ENV REDIS_URL redis://localhost:6379/0

# Precompile Assets
RUN cd /app/rails \
  && bundle exec rake assets:precompile

ENV SECRET_KEY_BASE $(export SECRET_KEY_BASE_TEMP=$(rails secret))

EXPOSE 9000

CMD nf start -j Procfile.review
