# syntax=docker/dockerfile:1

FROM node:17.0.1-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD [ "node", "index.js" ]
