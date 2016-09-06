FROM node:6-slim

ENV NODE_ENV production
RUN npm config set color false; \
    npm config set loglevel warn

COPY package.json /app/package.json
WORKDIR /app
RUN npm install

COPY . /app

CMD ["node_modules/.bin/babel-node", "index.js"]
