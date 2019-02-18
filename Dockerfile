
FROM cerner/kaiju-ruby-node-redis-traefik:2.4.2-8.9.2-3.2-1.4.4

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

# Rails Env
ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV KAIJU_ALLOW_NO_AUTH i_accept_the_risk_of_running_with_no_authentication
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379

# Precompile Assets
RUN cd /app/rails \
  && bundle exec rake assets:precompile

ENV SECRET_KEY_BASE $(export SECRET_KEY_BASE_TEMP=$(rails secret))

EXPOSE 9000

CMD nf start -j Procfile.review
