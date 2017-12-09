FROM node:8.9.2

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Expose port
EXPOSE 8080

# Mount Source into Container
ADD . $App_Home

# Install Node Dependencies
RUN npm run clean
RUN npm install --unsafe-perm --silent

CMD npm start
