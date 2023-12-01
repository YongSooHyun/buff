FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN apk add --no-cache git openssh

RUN npm install

COPY ./ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
