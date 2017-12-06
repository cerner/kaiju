FROM ruby:2.4.2

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

# Set env to prod by default
ARG RAILS_ENVIRONMENT=production
ENV RAILS_ENV $RAILS_ENVIRONMENT

# Prepare Directory for Source Code
ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

EXPOSE 3000

# Install Ruby Dependencies
COPY Gemfile $APP_HOME/Gemfile
COPY Gemfile.lock $APP_HOME/Gemfile.lock
RUN bundle install

# Install Node Dependencies
ADD client/package.json /tmp/package.json
RUN cd /tmp && npm install --unsafe-perm

# Mount Source into Container
ADD . $App_Home

# Copy cached npm modules into client directory
RUN npm run clean && cp -a /tmp/node_modules $APP_HOME/client

# Cheat, without this folder existing, precompile will fail
RUN mkdir $APP_HOME/app/assets/webpack; exit 0

# Precompile Assets
RUN bundle exec rake assets:precompile

VOLUME ["$APP_HOME/public"]

CMD bundle exec puma
