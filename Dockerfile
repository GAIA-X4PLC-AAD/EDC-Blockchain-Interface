# syntax=docker/dockerfile:1

FROM node:alpine3.20
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
RUN apk add docker
RUN apk add bash


COPY . .
CMD [ "node", "index.js" ]
