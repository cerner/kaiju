# This docker container creates a non-persistent review app for heroku PR deployments.
FROM cerner/kaiju-ruby-node-redis-traefik:2.4.2-8.9.2-3.2-1.4.4

EXPOSE 80

# Prepare Directory for Source Code
RUN mkdir /app
WORKDIR /app

# Install Node Dependencies

COPY ["package.json", "package-lock.json", "Gemfile", "Gemfile.lock",  "/app/"]
COPY ["client/package.json", "client/package-lock.json", "/app/client/"]

RUN npm install
RUN bundle install

COPY . /app

# Node Env
ENV NODE_ENV=production

# Rails Env
ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV KAIJU_ALLOW_NO_AUTH i_accept_the_risk_of_running_with_no_authentication
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379

# Precompile Assets
RUN cd /app/ \
  && bundle exec rake assets:precompile

ENV SECRET_KEY_BASE $(export SECRET_KEY_BASE_TEMP=$(rails secret))

EXPOSE 9000

CMD nf start -j Procfile.review