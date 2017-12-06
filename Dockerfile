FROM ruby:2.4.2
MAINTAINER Matt Henkes "mjhenkes@gmail.com"

# Start Node installation copied from docker-node
# https://github.com/nodejs/docker-node
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# gpg keys listed at https://github.com/nodejs/node#release-team
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    56730D5401028683275BD23C23EFEFE93C4CFFFE \
  ; do \
    gpg --keyserver pgp.mit.edu --recv-keys "$key" || \
    gpg --keyserver keyserver.pgp.com --recv-keys "$key" || \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key" ; \
  done

ENV NODE_VERSION 8.4.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs
# End Node installation

# install traefik
RUN mkdir traefik
RUN cd traefik \
  && curl -SLO "https://github.com/containous/traefik/releases/download/v1.4.4/traefik" \
  && chmod +x traefik \
  && cp traefik /usr/local/bin/

# install redis
RUN mkdir redis \
  && cd redis \
  && wget http://download.redis.io/redis-stable.tar.gz \
  && tar xvzf redis-stable.tar.gz \
  && cd redis-stable \
  && make \
  && make install

CMD redis-server

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
ENV ENTRY 'Name:http Address::80'

# Precompile Assets
RUN cd /app/rails \
  && bundle exec rake assets:precompile

EXPOSE 9000

CMD nf start -j Procfile.review
