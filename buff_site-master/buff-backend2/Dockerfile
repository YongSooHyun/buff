FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY ./ .
COPY ./ormconfig.prod.js ./ormconfig.js

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
