FROM node:alpine

ARG APP_PORT

ENV APP_PORT=$APP_PORT

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf src

RUN npm run start:prod

EXPOSE $APP_PORT

